import { Router } from 'express';
import { CreateFeedDto } from '@/dtos/feed.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class IndexRoute implements Routes {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
   
    this.router.get(`${this.path}`, (req, res) => {
      res.send('Hello NextLane!');
    });
  }
}
