import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from 'src/food/entities/food.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
  ) {}

  async onModuleInit() {
    await this.seedFoods();
  }

  private async seedFoods() {
    // ... your seeding logic ...
  }
}
