import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'
import mail from '@adonisjs/mail/services/main'
import crypto from 'node:crypto'

export default class AuthController {
  // Page de connexion / inscription
  async showLogin({ view }: HttpContext) {
    return view.render('pages/home') // Tout se fait dans home
  }
  async showRegister({ view }: HttpContext) {
    return view.render('pages/home') // Tout se fait dans home
  }

  // Générer un username unique
  private async generateUsername(name: string): Promise<string> {
    let base = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
    let username = base
    let count = 1
    while (await User.query().where('username', username).first()) {
      username = `${base}_${count}`
      count++
    }
    return username
  }

  // Inscription utilisateur
  public async register({ request, response, session }: HttpContext) {
    try {
      const rawData = request.body()
      const payload = await request.validateUsing(registerValidator, { data: rawData })

      const birthdate = DateTime.fromISO(payload.birthdate)
      const hashedPassword = await hash.make(payload.password)
      const username = await this.generateUsername(payload.name)

      const emailToken = crypto.randomBytes(32).toString('hex')

      const user = await User.create({
        ...payload,
        password: hashedPassword,
        username,
        birthdate,
        is_verified: false,
        email_token: emailToken,
      })

      const verifyUrl = `http://localhost:3333/verify-email/${emailToken}`

      await mail.send((message) => {
        message
          .to(user.email)
          .from('no-reply@tonapp.com', 'X-Cloune')
          .subject('Activez votre compte X-Cloune')
          .htmlView('emails/verify', { name: user.name, verifyUrl })
      })

      // ✅ Message flash et redirection vers home
      session.flash(
        'success',
        'Votre compte a été créé avec succès ! Vérifiez votre boîte mail pour activer votre compte.'
      )
      return response.redirect('/')
    } catch (error) {
      console.error('❌ Erreur register:', error)
      session.flash('error', 'Une erreur est survenue lors de la création du compte.')
      return response.redirect('/')
    }
  }

  // Validation du compte par email
  public async verifyEmail({ params, response, session }: HttpContext) {
    const { token } = params
    if (!token) {
      session.flash('error', 'Lien de vérification manquant.')
      return response.redirect('/')
    }

    const user = await User.findBy('email_token', token)
    if (!user) {
      session.flash('error', 'Lien de vérification invalide ou expiré.')
      return response.redirect('/')
    }

    user.is_verified = true
    user.email_token = null
    await user.save()

    session.flash(
      'success',
      'Votre compte a été activé avec succès 🎉 Vous pouvez maintenant vous connecter.'
    )
    return response.redirect('/')
  }

  // Connexion utilisateur
  public async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      if (!user.is_verified) {
        session.flash('error', 'Veuillez vérifier votre email avant de vous connecter.')
        return response.redirect('/')
      }

      await auth.use('web').login(user)
      session.flash('success', `Bienvenue ${user.name || user.email} 👋`)
      return response.redirect('/index') // Page protégée après connexion
    } catch (error) {
      console.error('❌ Erreur login:', error)
      session.flash('error', 'Email ou mot de passe incorrect.')
      return response.redirect('/')
    }
  }

  // Déconnexion
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
