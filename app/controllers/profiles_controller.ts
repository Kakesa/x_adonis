import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async show({ auth, view }: HttpContext) {
    const user = auth.user

    if (!user) {
      return view.render('errors/unauthorized')
    }

    // Compte les followers / followings si tu as ces tables
    const followersCount = 125 // Exemple statique, à remplacer par une requête
    const followingCount = 210

    const tweetsCount = 34 // Exemple : tu pourras compter les posts liés à l'utilisateur

    return view.render('pages/profil', {
      user,
      followersCount,
      followingCount,
      tweetsCount,
    })
  }
}
