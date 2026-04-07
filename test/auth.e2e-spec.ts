import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'asdf3@asdf.com', password: '1234' })
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual('asdf3@asdf.com');
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'newSignUp@gmail.com';

    request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'alskdfjl' })
      .expect(201)
      .then(() => {
        request(app.getHttpServer())
          .get('/auth/whoami')
          .expect(200)
          .then((res) => {
            const { id, email } = res.body;
            expect(id).toBeDefined();
            expect(email).toEqual(email);
          });
      });
  });
});
