import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ 
    ConfigModule.forRoot({ isGlobal: true })
    ,TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'mysecretpassword',
      username: 'postgres',
      synchronize: true,
      entities: [__dirname + '/../**/*.entity.{js,ts}']
    }
  ),UsersModule, ContactsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
