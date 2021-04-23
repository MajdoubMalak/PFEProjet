import { forwardRef, Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { OrganisatorModule } from 'src/organisator/organisator.module';
import { ServiceProvidorModule } from 'src/ServiceProvidor/serviceprovidor.module';
import { UserModule } from 'src/Particular/user.module';
import { AdminController } from './admin.controller';
import { AdminSchema } from './admin.model';
import { AdminService } from './admin.service';
import { ADMINAuthModule } from './auth/admin_auth.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Admin', schema: AdminSchema}]), 
  ADMINAuthModule, forwardRef(() =>UserModule),
  forwardRef(() =>OrganisatorModule),
  forwardRef(() =>ServiceProvidorModule), ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService]
})
export class AdminModule {}