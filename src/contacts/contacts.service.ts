import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ContactsService {

  constructor(@InjectRepository(Contact) private contactsRepository: Repository<Contact>) {}

  async create(createContactDto: CreateContactDto, user: User) {
    const contact = await this.contactsRepository.create({
      ...createContactDto,
      user: user,
    });
    await this.contactsRepository.save(contact);
    
    return contact;
  }

  async findAll() {
    const contacts = await this.contactsRepository.find({relations: ['user']});
    console.log(contacts);
    return contacts;
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
