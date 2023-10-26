import { Router } from 'express';
import { FeedController } from '@/controllers/feeds.controller';
import { CreateFeedDto } from '@/dtos/feed.dto';
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
    // TODO: Implement route CRUD methods
  }
}
