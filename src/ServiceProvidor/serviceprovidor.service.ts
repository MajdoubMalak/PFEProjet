import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from 'src/emails/email_aaccountActivation/email.service';
import { ServiceProvidor } from './serviceprovidor.model';
import {ServiceProvidorAuthService} from './auth/auth.service';
import { ResetRequestService } from 'src/ResetRequest/ResetRequest.service';
import { ResetRequestEmailService } from 'src/emails/ResetRequestEmail/email.service';
import { AccountActivationEmailService } from 'src/emails/AccountActivated/email.service';

@Injectable()
export class ServiceProvidorService {
    constructor(@InjectModel('ServiceProvidor') private readonly serviceprovidorModel: Model<ServiceProvidor>,
    private serviceproviderauthService: ServiceProvidorAuthService,
    private emailService: EmailService,
    private resetrequestService: ResetRequestService,
    private resetrequestemailService: ResetRequestEmailService,
    private accountactivationemailService: AccountActivationEmailService){}

    async  AddServiceProvidor(username: string, email: string, password: string, company: string,region: string, category: string, phoneNumber: string, age: number, gender:string){
        const usernameexist = await this.serviceprovidorModel.findOne({username : username}).exec();
        const useremailexist = await  this.serviceprovidorModel.findOne({email: email}).exec();
        const userphoneexist =  await this.serviceprovidorModel.findOne({phoneNumber : phoneNumber}).exec();
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

        const newServiseProvider= new this.serviceprovidorModel({
            username: username,
            email: email.toLowerCase(), 
            password: password, 
            company: company, 
            region:region,
            category: category,
            phoneNumber: phoneNumber,
            age: age,
            gender:gender })
           
           const hashed = await this.serviceproviderauthService.hashPassword(newServiseProvider.password);
           newServiseProvider.password = hashed;
           const saved_orga = await newServiseProvider.save();
           const token = await this.serviceproviderauthService.generateJWT(saved_orga);
           console.log(token);
           return await token;  


        }     
     }
     async Login(username: string, password: string): Promise<any> {
      console.log(username);
      console.log(password);
      const user = await this.serviceprovidorModel.findOne({username : username} ).exec();
      console.log(user);
      if(!user){
          return 'wrong username taped';
      }else{
          if (!user.activated){
              return 'Account not activated'
          }
          else{
          if(await this.serviceproviderauthService.comparePasswords(password, user.password)){
              return  this.serviceproviderauthService.generateJWT(user);
          }else{
              return 'wrong password inserted taped';
          } 
      }   
      }    
  }
  async updateprofilepic(id: string, profilepicture: string){
    const updateduser = await this.findServiceProvidor(id);
    updateduser.profilePicture=profilepicture;
    updateduser.save()
}
async checkEmailAccount (username: string): Promise<any>{
 // const user= await this.findServiceProvidor(id);
 const user= await this.serviceprovidorModel.findOne({username : username} ).exec();
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
async GetIdByName(username:string):Promise<any>{
  const user = await this.serviceprovidorModel.findOne({username : username} ).exec();
  console.log(user);
   return user._id;
}
async activateAccount(id: string, codeNumber: number){
  const updateuser = await this.findServiceProvidor(id);
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
      const user = await this.serviceprovidorModel.findOne({username : username} ).exec();
      
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
      const user= await this.findServiceProvidor(userid);
      user.password=password;
      const hashed = await this.serviceproviderauthService.hashPassword(user.password);
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
      const user = await this.serviceprovidorModel.findOne({username : username} ).exec();
      const code = -1;
      return await this.resetrequestService.AddResetRequest(user._id,user.username, code);
   }
     async getAllServiceProvidors() {
        const result= await  this.serviceprovidorModel.find().exec(); 
        console.log(result);
  
       return result as ServiceProvidor[]; 
     }
     async getSingleServiceProvidor(id: string){
        const organisator= await this.findServiceProvidor(id);
        if(!organisator){
         
            throw new NotFoundException('could not find the service provider');
            
        }
        return organisator;
    }

   async  updateServiceProvidor(id: string, organisatorname: string, email: string, company: string,region: string, category: string, phoneNumber: string, age: number, gender:string){
        const updatedServiceProvidor = await this.findServiceProvidor(id);
      if (organisatorname){
         updatedServiceProvidor.username= organisatorname;
      }
      if (email){
        updatedServiceProvidor.email=email;
      }

      if (phoneNumber){
        updatedServiceProvidor.phoneNumber=phoneNumber;
      }
      if (age){
        updatedServiceProvidor.age=age;
      }
      if (company){
        updatedServiceProvidor.company=company;
      }
      if (region){
        updatedServiceProvidor.region=region;
      }
      if (category){
        updatedServiceProvidor.category=category;
      }
      if (gender){
        updatedServiceProvidor.gender=gender;
      }


      updatedServiceProvidor.save();
    }
    async deleteServiceProvidor(id: string){
        const result = await this.serviceprovidorModel.deleteOne({_id: id}).exec();
        console.log(result);
        if (result.n===0){
            throw new NotFoundException('Could not be deleted');
        }
       }

    async findServiceProvidor(id: string): Promise<ServiceProvidor> {
        let serviceprovider;
        try{
         serviceprovider = await this.serviceprovidorModel.findById(id);
        } catch (error){
            throw new NotFoundException('Could not find service provider');
        }
     return serviceprovider;
    
    }
    async AdminactivateAccount(id: string){
      const updateuser = await this.findServiceProvidor(id);
      console.log('service provider', updateuser);
          updateuser.activated =true;
          updateuser.save();
          this.accountactivationemailService.sendemail(updateuser.email); 
          return 'account activated';
   }
   async AdmindesactivateAccount(id: string){
    const updateuser = await this.findServiceProvidor(id);
        updateuser.activated =false;
        updateuser.save();
        
        return 'account desactivated';
 }
    }