import { forwardRef, Module } from '@nestjs/common';
import { OrganisatorAuthService } from './auth.service';
import { JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guard';
import { OrganisatorModule } from '../organisator.module';


@Module({
    imports: [
        forwardRef(() => OrganisatorModule),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET'),
              signOptions: {expiresIn: '10000s'}
          })
        }),
        ],
      providers: [OrganisatorAuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
      exports: [OrganisatorAuthService]
    })

  export class OrganisatorAuthModule {}