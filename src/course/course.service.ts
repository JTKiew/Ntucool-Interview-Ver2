import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Course, courseData } from 'src/database';


@Injectable()
export class CourseService {
    // local variable to save the courses data 
    private courses: Course[] = courseData;

    // get course info with given id
    public getCourse(id: number){
        if (this.validId(id))
            return this.courses[id-1]
        else
            throw new BadRequestException("Invalid id! Course not exists!");
    }

    // helper function to verify given id
    // the courseId are in range 1-5
    // id-1 should in range of 0-4
    public validId(id: number){
        if (id-1 < 0 || id-1 >= this.courses.length)
            return false;
        else
            return true
    }
}
