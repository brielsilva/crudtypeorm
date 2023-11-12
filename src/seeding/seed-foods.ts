import { createConnection, getRepository } from 'typeorm';
import { Food } from '../food/entities/food.entity';

async function seedFoods() {
  const connection = await createConnection(); // Add your connection options here

  const foodRepository = getRepository(Food);

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
      name: 'Arroz',
      healthy: true,
      calories: 130,
      protein: 2.7,
      fat: 0.3,
    },
    {
      class: '8',
      name: 'Salada',
      healthy: true,
      calories: 33,
      protein: 2.9,
      fat: 0.4,
    },
    {
      class: '9',
      name: 'Spaguetti',
      healthy: true,
      calories: 158,
      protein: 5.8,
      fat: 0.9,
    },
  ];

  await foodRepository.save(
    foodsData.map((data) => foodRepository.create(data)),
  );

  console.log('Seeded foods into the database.');

  await connection.close();
}

seedFoods().catch((error) => {
  console.error('Error during seeding:', error);
});
