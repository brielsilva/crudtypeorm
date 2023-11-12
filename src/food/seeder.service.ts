// database-seeder.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './entities/food.entity';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  async onModuleInit() {
    await this.seedFoods();
  }

  private async seedFoods() {
    // Check if the seeding is necessary to avoid re-seeding on every application start
    const count = await this.foodRepository.count();
    if (count > 0) {
      console.log('Seeding skipped');
      return;
    }

    const foodsData = [
      {
        class: '0',
        name: 'Banana',
        healthy: true,
        calories: 89,
        protein: 1.1,
        fat: 0.3,
      },
      {
        class: '1',
        name: 'Feijões',
        healthy: true,
        calories: 347,
        protein: 21.1,
        fat: 1.5,
      },
      {
        class: '2',
        name: 'Galinha',
        healthy: true,
        calories: 239,
        protein: 27.3,
        fat: 13.6,
      },
      {
        class: '3',
        name: 'Leite',
        healthy: true,
        calories: 42,
        protein: 3.4,
        fat: 1.0,
      },
      {
        class: '4',
        name: 'Suco de laranja',
        healthy: true,
        calories: 45,
        protein: 0.7,
        fat: 0.2,
      },
      {
        class: '5',
        name: 'Pizza',
        healthy: false,
        calories: 266,
        protein: 11.0,
        fat: 10.0,
      },
      {
        class: '6',
        name: 'Batata',
        healthy: true,
        calories: 77,
        protein: 2.0,
        fat: 0.1,
      },
      {
        class: '7',
        name: 'Salada',
        healthy: true,
        calories: 130,
        protein: 2.7,
        fat: 0.3,
      },
      {
        class: '8',
        name: 'Spaguetti',
        healthy: true,
        calories: 33,
        protein: 2.9,
        fat: 0.4,
      },
      {
        class: '9',
        name: 'Arroz',
        healthy: true,
        calories: 158,
        protein: 5.8,
        fat: 0.9,
      },
    ];

    // Seed the database with the food data
    await this.foodRepository.save(foodsData);
    console.log('Database seeded with food data');
  }
}
