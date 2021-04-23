import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {OrganisatorAuthService} from './auth/auth.service';
import { Organisator } from './organisator.model';
import { EmailService } from 'src/emails/email_aaccountActivation/email.service';
import { ResetRequestService } from 'src/ResetRequest/ResetRequest.service';
import { ResetRequestEmailService } from 'src/emails/ResetRequestEmail/email.service';
import { AccountActivationEmailService } from 'src/emails/AccountActivated/email.service';
import { User } from 'src/Particular/user.model';
import { Subscriber } from 'rxjs';

@Injectable()
export class OrganisatorService {
    constructor(@InjectModel('Organisateur') private readonly organisatorModel: Model<Organisator>,
    private organisatorauthService: OrganisatorAuthService,
    private emailService: EmailService,
    private resetrequestService: ResetRequestService,
    private resetrequestemailService: ResetRequestEmailService,
    private accountactivationemailService: AccountActivationEmailService){}

    async  AddOrganisator(username: string, email: string, password: string, company: string,region: string, category: string, phoneNumber: string, age: number,gender:string){
        const usernameexist = await this.organisatorModel.findOne({username : username}).exec();
        const useremailexist = await  this.organisatorModel.findOne({email: email}).exec();
        const userphoneexist =  await this.organisatorModel.findOne({phoneNumber : phoneNumber}).exec();
        if(usernameexist){
         
            return await "user name exist !"
        }
           else if(useremailexist){
             
              return await "user email exist !"
           }
          else if(userphoneexist){
              return await "user phone number exist !"
         }
        else{

        const newOrganisator= new this.organisatorModel({
            username: username,
            email: email.toLowerCase(), 
            password: password, 
            company: company, 
            region:region,
            category: category,
            phoneNumber: phoneNumber,
            age: age,
            gender:gender })
            const hashed = await this.organisatorauthService.hashPassword(newOrganisator.password);
            newOrganisator.password = hashed;
            const saved_orga = await newOrganisator.save();
            const token = await this.organisatorauthService.generateJWT(saved_orga);
            console.log(token);
            return await token;  
        }     
     }

     async Login(username: string, password: string): Promise<any> {
      const user = await this.organisatorModel.findOne({username : username} ).exec();
      
      if(!user){
          return 'wrong username taped';
      }else{
          if (!user.activated){
              return 'Account not activated'
          }
          else{
          if(await this.organisatorauthService.comparePasswords(password, user.password)){
              return  this.organisatorauthService.generateJWT(user);
          }else{
              return 'wrong password inserted taped';
          } 
      }   
      }    
  }
  async GetIdByName(username:string):Promise<any>{
     const user = await this.organisatorModel.findOne({username : username} ).exec();
     console.log(user);
      return user._id;
  }
  async updateprofilepic(id: string, profilepicture: string){
    const updateduser = await this.findOrganisator(id);
    updateduser.profilePicture=profilepicture;
    updateduser.save()
}
async checkEmailAccount (username: string): Promise<any>{
  const user= await this.organisatorModel.findOne({username : username} ).exec();
  if(user.activated){
    console.log('account activated'); 
    return 'account already activated'}
else{
  const name=user.username;
  const useremail=user.email;
  const random = (Math.random() * 8999)+1000;
  const code = Math.round(random);
 this.emailService.sendemail(name, useremail,code);
 user.codeNumber=code;
 user.save();
 return "Code number sent by email";
}
}
async activateAccount(id: string, codeNumber: number){
  const updateuser = await this.findOrganisator(id);
  if(updateuser.codeNumber == codeNumber){
      updateuser.activated =true;
      updateuser.save();
      this.accountactivationemailService.sendemail(updateuser.email);
      return 'account activated';
  }
  else {
      return 'wrong code';
  }
}
  ///////////////ForgotPassword/////////////////////////////////
  async SendResetPasswordRequest(username: string): Promise<any> {
    const user = await this.organisatorModel.findOne({username : username} ).exec();
    
    if(!user){
        return 'wrong username taped';
    }
     else{   
      const random = (Math.random() * 8999)+1000;
            const code = Math.round(random);
         //send a reset password request 
         this.resetrequestService.AddResetRequest(user._id,user.username, code);
         //send an email containing the link 
        this.resetrequestemailService.sendemail(user.email, code);
        
        return ('Reset Request sent and email sent');
     }    
}
///////////////Check the reset password request//////////////////
async ChangePasswordCheckResetRequest(username: string, password: string){
   const userId= this.resetrequestService.SearchByusername(username);
   const userid= (await userId).toString();
   let user;
   try{
    const user= await this.findOrganisator(userid);
    user.password=password;
    const hashed = await this.organisatorauthService.hashPassword(user.password);
    user.password = hashed;
    user.save();
    this.resetrequestService.Delete(username);
    return  'Request Deleted'; 

   }catch (error){
    throw new NotFoundException('Could not find the reset password request')
}  
   }
   ///////////////Changer le mot de passe////////////////////////
   async changePassword(username: string) {
    const user = await this.organisatorModel.findOne({username : username} ).exec();
    const code = -1;
    return await this.resetrequestService.AddResetRequest(user._id,user.username, code);
 }
     async getAllOrganisators() {
        const result= await  this.organisatorModel.find().exec(); 
        console.log(result);
  
       return result as Organisator[]; 
     }
     async getSingleOrganisator(id: string){
        const organisator= await this.findOrganisator(id);
        if(!organisator){
         
            throw new NotFoundException('could not find the organisator');
            
        }
        return organisator;
    }

