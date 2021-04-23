import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './Particular/user.module';
import { AuthModule } from './Particular/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './emails/email_aaccountActivation/email.module';
import { OrganisatorModule } from './organisator/organisator.module';
import { ServiceProvidorModule } from './ServiceProvidor/serviceprovidor.module';
import { AdminModule } from './Admin/admin.module';
import { ResetRequestModule } from './ResetRequest/ResetRequest.module';
import {SubscriptionRequestModule} from './subscription-request/subscription-request.module'




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AdminModule,
    OrganisatorModule,
    ServiceProvidorModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/PFEProject'),
    AuthModule,
    EmailModule,
    ResetRequestModule, 
    SubscriptionRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {}
