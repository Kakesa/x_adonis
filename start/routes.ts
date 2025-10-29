import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'

// Page d’accueil publique
router.get('/', async ({ view }) => view.render('pages/index')).as('index')

// Page home protégée
router
  .get('/home', async ({ view }) => {
    return view.render('pages/home') // Crée pages/home.edge
  })
  .middleware([middleware.auth()])
  .as('home')

// Actions Auth
router.get('/auth/login', (ctx) => new AuthController().showLogin(ctx)).as('auth.login.show')
router.post('/auth/login', (ctx) => new AuthController().login(ctx)).as('auth.login')
router.post('/auth/register', (ctx) => new AuthController().register(ctx)).as('auth.register')
router
  .get('/auth/logout', (ctx) => new AuthController().logout(ctx))
  .middleware([middleware.auth()])
  .as('auth.logout')

// Vérification email
router.get('/verify-email/:token', (ctx) => new AuthController().verifyEmail(ctx)).as('auth.verify')
