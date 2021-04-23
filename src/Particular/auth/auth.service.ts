import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/Particular/user.model';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService){}
  
    async generateJWT(user: User) {
        return  await (this.jwtService.signAsync({user}));
    }

    async hashPassword(password: string): Promise <string> {
        return await<string>(bcrypt.hash(password, 12));

    }

    async comparePasswords(newPassword: string, passwordHash: string){
        return await (bcrypt.compare(newPassword, passwordHash));
    }
}


