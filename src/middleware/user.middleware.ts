import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  private readonly jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (token) {
      try {
        const decoded = jwt.verify(token, this.jwtSecret); // Decode the token
        req['user'] = decoded; // Attach the user data to the request
      } catch (error) {
        return res.status(401).json({
          message: 'Unauthorized on user middleware',
          error: (error as Error).message,
        });
      }
    }
    next();
  }
}
