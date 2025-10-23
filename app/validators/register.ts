import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    // Nom complet (obligatoire)
    name: vine.string().trim().minLength(3).maxLength(200),

    // Email (obligatoire)
    email: vine.string().trim().email(),

    // Mot de passe (obligatoire, min 6 caractères)
    password: vine.string().trim().minLength(6),

    // Téléphone (obligatoire)
    phone: vine.string().trim().minLength(8).maxLength(20),

    /// Date de naissance (obligatoire, format YYYY-MM-DD)
    birthdate: vine
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/),

    // Genre (facultatif)
    gender: vine.enum(['male', 'female', 'other']).optional(),

    // Site web (facultatif)
    website: vine.string().trim().url().optional(),

    // Bio (facultatif)
    bio: vine.string().trim().maxLength(500).optional(),

    // Images (facultatif)
    profile_picture: vine.string().trim().url().optional(),
    banner_picture: vine.string().trim().url().optional(),
  })
)
