import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './auth.service';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import { LocalAuthenticationGuard } from '../guards/localAuthentication.guard';
import RequestWithUSer from './requestWithUser.interface';
import * as fs from 'fs';
import * as rsaPemToJwk from 'rsa-pem-to-jwk';
import * as path from 'path';
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('/auth')
  async authorize(@Query() query, @Res() res: Response) {
    const privateCode = 'XPQC';
    console.log(privateCode);
    if (!query.client_id || !query.redirect_url) {
      return res.json({
        code: 'Bad Request',
      });
    }
    if (query.client_id !== '123') {
      return res.json({
        code: 'Unauthorized',
      });
    }
    res.redirect(`${query.redirect_url}?code=${privateCode}`);
  }

  @Post('/auth/validate')
  async validateCode(@Body() body) {
    const { code, grant_type, redirect_url } = body;
    if (!code || !grant_type || !redirect_url) {
      return new HttpException(
        'Faltou argumentos no body',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (code !== 'XPQC') {
      return new UnauthorizedException('Code invalido');
    }
    return this.authenticationService.returnToken();
  }

  @Get('/auth/jwk')
  async returnJwk() {
    const privateKey = fs.readFileSync(
      path.join(process.cwd(), './src/auth/private.pem'),
    );
    const jwk = rsaPemToJwk(privateKey, { use: 'sig' }, 'public');
    return jwk;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUSer, @Res() response: Response) {
    const user = request.user;
    const cookie = this.authenticationService.getCookieWithJwtAccessToken(
      user.id,
    );
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @Post('verify')
  async Verify(@Body() body) {
    return await this.authenticationService.verifyAccount(
      body.email,
      body.code,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUSer, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
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
