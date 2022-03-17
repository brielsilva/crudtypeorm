import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import { UsersService } from "src/users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './tokenPayload.interface';
import { Role } from 'src/users/entities/roles.enum';
import  MailerService  from 'src/mailer/mailer_service';
import MailOptions from 'src/mailer/mailer_options_interface';
import { UserState } from 'src/enums/users.states';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthenticationService {
    private code;
    constructor(private readonly mailerService: MailerService,private readonly usersService: UsersService, private readonly jwtService: JwtService) {
      this.code = Math.floor(10000 + Math.random() * 90000);
    }

    public getookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId};
        const token = this.jwtService.sign(payload);
        return `Authentication=${token};  HttpOnly; Path=/; Max-Age=${5*60}`;
    }
    
    public getCookieForLogOut(){
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    public async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password,10);
        console.log(this.code);
        const hashCode = await bcrypt.hash(this.code.toString(),10)
        try {
            const user: CreateUserDto = {
              ...registrationData,
                password: hashedPassword,
                authConfirmToken: `${hashCode}`,
                state: UserState.UNVERIFIED,
                roles: Role.USER
            }
            const createdUser = await this.usersService.create(user);
            createdUser.password = undefined;
            const message: MailOptions = {
              to: registrationData.email,
              subject: 'Confirm Email',
              text: `${this.code}`,
              from: 'gabrielcostasilva500@gmail.com'
            };
            await this.mailerService.sendMail(message);
            return createdUser;
        } catch(error) {
          console.log(error);
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went Wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
      try {
          const user = await this.usersService.findByEmail(email);
          await this.verifyPassword(plainTextPassword, user.password);
          user.password = undefined;
          return user;
        } catch (error) {
          throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
      }
      public async verifyAccount(email: string,code: string) {
        try {
          const user = await this.usersService.findByEmail(email);
          const userCode = await this.usersService.findByIdWithCode(user.id);
          console.log(userCode);
          console.log(user);
          const result = await bcrypt.compare(code,userCode.authConfirmToken);
          if(!result) {
            return new HttpException('Verification code has expired or not found', HttpStatus.BAD_REQUEST);
          }
          await this.usersService.updateVerifiedUser(userCode.authConfirmToken);
          return true;
        } catch(error) {
          return new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
          plainTextPassword,
          hashedPassword
        );

        if (!isPasswordMatching) {
          throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
      }
}