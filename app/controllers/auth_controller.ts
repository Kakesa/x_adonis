import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'

export default class AuthController {
  /**
   * Page de connexion
   */
  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  /**
   * Page d'inscription
   */
  async showRegister({ view }: HttpContext) {
    return view.render('auth/register')
  }

  /**
   * Générer un username unique à partir du full name
   */
  private async generateUsername(name: string): Promise<string> {
    let base = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_') // remplace les espaces par "_"
      .replace(/[^a-z0-9_]/g, '') // retire les caractères spéciaux

    let username = base
    let count = 1

    while (await User.query().where('username', username).first()) {
      username = `${base}_${count}`
      count++
    }

    return username
  }

  /**
   * Inscription utilisateur
   */
  public async register({ request, response, session }: HttpContext) {
    // Validation avec Vine
    const payload = await request.validateUsing(registerValidator)

    // Hash du mot de passe
    const hashedPassword = await hash.make(payload.password)

    // Génération du username
    const username = await this.generateUsername(payload.name)

    // Conversion de birthdate en DateTime (obligatoire)
    const birthdate = DateTime.fromISO(payload.birthdate)

    // Création du compte utilisateur
    await User.create({
      ...payload,
      password: hashedPassword,
      username,
      birthdate,
    })

    // Message flash de succès
    session.flash('success', 'Compte créé avec succès ! Connectez-vous pour continuer.')

    return response.redirect('/login')
  }

  /**
   * Connexion utilisateur
   */
  public async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      session.flash('success', `Bienvenue ${user.name || user.email} 👋`)
      return response.redirect('/')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Email ou mot de passe incorrect.')
      return response.redirect('/login')
    }
  }

  /**
   * Déconnexion utilisateur
   */
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
