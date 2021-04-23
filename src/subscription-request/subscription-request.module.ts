import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganisatorModule } from 'src/organisator/organisator.module';
import { SubscriptionRequestController } from './subscription-request.controller';
import { SubscriptionRequestSchema } from './subscription-request.model';
import { SubscriptionRequestService } from './subscription-request.service';

@Module({
imports: [MongooseModule.forFeature([{name: 'SubscriptionRequest', schema:SubscriptionRequestSchema}]),
OrganisatorModule
],
providers: [SubscriptionRequestService],
exports: [SubscriptionRequestService],
controllers: [SubscriptionRequestController],
})
export class SubscriptionRequestModule {}



