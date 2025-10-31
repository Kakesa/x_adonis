import fs from 'node:fs'
import path from 'node:path'
import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import Media from '#models/media'
import { v4 as uuidv4 } from 'uuid'
import app from '@adonisjs/core/services/app'

export default class TweetsController {
  /**
   * Lister tous les tweets
   */
  async showTweets({ view }: HttpContext) {
    const tweets = await Tweet.query()
      .preload('user')
      .preload('comments', (q) => q.preload('user'))
      .preload('likes')
      .preload('media')

    return view.render('pages/home', { tweets })
  }

  /**
   * Détail d’un tweet
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

      return response.ok({ tweet })
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

    // Gestion des médias uploadés
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

    // Ajout de nouveaux fichiers
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

    // Supprimer les médias associés
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
