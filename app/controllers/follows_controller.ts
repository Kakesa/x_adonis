import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Follower from '#models/follower'

export default class FollowsController {
  // Toggle follow / unfollow
  public async toggle({ auth, params, response }: HttpContext) {
    const user = auth.user
    const targetUser = await User.findBy('id', params.id)

    if (!targetUser || !user) {
      return response.notFound('Utilisateur introuvable')
    }

    // Vérifier si on suit déjà
    const existing = await Follower.query()
      .where('follower_id', user.id)
      .where('following_id', targetUser.id)
      .first()

    if (existing) {
      await existing.delete()
      return response.json({ message: 'Vous ne suivez plus cet utilisateur', following: false })
    } else {
      await Follower.create({
        followerId: user.id,
        followingId: targetUser.id,
      })
      return response.json({ message: 'Vous suivez maintenant cet utilisateur', following: true })
    }
  }

  // Liste des abonnements
  public async following({ params, view }: HttpContext) {
    const user = await User.findByOrFail('username', params.username)
    await user.load('following') // charger les utilisateurs suivis

    return view.render('pages/following', { user, following: user.following })
  }

  // Liste des abonnés
  public async followers({ params, view }: HttpContext) {
    const user = await User.findByOrFail('username', params.username)
    await user.load('followers') // charger les abonnés

    return view.render('pages/followers', { user, followers: user.followers })
  }
}
