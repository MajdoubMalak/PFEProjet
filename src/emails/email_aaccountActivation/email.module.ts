import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
    imports: [
MailerModule.forRoot({
    //transport: {
    // service: 'gmail',
    // host: 'smtp.gmail.com',
      // auth: {
        // user: process.env.MAILDEV_INCOMING_USER,
        // pass: process.env.MAILDEV_INCOMING_PASS,   
       // user: 'pfeeventapp@gmail.com',
        //pass: 'pfeeventapp123' 
   // },
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
providers: [EmailService],
controllers: [EmailController],
exports: [EmailService]
})
export class EmailModule{}