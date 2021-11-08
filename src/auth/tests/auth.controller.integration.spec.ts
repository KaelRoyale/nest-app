import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {User} from '../../users/user.schema';
import { UsersService } from '../../users/users.service';
import mockedJwtService from '../../mocks/jwt.service';
import mockedConfigService from '../../mocks/config.service';
import { AuthController } from '../auth.controller';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import mockedUser from '../../mocks/user.mock';
import { getModelToken } from '@nestjs/mongoose';

describe('The AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;
  beforeEach(async () => {
    userData = {
      ...mockedUser
    }
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve())
    }

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: getModelToken('User'),
          useValue: usersRepository
        }
      ],
    })
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  })
  describe('when registering with valid data', () => {
    it('should respond with the data of the user without the password', () => {
      const expectedData = {
        ...userData
      }
      delete expectedData.password;
      return request(app.getHttpServer())
        .post('/auth/signUp')
        .send({
          username: mockedUser.username,
          password: mockedUser.password
        })
        .expect(201)
        .expect(expectedData);
    })
  })
  describe('when registering with invalid data', () => {
    it('should throw an error', () => {
      return request(app.getHttpServer())
        .post('/auth/signUp')
        .send({
          username: mockedUser.username
        })
        .expect(400)
    })
  })
});