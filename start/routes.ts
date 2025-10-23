/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'
import HomeController from '#controllers/home_controller'
import User from '#models/user'

// -------------------
// Home
// -------------------
// router.on('/').render('pages/home')
router.get('/', (ctx) => new HomeController().index(ctx)).as('pages/home')

// Page après connexion
router
  .get('/index', async ({ view }) => {
    return view.render('pages/index')
  })
  .middleware([middleware.auth()]) // 🔒 Protège la page /index
// -------------------
// Auth
// -------------------
router.get('/login', (ctx) => new AuthController().showLogin(ctx))
router.post('/login', (ctx) => new AuthController().login(ctx))

router.get('/register', (ctx) => new AuthController().showRegister(ctx)).as('register.show')
router.post('/register', (ctx) => new AuthController().register(ctx)).as('register')

router.post('/logout', (ctx) => new AuthController().logout(ctx)).middleware([middleware.auth()])

// Vérification email
// router.get('/verify-email', (ctx) => new AuthController().verifyEmail(ctx)).as('verify-email')
router.get('/verify-email/:token', async ({ params, response }) => {
  const user = await User.findBy('email_token', params.token)
  if (!user) {
    return response.badRequest('Lien invalide ou expiré.')
  }

  user.is_verified = true
  user.email_token = null
  await user.save()

  return response.redirect('/login')
})
