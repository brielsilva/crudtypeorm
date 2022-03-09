import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import RequestWithUSer from "src/auth/requestWithUser.interface";
import { Role } from "src/users/entities/roles.enum";

@Injectable()
export default class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles',[
            context.getHandler(),
            context.getClass()
        ]);
        const { user } = context.switchToHttp().getRequest();
        
        return requireRoles.some((role) => user.roles.includes(role));
    }
}