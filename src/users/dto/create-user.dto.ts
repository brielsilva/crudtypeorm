import { Contact } from "src/contacts/entities/contact.entity";

export class CreateUserDto {
    email: string;
    password: string;
    name: string;
}
