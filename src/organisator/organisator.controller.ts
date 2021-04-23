import { Body, Controller, Delete, Get, Param, Patch, Post,Request, Res, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config';
import { JwtAuthGuard } from './auth/guards/jwt-guard';
import { Organisator } from './organisator.model';
import { OrganisatorService } from './organisator.service';
import { join } from 'path';
import { of } from 'rxjs';
import { UserRole } from 'src/Roles';
import { RolesGuard } from './auth/guards/roles.guard';
import { hasRoles } from './auth/decorators/roles.decorator';
import { ADMINhasRoles } from 'src/Admin/auth/decorators/roles.decorator';
import { ADMINJwtAuthGuard } from 'src/Admin/auth/guards/jwt-guard';
import { ADMINRolesGuard } from 'src/Admin/auth/guards/roles.guard';


@Controller('organisator')
export class OrganisatorController {
    constructor(private readonly organisatorService: OrganisatorService){}  

    @Post()
    async addOrganisateur(
    @Body('organisatorname') organisatorname: string, 
    @Body('email') organisatoremail: string,
    @Body('password') organisatorpassword: string,
    @Body('company') organisatorcompany: string,
    @Body('region') organisatorregion: string,
    @Body('category') organisatorcategory: string,
    @Body('phoneNumber') organisatorphonenumber: string,
    @Body('age') organisatorage: number,
    @Body('gender') organisatorgender: string,
    ){   
     console.log(organisatorcompany);
     console.log(organisatorcompany);
     console.log(organisatorregion);  
    const user = await this.organisatorService.AddOrganisator(organisatorname,  organisatoremail, organisatorpassword, organisatorcompany,organisatorregion, organisatorcategory,organisatorphonenumber, organisatorage, organisatorgender);
        return user;
    }
    @Post('/login')
    async Login(@Body('organisatorname') username: string,
     @Body('password') password: string ){
      return this.organisatorService.Login(username, password);
    }
    ////////////////////////ORGANISATEUR////////////////////////////////////////
    @hasRoles(UserRole.ORGA)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('upload')
    @UseInterceptors(FilesInterceptor('file',null,multerOptions))
    async uploadFile(@UploadedFiles() file, @Request() req){
        const user: Organisator = req.user.user;
        const updateduser= this.organisatorService.updateprofilepic(user._id,file[0].filename) ;
       console.log(updateduser);
       return updateduser;
    }
    @Get('getprofilepicture/:picturename')
    async getProfilePicture(@Param('picturename') picturename: string, @Res() res){
      return of(res.sendFile(join(process.cwd(), 'uploads/'+picturename)));
    }
    @hasRoles(UserRole.ORGA)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('profileinformation')
    async GetProfileInformation(@Request() req){
          const user: Organisator= req.user.user;
          console.log('user', user);
          return user;

      }
      @Post('/ForgotPassword')
      async SendResetPasswordRequest (@Body('username') username: string){
         return this.organisatorService.SendResetPasswordRequest(username);   
      }
      @Post('/CheckResetRequest')
      async ChangePasswordcheckresetrequest (@Body('username') username: string, @Body('password') password: string){
         return this.organisatorService.ChangePasswordCheckResetRequest(username, password);   
      }
      /////////////////////ORGANISATEUR////////////////////
      @UseGuards(JwtAuthGuard)
      @hasRoles(UserRole.ORGA)
      @Post('/updatePassword')
      async cupdateuserpassword (@Body('username') username: string, @Body('password') password: string){
         await this.organisatorService.changePassword(username);
         console.log('request added');
         return this.organisatorService.ChangePasswordCheckResetRequest(username, password);   
      }
    @Get()
    async getAllUsers()
     {
        const result = await this.organisatorService.getAllOrganisators(); 
       return result.map (organisator => ({
           id: organisator.id,
           username: organisator.username,
           email: organisator.email,
           password: organisator.password,
           company: organisator.company,
           region:organisator.region,
           category: organisator.category,
           rank: organisator.rank,
           profilepicture:organisator.profilePicture,
           phoneNumber: organisator.phoneNumber,
           age: organisator.age,
           gender: organisator.gender,
       }))
     }
     @Get(':id')
     getOrganisator(@Param('id') Id: string,){
         return this.organisatorService.getSingleOrganisator(Id);
     }
     @Post('IdByName')
     getIdByName(@Body('username') username: string){
         return this.organisatorService.GetIdByName(username);
     }
     ///////////////////////ADMINISTRATEUR/////////////////////////
      @ADMINhasRoles(UserRole.ADMIN)
      @UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
      @Delete(':id')
      async deleteOrganisator(@Param('id') Id: string){
          await this.organisatorService.deleteOrganisator(Id);
          return null;
      }
      /////////////////////ADMIN ET ORGANISATEUR //////////////////////////////
      @hasRoles(UserRole.ORGA)
      @UseGuards(JwtAuthGuard, RolesGuard)
     @Patch(':id')
     async updateUser(@Param('id') userId: string,
     @Body('organisatorname') username: string, 
     @Body('email') useremail: string,
     @Body('gender') usergender: string,
     @Body('phoneNumber') userphonenumber: string,
     @Body('age') userage: number,
     @Body('company') company: string,
     @Body('region') region:string,
     @Body('category') category:string,
      ){
        return await this.organisatorService.updateOrganisator(userId, username, useremail, company,region, category,userphonenumber,usergender, userage);
          
      }  

      /////////////////////////ADMINISTRATEUR//////////////////////////// 
       @ADMINhasRoles(UserRole.ADMIN)
       @UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
      @Patch('AdminActivateAccount/:id')
      async adminactivateAccount(@Param('id') userId: string){
          return await this.organisatorService.AdminactivateAccount(userId);
      }
           ///////////////////ADMIN///////////////////////////////////////
           @ADMINhasRoles(UserRole.ADMIN)
           @UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
           @Patch('AdmindesactivateAccount/:id')        
             async admindesactivateAccount(@Param('id') userId: string){
         return await this.organisatorService.AdmindesactivateAccount(userId);
     }
      @Post('CheckEmailAccount')
      async checkEmailAccount(@Body('username') username: string){
         return this.organisatorService.checkEmailAccount(username);
      }
      @Patch('ActivateAccount/:id')
      async activateAccount(@Param('id') userId: string, @Body('codeNumber') codeNumber: number){
          return await this.organisatorService.activateAccount(userId, codeNumber);
      }
      @Get('getSubscriber/:id')
      async getSubscriber(@Param('id') Id: string){
          return await this.organisatorService.getSubscriber(Id);
      }
}