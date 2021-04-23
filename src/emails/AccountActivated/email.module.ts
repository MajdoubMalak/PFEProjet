import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AccountActivationEmailService } from './email.service';


@Module({
    imports: [
MailerModule.forRoot({

    transport: 'smtps://pfeeventapp@gmail.com:pfeeventapp123@smtp.gmail.com',
    
    preview: true,
    template: {
      dir: process.cwd() + '/template/',
      adapter: new HandlebarsAdapter(), 
      options: {
        strict: true,
      },
    },
  }),
],
providers: [AccountActivationEmailService],
exports: [AccountActivationEmailService]
})
export class AccountActivationEmailModule{}