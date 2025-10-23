import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, beforeSave, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import Tweet from '#models/tweet'
import Like from '#models/like'
import Comment from '#models/comment'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  // 🔹 Colonnes
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string | null

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.date()
  declare birthdate?: DateTime | null

  @column()
  declare gender?: 'male' | 'female' | 'other' | null

  @column()
  declare profile_picture?: string | null

  @column()
  declare banner_picture?: string | null

  @column()
  declare phone?: string | null

  @column()
  declare website?: string | null

  @column()
  declare bio?: string | null

  @column()
  declare is_verified: boolean

  @column()
  declare email_token: string | null

  @column()
  declare verified: boolean

  @column()
  declare tweets_count: number

  @column()
  declare followers_count: number

  @column()
  declare following_count: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 🔹 Relations
  @hasMany(() => Tweet)
  declare tweets: HasMany<typeof Tweet>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @manyToMany(() => User, {
    pivotTable: 'followers',
    localKey: 'id',
    pivotForeignKey: 'follower_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'following_id',
  })
  declare following: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'followers',
    localKey: 'id',
    pivotForeignKey: 'following_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'follower_id',
  })
  declare followers: ManyToMany<typeof User>

  // 🔐 Hook pour hacher le mot de passe avant sauvegarde
  @beforeSave()
  public static async hashPasswordHook(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
