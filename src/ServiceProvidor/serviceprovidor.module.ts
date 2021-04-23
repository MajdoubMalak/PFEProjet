import { forwardRef, Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { AdminModule } from 'src/Admin/admin.module';

import { EmailModule } from 'src/emails/email_aaccountActivation/email.module';
import { ResetRequestModule } from 'src/ResetRequest/ResetRequest.module';
import { ResetRequestEmailModule } from 'src/emails/ResetRequestEmail/email.module';
import { ServiceProvidorAuthModule } from './auth/auth.module';
import { ServiceProvidorController } from './serviceprovidor.controller';
import { ServiceProvidorSchema } from './serviceprovidor.model';
import { ServiceProvidorService } from './serviceprovidor.service';
import { AccountActivationEmailModule } from 'src/emails/AccountActivated/email.module';



@Module({
  imports: [MongooseModule.forFeature([{name: 'ServiceProvidor', schema: ServiceProvidorSchema}]), 
  forwardRef(() =>AdminModule),
  EmailModule,
  ServiceProvidorAuthModule,
  ResetRequestModule,
  ResetRequestEmailModule,
  AccountActivationEmailModule],
  providers: [ServiceProvidorService],
  controllers: [ServiceProvidorController],
  exports: [ServiceProvidorService]
})
export class ServiceProvidorModule {}