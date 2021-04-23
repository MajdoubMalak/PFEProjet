import { forwardRef, Module } from '@nestjs/common';
import { JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ADMINAuthService } from './admin_auth.service';
import { AdminModule } from '../admin.module';
import { ADMINRolesGuard } from './guards/roles.guard';
import { ADMINJwtAuthGuard } from './guards/jwt-guard';
import { ADMINJwtStrategy } from './guards/jwt-strategy';


@Module({
    imports: [
        forwardRef(() => AdminModule),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET'),
              signOptions: {expiresIn: '10000s'}
          })
        }),
        ],
      providers: [ADMINAuthService, ADMINRolesGuard, ADMINJwtAuthGuard, ADMINJwtStrategy],
      exports: [ADMINAuthService]
    })

  export class ADMINAuthModule {}