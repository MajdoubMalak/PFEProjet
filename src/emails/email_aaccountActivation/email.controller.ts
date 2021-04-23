import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  getHello() {
    const username="malak";
    const usermail="majdoub29malak@gmail.com";
    const code=258
    return this.emailService.sendemail(username, usermail,code);
  }
}