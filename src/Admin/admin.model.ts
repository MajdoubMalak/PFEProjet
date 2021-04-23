import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { UserRole } from 'src/Roles';

export type AdminDocument = Admin & Document;
@Schema()
export class Admin{
@Prop({ required: false, default:"admin"})
username: string;
@Prop({ required: false, default:"admin"})
password: string;
@Prop({ required: true, default: UserRole.ADMIN})
role: string;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
export interface Admin extends Document {
    id: string;
    username: string;
    password: string;
    role: string;
    
}