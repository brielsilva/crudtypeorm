import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AuthenticationModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from './config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { PhotoUserModule } from './photo_user/photo_user.module';

const environment = process.env.NODE_ENV || 'development';
const envConfig = dotenv.parse(fs.readFileSync(`.env`));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'mysecretpassword',
      database: process.env.DB_DATABASE || 'test',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    UsersModule,
    AuthenticationModule,
    MailerModule,
    PhotoUserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
