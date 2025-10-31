import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Comment from '#models/comment'
import Media from '#models/media'
import Like from '#models/like'

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

  // Tweet parent (retweet / réponse)
  @column({ columnName: 'parent_tweet_id' })
  declare parentTweetId?: number | null

  @belongsTo(() => Tweet, { foreignKey: 'parentTweetId' })
  declare parentTweet?: BelongsTo<typeof Tweet>

  // Relations pour réponses / retweets
  @hasMany(() => Tweet, { foreignKey: 'parentTweetId' })
  declare replies: HasMany<typeof Tweet>

  // Visibilité du tweet
  @column()
  declare visibility: 'public' | 'private' | 'followers'

  // Statistiques locales
  @column()
  declare likesCount: number

  @column()
  declare retweetsCount: number

  @column()
  declare commentsCount: number

  @column()
  declare viewsCount: number

  // Tweet épinglé
  @column()
  declare isPinned: boolean

  // Dates
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /*
  |-------------------------------------------------------------------------- 
  | Relations
  |-------------------------------------------------------------------------- 
  */

  @hasMany(() => Comment, { foreignKey: 'tweetId' })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Media, { foreignKey: 'tweetId' })
  declare media: HasMany<typeof Media>

  @hasMany(() => Like, { foreignKey: 'tweetId' }) // ✅ clé correcte
  declare likes: HasMany<typeof Like>
}
