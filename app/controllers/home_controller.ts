import * as fs from 'node:fs/promises'
import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  public async index({ view }: HttpContext) {
    try {
      // 🗂️ Chemin absolu vers le dossier des logos
      const logoDir = app.makePath('resources/images/logo')

      // 📷 Lecture du dossier
      const files = await fs.readdir(logoDir)

      // 🔍 Filtre les fichiers d’images valides
      const images = files.filter((file) => /\.(png|jpe?g|svg|webp)$/i.test(file))

      // 🧭 Construit les chemins accessibles côté client
      const imagePaths = images.map((file) => `/images/logo/${file}`)

      // 📤 Rendu de la vue avec les images
      return view.render('pages/home', { imagePaths })
    } catch (error) {
      console.error('Erreur lors de la lecture des images :', error)
      // En cas d’erreur, on affiche quand même la page mais sans images
      return view.render('pages/home', { imagePaths: [] })
    }
  }
}
