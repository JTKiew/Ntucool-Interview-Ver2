import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { userData, Users } from 'src/database';
import { createUserDto, editUserDto, queryUserDto } from 'src/dto';
import { userSorting } from 'src/Utility/Sorting';

@Injectable()
export class UserService {
    // local variable to save the users data 
    private users: Users[] = userData;

    // receive the name and email to create new user
    createUser(dto: createUserDto){
        // search the users for duplicates name or email
        let exist = this.users.find((obj) => {
            return obj.name === dto.name || obj.email === dto.email;
        })
        // create user
        if (exist === undefined || null){
            // add new users
            this.users.push({
                id: this.users.length , 
                name: dto.name,
                email: dto.email
            });
            console.log(this.users)
            return `User ${dto.name} created!`
        }
        else{
            throw new BadRequestException("Name or Email already been used!");
        }
    }

    // get user info with given id
    public getUser(id: number){
        // verify given id
        if (this.validId(id))
            return this.users[id];
        else 
            throw new BadRequestException("Invalid id! User not exists!");
        
    }

    // query user with name or email
    queryUser(dto: queryUserDto){
        let retVal: {} = {};
        // handling the content of str by filter
        if (dto.filter === "name"){
            // search user with name: str
            retVal = this.users.find(obj => obj.name === dto.str);
            if (retVal)
                return retVal;
            else
                throw new BadRequestException("Invalid name! User not exists!");
        }
        else if (dto.filter === "email"){
            // search user with email: str
            retVal = this.users.find(obj => obj.email === dto.str);
            if (retVal)
                return retVal;
            else
                throw new BadRequestException("Invalid email! User not exists!");
        }
        else    
            throw new BadRequestException("Invalid filter!");
    }

    // edit user's name or email 
    editUser(id: number, dto: editUserDto){
        // verify given id
        if (this.validId(id)){
            // not blank means have changing towards name or email
            if (dto.name !== ''){
                this.users[id].name = dto.name;
            }
            if (dto.email !== ''){
                this.users[id].email = dto.email;
            }
            console.log(this.users)
            return `User with id ${id} edited!`
        }
        else {
            throw new BadRequestException("Invalid id! User not exists!");
        }
    }

    // delete user with given id
    deleteUser(id: number){
        // verify given id
        if (this.validId(id)){
            // delete the user
            this.users.splice(id,1);
            // update remaining users's id
            this.users = userSorting(this.users);
            console.log(this.users);
            return `User with id ${id} deleted!`;
        }
        else {
            throw new BadRequestException("Invalid id! User not exists!");
        }
    }

    // helper function to verify given id
    // since the id of users always update to ensure continuous ids
    // there is no condition such that ids: [1 2 3] delete 2, remain [1 3]
    // the id will always be in range of 0 - users.length-1
    public validId(id: number){
        if (id < 0 || id >= this.users.length)
            return false;
        else
            return true
    }

}
