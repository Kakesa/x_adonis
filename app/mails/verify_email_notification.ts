import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'

export default class VerifyEmail extends BaseMail {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  prepare() {
    this.message
      .subject('Vérifie ton adresse e-mail')
      .from('no-reply@tonapp.com')
      .to(this.user.email)
      .htmlView('emails/verify_email', {
        user: this.user,
        token: this.token,
      })
  }
}
