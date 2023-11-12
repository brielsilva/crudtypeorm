import { Module } from '@nestjs/common';
// import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoUser } from './entities/photo_user.entity';
import { PhotoUserController } from './photo_user.controller';
import { PhotoUserService } from './photo_user.service';
import { UsersModule } from 'src/users/users.module';
import { FoodModule } from 'src/food/food.module';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoUser]), UsersModule, FoodModule],
  //controllers: [], // Desabilitado enquanto Admin Roles não estão setadas
  providers: [PhotoUserService],
  controllers: [PhotoUserController],
})
export class PhotoUserModule {}
