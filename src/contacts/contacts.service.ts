import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContactsService {

  constructor(@InjectRepository(Contact) private contactsRepository: Repository<Contact>) {}

  create(createContactDto: CreateContactDto) {
    return 'This action adds a new contact';
  }

  findAll() {
    return `This action returns all contacts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contact`;
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
