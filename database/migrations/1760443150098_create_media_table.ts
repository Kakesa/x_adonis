import { BaseSchema } from '@adonisjs/lucid/schema'

export default class MediaSchema extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Le tweet auquel appartient le média
      table.integer('tweet_id').unsigned().references('id').inTable('tweets').onDelete('CASCADE')

      // Type de média (image, vidéo, gif, audio)
      table.enum('type', ['image', 'video', 'gif', 'audio']).notNullable()

      // URL du fichier média
      table.string('url').notNullable()

      // Miniature (utile pour les vidéos)
      table.string('thumbnail_url').nullable()

      // Optionnel : durée en secondes pour l’audio/vidéo
      table.integer('duration').nullable()

      // Dates
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
