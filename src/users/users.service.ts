import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserState } from 'src/enums/users.states';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}
  
  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findById(userId);
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);

    return newUser;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email }) 
    return user;
  }

  async findByCode(code: string) {
    const user = await this.usersRepository.findOne({ authConfirmToken: code });
    return user;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({id});
    if(user) {
      return user;
    }

    throw new HttpException('User not found',HttpStatus.NOT_FOUND);
  }

  async updateVerifiedUser(user: User, state: UserState) {
    await this.usersRepository.update({id: user.id}, { state: state,authConfirmToken: undefined});
  }

}
