import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ApiPaths } from '../src/common/constants/api-paths.constant';
import { TransformResponseInterceptor } from '../src/common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Healthcheck (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(ApiPaths.GLOBAL_PREFIX);
    app.useGlobalInterceptors(new TransformResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/api/v1/health (GET) returns HTTP 200 with standard envelope', async () => {
    const response = await request(app.getHttpServer())
      .get(`/${ApiPaths.GLOBAL_PREFIX}/${ApiPaths.HEALTH}`)
      .expect(200);

    expect(response.body).toEqual({
      code: 0,
      message: 'OK',
      data: {
        status: 'healthy',
      },
    });
  });
});
