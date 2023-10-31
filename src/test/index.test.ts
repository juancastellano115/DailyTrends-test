import request from 'supertest';
import { App } from '@/app';
import { IndexRoute } from '@routes/index.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

// Mock queues
jest.mock('@/queues/scraper.queue', () => ({
  scraperElMundoQueue: {
    name: 'scraper-el-mundo',
    add: jest.fn(),
  },
  scraperElPaisQueue: {
    name: 'scraper-el-pais',
    add: jest.fn(),
  },
}));

// Mock redis
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
  })),
}));

// Mock mongoose methods
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  set: jest.fn(),
  model: jest.fn().mockReturnValue({
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    deleteMany: jest.fn(),
    deleteOne: jest.fn(),
    updateMany: jest.fn(),
    updateOne: jest.fn(),
  }),
}));

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      const indexRoute = new IndexRoute();
      const app = new App([indexRoute]);

      return request(app.getServer()).get(`${indexRoute.path}`).expect(200);
    });
  });
});
