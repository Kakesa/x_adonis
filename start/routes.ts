import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
| J'ai corrigé 3 points principaux :
| 1. Les imports de contrôleurs sont maintenant tous statiques et uniformes.
| 2. La syntaxe des routes utilise le format recommandé `[Controller, 'method']`
|    qui est plus performant et plus clair.
| 3. L'ordre des routes de profil a été corrigé pour éviter les conflits.
|--------------------------------------------------------------------------
*/

// --- 1. Imports de tous les contrôleurs ---
const AuthController = () => import('#controllers/auth_controller')
const TweetsController = () => import('#controllers/tweets_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const FollowsController = () => import('#controllers/follows_controller')
const SuggestionsController = () => import('#controllers/suggestions_controller')

// -------------------
// Pages publiques
// -------------------
router.get('/', ({ view }) => view.render('pages/index')).as('index')
router.get('/auth/login', [AuthController, 'showLogin']).as('auth.login.show')
router.post('/auth/login', [AuthController, 'login']).as('auth.login')
router.post('/auth/register', [AuthController, 'register']).as('auth.register')
router.get('/verify-email/:token', [AuthController, 'verifyEmail']).as('auth.verify')

// -------------------
// Routes protégées par authentification
// -------------------
router
  .group(() => {
    // Page d'accueil avec les tweets
    router.get('/home', [TweetsController, 'showTweets']).as('home')

    // Déconnexion
    router.post('/logout', [AuthController, 'logout']).as('auth.logout')

    // --- Profil utilisateur ---
    // L'ordre est crucial : du plus spécifique au plus général
    router.get('/profil', [ProfilesController, 'showMe']).as('pages.profil')
    router.post('/users/:id/follow', [FollowsController, 'toggle']).as('users.follow.toggle')
    router
      .get('/profil/:username/following', [FollowsController, 'following'])
      .as('profile.following')
    router
      .get('/profil/:username/followers', [FollowsController, 'followers'])
      .as('profile.followers')

    router.get('/profil/:username', [ProfilesController, 'showByUsername']).as('profile.show')

    // --- CRUD Tweets ---
    router.get('/tweets/:id', [TweetsController, 'show']).as('tweets.show')
    router.post('/tweets', [TweetsController, 'store']).as('tweets.store')
    router.put('/tweets/:id', [TweetsController, 'update']).as('tweets.update')
    router.delete('/tweets/:id', [TweetsController, 'destroy']).as('tweets.destroy')
    router.post('/tweets/:id/retweet', [TweetsController, 'retweet']).as('tweets.retweet')
    // Like
    // router.post('/tweets/:id/like', [TweetsController, 'like']).as('tweets.like')
    // comment
    // router.post('/tweets/:id/comment', [TweetsController, 'comment']).as('tweets.comment')

    // --- Suggestions ---
    router.get('/suggestions', [SuggestionsController, 'index']).as('suggestions')
  })
  .use(middleware.auth()) // Applique le middleware `auth` à TOUTES les routes de ce groupe
