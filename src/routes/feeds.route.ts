import { Router } from 'express';
import { FeedController } from '@/controllers/feeds.controller';
import { CreateFeedDto } from '@/dtos/feed.dto';
import { GetFeedsDto } from '@/dtos/feed.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class FeedRoute implements Routes {
  public path = '/feeds';
  public router = Router();
  public feed = new FeedController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, ValidationMiddleware(GetFeedsDto), this.feed.getFeeds);
    this.router.get(`${this.path}/:id`, this.feed.getFeedById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateFeedDto), this.feed.createFeed);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(CreateFeedDto, true), this.feed.updateFeed);
    this.router.delete(`${this.path}/:id`, this.feed.deleteFeed);
  }
}
