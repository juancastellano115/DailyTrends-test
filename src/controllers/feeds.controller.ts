import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Feed } from '@/interfaces/feed.interface';
import { FeedService } from '@/services/feeds.service';
import { getCache, REDIS_EXPIRATION_TIME } from '@/lib/cache.lib';
import { RedisClientType } from 'redis';

/**
 * Controller for handling feed-related HTTP requests.
 */
export class FeedController {
  public feedService = Container.get(FeedService);
  private cache: RedisClientType;
  constructor() {
    (async () => {
      this.cache = await getCache();
    })();
  }

  /**
   * Get all feeds.
   * @route GET /feeds
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing an array of feeds and a message.
   */
  public getFeeds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { skip, limit } = req.body;
      const requestId = `all-s${skip}-l${limit}`;
      const cachedFeeds = await this.cache.get(requestId);
      if (cachedFeeds) {
        const parsedData = JSON.parse(cachedFeeds);
        return res.status(200).json({ data: parsedData, message: 'cached-findAll' });
      }
      const findAllFeedsData: Feed[] = await this.feedService.findAllFeeds(skip, limit);
      await this.cache.setEx(requestId, REDIS_EXPIRATION_TIME, JSON.stringify(findAllFeedsData));
      res.status(200).json({ data: findAllFeedsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a feed by ID.
   * @route GET /feeds/:id
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing a feed and a message.
   */
  public getFeedById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feedId: string = req.params.id;
      const cachedFeed = await this.cache.get(feedId);
      if (cachedFeed) {
        const parsedData = JSON.parse(cachedFeed);
        return res.status(200).json({ data: parsedData, message: 'cached-findOne' });
      }
      const findOneFeedData: Feed = await this.feedService.findFeedById(feedId);
      if (!findOneFeedData) {
        return res.status(404).json({ message: 'Feed not found' });
      }
      await this.cache.setEx(feedId, REDIS_EXPIRATION_TIME, JSON.stringify(findOneFeedData));
      res.status(200).json({ data: findOneFeedData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
  /**
   * Create a new feed.
   * @route POST /feeds
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the created feed and a message.
   */
  public createFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feedData: Feed = req.body;
      const createFeedData: Feed = await this.feedService.createFeed(feedData);

      res.status(201).json({ data: createFeedData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a feed by ID.
   * @route PUT /feeds/:id
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the updated feed and a message.
   */
  public updateFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feedId: string = req.params.id;
      const FeedData: Feed = req.body;
      const updateFeedData: Feed = await this.feedService.updateFeed(feedId, FeedData);

      res.status(200).json({ data: updateFeedData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a feed by ID.
   * @route DELETE /feeds/:id
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the deleted feed and a message.
   */
  public deleteFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feedId: string = req.params.id;
      const deleteFeedData: Feed = await this.feedService.deleteFeed(feedId);

      res.status(200).json({ data: deleteFeedData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
