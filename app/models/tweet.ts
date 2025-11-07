import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Comment from '#models/comment'
import Media from '#models/media'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Auteur du tweet
  @column({ columnName: 'user_id' })
  declare userId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  // Contenu texte
  @column()
  declare content: string | null

  // 🧩 Tweet parent (réponse ou retweet)
  @column({ columnName: 'parent_tweet_id' })
  declare parentTweetId?: number | null

  @belongsTo(() => Tweet, { foreignKey: 'parentTweetId' })
  declare parentTweet?: BelongsTo<typeof Tweet>

  // 🔁 Tweet original si c’est un retweet
  @column({ columnName: 'original_tweet_id' })
  declare originalTweetId?: number | null

  @belongsTo(() => Tweet, { foreignKey: 'originalTweetId' })
  declare originalTweet?: BelongsTo<typeof Tweet>

  // ✅ Indique si ce tweet est un retweet
  @column()
  declare isRetweet: boolean

  // 🧩 Tous les retweets / réponses / citations liés à ce tweet
  @hasMany(() => Tweet, { foreignKey: 'parentTweetId' })
  declare children: HasMany<typeof Tweet>

  // 👁️ Visibilité
  @column()
  declare visibility: 'public' | 'private' | 'followers'

  // 📊 Statistiques locales
  @column()
  declare likesCount: number

  @column()
  declare retweetsCount: number

  @column()
  declare commentsCount: number

  @column()
  declare viewsCount: number

  // 📌 Épinglé ou non
  @column()
  declare isPinned: boolean

  // 🕒 Dates
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /*
  |-------------------------------------------------------------------------- 
  | Relations complémentaires
  |-------------------------------------------------------------------------- 
  */

  // 💬 Commentaires
  @hasMany(() => Comment, { foreignKey: 'tweetId' })
  declare comments: HasMany<typeof Comment>

  // 📸 Médias
  @hasMany(() => Media, { foreignKey: 'tweetId' })
  declare media: HasMany<typeof Media>

  // 🔹 Likes (manyToMany)
  @manyToMany(() => User, {
    pivotTable: 'likes', // table pivot
    localKey: 'id', // clé locale du tweet
    pivotForeignKey: 'tweet_id', // colonne tweet_id dans pivot
    relatedKey: 'id', // clé de l'user
    pivotRelatedForeignKey: 'user_id', // colonne user_id dans pivot
  })
  declare likes: ManyToMany<typeof User>
}
