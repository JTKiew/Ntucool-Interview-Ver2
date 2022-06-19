import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, RequestTimeoutException, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createUserDto, editUserDto, queryUserDto } from 'src/dto';
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard';
import { Role } from 'src/guards/roles/roles';
import { Roles } from 'src/guards/roles/roles.decorator';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { UserService } from './user.service';
 
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor( private userService: UserService) {}

    // create new user
    // url: localhost:3000/user/create
    // submited name and email carry by HTTP Req Body
    // BearerAuthToken should added in Header.Authorization 
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('create')
    createUser(@Body() dto: createUserDto){
        return this.userService.createUser(dto);
    };
    // get user data by id
    // url: localhost:3000/user/get/:id
    // :id must replace by the id of target user 
    @Get('get/:id')
    getUser(@Param('id', ParseIntPipe) id: number){
        return this.userService.getUser(id);
    }
    
    // query user by name/email
    // url: localhost:3000/user/query?filter= &str= 
    // use filter to specified content of str (name / email)
    // str contain query parameter
    @Get('query')
    queryUser(@Query() dto: queryUserDto){
        return this.userService.queryUser(dto);
    }
    
    // edit user name and email by id
    // url: localhost:3000/user/edit/:id
    // :id must replace by the id of target user 
    // edit data (name / email) carry by HTTP Req Body
    // content in name or email can be blank => no changes
    // BearerAuthToken should added in Header.Authorization 
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('edit/:id')
    edituser(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: editUserDto){
        return this.userService.editUser(id, dto);
    }

    // delete user by id
    // url: localhost:3000/user/edit/:id
    // :id must replace by the id of target user 
    // BearerAuthToken should added in Header.Authorization 
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('delete/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number){
        return this.userService.deleteUser(id);
    }
}
