import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from '../Particular/user.model';
import {Organisator} from '../organisator/organisator.model';
export type SubscriptionRequestDocument = SubscriptionRequest & Document;
@Schema()
export class SubscriptionRequest{
@Prop({ required: true})
date: string;
@Prop({required: true})
time: string; 
@Prop({required: true,default:0})
state: number
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
senderuser:User;
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organisator' } )
receiverorganizer: Organisator;
}
export const SubscriptionRequestSchema = SchemaFactory.createForClass(SubscriptionRequest);
export interface SubscriptionRequest extends Document {
    date: string;
    time: string;
    state: number;
    senderuser: User;
    receiverorganizer: Organisator;
}