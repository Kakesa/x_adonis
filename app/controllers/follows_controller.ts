import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Follower from '#models/follower'

export default class FollowController {
  /**
   * 🔹 Suivre ou se désabonner d’un utilisateur
   */
  async toggle({ auth, params, response }: HttpContext) {
    const user = auth.user
    const { id } = params // ID de l'utilisateur à suivre

    if (!user) {
      return response.unauthorized({ message: 'Authentification requise' })
    }

    if (user.id === Number(id)) {
      return response.badRequest({ message: 'Tu ne peux pas te suivre toi-même' })
    }

    const existingFollow = await Follower.query()
      .where('follower_id', user.id)
      .where('following_id', id)
      .first()

    if (existingFollow) {
      await existingFollow.delete()
      return response.ok({ message: 'Désabonné avec succès', following: false })
    }

    await Follower.create({
      followerId: user.id,
      followingId: id,
    })

    return response.ok({ message: 'Abonné avec succès', following: true })
  }

  /**
   * 🔹 Liste des abonnés (followers)
   */
  async followers({ params, view }: HttpContext) {
    const { username } = params

    const user = await User.query()
      .where('username', username)
      .preload('followers') // charge les utilisateurs qui suivent
      .firstOrFail()

    return view.render('pages/followers', {
      user,
      followers: user.followers, // déjà une liste d'objets User
    })
  }

  /**
   * 🔹 Liste des abonnements (following)
   */
  async following({ params, view }: HttpContext) {
    const { username } = params

    const user = await User.query()
      .where('username', username)
      .preload('following') // charge les utilisateurs suivis
      .firstOrFail()

    return view.render('pages/following', {
      user,
      following: user.following,
    })
  }
}
