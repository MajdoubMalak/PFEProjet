import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { UserRole } from 'src/Roles';

export type ServiceProvidorDocument = ServiceProvidor & Document;
@Schema()
export class ServiceProvidor{
@Prop({ required: true})
username: string;
@Prop({required: true})
email: string;
@Prop({ required: true})
password: string;
@Prop({ required: true})
company: string;
@Prop({  required: true})
region: string;
@Prop({  required: true})
category: string;
@Prop({ required: true})
phoneNumber: string;
@Prop({ required: true})
age:number;
@Prop({ required: true})
gender:string;
@Prop({ required: false, default: 0})
rank:number;
@Prop({ required: false, default: "null.jpg"})
profilePicture:string;
@Prop({ required: true, default: UserRole.PRESTA})
role: string; 
@Prop( {required: true, default: -1})
codeNumber: number;
@Prop({required: true, default:false})
activated: boolean; 

}
export const ServiceProvidorSchema = SchemaFactory.createForClass(ServiceProvidor);
export interface ServiceProvidor extends Document {
    id: string;
    username: string;
    email: string;
    password: string;
    company: string;
    region:string;
    category: string;
    rank: number;
    profilePicture: string;
    phoneNumber: string;
    age: number;
    gender:string;
    role: string;
    codeNumber: number;
    activated: boolean;   

}