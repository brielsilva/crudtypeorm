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
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    // Generate a salt
    const salt = await bcrypt.genSalt();

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user entity with the hashed password and the rest of the user details
    const user = this.usersRepository.create({
      ...rest,
      salt: salt,
      hashedPassword: hashedPassword,
    });

    // Save the new user to the database
    return this.usersRepository.save(user);
  }

  async findByCpf(cpf: string) {
    const user = await this.usersRepository.findOne({ cpf });
    return user;
  }

  async findRelation(cpf: string) {
    const user = await this.usersRepository.findOne(
      { cpf },
      { loadEagerRelations: true },
    );
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user;
  }

  // async findByCode(code: string) {
  //   const user = await this.usersRepository.findOne({ authConfirmToken: code });
  //   return user;
  // }

  async findById(id: string) {
    const user = await this.usersRepository.findOne(
      { id },
      { loadEagerRelations: true },
    );
    if (user) {
      return user;
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  // async updateVerifiedUser(user: User, state: UserState) {
  //   await this.usersRepository.update(
  //     { id: user.id },
  //     { state: state, authConfirmToken: undefined },
  //   );
  // }
}
