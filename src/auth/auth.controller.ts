import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './auth.service';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import JwtRefreshGuard from '../guards/jwt_refresh.guard';
import { LocalAuthenticationGuard } from '../guards/localAuthentication.guard';
import RequestWithUSer from './requestWithUser.interface';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('authentication')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthenticationController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  // @Post('register')
  // async register(@Body() registrationData: CreateUserDto) {
  //   return this.authenticationService.register(registrationData);
  // }

  @HttpCode(200)
  @Post('log-in')
  async logIn(@Body() loginDto: LoginDto) {
    const user = await this.authenticationService.getAuthenticatedUser(
      loginDto.cpf,
      loginDto.password,
    );

    return await this.authenticationService.generateAccessToken(user);
  }

  // @Post('verify')
  // @Post('/verify')
  // async Verify(@Body() body) {
  //   return await this.authenticationService. verifyAccount(body.code)
  // }

  //@UseGuards(JwtAuthenticationGuard)
  // @Post('log-out')
  // async logOut(@Req() request: RequestWithUSer, @Res() response: Response) {
  //   response.setHeader(
  //     'Set-Cookie',
  //     this.authenticationService.getCookieForLogOut(),
  //   );
  //   return response.sendStatus(200);
  // }
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUSer) {
    const user = request.user;
    user.hashedPassword = undefined;
    return this.usersService.findRelation(user.cpf);
  }
}
