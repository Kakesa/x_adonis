import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TweetsSchema extends BaseSchema {
  protected tableName = 'tweets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Auteur du tweet
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      // Contenu texte du tweet
      table.text('content').nullable()

      // Si le tweet est une réponse ou un retweet
      table
        .integer('parent_tweet_id')
        .unsigned()
        .references('id')
        .inTable('tweets')
        .onDelete('CASCADE')
        .nullable()

      // Visibilité du tweet (public, privé, ou réservé aux abonnés)
      table.enum('visibility', ['public', 'private', 'followers']).defaultTo('public')

      // Statistiques du tweet
      table.integer('likes_count').defaultTo(0)
      table.integer('retweets_count').defaultTo(0)
      table.integer('comments_count').defaultTo(0)
      table.integer('views_count').defaultTo(0)

      // Tweet épinglé ou non
      table.boolean('is_pinned').defaultTo(false)

      // Dates de création et de mise à jour
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
