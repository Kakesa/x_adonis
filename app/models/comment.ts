import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Tweet from '#models/tweet'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Auteur du commentaire
  @column()
  declare user_id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Tweet parent
  @column()
  declare tweet_id: number

  @belongsTo(() => Tweet)
  declare tweet: BelongsTo<typeof Tweet>

  // Si le commentaire est une réponse à un autre commentaire
  @column()
  declare parent_comment_id?: number | null

  @belongsTo(() => Comment, { foreignKey: 'parent_comment_id' })
  declare parent_comment?: BelongsTo<typeof Comment>

  @hasMany(() => Comment, { foreignKey: 'parent_comment_id' })
  declare replies: HasMany<typeof Comment>

  // Contenu
  @column()
  declare content: string

  // Statistiques
  @column()
  declare likes_count: number

  @column()
  declare replies_count: number

  // Dates
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
