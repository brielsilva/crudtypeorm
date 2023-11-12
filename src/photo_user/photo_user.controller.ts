// photo-user.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PhotoUserService } from './photo_user.service';
import { PhotoUser } from './entities/photo_user.entity';
import { CreatePhotoUserDto } from './dto/create_photo_user.dto';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import RequestWithUSer from 'src/auth/requestWithUser.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('photo-user')
@ApiTags('photo-user')
@ApiBearerAuth()
export class PhotoUserController {
  constructor(private readonly photoUserService: PhotoUserService) {}

  @Get()
  findAll(): Promise<PhotoUser[]> {
    return this.photoUserService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async uploadPhoto(
    @Req() request: RequestWithUSer,
    @Body() createPhotoUserDto: CreatePhotoUserDto,
  ) {
    createPhotoUserDto.userId = request.user.id;
    return this.photoUserService.handle(createPhotoUserDto);
  }

  // Add more endpoints as needed
}
