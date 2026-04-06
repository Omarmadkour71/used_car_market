import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserEntity } from './users.entity';

let service: AuthService;
let fakeUsersService: Partial<UsersService>;

describe('Auth Service', () => {
  // UsersService mock & creating AuthService Before each test
  beforeEach(async () => {
    const users: UserEntity[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can Create an Instance of Auth Service', () => {
    expect(service).toBeDefined();
  });

  it('creates a user with hashed and salted password', async () => {
    const user = await service.signup('newUser@mm.com', '1234');

    expect(user.password).not.toEqual('1234');
    const [salt, password] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(password).toBeDefined();
  });

  it('throws an error if the user signs up with an existed email', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '123' }]);

    await expect(service.signup('a', '1234')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if user signs in with wrong email', async () => {
    await expect(service.signin('wrongemail@test.com', '1234')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if the password is wrong', async () => {
    await service.signup('test@example.com', 'newpassword');
    await expect(
      service.signin('test@example.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('signs user in with right email and password', async () => {
    await service.signup('testing@example.com', 'password');
    const user = await service.signin('testing@example.com', 'password');
    expect(user).toBeDefined();
  });
});
