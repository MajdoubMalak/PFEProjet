import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {UserRole} from '../Roles';

export type UserDocument = User & Document;
@Schema()
export class User{
@Prop({ required: true})
username: string;
@Prop({required: true})
email: string;
@Prop({ required: true})
password: string;
@Prop({  required: true})
gender: string;
@Prop({  required: false, default:'null.jpg'})
profilePicture: string;
@Prop({ required: true})
phoneNumber: string;
@Prop({ required: true})
age:number;
@Prop({ required: true, default: UserRole.PARTI})
role: string; 
@Prop( {required: true, default: -1})
codeNumber: number;
@Prop({required: true, default:false})
activated: boolean; 
}
export const UserSchema = SchemaFactory.createForClass(User);
export interface User extends Document {
    id: string;
    username: string;
    email: string;
    password: string;
    gender: string;
    profilePicture: string;
    phoneNumber: string;
    age: number;
    role: string;
    codeNumber: number;
    activated: boolean;

}

