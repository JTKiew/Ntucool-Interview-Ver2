import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';

@ApiTags('Course')
@Controller('course')
export class CourseController {
    constructor( private courseService: CourseService) {}

    // get course data by id
    // url: localhost:3000/course/get/:id
    // :id must replace by the id of target course
    @Get('get/:id')
    getCourse(@Param('id', ParseIntPipe) id: number){
        return this,this.courseService.getCourse(id);
    }
}
