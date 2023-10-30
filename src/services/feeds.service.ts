import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Feed } from '@/interfaces/feed.interface';
import FeedModel from '@/models/feed.model';

@Service()
export class FeedService {
  feed: FeedModel;
  constructor() {
    this.feed = new FeedModel();
  }

  /**
   * Finds all feeds with optional pagination.
   * @param skip - The number of feeds to skip.
   * @param limit - The maximum number of feeds to return.
   * @returns A promise that resolves to an array of feeds.
   */
  public async findAllFeeds(skip = 0, limit = 100): Promise<Feed[]> {
    const feeds: Feed[] = await this.feed.findAll(skip, limit);
    return feeds;
  }

  /**
   * Finds a feed by its ID.
   * @param feedId - The ID of the feed to find.
   * @returns A promise that resolves to the found feed.
   * @throws HttpException if the feed doesn't exist.
   */
  public async findFeedById(feedId: string): Promise<Feed> {
    const findFeed: Feed = await this.feed.findById(feedId);
    if (!findFeed) throw new HttpException(409, "Feed doesn't exist");

    return findFeed;
  }

  /**
   * Creates a new feed.
   * @param feedData - The data for the new feed.
   * @returns A promise that resolves to the created feed.
   */
  public async createFeed(feedData: Feed): Promise<Feed> {
    const createFeedData: Feed = await this.feed.create({ ...feedData });

    return createFeedData;
  }

  /**
   * Updates a feed by its ID.
   * @param feedId - The ID of the feed to update.
   * @param feedData - The updated data for the feed.
   * @returns A promise that resolves to the updated feed.
   * @throws HttpException if the feed doesn't exist.
   */
  public async updateFeed(feedId: string, feedData: Feed): Promise<Feed> {
    const updateFeedById: Feed = await this.feed.updateById(feedId, { ...feedData });
    if (!updateFeedById) throw new HttpException(409, "Feed doesn't exist");

    return updateFeedById;
  }

  /**
   * Deletes a feed by its ID.
   * @param feedId - The ID of the feed to delete.
   * @returns A promise that resolves to the deleted feed.
   * @throws HttpException if the feed doesn't exist.
   */
  public async deleteFeed(feedId: string): Promise<Feed> {
    const deleteFeedById: Feed = await this.feed.deleteById(feedId);
    if (!deleteFeedById) throw new HttpException(409, "Feed doesn't exist");

    return deleteFeedById;
  }
}
