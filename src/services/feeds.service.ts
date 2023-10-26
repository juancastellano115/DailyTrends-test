import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Feed } from '@/interfaces/feed.interface';
import { FeedModel } from '@/models/feeds.model';

@Service()
export class FeedService {
  public async findAllFeeds(): Promise<void> {
    // TODO: implement method
  }

  public async findFeedById(): Promise<void> {
    // TODO: implement method
  }

  public async createFeed(): Promise<void> {
    // TODO: implement method
  }

  public async updateFeed(): Promise<void> {
    // TODO: implement method
  }
}
