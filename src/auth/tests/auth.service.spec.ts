import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import mockedJwtService from '../../mocks/jwt.service'
import mockedConfigService from 'src/mocks/config.service';
import { DatabaseModule } from '../../database/database.module';
import * as Joi from 'joi';
import { UsersService } from 'src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';

describe('The AuthenticationService', () => {
    let authenticationService: AuthService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                UsersModule,

                DatabaseModule,

            ],
            providers: [
                UsersService,
                AuthService,
                {
                    provide: getModelToken('User'),
                    useValue: {},
                },
                {
                    provide: JwtService,
                    useValue: mockedJwtService
                },
                {
                    provide: ConfigService,
                    useValue: mockedConfigService
                },

            ],
        }).compile();
        authenticationService = await module.get<AuthService>(AuthService);
    })
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
            it('should throw an error', async () => {
              
            })
          })
       
    })
});