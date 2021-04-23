import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {ADMINAuthService} from './auth/admin_auth.service';
import { Admin } from './admin.model';

@Injectable()
export class AdminService {
    constructor(@InjectModel('Admin') private readonly adminModel: Model<Admin>,
    private adminauthService: ADMINAuthService){}
    async  AddAdmin(){
        const newAdmin= new this.adminModel()
            const hashed = await this.adminauthService.hashPassword(newAdmin.password);
            newAdmin.password = hashed;
            const saved_admin = await newAdmin.save();
            const token = await this.adminauthService.generateJWT(saved_admin);
            console.log(token);
            return await token;
     }
     async Login(username: string, password: string): Promise<any> {
        const admin = await this.adminModel.findOne({username : username} ).exec();
        console.log(admin);
        if(!admin){
            return 'wrong admin taped';
        }else{
            if(await this.adminauthService.comparePasswords(password, admin.password)){
                return  this.adminauthService.generateJWT(admin);
            }else{
                return 'wrong password inserted taped';
            } 
        }  
    }

    async getAllAdmins() {
        const result= await  this.adminModel.find().exec(); 
        console.log(result);
  
       return result as Admin[]; 
     }

}
 
