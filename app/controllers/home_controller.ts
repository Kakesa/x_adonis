import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  public async index({ view, auth }: HttpContext) {
    const authUser = auth.user
    return view.render('pages/index', { authUser })
  }
}
