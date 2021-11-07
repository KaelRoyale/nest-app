import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../../users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import mockedJwtService from '../../mocks/jwt.service'
import mockedConfigService from '../../mocks/config.service';
import { DatabaseModule } from '../../database/database.module';
import * as Joi from 'joi';
import { UsersService } from 'src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { LoginUserDto } from '../dto/login-user.dto';
import { HttpStatus } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

describe('Authentication Service', () => {
    let authenticationService: AuthService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                UsersModule,

                DatabaseModule,
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.register({
                    secretOrPrivateKey: process.env.JWT_SECRET || 'hard!toGuess',
                    signOptions: {
                        expiresIn: 3600,
                    },
                }),
            ],
            providers: [
                UsersService,
                AuthService,
                {
                    provide: getModelToken('User'),
                    useValue: { name: 'User', schema: UserSchema },
                },

                {
                    provide: ConfigService,
                    useValue: mockedConfigService
                },

            ],
        }).compile();
        authenticationService = await module.get<AuthService>(AuthService);
    })
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('when sign up a new user', () => {
        describe('with new user', () => {
            let user: User;
            beforeEach(() => {
                user = new User();
                //findOne.mockReturnValue(Promise.resolve(user));
            })
            it('should return the user', async () => {

            })
        })
        describe('and existed user', () => {
            beforeEach(() => {

            })


        })

    })
});