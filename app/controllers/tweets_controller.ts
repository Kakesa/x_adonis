import fs from 'node:fs'
import path from 'node:path'
import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import Media from '#models/media'
import { v4 as uuidv4 } from 'uuid'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

export default class TweetsController {
  /**
   * Lister tous les tweets avec timeAgo
   */
  async showTweets({ view }: HttpContext) {
    const tweets = await Tweet.query()
      .preload('user')
      .preload('comments', (q) => q.preload('user'))
      .preload('likes')
      .preload('media')

    const tweetsWithTimeAgo = tweets.map((tweet) => {
      let timeAgo = ''
      if (tweet.createdAt) {
        const dt =
          tweet.createdAt instanceof Date
            ? DateTime.fromJSDate(tweet.createdAt)
            : typeof tweet.createdAt === 'string'
              ? DateTime.fromISO(tweet.createdAt)
              : tweet.createdAt

        timeAgo = dt.toRelative() || ''
      }

      return { ...tweet.serialize(), timeAgo }
    })

    return view.render('pages/home', { tweets: tweetsWithTimeAgo })
  }

  /**
   * Détail d’un tweet avec timeAgo
   */
  async show({ params, response }: HttpContext) {
    try {
      const tweet = await Tweet.query()
        .where('id', params.id)
        .preload('user')
        .preload('comments', (q) => q.preload('user'))
        .preload('likes')
        .preload('media')
        .firstOrFail()

      const dt =
        tweet.createdAt instanceof Date
          ? DateTime.fromJSDate(tweet.createdAt)
          : typeof tweet.createdAt === 'string'
            ? DateTime.fromISO(tweet.createdAt)
            : tweet.createdAt

      const tweetWithTimeAgo = {
        ...tweet.toJSON(),
        timeAgo: dt.toRelative() || '',
      }

      return response.ok({ tweet: tweetWithTimeAgo })
    } catch {
      return response.notFound({ message: 'Tweet non trouvé' })
    }
  }

  /**
   * Créer un tweet avec médias
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const content = request.input('content')
    const visibility = request.input('visibility') || 'public'
    const parentTweetId = request.input('parentTweetId') || null

    const tweet = await Tweet.create({
      userId: user.id,
      content,
      visibility,
      parentTweetId,
      likesCount: 0,
      retweetsCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      isPinned: false,
    })

    const files = request.files('media', {
      size: '100mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'mkv', 'webm'],
    })

    for (const file of files) {
      if (!file || !file.isValid) continue
      const ext = file.extname ?? 'bin'
      const fileName = `${uuidv4()}.${ext}`

      await file.move(app.publicPath('uploads'), { name: fileName, overwrite: true })

      await Media.create({
        tweetId: tweet.id,
        url: `/uploads/${fileName}`,
        type: ext.match(/mp4|mov|avi|mkv|webm/) ? 'video' : 'image',
      })
    }

    return response.redirect('/home')
  }

  /**
   * Mettre à jour un tweet et ajouter de nouveaux médias
   */
  async update({ params, request, auth, response }: HttpContext) {
    const tweet = await Tweet.findOrFail(params.id)
    if (tweet.userId !== auth.user?.id) {
      return response.unauthorized({ message: 'Action non autorisée' })
    }

    tweet.merge(request.only(['content', 'visibility', 'isPinned']))
    await tweet.save()

    const files = request.files('media', {
      size: '100mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'mkv', 'webm'],
    })

    for (const file of files) {
      if (!file || !file.isValid) continue
      const ext = file.extname ?? 'bin'
      const fileName = `${uuidv4()}.${ext}`

      await file.move(app.publicPath('uploads'), { name: fileName, overwrite: true })

      await Media.create({
        tweetId: tweet.id,
        url: `/uploads/${fileName}`,
        type: ext.match(/mp4|mov|avi|mkv|webm/) ? 'video' : 'image',
      })
    }

    return response.ok({ tweet })
  }

  /**
   * Supprimer un tweet et ses médias
   */
  async destroy({ params, auth, response }: HttpContext) {
    const tweet = await Tweet.findOrFail(params.id)
    if (tweet.userId !== auth.user?.id) {
      return response.unauthorized({ message: 'Action non autorisée' })
    }

    const medias = await Media.query().where('tweetId', tweet.id)
    for (const media of medias) {
      const filePath = path.join(app.publicPath(), media.url.replace(/^\//, ''))
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      await media.delete()
    }

    await tweet.delete()
    return response.ok({ message: 'Tweet et médias supprimés avec succès' })
  }
}
