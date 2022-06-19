# NTUCool-Interview

# Preparation and Installation
- install nest.js cli using `npm install -g @nestjs/cli`
- install the required modules through `npm install`
- run the Web API with `npm run start`
- test the Web API through API tester like Postman(https://www.postman.com/), Insomnia(https://insomnia.rest/) 

# API Modules Structure
``` mermaid 
%%{ init : { "theme" : "default", "flowchart" : { "curve" : "linear" }}}%%

flowchart RL
    subgraph App_Module["App_Module (localhost:3000/)"]
        direction LR
        A(App_Controller) ---B(App_Service)
    end
    
    subgraph User_Module["User_Module (.../user)"]
        direction LR
        C(User_Controller) ---D(User_Service)
    end
    
    subgraph Enrollment_Module["Enrollment_Module (.../enrollment)"]
        direction LR
        E(Enrollmen_Controller) --- F(Enrollment_Service)
    end
    
    subgraph Course_Module["Course_Module (.../course)"]
        direction LR
        G(Course_Controller) --- H(Course_Service)
    end
    
    subgraph Auth_Module["Auth_Module (.../auth)"]
            direction LR
            Z(Auth_Controller) ---Y(Auth_Service)
    end
    
    User_Module --> |Imported| Enrollment_Module
    Course_Module --> |Imported| Enrollment_Module
    User_Module --> |"Import User Modules"| App_Module
    Enrollment_Module --> |"Import Enrollment Modules"| App_Module
    Course_Module --> |"Import Course Modules"| App_Module
    Auth_Module --> |"Import Auth Modules"| App_Module
```
# Web APIs
## Auth API
``` mermaid
%%{ init : { "theme" : "default", "flowchart" : { "curve" : "" }}}%%
flowchart LR    
    Pipes["Validation Pipes + ParseIntPipe <br> Validate and Transform input data type"]
    Client --> |"localhost:3000 <br> req.Body{name: {string}, pass: {string}}"| Auth{"/auth"}
    Auth{"/auth"} --> |"/signIn"| Pipes
    Pipes --> |"Pass"| Auth_Controller
    Pipes --> |"Fail"| ThrowException
    Auth_Controller --> Auth_Service
```
## User API
``` mermaid
%%{ init : { "theme" : "default", "flowchart" : { "curve" : "linear" }}}%%
flowchart LR    
    Pipes["Validation Pipes + ParseIntPipe <br> Validate and Transform input data type"]
    subgraph Guards[jwtAuthGuard + RolesGuard]
        jwtAuthGuard["Authentication of Bearer Token"]
        RolesGuard["Authorization of user's role"]
    end
    
    User{"/user"} --> |"/get/:id"| Pipes
    User{"/user"} --> |"/query"| Pipes
    
    User{"/user"} -->|"/create"| Guards
    User{"/user"} -->|"/edit/:id"| Guards 
    User{"/user"} -->|"/delete/:id"| Guards 
    
    Guards --> |"Pass"| Pipes
    Guards --> |"Fail"| ThrowException
    
    Pipes --> |"Pass"| User_Controller
    Pipes --> |"Fail"| ThrowException

    User_Controller --> User_Service
```

## Enrollment API
``` mermaid 
%%{ init : { "theme" : "default", "flowchart" : { "curve" : "linear" }}}%%
flowchart LR    
    Pipes["Validation Pipes + ParseIntPipe <br> Validate and Transform input data type"]
    subgraph Guards[jwtAuthGuard + RolesGuard]
        jwtAuthGuard["Authentication of Bearer Token"]
        RolesGuard["Authorization of user's role"]
    end
    
    Enrollment{"/enrollment"} --> |"/queryUser"| Pipes
    Enrollment{"/enrollment"} --> |"/get/:id"| Pipes
    Enrollment{"/enrollment"} --> |"/queryEnroll"| Pipes
    Enrollment{"/enrollment"} --> |"/queryCourse"| Pipes 
    Enrollment{"/enrollment"} --> |"/add"| Guards 
    Enrollment{"/enrollment"} --> |"/delete/:id"| Guards 
    
    Guards --> |"Pass"| Pipes
    Guards --> |"Fail"| ThrowException
    
    Pipes --> |"Pass"| Enrollment_Controller
    Pipes --> |"Fail"| ThrowException
    
    Enrollment_Controller --> Enrollment_Service
```

## Course API
``` mermaid
%%{ init : { "theme" : "default", "flowchart" : { "curve" : "linear" }}}%%
flowchart LR    
    Pipes["Validation Pipes + ParseIntPipe <br> Validate and Transform input data type"]
    
    Course{"/course"} --> |"/get/:id"| Pipes
    Pipes --> |"Pass"| Course_Controller
    Pipes --> |"Fail"| ThrowException
    Course_Controller --> Course_Service
```

# Some Implementations
- email must match regex \/^\S@\S$\/
    - using ValidationPipe to verify the format of email
    - @Matches('\^[\\S]+@[\\S]+$') 
    
- return BadRequest 
    - `throw new BadRequestException({ErrMsg});`

- Bearer Auth token 
    -  generate by JwtService.sign()

- return Unauthorized
    -  `throw new UnauthorizedException();`

- Guards for Bearer Auth token validation
- Guards for admin role authorization
- Swagger for visualized API table
