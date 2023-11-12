import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Nutri } from 'src/nutri/entities/nutri.entity';

@Entity('user_to_nutri')
export class UserToNutri {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.nutriConnections)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Nutri, (nutri) => nutri.userConnections)
  @JoinColumn({ name: 'nutri_id' })
  nutri: Nutri;

  @Column()
  @IsDate()
  created_at: Date;
}
