import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('username', 50).nullable().unique()
      table.string('name', 100).nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.date('birthdate').nullable()
      table.enum('gender', ['male', 'female', 'other']).nullable()

      table.string('profile_picture').nullable()
      table.string('banner_picture').nullable()
      table.string('phone', 20).nullable()
      table.string('website', 255).nullable()
      table.text('bio').nullable()

      // Compte vérifié par défaut = false
      table.boolean('verified').defaultTo(false)

      // Compteurs pour optimisation (peuvent être mis à jour dynamiquement)
      table.integer('tweets_count').defaultTo(0)
      table.integer('followers_count').defaultTo(0)
      table.integer('following_count').defaultTo(0)

      // Dates de création et de mise à jour automatiques
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
