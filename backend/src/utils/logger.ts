import morgan from 'morgan';
import { Request, Response } from 'express';

morgan.token('message', (_req: Request, res: Response) => res.locals.errorMessage || '');

export const successHandler = morgan(
  ':method :url :status - :response-time ms',
  {
    skip: (_req: Request, res: Response) => res.statusCode >= 400,
  }
);

export const errorHandler = morgan(
  ':method :url :status - :response-time ms - message: :message',
  {
    skip: (_req: Request, res: Response) => res.statusCode < 400,
  }
);