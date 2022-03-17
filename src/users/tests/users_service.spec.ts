import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

describe('User Service', () => {
    let usersService: UsersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersService, 
                {
                provide: getRepositoryToken(User), 
                useValue: {
                    find: jest.fn(),
                    findOne: jest.fn(),
                    create: jest.fn(),
                    save: jest.fn()
                }
        }]}).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
    });

    describe('Create User', () => {
        it('Should return a new user', async () => {
            const result = {
                'id': 1,
                'name': 'Gabriel Costa',
                'email': 'gabrielcostasilva100@gmail.com',
                'contacts': [],
                'roles': 'users',
                'password': undefined,
                'isVerified': false,
                'authConfirmToken': 'string'
            };
            const userDto: CreateUserDto = {
                'email': 'gabrielcostasilva100@gmail.com',
                'password': 'gabrielcosta'
            }
            const
        })
    })
})