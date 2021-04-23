import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../admin.model';
const bcrypt = require('bcrypt');
@Injectable()
export class ADMINAuthService {
    constructor(private readonly jwtService: JwtService){}
  
    async generateJWT(user: Admin) {
        return  await (this.jwtService.signAsync({user}));
    }

    async hashPassword(password: string): Promise <string> {
        return await<string>(bcrypt.hash(password, 12));

    }

    async comparePasswords(newPassword: string, passwordHash: string){
        return await (bcrypt.compare(newPassword, passwordHash));
    }
}