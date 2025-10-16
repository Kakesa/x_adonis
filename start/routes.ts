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

// -------------------
// Home
// -------------------
// router.on('/').render('pages/home')
router.get('/', (ctx) => new HomeController().index(ctx)).as('pages/home')

// -------------------
// Auth
// -------------------
router.get('/login', (ctx) => new AuthController().showLogin(ctx))
router.post('/login', (ctx) => new AuthController().login(ctx))

router.get('/register', (ctx) => new AuthController().showRegister(ctx)).as('register.show')
router.post('/register', (ctx) => new AuthController().register(ctx)).as('register')

router.post('/logout', (ctx) => new AuthController().logout(ctx)).middleware([middleware.auth()])
