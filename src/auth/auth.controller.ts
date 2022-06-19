import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { signInDto } from 'src/dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    // pass a private password to validate admin user
    // url: localhost:3000/auth/signIn
    // submited name and pass carry by HTTP Req Body
    @Post("/signIn")
    signIn(@Body() dto: signInDto){
        return this.authService.signIn(dto);
    }
}
