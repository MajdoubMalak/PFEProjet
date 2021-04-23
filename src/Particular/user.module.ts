import { Module,forwardRef, CacheModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserSchema} from './user.model';
import {MongooseModule} from '@nestjs/mongoose';
import { AuthModule } from 'src/Particular/auth/auth.module';
import { EmailModule } from 'src/emails/email_aaccountActivation/email.module';
import { AdminModule } from 'src/Admin/admin.module';
import { ResetRequestModule } from 'src/ResetRequest/ResetRequest.module';
import { ResetRequestEmailModule } from 'src/emails/ResetRequestEmail/email.module';
import { AccountActivationEmailModule } from 'src/emails/AccountActivated/email.module';



@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]), 
  forwardRef(() =>AdminModule),
  EmailModule,
  AuthModule,
  ResetRequestModule,
  ResetRequestEmailModule,
  AccountActivationEmailModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
