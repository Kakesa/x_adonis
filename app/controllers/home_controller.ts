import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'

export default class HomeController {
  public async index({ view, auth }: HttpContext) {
    const authUser = auth.user

    // Récupérer les tweets avec l'auteur, les counts et les médias
    const tweets = await Tweet.query()
      .preload('user')
      .preload('comments', (q) => q.preload('user'))
      .preload('likes')
      .preload('media')
      .orderBy('created_at', 'desc')

    // Calculer les counts directement dans le tableau (utile pour Edge)
    const tweetsForView = tweets.map((tweet) => ({
      ...tweet.serialize(),
      comments_count: tweet.comments.length,
      likes_count: tweet.likes.length,
      retweets_count: tweet.retweets_count ?? 0, // si tu as cette colonne
    }))

    return view.render('pages/index', { authUser, tweets: tweetsForView })
  }
}
