import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[HTTP] ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
      console.log(`[HTTP] ${res.statusCode} ${req.method} ${req.originalUrl}`);
    });

    next();
  }
}
