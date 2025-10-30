import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ProfilesController from '#controllers/profiles_controller'
import TweetsController from '#controllers/tweets_controller'
import { middleware } from '#start/kernel'

// -------------------
// Pages publiques
// -------------------

// Page d'accueil / login-register
router.get('/', async ({ view }) => view.render('pages/index')).as('index')

// Page home protégée
router
  .get('/home', async ({ view, auth, response }) => {
    if (!auth.user) return response.redirect('/')
    return view.render('pages/home', { user: auth.user })
  })
  .middleware([middleware.auth()])

// -------------------
// Auth
// -------------------

// Formulaire login
router.get('/auth/login', (ctx) => new AuthController().showLogin(ctx)).as('auth.login.show')

// Action login
router.post('/auth/login', (ctx) => new AuthController().login(ctx)).as('auth.login')

// Action register
router.post('/auth/register', (ctx) => new AuthController().register(ctx)).as('auth.register')

// Logout
router.post('/logout', (ctx) => new AuthController().logout(ctx)).middleware([middleware.auth()])

// Vérification email
router.get('/verify-email/:token', (ctx) => new AuthController().verifyEmail(ctx)).as('auth.verify')

// -------------------
// Profil utilisateur
// -------------------

router.get('/profile', (ctx) => new ProfilesController().show(ctx)).middleware([middleware.auth()])

// -------------------
// CRUD Tweets
// -------------------

// Lister tous les tweets (public)
router.get('/tweets', (ctx) => new TweetsController().index(ctx))

// Détail d’un tweet
router.get('/tweets/:id', (ctx) => new TweetsController().show(ctx))

// Créer un tweet (auth requis)
router.post('/tweets', (ctx) => new TweetsController().store(ctx)).middleware([middleware.auth()])

// Mettre à jour un tweet (auth requis)
router
  .put('/tweets/:id', (ctx) => new TweetsController().update(ctx))
  .middleware([middleware.auth()])

// Supprimer un tweet (auth requis)
router
  .delete('/tweets/:id', (ctx) => new TweetsController().destroy(ctx))
  .middleware([middleware.auth()])
