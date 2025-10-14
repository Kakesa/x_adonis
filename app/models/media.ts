import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tweet from '#models/tweet'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Tweet associé
  @column()
  declare tweet_id: number

  @belongsTo(() => Tweet)
  declare tweet: BelongsTo<typeof Tweet>

  // Type de média
  @column()
  declare type: 'image' | 'video' | 'gif' | 'audio'

  // URL du fichier
  @column()
  declare url: string

  // URL de la miniature (optionnel)
  @column()
  declare thumbnail_url?: string | null

  // Durée (pour vidéo/audio)
  @column()
  declare duration?: number | null

  // Dates
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
