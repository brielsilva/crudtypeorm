import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import RequestWithUSer from "./requestWithUser.interface";

@Injectable()
export default class EmailAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: RequestWithUSer = context.switchToHttp().getRequest();
        console.log(request);
        if(!request.user?.isVerified) {
            console.log(request.user);
            throw new UnauthorizedException('Confirm your email first');
        }

        return true;
    }
}