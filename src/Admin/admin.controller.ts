import { Body, Controller,Get,Post, UseGuards} from '@nestjs/common';
import { UserRole } from 'src/Roles';
import { AdminService } from './admin.service';
import { ADMINhasRoles } from './auth/decorators/roles.decorator';
import { ADMINJwtAuthGuard } from './auth/guards/jwt-guard';
import { ADMINRolesGuard } from './auth/guards/roles.guard';

@Controller('Admin')
export class AdminController {
    constructor(private readonly adminService: AdminService){}  
    @Post()
    async addAdmin(){   
    const admin = await this.adminService.AddAdmin();
        return admin;
    }
    @Post('/login')
    async Login(@Body('username') username: string,
     @Body('password') password: string ){
      return this.adminService.Login(username, password);
    } 
    @ADMINhasRoles(UserRole.ADMIN)
    @UseGuards(ADMINJwtAuthGuard,ADMINRolesGuard)
//////////////////////////////////////////////////////////////////////////////////////////////////////
    @Get()
    async getAllAdmin()
     {
        const result = await this.adminService.getAllAdmins(); 
       return result.map (user => ({
           id: user.id,
           username: user.username,
           password: user.password,

       }))
     }
}