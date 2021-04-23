import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type ResetRequestDocument = ResetRequest & Document;
@Schema()
export class ResetRequest{
@Prop({ required: true})
id: string;
@Prop({required: true})
username: string; 
@Prop({required: true})
code: number
}
export const ResetRequestSchema = SchemaFactory.createForClass(ResetRequest);
export interface ResetRequest extends Document {
    id: string;
    username: string;
    code: number;
}