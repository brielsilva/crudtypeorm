import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";
import { LocalStrategy } from "./local.stratety";
import {JwtModule} from '@nestjs/jwt';
import { JwtStrategy } from "./jwt.strategy";
import { MailerModule } from "src/mailer/mailer_module";

@Module({
    imports: [MailerModule,UsersModule,PassportModule,ConfigModule,JwtModule.registerAsync({
        imports: [],
        inject: [],
        useFactory: async (configService: ConfigService) => ({
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            signOptions: {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
            }
        })
    })],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy],
    controllers: [AuthenticationController],
    exports: [AuthenticationService]
})

export class AuthenticationModule {}