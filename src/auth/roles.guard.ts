import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/common/enums/roles.enum';
import { ROLES_METADATA_KEY } from './decorators/roles.decorator';
import { AUTH_ERROR_MESSAGE_ENUMS } from './eunms/auth-error-response.enums';

export class RolesGuard implements CanActivate {
  constructor(private reflector = new Reflector()) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // console.log(this);
    
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    
    if(!request.isAuthenticated()) return false;
    
    const userRoles:string[] | undefined = request?.user?.payload?.roles;

    const result =  roles.some(role => userRoles && userRoles.includes(role))

    if(result) return result;
    
    throw new ForbiddenException(
      AUTH_ERROR_MESSAGE_ENUMS.FORBIDDEN_ROLE
    )
  }
}
