import { Contact } from "src/contacts/entities/contact.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {Exclude} from 'class-transformer';
import { UserState } from '../../enums/users.states';

@Entity('users')
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string

    @Column({ nullable: false})
    @Exclude()
    password: string

    @Column({ unique: true, nullable: false})
    email: string

    @Column({select: false, nullable: true})
    @Exclude()
    authConfirmToken: string

    @Column({
        nullable: true
      })
    @Exclude()
    currentHashedRefreshToken?: string;

    @Column({
      type: "enum",
      enum: UserState,
      default: UserState.UNVERIFIED
    })
    state: UserState

    @OneToMany(() => Contact,(contact: Contact) => contact.user) 
    contacts: Contact[];

    @CreateDateColumn()
    createdAt: Date

    @Column()
    roles: string
}
