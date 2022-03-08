import { Contact } from "src/contacts/entities/contact.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string

    @Column({ nullable: false})
    password: string

    @Column({ unique: true, nullable: false})
    email: string

    @OneToMany(() => Contact,(contact: Contact) => contact.user, {cascade: true,eager: true}) 
    contacts: Contact[];

}
