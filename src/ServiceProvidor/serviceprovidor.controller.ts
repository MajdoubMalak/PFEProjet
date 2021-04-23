import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors, Res, Request, UseGuards} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { of } from 'rxjs';
import { ADMINhasRoles } from 'src/Admin/auth/decorators/roles.decorator';
import { ADMINJwtAuthGuard } from 'src/Admin/auth/guards/jwt-guard';
import { ADMINRolesGuard } from 'src/Admin/auth/guards/roles.guard';
import { multerOptions } from 'src/config';
import { UserRole } from 'src/Roles';
import { hasRoles } from './auth/decorators/roles.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ServiceProvidor } from './serviceprovidor.model';
import { ServiceProvidorService } from './serviceprovidor.service';


@Controller('ServiceProvidor')
export class ServiceProvidorController {
    constructor(private readonly serviceprovidorService: ServiceProvidorService){}  

    @Post()
    async addServiceProvidor(
    @Body('serviceprovidorname') serviceprovidorname: string, 
    @Body('email') serviceprovidoremail: string,
    @Body('password') serviceprovidorpassword: string,
    @Body('company') serviceprovidorcompany: string,
    @Body('region') serviceprovidorregion: string,
    @Body('category') serviceprovidorcategory: string,
    @Body('phoneNumber') serviceprovidorphonenumber: string,
    @Body('age') serviceprovidorage: number,
    @Body('gender') serviceprovidorgender: string,
    ){   
    
    const user = await this.serviceprovidorService.AddServiceProvidor(serviceprovidorname,  serviceprovidoremail, serviceprovidorpassword, serviceprovidorcompany,serviceprovidorregion, serviceprovidorcategory,serviceprovidorphonenumber, serviceprovidorage, serviceprovidorgender);
        return user;
    }
    @Post('/login')
    async Login(@Body('serviceprovidorname') username: string,
     @Body('password') password: string ){
         console.log(username);
         console.log(password);
      return this.serviceprovidorService.Login(username, password);
    }
    ///////////////////////PRESTATAIRE///////////////////////////////////////////
     @hasRoles(UserRole.PRESTA)
     @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('upload')
    @UseInterceptors(FilesInterceptor('file',null,multerOptions))
    async uploadFile(@UploadedFiles() file, @Request() req){
        const user: ServiceProvidor = req.user.user;
        const updateduser= this.serviceprovidorService.updateprofilepic(user._id,file[0].filename) ;
       console.log(updateduser);
       return updateduser;
    }
    @Get('getprofilepicture/:picturename')
    async getProfilePicture(@Param('picturename') picturename: string, @Res() res){
      return of(res.sendFile(join(process.cwd(), 'uploads/'+picturename)));

    }

    @Post('/ForgotPassword')
    async SendResetPasswordRequest (@Body('username') username: string){
       return this.serviceprovidorService.SendResetPasswordRequest(username);   
    }
    @Post('/CheckResetRequest')
    async ChangePasswordcheckresetrequest (@Body('username') username: string, @Body('password') password: string){
       return this.serviceprovidorService.ChangePasswordCheckResetRequest(username, password);   
    }
    /////////////////////PRESTATAIRE////////////////////
    @UseGuards(JwtAuthGuard)
    @hasRoles(UserRole.PRESTA)
    @Post('/updatePassword')
    async cupdateuserpassword (@Body('username') username: string, @Body('password') password: string){
       await this.serviceprovidorService.changePassword(username);
       console.log('request added');
       return this.serviceprovidorService.ChangePasswordCheckResetRequest(username, password);   
    }

    @hasRoles(UserRole.PRESTA)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('profileinformation')
    async GetProfileInformation(@Request() req){
          const user: ServiceProvidor= req.user.user;
          console.log('user', user);
          return user;
    }
    @Get()
    async getAllUsers()
     {
        const result = await this.serviceprovidorService.getAllServiceProvidors(); 
       return result.map (serviceprovidor => ({
           id: serviceprovidor.id,
           username: serviceprovidor.username,
           email: serviceprovidor.email,
           password: serviceprovidor.password,
           company: serviceprovidor.company,
           region:serviceprovidor.region,
           category: serviceprovidor.category,
           rank: serviceprovidor.rank,
           profilepicture:serviceprovidor.profilePicture,
           phoneNumber: serviceprovidor.phoneNumber,
           age: serviceprovidor.age,
           gender:serviceprovidor.gender,
       }))
     }
     @Get(':id')
     getServiceProvidor(@Param('id') Id: string,){
         return this.serviceprovidorService.getSingleServiceProvidor(Id);
     }
 /////////////////////ADMIN ET PRESTATAIRE //////////////////////////////
    @hasRoles(UserRole.PRESTA)
    @UseGuards(JwtAuthGuard, RolesGuard)
      @Patch(':id')
      async updateServiceProvidor(@Param('id')Id: string,
      @Body('serviceprovidorname') username: string, 
      @Body('email') useremail: string,
      @Body('company') company: string,
      @Body('region') region: string,
      @Body('category') category: string,
     
      @Body('phoneNumber') userphonenumber: string,
      @Body('age') userage: number,
      @Body('gender') usergender: string,
       ){
          await this.serviceprovidorService.updateServiceProvidor(Id, username, useremail,company,region,category, userphonenumber, userage,usergender);
           return null;
      }
    ///////////////////////ADMINISTRATEUR/////////////////////////
     @ADMINhasRoles(UserRole.ADMIN)
      @UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
      @Delete(':id')
      async deleteServiceProvidor(@Param('id') Id: string){
          await this.serviceprovidorService.deleteServiceProvidor(Id);
          return null;
      }
      /////////////////////ADMIN///////////////////////////
       @ADMINhasRoles(UserRole.ADMIN)
       @UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
     @Patch('AdminActivateAccount/:id')
     async adminactivateAccount(@Param('id') userId: string){
         return await this.serviceprovidorService.AdminactivateAccount(userId);
     }
     ///////////////////ADMIN///////////////////////////////////////
      @ADMINhasRoles(UserRole.ADMIN)
      @UseGuards(ADMINJwtAuthGuard, ADMINRolesGuard)
      @Patch('AdminDesactivateAccount/:id')        
        async admindesactivateAccount(@Param('id') userId: string){
    return await this.serviceprovidorService.AdmindesactivateAccount(userId);
}
     @Post('CheckEmailAccount')
     async checkEmailAccount(@Body('username') username: string ){
        return this.serviceprovidorService.checkEmailAccount(username);
     }
     @Post('IdByName')
     getIdByName(@Body('username') username: string){
         return this.serviceprovidorService.GetIdByName(username);
     }
     @Patch('ActivateAccount/:id')
     async activateAccount(@Param('id') userId: string, @Body('codeNumber') codeNumber: number){
         return await this.serviceprovidorService.activateAccount(userId, codeNumber);
     }
}