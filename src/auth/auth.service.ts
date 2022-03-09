import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import { UsersService } from "src/users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './tokenPayload.interface';

@Injectable()
export class AuthenticationService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

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
        try {
            const createdUser = await this.usersService.create({
                ...registrationData,
                password: hashedPassword
            });
            createdUser.password = undefined;
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