   async  updateOrganisator(id: string, organisatorname: string, email: string, company: string,region: string, category: string, phoneNumber: string, gender:string, age: number){
        const updatedorganisator = await this.findOrganisator(id);
      if (organisatorname){
         updatedorganisator.username= organisatorname;
      }
      if (email){
        updatedorganisator.email=email;
      }

      if (phoneNumber){
        updatedorganisator.phoneNumber=phoneNumber;
      }
      if (age){
        updatedorganisator.age=age;
      }
      if (company){
        updatedorganisator.company=company;
      }
      if (region){
        updatedorganisator.region=region;
      }
      if (category){
        updatedorganisator.category=category;
      }
      if(gender){
        updatedorganisator.gender=gender;
      }
     


      updatedorganisator.save();
    }
    async deleteOrganisator(id: string){
        const result = await this.organisatorModel.deleteOne({_id: id}).exec();
        console.log(result);
        if (result.n===0){
            throw new NotFoundException('Could not be deleted');
        }
       }

    async findOrganisator(id: string): Promise<Organisator> {
        let organisator;
        try{
         organisator = await this.organisatorModel.findById(id);
        } catch (error){
            throw new NotFoundException('Could not find organisator');
        }
     return organisator;
    
    }
    async AdminactivateAccount(id: string){
      const updateuser = await this.findOrganisator(id);
          updateuser.activated =true;
          updateuser.save();
          this.accountactivationemailService.sendemail(updateuser.email);
          return 'account activated';
   }
   async AdmindesactivateAccount(id: string){
    const updateuser = await this.findOrganisator(id);
        updateuser.activated =false;
        updateuser.save();
  
        return 'account desactivated';
 }
 async addSubRequest(id: string, request:string) {
  const organizer= await this.findOrganisator(id);
      organizer.SubscritionRequest.push(request);
      await organizer.save();
 }
async DeleteSubReq(id: string, request:string){
  const organizer= await this.findOrganisator(id);
  var pos =organizer.SubscritionRequest.indexOf(request);
  var removedItem= organizer.SubscritionRequest.splice(pos, 1);
  console.log('removedItem',removedItem);
  await organizer.save();
}
async addSubscriber(id:string, sender:User){
  const user = await this.organisatorModel.findOne({_id: id} ).exec();
  console.log(user);
   user.Subscribers.push(sender);
   user.save();
}
async getSubscriber(id:string,){
  const user = await this.organisatorModel.findOne({_id: id} ).exec();
  const subscriber= user.Subscribers[0];
  console.log(subscriber);
    return subscriber
}
    }
    