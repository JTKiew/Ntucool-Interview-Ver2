import { HttpException, HttpStatus } from "@nestjs/common";

// custom Exception 
export class unAuthenticateException extends HttpException{
    constructor(){
        super({statusCode: HttpStatus.FORBIDDEN ,message:"Invalid Credential!", error: "Forbidden"}, HttpStatus.FORBIDDEN);
    }
}