import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ContactResolver } from './contact.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Contact,User]), UsersModule],
  controllers: [ContactsController],
  providers: [ContactsService, UsersService,ContactResolver],
  exports: [ContactsService,ContactResolver]
})
export class ContactsModule {}
