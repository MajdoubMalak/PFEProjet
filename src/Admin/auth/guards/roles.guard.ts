import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Admin } from "src/Admin/admin.model";
import { AdminService } from "src/Admin/admin.service";


@Injectable()
export class ADMINRolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    @Inject (forwardRef(() => AdminService))
              private adminService: AdminService
              ) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        console.log(request);
        const admin: Admin = request.user.user;
      console.log("admin check",admin);
       console.log("admin check",admin.role);
              console.log( roles.indexOf(admin.role) );
               const hasRole = () => roles.indexOf(admin.role) == 0;
                let hasPermission: boolean = false;
                console.log(hasRole());  
                if (hasRole()) {
                    hasPermission = true;
                };
                return admin && hasPermission;
            
        
    }
   

        
   
    }