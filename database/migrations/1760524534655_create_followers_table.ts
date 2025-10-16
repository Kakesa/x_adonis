import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Followers extends BaseSchema {
  protected tableName = 'followers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('follower_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('following_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.unique(['follower_id', 'following_id'])
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
