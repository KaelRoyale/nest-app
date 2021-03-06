import { HttpStatus } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';

import { User } from '../src/users/user.schema';

describe('AuthController (e2e)', () => {
    const authUrl = `http://localhost:3000/api/auth`;

    const mockUser: User = {

        username: 'test7',
        password: 'testpass7',
        createdAt:  new Date(),
        failedAttemps: 0,
        isLocked: false,
        lastFailedAttempts: null,
        lastLoginAt: null

    };

    describe('/auth/register (POST)', () => {
        it('it should register a user and return the new user object', () => {
            return request(authUrl)
                .post('/signup')
                .set('Accept', 'application/json')
                .send(mockUser)
                .expect((response: request.Response) => {
                    const { id, username, password } =
                        response.body;

                    expect(typeof id).toBe('number'),

                    expect(username).toEqual(mockUser.username),
                    expect(password).toBeUndefined();
                    
                   
                })
                .expect(HttpStatus.CREATED);
        });

        it('it should not register a new user if the passed email already exists', () => {
            return request(authUrl)
                .post('/signup')
                .set('Accept', 'application/json')
                .send(mockUser)
                .expect(HttpStatus.CONFLICT);
        });
    });

    describe('/auth/login (POST)', () => {
        it('it should not log in nor return a JWT for an unregistered user', () => {
            return request(authUrl)
                .post('/login')
                .set('Accept', 'application/json')
                .send({ email: 'doesnot@exist.com', password: 'password' })
                .expect((response: request.Response) => {
                    const { token }: { token: string } = response.body;

                    expect(token).toBeUndefined();
                })
                .expect(HttpStatus.FORBIDDEN);
        });

        it('it should log in and return a JWT for a registered user', () => {
            return request(authUrl)
                .post('/login')
                .set('Accept', 'application/json')
                .send(mockUser)
                .expect((response: request.Response) => {
                    const { token }: { token: string } = response.body;

                    expect(jwt.verify(token, 'jwtsecret')).toBeTruthy();
                })
                .expect(HttpStatus.OK);
        });
    });
});