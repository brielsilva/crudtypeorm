import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
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
  async create(@Body() createContactDto: CreateContactDto) {
    const user = await this.usersRepository.findOne(createContactDto.idUser);

    return await this.contactsService.create(createContactDto,user);
  }

  @Get()
  async findAll(@Param('id') id:string) {
    const user = await this.usersRepository.findOne(id);
    return this.contactsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
