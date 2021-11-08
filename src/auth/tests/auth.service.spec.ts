import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../../users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import mockedJwtService from '../../mocks/jwt.service'
import mockedConfigService from '../../mocks/config.service';
import mockedUser from '../../mocks/user.mock';
import { UsersService } from '../../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../../users/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('Authentication Service', () => {
    let bcryptCompare: jest.Mock;
    let usersService: UsersService;
    let findUser: jest.Mock;
    let userData: User;
    let authenticationService: AuthService;

    beforeEach(async () => {
        userData = {
            ...mockedUser
        }
        bcryptCompare = jest.fn().mockReturnValue(true);
        (bcrypt.compare as jest.Mock) = bcryptCompare;
        
        const module = await Test.createTestingModule({
            imports: [
                
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
                }
              

            ],
        }).compile();
        authenticationService = await module.get<AuthService>(AuthService);
        usersService = await module.get<UsersService>(UsersService);
    })

    it('should be defined', () => {
        expect(authenticationService).toBeDefined();
    });

    describe('when accessing the data of authenticating user', () => {
        it('should attempt to get a user by user name', async () => {
            const getByEmailSpy = jest.spyOn(usersService, 'findByLogin');
            await authenticationService.login({ username: 'mockTestUser', password: "strongPassword" });
            expect(getByEmailSpy).toBeCalledTimes(1);
        })
        describe('and the provided password is not valid', () => {
            beforeEach(() => {
                bcryptCompare.mockReturnValue(false);
            });
            it('should throw an error', async () => {
                await expect(
                    authenticationService.login({ username: 'mockTestUser', password: 'strongPassword' })
                ).rejects.toThrow();
            })
        })
    });

});