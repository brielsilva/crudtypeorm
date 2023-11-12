import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

@Entity('food')
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  @IsString()
  @IsNotEmpty()
  class: string;

  @Column({ type: 'varchar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'boolean' })
  @IsBoolean()
  healthy: boolean;

  @Column('decimal', { precision: 5, scale: 2 }) // Precision and scale can be adjusted as needed.
  @IsNumber()
  @Min(0)
  calories: number;

  @Column('decimal', { precision: 5, scale: 2 })
  @IsNumber()
  @Min(0)
  protein: number;

  @Column('decimal', { precision: 5, scale: 2 })
  @IsNumber()
  @Min(0)
  fat: number;
}
