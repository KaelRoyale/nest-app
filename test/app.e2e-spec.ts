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
});
