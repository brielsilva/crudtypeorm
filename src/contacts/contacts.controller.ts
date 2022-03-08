import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import RequestWithUSer from 'src/auth/requestWithUser.interface';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService, @InjectRepository(User) private usersRepository: Repository<User>) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async create(@Req() request: RequestWithUSer,@Body() createContactDto: CreateContactDto) {
    const user = request.user;
    return await this.contactsService.create(createContactDto,user);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async findAll(@Param('id') id:string) {
    const user = await this.usersRepository.findOne(id);
    return this.contactsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
