import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthenticationService } from "./auth.service";
import RegisterDto from "./dto/register.dto";
import JwtAuthenticationGuard from "../guards/jwt-authentication.guard";
import JwtRefreshGuard from '../guards/jwt_refresh.guard';
import { LocalAuthenticationGuard } from "../guards/localAuthentication.guard";
import RequestWithUSer from "./requestWithUser.interface";
import { UsersService } from "src/users/users.service";

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly usersService: UsersService,private readonly authenticationService: AuthenticationService) {}


    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request: RequestWithUSer) {
      const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
   
      request.res.setHeader('Set-Cookie', accessTokenCookie);
      return request.user;
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUSer) {
      const {user} = request;
      const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
      const {
        cookie: refreshTokenCookie,
        token: refreshToken,
      } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
   
      await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
   
      request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
      return user;
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