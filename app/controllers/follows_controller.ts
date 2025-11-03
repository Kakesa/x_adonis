import type { HttpContext } from '@adonisjs/core/http'
import Follower from '#models/follower'

export default class FollowersController {
  // -----------------------
  // Suivre un utilisateur
  // -----------------------
  public async follow({ auth, params, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié' })
    }

    const followerId = auth.user.id
    const followingId = Number(params.id)

    if (followerId === followingId) {
      return response.badRequest({ message: 'Impossible de se suivre soi-même' })
    }

    // Vérifier si le follow existe déjà
    const exists = await Follower.query()
      .where('follower_id', followerId)
      .andWhere('following_id', followingId)
      .first()

    if (exists) {
      return response.badRequest({ message: 'Vous suivez déjà cet utilisateur' })
    }

    await Follower.create({ followerId, followingId })

    return response.json({ message: 'Vous suivez maintenant cet utilisateur' })
  }

  // -----------------------
  // Se désabonner
  // -----------------------
  public async unfollow({ auth, params, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié' })
    }

    const followerId = auth.user.id
    const followingId = Number(params.id)

    const deleted = await Follower.query()
      .where('follower_id', followerId)
      .andWhere('following_id', followingId)
      .delete()

    if (deleted) {
      return response.json({ message: 'Désabonné !' })
    } else {
      return response.notFound({ message: 'Vous ne suivez pas cet utilisateur' })
    }
  }

  // -----------------------
  // Liste des abonnés
  // -----------------------
  public async followers({ params, response }: HttpContext) {
    const userId = Number(params.id)

    const followers = await Follower.query().where('following_id', userId).preload('follower')

    return response.json(followers.map((f) => f.follower))
  }

  // -----------------------
  // Liste des abonnements
  // -----------------------
  public async following({ params, response }: HttpContext) {
    const userId = Number(params.id)

    const following = await Follower.query().where('follower_id', userId).preload('following')

    return response.json(following.map((f) => f.following))
  }
}
