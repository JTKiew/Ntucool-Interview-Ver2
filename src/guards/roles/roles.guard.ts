import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate{
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get required role from metadata 
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // no requiredRoles => by default no reole needed 
    if (!requiredRoles) {
      return true;
    }
    // get user data for user's role 
    const { user } = context.switchToHttp().getRequest();
    console.log("requiredRoles: "+requiredRoles+"\tuser's roles: "+user.roles)
    // true if req.user has the requiredRole
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}