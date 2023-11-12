import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserState } from '../../enums/users.states';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserToNutri } from 'src/user_to_nutri/entities/user_to_nutri.entity';
import { Nutri } from 'src/nutri/entities/nutri.entity';
import { PhotoUser } from 'src/photo_user/entities/photo_user.entity';
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column({ length: 100 })
  @IsString()
  lastName: string;

  @Column()
  @IsString()
  salt: string;

  @Column()
  @IsDate()
  birth: Date;

  @Column({ length: 11 })
  @IsString()
  cpf: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  hashedPassword: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken?: string;

  // @OneToMany(() => UserPhysicHistoryMonthly, (history) => history.user)
  // physicHistory: UserPhysicHistoryMonthly[];

  @OneToOne(() => Nutri, (nutri) => nutri.user, { nullable: true })
  nutriProfile: Nutri;

  @OneToMany(() => UserToNutri, (userToNutri) => userToNutri.user)
  nutriConnections: UserToNutri[];

  @OneToMany(() => PhotoUser, (photoUser) => photoUser.user, { eager: true })
  photos: PhotoUser[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  roles: string;
}
