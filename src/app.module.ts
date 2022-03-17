import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AuthenticationModule } from './auth/auth.module';
import {GraphQLModule} from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ContactResolver } from './contacts/contact.resolver';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from './config';
@Module({
  imports: [ 
    ConfigModule.forRoot({
      envFilePath: '../development.env'
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [],
      inject: [],
      driver: ApolloDriver,
      useFactory: () => ({
        playground: Boolean(1),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      })
    })
    ,TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'mysecretpassword',
      username: 'postgres',
      database: 'test',
      synchronize: true,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')]
    }
  ), UsersModule, ContactsModule, AuthenticationModule, MailerModule],
  controllers: [AppController],
  providers: [AppService, ContactResolver],
})
export class AppModule {
  constructor(private connection: Connection) {
  }
}
