import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import app from '@adonisjs/core/services/app'

/**
 * Copie les images de `resources/images/logo` vers `public/images/logo`
 */
export default async function copyStaticAssets() {
  try {
    const srcDir = app.makePath('resources/images/logo')
    const destDir = app.makePath('public/images/logo')

    // 🧱 Crée le dossier destination s'il n'existe pas
    await fs.mkdir(destDir, { recursive: true })

    // 📦 Liste les fichiers du dossier source
    const files = await fs.readdir(srcDir)

    // 🔄 Copie chaque image
    for (const file of files) {
      const srcPath = path.join(srcDir, file)
      const destPath = path.join(destDir, file)
      await fs.copyFile(srcPath, destPath)
    }

    console.log('✅ Images copiées de resources/images/logo vers public/images/logo')
  } catch (error) {
    console.error('⚠️ Erreur lors de la copie des images :', error)
  }
}
