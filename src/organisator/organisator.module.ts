import { forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {OrganisatorAuthModule } from './auth/auth.module';
import { EmailModule } from 'src/emails/email_aaccountActivation/email.module';
import { OrganisatorController } from './organisator.controller';
import { OrganisatorSchema } from './organisator.model';
import { OrganisatorService } from './organisator.service';
import { AdminModule } from 'src/Admin/admin.module';
import { ResetRequestModule } from 'src/ResetRequest/ResetRequest.module';
import { ResetRequestEmailModule } from 'src/emails/ResetRequestEmail/email.module';
import { AccountActivationEmailModule } from 'src/emails/AccountActivated/email.module';



@Module({
  imports: [MongooseModule.forFeature([{name: 'Organisateur', schema: OrganisatorSchema}]), 
  forwardRef(() =>AdminModule),
  EmailModule,
  OrganisatorAuthModule,
  ResetRequestModule,
  ResetRequestEmailModule,
  AccountActivationEmailModule],
  providers: [OrganisatorService],
  controllers: [OrganisatorController],
  exports: [OrganisatorService]
})
export class OrganisatorModule {}