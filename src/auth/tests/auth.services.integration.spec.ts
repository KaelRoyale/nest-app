import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from "src/users/user.schema"
import { UsersService } from '../../users/users.service';
import mockedJwtService from '../../mocks/jwt.service';
import mockedConfigService from '../../mocks/config.service';
import { AuthController } from '../auth.controller';
import { ConflictException, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { getConnectionToken } from '@nestjs/mongoose';

const mockedUser: User = {

    username: 'testUser',
    password: 'testPass1234',
    createdAt: new Date(),
    failedAttemps: 0,
    isLocked: false,
    lastLoginAt: new Date(),
    lastFailedAttempts: null
}

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
                    provide: getConnectionToken('User'),
                    useValue: usersRepository
                }
            ],
        })
            .compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    })
    describe('when sign in', () => {
        describe('successful', () => {
            it('should return a jwt token', () => {

            })
        })

    })
    describe('when register', () => {
        describe('and using valid data', () => {
            it('should respond with the data of the user without the password', () => {
                const expectedData = {
                    ...userData
                }
                delete expectedData.password;
                return request(app.getHttpServer())
                    .post('/auth/signUp')
                    .send({

                        username: mockedUser.username,
                        password: 'strongPassword'
                    })
                    .expect(201);
            })
        })
        describe('when registering with duplicated username', () => {
            it('should throw an error', () => {
                return request(app.getHttpServer())
                    .post('/auth/signup')
                    .send({
                        username: "test6",
                        password: "aaa"

                    })
                    .expect(ConflictException)
            })
        })
    })
});