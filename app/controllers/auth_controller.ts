import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'
import mail from '@adonisjs/mail/services/main'
import crypto from 'node:crypto'

export default class AuthController {
  // Page login / home
  public async showLogin({ view, request }: HttpContext) {
    return view.render('pages/index', {
      csrfToken: request.csrfToken, // ✅ il faut les parenthèses ici
    })
  }

  public async showRegister({ view }: HttpContext) {
    return view.render('pages/index')
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

  // Inscription
  public async register({ request, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator, { data: request.body() })
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

      session.flash(
        'success',
        'Votre compte a été créé ! Vérifiez votre boîte mail pour activer votre compte.'
      )
      return response.redirect('/')
    } catch (error) {
      console.error('❌ Erreur register:', error)
      session.flash('error', 'Erreur lors de la création du compte.')
      return response.redirect().back()
    }
  }

  // Vérification email
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

    session.flash('success', 'Compte activé 🎉 Vous pouvez maintenant vous connecter.')
    return response.redirect('/')
  }

  // ✅ Login sécurisé (avec validation)
  public async login({ request, response, auth, session }: HttpContext) {
    // Validation via le validator
    const { email, password } = await request.validateUsing(loginValidator, {
      data: request.body(),
    })

    try {
      // Vérifie si l'utilisateur existe et le mot de passe est correct
      const user = await User.verifyCredentials(email, password)

      // Vérifie s’il a activé son compte
      if (!user.is_verified) {
        session.flash('error', 'Veuillez vérifier votre email avant de vous connecter.')
        return response.redirect('/')
      }

      // Connecte l’utilisateur via la session
      await auth.use('web').login(user)

      session.flash('success', `Bienvenue ${user.name || user.email}`)
      return response.redirect('/home')
    } catch {
      session.flash('error', 'Email ou mot de passe incorrect.')
      return response.redirect('/')
    }
  }

  // Déconnexion
  public async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Vous êtes déconnecté.')
    return response.redirect('/')
  }
}
