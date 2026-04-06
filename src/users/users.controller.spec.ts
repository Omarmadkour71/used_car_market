import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserEntity } from './users.entity';
import { NotFoundException } from '@nestjs/common';

let fakeUsersService: Partial<UsersService>;
let fakeAuthService: Partial<AuthService>;

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    fakeAuthService = {
      // signin: () => {},
      // signup: () => {},
    };

    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '1234' }]);
      },
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asd@asd.com', password: '123' });
      },
      // remove: () => {},
      // update: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findByEmail returns a user with the gived email', async () => {
    const user = await controller.findByEmail('asdf@asdf.com');
    expect(user.length).toEqual(1);
    expect(user[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a user with the given id', async () => {
    const user = await controller.findUser('12');
    expect(user).toBeDefined();
    expect(user.id).toEqual(12);
  });

  it('findUser throws an error if no id is found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('12')).rejects.toThrow(NotFoundException);
  });
});
