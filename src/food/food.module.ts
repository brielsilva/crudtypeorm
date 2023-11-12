import { Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { DatabaseSeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Food])],
  exports: [TypeOrmModule],
  providers: [DatabaseSeederService],
})
export class FoodModule {}
