import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";
import { LocalStrategy } from "./local.stratety";
import {JwtModule} from '@nestjs/jwt';
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [UsersModule,PassportModule,ConfigModule,JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async () => ({
            secret: 'dsahdusahdsa',
            signOptions: {
                expiresIn: 5*60
            }
        })
    })],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy],
    controllers: [AuthenticationController]
})

export class AuthenticationModule {}