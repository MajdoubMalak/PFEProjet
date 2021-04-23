import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Organisator } from '../organisator.model';

const bcrypt = require('bcrypt');
@Injectable()
export class OrganisatorAuthService {
    constructor(private readonly jwtService: JwtService){}
  
    async generateJWT(user: Organisator) {
        return  await (this.jwtService.signAsync({user}));
    }

    async hashPassword(password: string): Promise <string> {
        return await<string>(bcrypt.hash(password, 12));

    }

    async comparePasswords(newPassword: string, passwordHash: string){
        return await (bcrypt.compare(newPassword, passwordHash));
    }
}