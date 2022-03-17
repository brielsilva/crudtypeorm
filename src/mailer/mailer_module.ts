import { Module } from "@nestjs/common";
import {ConfigModule} from '@nestjs/config';
import EmailService from "./mailer_service";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [EmailService],
    exports: [EmailService]
})
export  class MailerModule {}