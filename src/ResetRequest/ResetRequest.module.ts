import { forwardRef, Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { ResetRequestController } from './ResetRequest.controller';
import { ResetRequestService } from './ResetRequest.service';
import { ResetRequestSchema } from './ResetRequestModel';



@Module({
  imports: [MongooseModule.forFeature([{name: 'ResetRequest', schema:ResetRequestSchema}]),
  ],
  providers: [ResetRequestService],
  exports: [ResetRequestService],
  controllers: [ResetRequestController],
})
export class ResetRequestModule {}