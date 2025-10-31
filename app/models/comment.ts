import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Tweet from '#models/tweet'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Auteur du commentaire
  @column({ columnName: 'user_id' })
  declare userId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  // Tweet parent
  @column({ columnName: 'tweet_id' })
  declare tweetId: number

  @belongsTo(() => Tweet, { foreignKey: 'tweetId' })
  declare tweet: BelongsTo<typeof Tweet>

  // Si le commentaire est une réponse à un autre commentaire
  @column({ columnName: 'parent_comment_id' })
  declare parentCommentId?: number | null

  @belongsTo(() => Comment, { foreignKey: 'parentCommentId' })
  declare parentComment?: BelongsTo<typeof Comment>

  @hasMany(() => Comment, { foreignKey: 'parentCommentId' })
  declare replies: HasMany<typeof Comment>

  // Contenu
  @column()
  declare content: string

  // Statistiques
  @column()
  declare likesCount: number

  @column()
  declare repliesCount: number

  // Dates
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
