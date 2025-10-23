import Env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

export default defineConfig({
  default: 'smtp',

  mailers: {
    smtp: transports.smtp({
      host: Env.get('MAIL_HOST'),
      port: Number(Env.get('MAIL_PORT')),
      auth: {
        type: 'login',
        user: Env.get('MAIL_USERNAME'),
        pass: Env.get('MAIL_PASSWORD'),
      },
      secure: false, // Mailtrap n'utilise pas TLS
    }),
  },

  from: {
    address: Env.get('MAIL_FROM_ADDRESS'), // ✅ utiliser `address`, pas `email`
    name: Env.get('MAIL_FROM_NAME'),
  },
})
