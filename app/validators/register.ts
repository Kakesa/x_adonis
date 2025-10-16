import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    // Nom complet (Nom + Prénom)
    name: vine.string().trim().minLength(3).maxLength(200),

    // Email
    email: vine.string().trim().email(),

    // Mot de passe avec confirmation
    password: vine.string().trim().minLength(6).confirmed(),

    // Genre (facultatif)
    gender: vine.enum(['male', 'female', 'other']).optional(),

    // Date de naissance (facultatif)
    birthdate: vine.string().trim(), // obligatoire

    // Téléphone (facultatif)
    phone: vine.string().trim().optional(),

    // Site web (facultatif)
    website: vine.string().trim().url().optional(),

    // Bio (facultatif)
    bio: vine.string().trim().maxLength(500).optional(),

    // Images (facultatif)
    profile_picture: vine.string().trim().url().optional(),
    banner_picture: vine.string().trim().url().optional(),
  })
)
