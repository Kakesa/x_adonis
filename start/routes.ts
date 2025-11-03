import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ProfilesController from '#controllers/profiles_controller'
import TweetsController from '#controllers/tweets_controller'
import { middleware } from '#start/kernel'
import FollowersController from '#controllers/follows_controller'
import SuggestionsController from '#controllers/suggestions_controller'

// -------------------
// Pages publiques
// -------------------

// Page d'accueil / login-register
router.get('/', async ({ view }) => view.render('pages/index')).as('index')

// Page home protégée
// Page home protégée avec les tweets
router
  .get('/home', (ctx) => new TweetsController().showTweets(ctx))
  .middleware([middleware.auth()])
  .as('home')

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
router.get('/profile/:username', (ctx) => new ProfilesController().showByUsername(ctx))

// -------------------
// CRUD Tweets
// -------------------

// Lister tous les tweets (public)
router.get('/tweets', (ctx) => new TweetsController().showTweets(ctx))
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

// Suivre un utilisateur
router
  .post('/follow/:id', async (ctx) => new FollowersController().follow(ctx))
  .middleware([middleware.auth()])

// Se désabonner
router
  .post('/unfollow/:id', async (ctx) => new FollowersController().unfollow(ctx))
  .middleware([middleware.auth()])

// Liste des abonnés d’un utilisateur
router.get('/users/:id/followers', async (ctx) => new FollowersController().followers(ctx))

// Liste des utilisateurs suivis
router.get('/users/:id/following', async (ctx) => new FollowersController().following(ctx))

// Suggestions d’utilisateurs à suivre
router
  .get('/suggestions', async (ctx) => new SuggestionsController().index(ctx))
  .middleware([middleware.auth()])

// Page abonnements de l'utilisateur connecté
router
  .get('/my-following', async ({ auth, view, response }) => {
    if (!auth.user) return response.redirect('/auth/login')

    // Précharger les utilisateurs suivis
    await auth.user.load('following')
    return view.render('pages/following', { user: auth.user, following: auth.user.following })
  })
  .middleware([middleware.auth()])

// Page abonnés de l'utilisateur connecté
router
  .get('/my-followers', async ({ auth, view, response }) => {
    if (!auth.user) return response.redirect('/auth/login')

    // Précharger les abonnés
    await auth.user.load('followers')
    return view.render('pages/followers', { user: auth.user, followers: auth.user.followers })
  })
  .middleware([middleware.auth()])
