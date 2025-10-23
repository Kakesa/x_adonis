import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'

// Page d’accueil
router
  .get('/', async ({ view }) => {
    return view.render('pages/home') // ici tu peux mettre tes modales login/register
  })
  .as('home')

// Actions Auth
router.get('/auth/login', (ctx) => new AuthController().showLogin(ctx)).as('auth.login.show')
router.post('/auth/login', (ctx) => new AuthController().login(ctx)).as('auth.login')
router.post('/auth/register', (ctx) => new AuthController().register(ctx)).as('auth.register')
router
  .post('/auth/logout', (ctx) => new AuthController().logout(ctx))
  .middleware([middleware.auth()])
  .as('auth.logout')

// Vérification email
router.get('/verify-email/:token', (ctx) => new AuthController().verifyEmail(ctx)).as('auth.verify')
