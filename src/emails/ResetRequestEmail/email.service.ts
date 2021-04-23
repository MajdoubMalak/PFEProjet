import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ResetRequestEmailService {
  constructor(private readonly mailerService: MailerService) {}
  
  async sendemail(  usermail: string, code: number)
   {
     
     const paramusermail=usermail;
     const verificationcode=code;
    this
      .mailerService
      .sendMail({
        to: paramusermail, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Reset Password', // Subject line
        //text:'hello',
        html: '<p>We received a reset password request, Your verification code is  <p>'+`${verificationcode}`+ '<p> If you did not request this code, it is possible that someone is trying to access your account <p>', // HTML body content
      })
      .then(() => {})
      .catch(() => {});
  }
}