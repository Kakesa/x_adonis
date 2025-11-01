import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Tweet from '#models/tweet'

export default class ProfilesController {
  /**
   * Profil de l'utilisateur connecté
   */
  async show({ auth, view }: HttpContext) {
    const user = auth.user
    if (!user) {
      return view.render('errors/unauthorized')
    }

    // Récupération des tweets du user connecté
    const tweets = await Tweet.query()
      .where('user_id', user.id)
      .preload('user', (query) => {
        query.select(['id', 'name', 'username', 'profile_picture'])
      })
      .orderBy('created_at', 'desc')

    const tweetsCount = tweets.length
    const followersCount = 125
    const followingCount = 210

    return view.render('pages/profil', {
      user,
      tweets,
      tweetsCount,
      followersCount,
      followingCount,
      isOwner: true, // indique qu’il s’agit du profil connecté
    })
  }

  /**
   * Profil public d'un autre utilisateur
   */
  async showByUsername({ params, auth, view, response }: HttpContext) {
    const { username } = params

    const user = await User.query().where('username', username).first()
    if (!user) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }

    // Récupère les tweets de ce user
    const tweets = await Tweet.query()
      .where('user_id', user.id)
      .preload('user', (query) => {
        query.select(['id', 'name', 'username', 'profile_picture'])
      })
      .orderBy('created_at', 'desc')

    const tweetsCount = tweets.length
    const followersCount = 90 // exemple
    const followingCount = 45

    const isOwner = auth.user?.id === user.id

    return view.render('pages/profil', {
      user,
      tweets,
      tweetsCount,
      followersCount,
      followingCount,
      isOwner,
    })
  }
}
