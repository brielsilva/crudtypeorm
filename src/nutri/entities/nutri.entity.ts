import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserToNutri } from 'src/user_to_nutri/entities/user_to_nutri.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('nutri')
export class Nutri {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 14 })
  @IsString()
  cnpj: string;

  @Column()
  @IsString()
  crn: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => UserToNutri, (userToNutri) => userToNutri.nutri)
  userConnections: UserToNutri[];
}
