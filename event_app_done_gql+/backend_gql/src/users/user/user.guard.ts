import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly secret = process.env.USER_SECRET_KEY;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      const decoded = jwt.verify(token, this.secret) as { [key: string]: any };
      if (decoded) {
        return true;
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
