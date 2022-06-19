import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class signInDto {
    @ApiProperty()
    @IsNotEmpty()   // ensure name not empty string
    name: string
    
    @ApiProperty()
    @IsNotEmpty()   // ensure pass not empty string
    pass: string
}