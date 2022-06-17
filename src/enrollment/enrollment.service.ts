import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { Course, Enrollment, Users } from 'src/database';
import { addEnrollmentDto, queryEnrollmentDto } from 'src/dto';
import { UserService } from 'src/user/user.service';
import { enrollSorting } from 'src/Utility/Sorting';

@Injectable()
export class EnrollmentService {
    // import UserService and CourseService
    @Inject(UserService)
    private readonly userService: UserService;
    @Inject(CourseService)
    private readonly courseService: CourseService;

    // local variable to save the enrollments data 
    private enrollments: Enrollment[] = [];

    // query user data with given courseId
    queryCourseUser(courseId: number){
        // verify given courseId
        if (this.courseService.validId(courseId)){
            let retVal: Users[] = []
            // search obj in enrollments array with obj.courseId === courseId
            // use the obj.userId to get user data with UserService.getUser()
            // push user data to retVal array
            this.enrollments.forEach(obj => {
                if (obj.courseId === courseId)
                    retVal.push(this.userService.getUser(obj.userId));
            })            
            // sorting the retVal array with Users.id
            retVal.sort((a,b) => (b.id < a.id ? 1 : b.id > a.id ? -1: 0))
            // remove dulicate 
            retVal = retVal.filter((obj,i) => i === retVal.indexOf(obj))
                
            return retVal
        }
        else
            throw new BadRequestException("Invalid id! Course not exists!");
    }

    // add enrollment with given userId, courseId and role
    addEnroll(dto: addEnrollmentDto){
        // verify userId
        if (this.userService.validId(dto.userId) !== true)
            throw new BadRequestException("Invalid userId!");
        // verify courseId
        if (this.courseService.validId(dto.courseId) !== true)
            throw new BadRequestException("Invalid courseId!");
        // verify role
        if (dto.role.localeCompare('student') !== 0 && dto.role.localeCompare('teacher') !== 0)
            throw new BadRequestException("Invalid role!");
        // searching for duplicate entry
        if (this.enrollments.some(obj => 
            obj.userId == dto.userId && 
            obj.courseId == dto.courseId &&
            obj.role == dto.role) == true){
                throw new BadRequestException("Enrollment Existed!");
            }
        else{
            // add new enrollment
            this.enrollments.push({
                'id': this.enrollments.length,
                'userId': Number(dto.userId),
                'courseId': Number(dto.courseId),
                'role': dto.role
            })
            console.log(this.enrollments);
            return `New Enrollment added!`;
        }
    }

    // delete enrollment with given id
    deleteEnroll(id: number){
        // verify given id
        if (this.validId(id)){
            // delete the enrollment
            this.enrollments.splice(id,1)
            // update remaining enrollments's id
            this.enrollments = enrollSorting(this.enrollments);
            console.log(this.enrollments);
            return `Enrollment with id ${id} deleted!`
        }
        else {
            throw new BadRequestException("Invalid id! Enrollment not exists!");
        }
    }

    // get enrollment date with given id
    getEnroll(id: number){
        // verify given id
        if (this.validId(id))
            return this.enrollments[id]
        else
            throw new BadRequestException("Invalid id! Enrollment not exists!");
    }

    // query enrollment with userid, courseId and role
    queryEnroll(dto: queryEnrollmentDto){
        // template for future enrollments.filter()
        let filter: {[key: string]: any} = {}

        // check valid query parameter
        // blank or undefined means no parameter received, ignored 
        // allowing us to query with only given parameter
        // record valid parameter in filter{}
        if (String(dto.userId) !== "" && dto.userId !== undefined){
            // check if userId valid
            if(this.userService.validId(dto.userId) === true)
                filter.userId = Number(dto.userId);
            else    
                throw new BadRequestException("Invalid id! User not exists!");
        }
           
        if (String(dto.courseId) !== "" && dto.courseId !== undefined){
            // check if courseId valid
            if(this.courseService.validId(dto.courseId) === true)
                filter.courseId = Number(dto.courseId);
            else    
                throw new BadRequestException("Invalid id! Course not exists!");
        }

        if (String(dto.role) !== "" && dto.role !== undefined){
            // check if role valid
            if (dto.role.localeCompare('student') !== 0 && dto.role.localeCompare('teacher') !== 0)
                throw new BadRequestException("Invalid role!");
            else    
                filter.role = dto.role;
        }

        // filter enrollments if filter contain valid parameter
        if (Object.keys(filter).length !== 0){
            // filter enrollments array using template filter{}
            // obj that it propperties match entries in filter are push to retVal array
            let retVal: Enrollment[] = this.enrollments.filter(
                obj => { return Object.keys(filter).every(propName => obj[propName] === filter[propName])}
            )
            return retVal;
        }
        else
            return [];
    }

    // query course date with given userId
    queryUserCourse(userId: number){
        // verify given userId
        if (this.userService.validId(userId) === true){
            let retVal: Course[] = []
            // search obj in enrollments array with obj.userId === userId
            // use the obj.courseId to get course data with courseService.getCourse()
            // push course data to retVal array
            this.enrollments.forEach(obj => {
                if (obj.userId === userId)
                    retVal.push(this.courseService.getCourse(obj.courseId));
            })            
            // sorting the retVal array with Course.id
            retVal.sort((a,b) => (b.id < a.id ? 1 : b.id > a.id ? -1: 0))
            // remove dulicate 
            retVal = retVal.filter((obj,i) => i === retVal.indexOf(obj))
            return retVal
        }
        else
            throw new BadRequestException("Invalid id! User not exists!");

    }

    // helper function to verify given id
    // since the id of enrollments always update to ensure continuous ids
    // there is no condition such that ids: [1 2 3] delete 2, remain [1 3]
    // the id will always be in range of 0 - enrollments.length-1
    public validId(id: number){
        if (id < 0 || id >= this.enrollments.length)
            return false;
        else
            return true
    }
    
}
