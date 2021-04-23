import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { User } from './user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/Particular/auth/auth.service';
import { EmailService } from 'src/emails/email_aaccountActivation/email.service';
import { ResetRequestService } from 'src/ResetRequest/ResetRequest.service';
import { ResetRequestEmailService } from 'src/emails/ResetRequestEmail/email.service';
import { AccountActivationEmailService } from 'src/emails/AccountActivated/email.service';
@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
    private authService: AuthService,
    private emailService: EmailService,
    private resetrequestService: ResetRequestService,
    private resetrequestemailService: ResetRequestEmailService,
    private accountactivationemailService: AccountActivationEmailService){}

    async  AddUser(username: string, email: string, password: string, gender: string,  phoneNumber: string, age: number){
        const usernameexist = await this.userModel.findOne({username : username}).exec();
        const useremailexist = await  this.userModel.findOne({email: email}).exec();
        const userphoneexist =  await this.userModel.findOne({phoneNumber : phoneNumber}).exec();
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

        const newUser= new this.userModel({
            username: username,
            email: email.toLowerCase(), 
            password: password, 
            gender: gender, 
            phoneNumber: phoneNumber,
            age: age })
           
            const hashed = await this.authService.hashPassword(newUser.password);
            newUser.password = hashed;
            const saved_user = await newUser.save();
            const token = await this.authService.generateJWT(saved_user);
            console.log(token);
            return await token;
        }     
     }
     async getAllUsers() {
        const result= await  this.userModel.find().exec(); 
       // console.log(result);
  
       return result as User[]; 
     }
     async getSingleUser(id: string){
        const user= await this.findUser(id);
        if(!user){
         
            throw new NotFoundException('could not find the user');
            
        }
        return user;
    }

   async  updateUser(id: string, username: string, email: string,  phoneNumber: string,  gender: string, age: number,){
        const updateduser = await this.findUser(id);
      if (username){
         updateduser.username= username;
      }
      if (email){
        updateduser.email=email;

      }
      if (phoneNumber){
        updateduser.phoneNumber=phoneNumber;

      }
      if (age){
        updateduser.age=age;
      }
      if (gender){
        updateduser.gender=gender;
      } 
      return await updateduser.save()
    }

    async updateprofilepic(id: string, profilepicture: string){
        const updateduser = await this.findUser(id);
        updateduser.profilePicture=profilepicture;
        updateduser.save()
    }

    async updateCodeNumber(id: string, codenumber: number){
        const updateuser = await this.findUser(id);
        updateuser.codeNumber = codenumber;
        updateuser.save();
    }

    async deleteUser(id: string){
        const result = await this.userModel.deleteOne({_id: id}).exec();
        console.log(result);
        if (result.n===0){
            throw new NotFoundException('Could not be deleted');
        }
       }



    async Login(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({username : username} ).exec();
        
        if(!user){
            return 'wrong username taped';
        }else{
            if (!user.activated){
                return 'Account not activated'
            }
            else{
            if(await this.authService.comparePasswords(password, user.password)){
                return  this.authService.generateJWT(user);
            }else{
                return 'wrong password inserted taped';
            } 
        }   
        }    
    }
    ///////////////ForgotPassword/////////////////////////////////
    async SendResetPasswordRequest(username: string): Promise<any> {
        const user = await this.userModel.findOne({username : username} ).exec();
        
        if(!user){
            return 'wrong username taped';
        }
         else{   
            const random = (Math.random() * 8999)+1000;
            const code = Math.round(random);

            
             //send a reset password request 
             this.resetrequestService.AddResetRequest(user._id,user.username, code);
             //send an email containing the link 
            this.resetrequestemailService.sendemail(user.email,code);
            
            return ('Reset Request sent and email sent');
         }    
    }
    ///////////////Check the reset password request//////////////////
    async ChangePasswordCheckResetRequest(username: string, password: string){
       const userId= this.resetrequestService.SearchByusername(username);
       const userid= (await userId).toString();
       let user;
       try{
        const user= await this.findUser(userid);
        user.password=password;
        const hashed = await this.authService.hashPassword(user.password);
        user.password = hashed;
        user.save();
        this.resetrequestService.Delete(username);
        return  'Request Deleted'; 

       }catch (error){
        throw new NotFoundException('Could not find the reset password request')
    }  
       }
       /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   async CheckResetRequest(code:number){
    //       const request = this.resetrequestService.SearchResetRequest(code);
    //       const req = (await request).toString();
    //       console.log(request);
    //     if(!request) {return 'Could not find the reset password request'}
    //     else {return 'Request found'}

    //   }
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       ///////////////Changer le mot de passe////////////////////////
       async changePassword(username: string) {
        const user = await this.userModel.findOne({username : username} ).exec();
        const code = -1;
        return await this.resetrequestService.AddResetRequest(user._id,user.username,code);
     }
    async checkEmailAccount (username: string): Promise<any>{
        const user= await this.userModel.findOne({username : username} ).exec();
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
        const user = await this.userModel.findOne({username : username} ).exec();
        console.log(user);
         return user._id;
     }
    async activateAccount(id: string, codeNumber: number){
       const updateuser = await this.findUser(id);
       if(updateuser.codeNumber == codeNumber){
           updateuser.activated =true;
           this.accountactivationemailService.sendemail(updateuser.email);
           updateuser.save();
           return 'account activated';
       }
       else {
           return 'wrong code';
       }
    
    }
    async AdminactivateAccount(id: string){
        const updateuser = await this.findUser(id);
        updateuser.activated =true;
        updateuser.save();
        this.accountactivationemailService.sendemail(updateuser.email);
        return 'account activated';
     }


    async findUser(id: string): Promise<User> {
        let user;
        try{
         user = await this.userModel.findById(id);
        } catch (error){
            throw new NotFoundException('Could not find user');
        }
     return user;
    }
    async AdmindesactivateAccount(id: string){
        const updateuser = await this.findUser(id);
            updateuser.activated =false;
            updateuser.save();
            return 'account desactivated';
     }   

}
