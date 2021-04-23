import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ADMINJwtAuthGuard extends AuthGuard('jwt') {}