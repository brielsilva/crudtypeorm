import { UserState } from "src/enums/users.states";

export class CreateUserDto {
    email: string;
    password: string;
    name: string;
    authConfirmToken: string;
    state: UserState;
    roles: string;
}
