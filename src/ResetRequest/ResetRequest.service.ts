import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from 'src/emails/email_aaccountActivation/email.service';
import {ResetRequest} from '../ResetRequest/ResetRequestModel';
import { request } from 'express';

@Injectable()
export class ResetRequestService {
    constructor(@InjectModel('ResetRequest') private readonly resetrequestModel: Model<ResetRequest>){}

    async  AddResetRequest(id: string, username: string, code:number){
        const newResetRequest= new this.resetrequestModel({
            id: id,
            username: username,
            code: code})
            const saved_resetrequest = await newResetRequest.save()
            console.log(saved_resetrequest);
            return await saved_resetrequest;        
     }  
    async SearchByusername(username:string) {
        
        const user = await this.resetrequestModel.findOne({username : username} ).exec(); 
        if(!user){
            return 'wrong username taped';
        }else{
            return user.id;
             
        }
    }  
    async Delete(username:string){
        
        return await this.resetrequestModel.deleteOne({username : username}).exec();
    }
     async SearchResetRequest (code: number): Promise<any>{
      const request= await  this.resetrequestModel.findOne({code : code}).exec();
      if(!request){return 'wrong';}
       else { return request.username;}
  

    }

}