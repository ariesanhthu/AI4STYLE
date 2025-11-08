import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class LoggerResponseTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger('ResponseTime');
    const startTime = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      logger.debug(`[${req.method}] ${req.url} - ${responseTime}ms`);
    });
    next();
  }
}