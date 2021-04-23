import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { OrganisatorService } from "src/organisator/organisator.service";
import { Organisator } from "src/organisator/organisator.model";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    @Inject (forwardRef(() => OrganisatorService))
              private organisatorService: OrganisatorService
              ) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: Organisator = request.user.user;
       const role = user.role;
       console.log("Role",role);
               const hasRole = () => (roles.indexOf(user.role) > -1 || (role =='admin'));
                let hasPermission: boolean = false;
                console.log(hasRole());  
                if (hasRole()) {
                    hasPermission = true;
                };
                return user && hasPermission;    
    }
    }