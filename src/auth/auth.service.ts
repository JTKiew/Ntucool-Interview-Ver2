import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/database';
import { signInDto } from 'src/dto';
import { Role } from 'src/guards/roles/roles';
import { unAuthenticateException } from 'src/unAuthenticateException';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    @Inject(UserService)
    private readonly userService: UserService;    
    @Inject(JwtService)
    private readonly jwtService: JwtService;

    // handle sign in 
    signIn(dto: signInDto){
        // check if the user name valid
        const user: Users = this.userService.findOne(dto.name);
        // since no registration features, we use fixed password, only admin know the password
        const adminPass: string =  "NtuCool";

        if (!user) throw new BadRequestException("Invalid User's name");
        // user existed and match the password 
        if(dto.pass === adminPass){
            // sign and return jwt
            // attach the admin role in the payload for future role validation
            console.log("Generate Bearer Token")
            const payload = {sub: user.id, username: user.name, roles: Role.Admin}
            return {accessToken: this.jwtService.sign(payload)}
        }
        else
            throw new unAuthenticateException();
    }
}