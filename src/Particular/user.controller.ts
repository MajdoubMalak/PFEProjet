import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors, Request, UploadedFiles, Res, UploadedFile } from '@nestjs/common';
 import {FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { of } from 'rxjs';
import { ADMINhasRoles } from 'src/Admin/auth/decorators/roles.decorator';
import { ADMINJwtAuthGuard } from 'src/Admin/auth/guards/jwt-guard';
import { ADMINRolesGuard } from 'src/Admin/auth/guards/roles.guard';
import { hasRoles } from 'src/Particular/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/Particular/auth/guards/jwt-guard';
import { RolesGuard } from 'src/Particular/auth/guards/roles.guard';
import { multerOptions } from 'src/config';
import { UserRole } from 'src/Roles';
import { User} from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}  

    @Post()
    async addUser(
    @Body('username') username: string, 
    @Body('email') useremail: string,
    @Body('password') userpassword: string,
    @Body('gender') usergender: string,
    @Body('phoneNumber') userphonenumber: string,
    @Body('age') userage: number,
    ){   
       
    const user = await this.userService.AddUser(username,  useremail, userpassword, usergender,userphonenumber, userage);
        return user;
    }
    @Post('/login')
    async Login(@Body('username') username: string,
     @Body('password') password: string ){
      return this.userService.Login(username, password);
    }
    @Get()
    async getAllUsers()
     {
        const result = await this.userService.getAllUsers(); 
       return result.map (user => ({
           id: user.id,
           username: user.username,
           email: user.email,
           password: user.password,
           gender:user.gender,
           profilepicture:user.profilePicture,
           phoneNumber: user.phoneNumber,
           age: user.age,
       }))
     }

     @Post('CheckEmailAccount')
     async checkEmailAccount(@Body('username') username: string){
        return this.userService.checkEmailAccount(username);
     }
     @Post('IdByName')
     getIdByName(@Body('username') username: string){
         return this.userService.GetIdByName(username);
     }
  
     @Get(':id')
     getUser(@Param('id') userId: string,){
         return this.userService.getSingleUser(userId);
     }

     @Post('/ForgotPassword')
     async SendResetPasswordRequest (@Body('username') username: string){
        return this.userService.SendResetPasswordRequest(username);   
     }
     @Post('/CheckResetRequest')
     async ChangePasswordcheckresetrequest (@Body('username') username: string, @Body('password') password: string){
        return this.userService.ChangePasswordCheckResetRequest(username, password);   
     }
  
     /////////////////////PARTICULIER////////////////////
     @UseGuards(JwtAuthGuard)
     @hasRoles(UserRole.PARTI)
     @Post('/updatePassword')
     async cupdateuserpassword (@Body('username') username: string, @Body('password') password: string){
        await this.userService.changePassword(username);
        console.log('request added');
        return this.userService.ChangePasswordCheckResetRequest(username, password);   
     }
/////////////ADMIN ET PARTICULIER//////////////////////
      @hasRoles(UserRole.PARTI)
      @UseGuards(JwtAuthGuard, RolesGuard)
     @Patch(':id')
     async updateUser(@Param('id') userId: string,
     @Body('username') username: string, 
     @Body('email') useremail: string,
     @Body('gender') usergender: string,
    
     @Body('phoneNumber') userphonenumber: string,
     @Body('age') userage: number,
      ){
        return await this.userService.updateUser(userId, username, useremail, userphonenumber,usergender, userage);
          
      }
///////////////////////////////////////////////////////////////////
      @Patch('ActivateAccount/:id')
      async activateAccount(@Param('id') userId: string, @Body('codeNumber') codeNumber: number){
          return await this.userService.activateAccount(userId, codeNumber);
      }
///////////////////////ADMIN/////////////////////////////////////////////////////
      @ADMINhasRoles(UserRole.ADMIN)
      @UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
      @Patch('AdminActivateAccount/:id')
      async adminactivateAccount(@Param('id') userId: string){
          return await this.userService.AdminactivateAccount(userId);
      }
///////////////////ADMIN///////////////////////////////////////
@ADMINhasRoles(UserRole.ADMIN)
@UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
@Patch('AdminDesactivateAccount/:id')
async admindesactivateAccount(@Param('id') userId: string){
    return await this.userService.AdmindesactivateAccount(userId);
}
///////////////////////ADMINISTRATEUR/////////////////////////
       @ADMINhasRoles(UserRole.ADMIN)
       @UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
      @Delete(':id')
      async deleteUser(@Param('id') userId: string){
          await this.userService.deleteUser(userId);
          return null;
      }
///////////////////////Particulier///////////////////////////  
      @hasRoles(UserRole.PARTI)
      @UseGuards(JwtAuthGuard, RolesGuard)
        @Post('upload')
         @UseInterceptors(FilesInterceptor('file',null,multerOptions))
         async uploadFile(@UploadedFiles() file, @Request() req){
             const user: User = req.user.user;
             const updateduser= this.userService.updateprofilepic(user._id,file[0].filename) ;
            console.log(updateduser);
            return updateduser;
        }      
      // @Post("upload")
      //  @UseInterceptors(FileInterceptor("file", { dest: "./uploads" }))
      //  uploadSingle(@UploadedFile() file, @Request() req) {
      //    console.log(file);
      //    const user: User = req.user.user;
      //    const updateduser= this.userService.updateprofilepic(user._id,file.filename) ;
      
      //  }
      
////////////////////////////////////////////////////////////////////      
      @Get('getprofilepicture/:picturename')
      async getProfilePicture(@Param('picturename') picturename: string, @Res() res){
        return of(res.sendFile(join(process.cwd(), 'uploads/'+picturename)));

      }


 
}
