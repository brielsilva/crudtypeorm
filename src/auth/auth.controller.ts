import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthenticationService } from "./auth.service";
import RegisterDto from "./dto/register.dto";
import JwtAuthenticationGuard from "./jwt-authentication.guard";
import { LocalAuthenticationGuard } from "./localAuthentication.guard";
import RequestWithUSer from "./requestWithUser.interface";

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}


    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUSer, @Res() response: Response) {
        const user = request.user;
        const cookie = this.authenticationService.getookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie',cookie);
        user.password = undefined;
        return response.send(user);
    }

    @Post('verify')
    @Post('/verify')
    async Verify(@Body() body) {
      return await this.authenticationService. verifyAccount(body.code)
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    async logOut(@Req() request: RequestWithUSer, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: RequestWithUSer) {
      const user = request.user;
      user.password = undefined;
      return user;
    }
}