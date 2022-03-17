import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserState } from "src/enums/users.states";
import RequestWithUSer from "../auth/requestWithUser.interface";

@Injectable()
export default class EmailAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: RequestWithUSer = context.switchToHttp().getRequest();
        console.log(request);
        if(request.user.state === UserState.UNVERIFIED) {
            console.log(request.user);
            throw new UnauthorizedException('Confirm your email first');
        }

        return true;
    }
}