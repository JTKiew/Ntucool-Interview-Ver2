import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./jwtConstants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            // extract Bearer token from header 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }
    // after extract the jwt from the header 
    // passport decode and kept the info in payload for us
    // allow us to do further validation 
    // if decode fail, automatically throw exception 
    async validate(payload: any){
        console.log("Bearer Token Valid")
        // by return the payload, the payload attached to http.req
        // access it by request.user
        return payload;
    }
}