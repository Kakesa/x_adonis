import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SuggestionsController {
  // Récupérer les suggestions d'utilisateurs à suivre
  public async index({ auth }: HttpContext) {
    const currentUser = auth.user
    if (!currentUser) return { suggestions: [] }

    // Récupérer les IDs des utilisateurs déjà suivis
    const followingIds = await currentUser
      .related('following')
      .query()
      .select('id')
      .then((users) => users.map((u) => u.id))

    // Sélectionner quelques utilisateurs aléatoires à suggérer
    const suggestions = await User.query()
      .whereNot('id', currentUser.id)
      .whereNotIn('id', followingIds)
      .limit(5)

    return { suggestions }
  }
}
