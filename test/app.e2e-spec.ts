import request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { testModule, usePipes } from './test.module';

const smartAccountUrl = '/wallet/smart-account';
const sendUserOperationUrl = '/wallet/send-op';

describe('Wallet controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await testModule.compile();
    app = moduleFixture.createNestApplication();
    usePipes(app);
    await app.init();
  });

  describe('Create smart account', () => {
    it('/wallet/smart-account (POST) - success', () => {
      return request(app.getHttpServer())
        .post(smartAccountUrl)
        .expect(201)
        .expect((res) => {
          expect(res.body.smartAccountAddress).not.toBeNull;
        });
    });
  });

  describe('Send user operation', () => {
    it('/wallet/send-op (POST) - success', () => {
      return request(app.getHttpServer())
        .post(sendUserOperationUrl)
        .expect(201)
        .expect((res) => {
          expect(res.body.uoHash).not.toBeNull;
          expect(res.body.txHash).not.toBeNull;
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
