import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authService = { findAll: () => ['test'] };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UsersService, AuthService]
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([
      app.close(),
    ])
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should detect that we are not logged in', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('disallow invalid credentials', async () => {
    const authInfo: LoginUserDto = { username: 'newTestUser4', password: 'badpass' };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  describe('Authentication', () => {
    let jwtToken: string

    describe('AuthModule', () => {
      // assume test data includes user test@example.com with password 'password'
      it('authenticates user with valid credentials and provides a jwt token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'testUser6', password: 'testPass6' })
          .expect(200)

       
        jwtToken = response.body.accessToken
        expect(jwtToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex
      })

      it('fails to authenticate user with an incorrect password', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'testUser6', password: 'passwordhere' })
          .expect(401)

        expect(response.body.accessToken).not.toBeDefined()
      })

      // assume test data does not include a nobody@example.com user
      it('fails to authenticate user that does not exist', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'nobody@example.com', password: 'test' })
          .expect(401)

        expect(response.body.accessToken).not.toBeDefined()
      })
    })

    describe('Protected', () => {
      it('gets protected resource with jwt authenticated request', async () => {
        const response = await request(app.getHttpServer())
          .get('/protected')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200)

        const data = response.body.data
        // add assertions that reflect your test data
        // expect(data).toHaveLength(3) 
      })
    })
  })
});
