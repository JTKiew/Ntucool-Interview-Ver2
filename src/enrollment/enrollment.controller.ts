import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { addEnrollmentDto, queryEnrollCourseDto, queryEnrollmentDto, queryEnrollUserDto} from 'src/dto';
import { EnrollmentService } from './enrollment.service';

@ApiTags('Enrollment')
@Controller('enrollment')
export class EnrollmentController {
    constructor( private enrollService: EnrollmentService) {}

    // query user data by courseId
    // url: localhost:3000/enrollment/queryUser?courseId=
    @Get('queryUser')
    queryCourseUser(@Query() dto: queryEnrollUserDto){
        return this.enrollService.queryCourseUser(Number(dto.courseId));
    }

    // add new enrollment with given userId, courseid and role
    // url: localhost:3000/enrollment/add
    // submited userId, courseId and role carry by HTTP Req Body
    // BearerAuthToken should added in Header.Authorization 
    @ApiBearerAuth()
    @Post('add')
    addEnrollment(@Body() dto: addEnrollmentDto){
        return this.enrollService.addEnroll(dto);
    }

    // delete enrollment by id
    // url: localhost:3000/enrollment/delete/:id
    // :id must replace by the id of target enrollment
    // BearerAuthToken should added in Header.Authorization 
    @ApiBearerAuth()
    @Delete('delete/:id')
    deleteEnrollment(@Param('id', ParseIntPipe) id: number){
        return this.enrollService.deleteEnroll(id);
    }

    // get enrollment data by id
    // url: localhost:3000/enrollment/get/:id
    // :id must replace by the id of target enrollment
    @Get('get/:id')
    getEnrollment(@Param('id', ParseIntPipe) id: number){
        return this.enrollService.getEnroll(id);
    }

    // query enrollment by userId, courseId or role
    // url: localhost:3000/enrollment/queryEnroll?userId= &courseId= &role=
    // use userId, courseId and role as query parameter
    @Get('queryEnroll')
    queryEnrollment(@Query() dto: queryEnrollmentDto){
        return this.enrollService.queryEnroll(dto);
    }

    // query course data by userId
    // url: localhost:3000/enrollment/queryCourrse?userId=
    @Get('queryCourse')
    queryUserCourse(@Query() dto: queryEnrollCourseDto ){
        return this.enrollService.queryUserCourse(Number(dto.userId));
    }
}
