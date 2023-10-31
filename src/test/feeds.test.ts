import bcrypt from 'bcrypt';
import request from 'supertest';
import { App } from '@/app';
import { CreateFeedDto } from '@dtos/feed.dto';
import { FeedRoute } from '@routes/feeds.route';

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

describe('Testing Feeds', () => {
  describe('[GET] /feeds', () => {
    it('response findAll Feeds', async () => {
      const feedsRoute = new FeedRoute();
      const feeds = feedsRoute.feed.feedService;

      feeds.findAllFeeds = jest.fn().mockReturnValue([
        {
          _id: 'qpwoeiruty',
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          _id: 'alskdjfhg',
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          _id: 'zmxncbv',
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      const app = new App([feedsRoute]);
      return request(app.getServer()).get(`${feedsRoute.path}`).expect(200);
    });
  });

  describe('[GET] /feeds/:id', () => {
    it('response findOne Feed', async () => {
      const feedId = 'qpwoeiruty';

      const feedsRoute = new FeedRoute();
      const feeds = feedsRoute.feed.feedService;

      feeds.findFeedById = jest.fn().mockReturnValue({
        _id: 'qpwoeiruty',
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([feedsRoute]);
      return request(app.getServer()).get(`${feedsRoute.path}/${feedId}`).expect(200);
    });
  });

  describe('[POST] /feeds', () => {
    it('response Create Feed', async () => {
      const feedData: CreateFeedDto = {
        heading: 'test',
        subHeading: 'test',
        author: 'test',
        link: 'test',
        image: 'test',
        provider: 'test',
      };

      const feedsRoute = new FeedRoute();
      const feeds = feedsRoute.feed.feedService;

      feeds.findFeedById = jest.fn().mockReturnValue(null);
      feeds.createFeed = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        ...feedData,
      });

      const app = new App([feedsRoute]);
      return request(app.getServer()).post(`${feedsRoute.path}`).send(feedData).expect(201);
    });
  });

  describe('[PUT] /feeds/:id', () => {
    it('response Update Feed', async () => {
      const feedId = '60706478aad6c9ad19a31c84';
      const feedData: CreateFeedDto = {
        heading: 'test-update',
        subHeading: 'test-update',
        author: 'test-update',
        link: 'test-update',
        image: 'test-update',
        provider: 'test-update',
      };

      const feedsRoute = new FeedRoute();
      const feeds = feedsRoute.feed.feedService;

      feeds.updateFeed = jest.fn().mockReturnValue(feedData);

      const app = new App([feedsRoute]);
      return request(app.getServer()).put(`${feedsRoute.path}/${feedId}`).send(feedData);
    });
  });

  describe('[DELETE] /feeds/:id', () => {
    it('response Delete Feed', async () => {
      const feedId = '60706478aad6c9ad19a31c84';

      const feedsRoute = new FeedRoute();
      const feeds = feedsRoute.feed.feedService;

      feeds.deleteFeed = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        heading: 'test-delete',
        subHeading: 'test-delete',
        author: 'test-delete',
        link: 'test-delete',
        image: 'test-delete',
        provider: 'test-delete',
      });

      const app = new App([feedsRoute]);
      return request(app.getServer()).delete(`${feedsRoute.path}/${feedId}`).expect(200);
    });
  });
});
