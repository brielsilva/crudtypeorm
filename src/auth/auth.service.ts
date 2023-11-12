import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './tokenPayload.interface';
import MailerService from '../mailer/mailer_service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/roles.enum';
import MailOptions from 'src/mailer/mailer_options_interface';
import { ConfigService } from '@nestjs/config';
import { UserState } from 'src/enums/users.states';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthenticationService {
  private code;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {
    this.code = Math.floor(10000 + Math.random() * 90000);
  }

  async sendConfirmationEmail(user: User) {
    const { email } = user;
    try {
      const messageSucessuful: MailOptions = {
        to: email,
        from: 'gabrielcostasilva500@gmail.com',
        text: `${this.code}`,
        subject: 'Authenticate User! Confirm Email',
      };
      await this.mailerService.sendMail(messageSucessuful);
    } catch (err) {
      console.log(err.response.body);
    }
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async register(registrationData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const user = {
        ...registrationData,
        password: hashedPassword,
        authConfirmToken: `${this.code}`,
        roles: Role.USER,
      };
      const createdUser = await this.usersService.createUser(user);
      createdUser.hashedPassword = undefined;
      //await this.sendConfirmationEmail(createdUser);
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went Wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // S - Single responsability => Tava fazendo o hash do password e pegando o user
  // public async getAuthenticatedUser(email: string, hashedPassword: string) {
  //     try {
  //         const user = await this.usersService.findByEmail(email);
  //         const isPasswordMatching = await bcrypt.compare(hashedPassword,user.password);
  //         if(!isPasswordMatching) {
  //             throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  //         }
  //         user.password = undefined;
  //         return user;
  //     } catch (error) {
  //         throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  //     }
  // }
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findByCpf(email);
      await this.verifyPassword(plainTextPassword, user.hashedPassword);
      delete user.hashedPassword;
      delete user.salt;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getAccessToken(userId: string) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${60 * 60}s`, // expiresIn expects a string or number
    });
    return { accessToken: token };
  }

  public getRefreshToken(userId: string) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${60 * 60 * 24 * 7}s`, // 7 days for refreshToken
    });
    return { refreshToken: token };
  }

  public async generateAccessToken(user: User) {
    const accessTokenObject = this.getAccessToken(user.id);
    const refreshTokenObject = this.getRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(
      refreshTokenObject.refreshToken,
      user.id,
    );

    // Combine the access and refresh tokens into a single object
    return {
      ...accessTokenObject,
      ...refreshTokenObject,
    };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // public async verifyAccount(code: string) {
  //   try {
  //     const user = await this.usersService.findByCode(code);
  //     if (!user) {
  //       return new HttpException(
  //         'Verification code has expired or not found',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     await this.usersService.updateVerifiedUser(user, UserState.ACTIVE);
  //     return true;
  //   } catch (error) {
  //     return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
