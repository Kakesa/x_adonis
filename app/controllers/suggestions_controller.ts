import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Follower from '#models/follower'

export default class SuggestionsController {
  // Récupérer les suggestions d'utilisateurs à suivre
  public async index({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié' })
    }

    try {
      // 1️⃣ Récupérer les IDs des utilisateurs que l'utilisateur suit déjà
      const followed = await Follower.query()
        .where('follower_id', auth.user.id)
        .select('following_id')

      const followedIds = followed.map((f) => f.followingId)

      // 2️⃣ Récupérer des utilisateurs à suggérer
      const suggestions = await User.query()
        .whereNot('id', auth.user.id) // exclure l'utilisateur actuel
        .whereNotIn('id', followedIds) // exclure ceux déjà suivis
        .limit(5)
        .select('id', 'name', 'username', 'profile_picture')

      return response.json({ suggestions })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }
}
