import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  //controllers: [], // Desabilitado enquanto Admin Roles não estão setadas
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
