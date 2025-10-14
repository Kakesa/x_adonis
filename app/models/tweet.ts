import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Comment from '#models/comment'
import Media from '#models/media'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Auteur du tweet
  @column()
  declare user_id: number

  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>

  // Contenu texte
  @column()
  declare content: string | null

  // Tweet parent (retweet / réponse)
  @column()
  declare parent_tweet_id?: number | null

  @belongsTo(() => Tweet, { foreignKey: 'parent_tweet_id' })
  declare parent_tweet?: BelongsTo<typeof Tweet>

  // Relations pour réponses / retweets
  @hasMany(() => Tweet, { foreignKey: 'parent_tweet_id' })
  declare replies: HasMany<typeof Tweet>

  // Visibilité du tweet
  @column()
  declare visibility: 'public' | 'private' | 'followers'

  // Statistiques locales
  @column()
  declare likes_count: number

  @column()
  declare retweets_count: number

  @column()
  declare comments_count: number

  @column()
  declare views_count: number

  // Tweet épinglé
  @column()
  declare is_pinned: boolean

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

  @hasMany(() => Comment, { foreignKey: 'tweet_id' })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Media, { foreignKey: 'tweet_id' })
  declare media: HasMany<typeof Media>
}
