import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDate,
  ValidateIf,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Nutri } from 'src/nutri/entities/nutri.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ writeOnly: true })
  @IsString()
  @IsNotEmpty()
  salt: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  birth: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ writeOnly: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  currentHashedRefreshToken?: string;

  @ApiProperty({ enum: ['nutri', 'otherRole1', 'otherRole2'] }) // Adjust the enum with your actual roles
  @IsString()
  @IsNotEmpty()
  roles: string;

  @ApiProperty({ type: () => Nutri, required: false })
  @ValidateIf((o) => o.roles === 'nutri')
  @ValidateNested()
  @Type(() => Nutri)
  @IsOptional()
  nutriProfile?: Nutri;
}
