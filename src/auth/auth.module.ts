import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/guards/jwt/jwtConstants';
import { JwtStrategy } from 'src/guards/jwt/jwt.strategy';

@Module({
  imports: [UserModule, JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
  })],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
