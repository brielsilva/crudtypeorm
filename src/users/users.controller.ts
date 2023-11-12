import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    let emailExist = await this.usersService.findByCpf(createUserDto.cpf);
    if (emailExist) {
      throw new HttpException('CPF is in use', HttpStatus.CONFLICT);
    }
    emailExist = null;
    emailExist = await this.usersService.findByCpf(createUserDto.cpf);
    if (emailExist) {
      throw new HttpException('Email is in use', HttpStatus.CONFLICT);
    }
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
