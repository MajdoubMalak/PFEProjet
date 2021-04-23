import { forwardRef, Module } from '@nestjs/common';
import { JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guard';
import { ServiceProvidorModule } from '../serviceprovidor.module';
import { ServiceProvidorAuthService } from './auth.service';



@Module({
    imports: [
        forwardRef(() => ServiceProvidorModule),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET'),
              signOptions: {expiresIn: '10000s'}
          })
        }),
        ],
      providers: [ServiceProvidorAuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
      exports: [ServiceProvidorAuthService]
    })

  export class ServiceProvidorAuthModule {}