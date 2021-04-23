import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AccountActivationEmailService {
  constructor(private readonly mailerService: MailerService) {}
  
  async sendemail(  usermail: string)
   {
     const paramusermail=usermail;
    this
      .mailerService
      .sendMail({
        to: paramusermail, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Compte activé ✔', // Subject line
        //text:'hello',
        html: '<p>Your account is activated</p> ' // HTML body content
      })
      .then(() => {})
      .catch(() => {});
  }
}