// photo-user.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PhotoUser } from './entities/photo_user.entity';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { CreatePhotoUserDto } from './dto/create_photo_user.dto';
import axios from 'axios';
import { Food } from 'src/food/entities/food.entity';
import { ApiResponse } from './dto/api_response.interface';

@Injectable()
export class PhotoUserService {
  constructor(
    @InjectRepository(PhotoUser)
    private photoUserRepository: Repository<PhotoUser>,
    @InjectRepository(Food)
    private foodRepository: Repository<Food>,
  ) {}

  async findAll(): Promise<PhotoUser[]> {
    return await this.photoUserRepository.find();
  }

  async saveImage(createPhotoUserDto: CreatePhotoUserDto): Promise<PhotoUser> {
    // Convert base64 to binary
    const buffer = Buffer.from(createPhotoUserDto.base64Image, 'base64');
    const filename = `${createPhotoUserDto.userId}-${Date.now()}.png`;

    // Define a path for the image
    const imagePath = `uploads/${filename}`;

    // Write the file to the filesystem
    await writeFile(join(__dirname, '..', '..', imagePath), buffer);

    // Save the URL to the database
    const photoUser = this.photoUserRepository.create({
      user: { id: createPhotoUserDto.userId },
      url: `http://localhost:3000/${filename}`,
    });

    return this.photoUserRepository.save(photoUser);
  }

  extractClassesFromPredictions(response: ApiResponse): string[] {
    if (response.predictions.length === 0) {
      return [];
    }

    return response.predictions.map((prediction) => prediction.class);
  }

  async analyzeImageWithExternalApi(base64Image: string): Promise<any> {
    const url =
      'https://detect.roboflow.com/food-zuaz7/1?api_key=WDPatX02Sud2szmRq0rx';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
      const response = await axios.post(url, base64Image, { headers: headers });
      return response.data;
    } catch (error) {
      console.error('Error calling external image analysis API:', error);
      throw error;
    }
  }

  async findFoodsByClasses(classes: string[]): Promise<Food[]> {
    // If there are no classes, return an empty array
    if (!classes.length) {
      return [];
    }

    // Use the IN operator to find all foods that have a class within the classes array
    const foods = await this.foodRepository.find({
      where: {
        class: In(classes),
      },
    });

    return foods;
  }

  analyzeDiet(foods: Food[]): boolean {
    // Count the number of unhealthy food items
    const unhealthyCount = foods.reduce((count, food) => {
      return count + (!food.healthy ? 1 : 0);
    }, 0);

    // If there are more than two unhealthy foods, the diet is considered bad
    if (unhealthyCount > 2) {
      return false;
    } else {
      return true;
    }
  }

  async handle(create: CreatePhotoUserDto): Promise<any> {
    const analyze = await this.analyzeImageWithExternalApi(create.base64Image);
    const classList = this.extractClassesFromPredictions(analyze);
    if (!classList) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'No classes provided.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const foods = await this.findFoodsByClasses(classList);
    if (!foods.length) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No foods found for the provided classes.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.saveImage(create);
    const dietAnalysis = this.analyzeDiet(foods);

    return {
      statusDiet: dietAnalysis,
      foodList: foods,
    };
  }

  // Add more methods as needed for your application
}
