import { Contact } from "src/contacts/entities/contact.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string

    @Column({ nullable: false})
    password: string

    @Column({ unique: true, nullable: false})
    email: string

    @OneToMany(() => Contact, contact => contact.user) contacts: Contact[];

}
