import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import { UsersService } from "src/users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './tokenPayload.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/users/entities/roles.decorator';
import { Role } from 'src/users/entities/roles.enum';

@Injectable()
export class AuthenticationService {
    private code;
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private readonly mailerService: MailerService) {
      this.code = Math.floor(10000 + Math.random() * 90000);
    }

    public getookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId};
        const token = this.jwtService.sign(payload);
        return `Authentication=${token};  HttpOnly; Path=/; Max-Age=${5*60}`;
    }

    async sendConfirmationEmail(user: User) {
      const {email, name} = await user;
      console.log(email);
      try {
        const result = await this.mailerService.sendMail({
          to: email,
          subject: 'Welcome to CRUD API! Confirm Email',
          template: 'confirm',
          context: {
            name,
            code: this.code
          }
        });
        console.log(result);
      } catch(err) {
        console.log(err);
      }
    }
    
    public getCookieForLogOut(){
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    public async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password,10);
        try {
            const user = {
              ...registrationData,
                password: hashedPassword,
                authConfirmToken: `${this.code}`,
                isVerified: false,
                roles: Role.USER
            }
            const createdUser = await this.usersService.create(user);
            createdUser.password = undefined;
            await this.sendConfirmationEmail(createdUser);
            return createdUser;
        } catch(error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went Wrong', HttpStatus.INTERNAL_SERVER_ERROR);
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
          const user = await this.usersService.findByEmail(email);
          await this.verifyPassword(plainTextPassword, user.password);
          user.password = undefined;
          return user;
        } catch (error) {
          throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
      }
      public async verifyAccount(code: string) {
        try {
          const user = await this.usersService.findByCode(code);
          if(!user) {
            return new HttpException('Verification code has expired or not found', HttpStatus.BAD_REQUEST);
          }
          await this.usersService.updateVerifiedUser(code);
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