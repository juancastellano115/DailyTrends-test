import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Feed } from '@/interfaces/feed.interface';
import { FeedService } from '@/services/feeds.service';

export class FeedController {
  public feed = Container.get(FeedService);

  // TODO: Implement controller CRUD methods
}
