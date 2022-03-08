import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}
  
  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);

    return newUser;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email })
    if(user) {
      throw new HttpException('Email already in use',HttpStatus.NOT_FOUND);
    }   
    return user;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({id});
    if(user) {
      return user;
    }

    throw new HttpException('User not found',HttpStatus.NOT_FOUND);
  }

}
