import request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { testModule, usePipes } from './test.module';
// import { mockOrder } from './mock/order.mock';

const smartAccountUrl = '/wallet/smart-account';

describe('Wallet controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await testModule.compile();
    app = moduleFixture.createNestApplication();
    usePipes(app);
    await app.init();
  });

  describe('createSmartAccount', () => {
    it('/api/wallet/smart-account (POST) - success', () => {
      return request(app.getHttpServer())
        .post(smartAccountUrl)
        .expect(201)
        .expect((res) => {
          console.log(res.body);
          expect(res.body.smartAccountAddress).not.toBeNull;
        });
    });

    // it('/api/cryptocurrencies (GET) - failed 401', () => {
    //   return request(app.getHttpServer()).get(cryptocurrencies_url).expect(401);
    // });
  });

  // describe('create order', () => {
  //   it('/api/order (POST) - success', () => {
  //     return request(app.getHttpServer())
  //       .post(order_url)
  //       .set('Authorization', apiKey)
  //       .send(mockOrder)
  //       .expect(201)
  //       .expect((res) => {
  //         const data = res.body;
  //         expect(data).toHaveProperty('orderCode');
  //         expect(data).toHaveProperty('network');
  //         expect(data).toHaveProperty('crypto');
  //         expect(data).toHaveProperty('amount');
  //         expect(data).toHaveProperty('address');
  //         expect(data).toHaveProperty('imageAddress');
  //         expect(data).toHaveProperty('expirationDate');
  //       });
  //   });

  //   it('/api/order (POST) - failed 401', () => {
  //     return request(app.getHttpServer()).post(order_url).expect(401);
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
