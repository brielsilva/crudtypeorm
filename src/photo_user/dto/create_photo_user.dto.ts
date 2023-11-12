import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreatePhotoUserDto {
  @ApiHideProperty()
  @IsString()
  @IsEmpty()
  userId: string;

  @ApiProperty({
    description: 'The base64 encoded image',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  base64Image: string;
}
