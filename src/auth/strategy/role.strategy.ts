// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
// // import { ROLES_METADATA_KEY } from '../decorators/roles.decorator';
// import { AUTH_ERROR_MESSAGE_ENUMS } from '../eunms/auth-error-response.enums';

// export class RolesGuard implements CanActivate {
//   constructor(private reflector = new Reflector()) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const roles = this.reflector.getAllAndOverride<string[]>(
//       ROLES_METADATA_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     const request = context.switchToHttp().getRequest();

//     if (!request.isAuthenticated) {
//       // in unwanted situations where request.isAuthenticated function is undefined,
//       // to pass this condition, you should add jwt auth decorator for that controller first
//       throw new ForbiddenException(AUTH_ERROR_MESSAGE_ENUMS.AUTH_ERROR);
//     }
//     if (!request.isAuthenticated()) {
//       return false;
//     }

//     const userRoles: string[] | undefined = request?.user?.payload?.roles;

//     const result = roles.some((role) => userRoles && userRoles.includes(role));

//     if (result) return result;

//     throw new ForbiddenException(AUTH_ERROR_MESSAGE_ENUMS.FORBIDDEN_ROLE);
//   }
// }
