import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'
import mail from '@adonisjs/mail/services/main'
import crypto from 'node:crypto'

export default class AuthController {
  // Page de connexion
  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  // Page d'inscription
  async showRegister({ view }: HttpContext) {
    return view.render('auth/register')
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

      // Créer la birthdate depuis day, month, year si tu utilises le formulaire en 3 parties
      const birthdate = DateTime.fromISO(payload.birthdate)

      const hashedPassword = await hash.make(payload.password)
      const username = await this.generateUsername(payload.name)

      // Générer token de validation
      const emailToken = crypto.randomBytes(32).toString('hex')

      // Créer l'utilisateur
      const user = await User.create({
        ...payload,
        password: hashedPassword,
        username,
        birthdate,
        is_verified: false,
        email_token: emailToken,
      })

      // Envoyer email de validation
      await mail.send((message) => {
        message
          .from('no-reply@tonapp.com', 'X-Cloune') // ← ici
          .to(user.email)
          .subject('Validez votre compte')
          .htmlView('emails/verify', { name: user.name, token: emailToken })
      })

      session.flash('success', 'Compte créé ! Vérifiez votre email pour activer votre compte.')
      return response.redirect('/login')
    } catch (error) {
      console.error('❌ Erreur register:', error)
      session.flash('error', 'Erreur lors de la création du compte')
      return response.redirect('/register')
    }
  }

  // Validation du compte par email
  public async verifyEmail({ request, response, session }: HttpContext) {
    const token = request.input('token')
    if (!token) {
      session.flash('error', 'Token manquant')
      return response.redirect('/login')
    }

    const user = await User.query().where('email_token', token).first()
    if (!user) {
      session.flash('error', 'Token invalide ou expiré')
      return response.redirect('/login')
    }

    user.is_verified = true
    user.email_token = null
    await user.save()

    session.flash('success', 'Compte activé ! Vous pouvez maintenant vous connecter.')
    return response.redirect('/login')
  }

  // Connexion utilisateur
  public async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      if (!user.is_verified) {
        session.flash('error', 'Veuillez vérifier votre email avant de vous connecter.')
        return response.redirect('/login')
      }

      await auth.use('web').login(user)
      session.flash('success', `Bienvenue ${user.name || user.email} 👋`)
      return response.redirect('/index')
    } catch (error) {
      console.error('❌ Erreur login:', error)
      session.flash('error', 'Email ou mot de passe incorrect.')
      return response.redirect('/login')
    }
  }

  // Déconnexion
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
