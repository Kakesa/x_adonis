import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CommentsSchema extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Auteur du commentaire
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      // Tweet sur lequel on commente
      table.integer('tweet_id').unsigned().references('id').inTable('tweets').onDelete('CASCADE')

      // Contenu du commentaire
      table.text('content').notNullable()

      // Si le commentaire est une réponse à un autre commentaire
      table
        .integer('parent_comment_id')
        .unsigned()
        .references('id')
        .inTable('comments')
        .onDelete('CASCADE')
        .nullable()

      // Statistiques locales
      table.integer('likes_count').defaultTo(0)
      table.integer('replies_count').defaultTo(0)

      // Dates
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
