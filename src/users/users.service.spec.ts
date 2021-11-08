import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.schema';
import { UsersService } from './users.service';
import mockedUser from "../mocks/user.mock";
import { getConnectionToken } from '@nestjs/mongoose';

let userData: User;

describe('UsersService', () => {
  let service: UsersService;

  

  userData = {
    ...mockedUser
  }
  const usersRepository = {
    create: jest.fn().mockResolvedValue(userData),
    save: jest.fn().mockReturnValue(Promise.resolve())
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getConnectionToken('User'),
          useValue: usersRepository
        }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
