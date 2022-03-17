import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EmailAuthGuard from 'src/guards/email.auth.guard';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import RequestWithUSer from 'src/auth/requestWithUser.interface';
import { Roles } from 'src/users/entities/roles.decorator';
import { Role } from 'src/users/entities/roles.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService, @InjectRepository(User) private usersRepository: Repository<User>) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(EmailAuthGuard)
  @UseGuards(JwtAuthenticationGuard)
  async create(@Req() request: RequestWithUSer,@Body() createContactDto: CreateContactDto) {
    const user = request.user;
    return await this.contactsService.create(createContactDto,user);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(EmailAuthGuard)
  async findAll(@Param('id') id:string) {
    const user = await this.usersRepository.findOne(id);
    return this.contactsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(EmailAuthGuard)
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(EmailAuthGuard)
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  @UseGuards(EmailAuthGuard)
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
