import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class PasswordUpdated extends BaseMailer {
    /**
     * WANT TO USE A DIFFERENT MAILER?
     *
     * Uncomment the following line of code to use a different
     * mailer and chain the ".options" method to pass custom
     * options to the send method
     */
    // public mailer = this.mail.use()
    constructor(private user: User, public subject: string) {
        super(user, subject)
    }

    /**
     * The prepare method is invoked automatically when you run
     * "PasswordUpdated.send".
     *
     * Use this method to prepare the email message. The method can
     * also be async.
     */
    public prepare(message: MessageContract) {
        message.subject(this.subject).from(Env.get('MAIL_FROM_ADDRESS')).to(this.user.email)
            .htmlView('emails/password-updated', { subject: this.subject, user: this.user })
    }
}
