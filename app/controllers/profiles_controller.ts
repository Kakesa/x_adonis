import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Tweet from '#models/tweet'
import { DateTime } from 'luxon'

export default class ProfilesController {
  /**
   * Profil de l'utilisateur connecté
   */
  public async show({ auth, view }: HttpContext) {
    const user = auth.user

    if (!user) {
      return view.render('errors/unauthorized')
    }

    // Récupération des tweets avec relations
    const tweets = await Tweet.query()
      .where('user_id', user.id)
      .preload('user', (query: any) => {
        query.select(['id', 'name', 'username', 'profile_picture'])
      })
      .preload('media', (query: any) => {
        query.select(['id', 'tweet_id', 'type', 'url'])
      })
      .preload('parentTweet', (query: any) => {
        query.preload('user', (q: any) => q.select(['id', 'name', 'username', 'profile_picture']))
        query.preload('media', (m: any) => m.select(['id', 'tweet_id', 'type', 'url']))
      })
      .orderBy('created_at', 'desc')

    // Sérialisation + timeAgo
    const tweetsWithTimeAgo = tweets.map((tweet) => {
      const dt =
        tweet.createdAt instanceof Date
          ? DateTime.fromJSDate(tweet.createdAt)
          : typeof tweet.createdAt === 'string'
            ? DateTime.fromISO(tweet.createdAt)
            : tweet.createdAt

      return { ...tweet.serialize(), timeAgo: dt.toRelative() || '' }
    })

    // Charger le nombre de followers / following
    await user.loadCount('followers')
    await user.loadCount('following')

    return view.render('pages/profil', {
      user,
      tweets: tweetsWithTimeAgo,
      tweetsCount: tweetsWithTimeAgo.length,
      followersCount: user.$extras.followers_count ?? 0,
      followingCount: user.$extras.following_count ?? 0,
      isOwner: true,
      isFollowing: false,
    })
  }

  /**
   * Profil public d'un autre utilisateur
   */
  public async showByUsername({ params, auth, view, response }: HttpContext) {
    const { username } = params

    const user = await User.query().where('username', username).first()

    if (!user) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }

    const tweets = await Tweet.query()
      .where('user_id', user.id)
      .preload('user', (query: any) => {
        query.select(['id', 'name', 'username', 'profile_picture'])
      })
      .preload('media', (query: any) => {
        query.select(['id', 'tweet_id', 'type', 'url'])
      })
      .preload('parentTweet', (query: any) => {
        query.preload('user', (q: any) => q.select(['id', 'name', 'username', 'profile_picture']))
        query.preload('media', (m: any) => m.select(['id', 'tweet_id', 'type', 'url']))
      })
      .orderBy('created_at', 'desc')

    // Sérialisation + timeAgo
    const tweetsWithTimeAgo = tweets.map((tweet) => {
      const dt =
        tweet.createdAt instanceof Date
          ? DateTime.fromJSDate(tweet.createdAt)
          : typeof tweet.createdAt === 'string'
            ? DateTime.fromISO(tweet.createdAt)
            : tweet.createdAt

      return { ...tweet.serialize(), timeAgo: dt.toRelative() || '' }
    })

    await user.loadCount('followers')
    await user.loadCount('following')

    let isFollowing = false
    if (auth.user) {
      isFollowing =
        (await auth.user.related('following').query().where('users.id', user.id).first()) !== null
    }

    return view.render('pages/profil', {
      user,
      tweets: tweetsWithTimeAgo,
      tweetsCount: tweetsWithTimeAgo.length,
      followersCount: user.$extras.followers_count ?? 0,
      followingCount: user.$extras.following_count ?? 0,
      isOwner: auth.user?.id === user.id,
      isFollowing,
    })
  }
}
