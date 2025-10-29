import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'
import ProfilesController from '#controllers/profiles_controller'

// Page publique (login/register)
router.get('/', async ({ view }) => view.render('pages/index')).as('index')

// Page home protégée
router
  .get('/home', async ({ view, auth, response }) => {
    if (!auth.user) return response.redirect('/')
    return view.render('pages/home', { user: auth.user })
  })
  .middleware([middleware.auth()])

// Actions Auth
router.get('/auth/login', (ctx) => new AuthController().showLogin(ctx)).as('auth.login.show')
router.post('/auth/login', (ctx) => new AuthController().login(ctx)).as('auth.login')
router.post('/auth/register', (ctx) => new AuthController().register(ctx)).as('auth.register')
router.post('/logout', (ctx) => new AuthController().logout(ctx)).middleware([middleware.auth()])

// Vérification email
router.get('/verify-email/:token', (ctx) => new AuthController().verifyEmail(ctx)).as('auth.verify')

// Profil utilisateur
router.get('/profile', (ctx) => new ProfilesController().show(ctx)).middleware([middleware.auth()])
