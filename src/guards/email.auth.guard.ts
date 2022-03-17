import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserState } from "src/enums/users.states";
import { User } from "src/users/entities/user.entity";
import RequestWithUSer from "../auth/requestWithUser.interface";

@Injectable()
export default class EmailAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: RequestWithUSer = context.switchToHttp().getRequest();
        console.log(request.user?.state);
        console.log(UserState.UNVERIFIED);
        if(request.user?.state === UserState.UNVERIFIED) {
            throw new UnauthorizedException('Confirm your email first');
        }

        return true;
    }
}