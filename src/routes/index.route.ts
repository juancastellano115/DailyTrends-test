import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

export class IndexRoute implements Routes {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res) => {
      res.send('Hello Muchosol!');
    });
  }
}
