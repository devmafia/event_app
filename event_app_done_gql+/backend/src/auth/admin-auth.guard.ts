import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = context.switchToHttp().getRequest().headers;
    const token = this.extractToken(gqlContext);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = this.configService.get<string>('ADMIN_SECRET_KEY');
      const decoded = jwt.verify(token, secret);
      context.switchToHttp().getRequest().admin = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired admin token');
      console.error(error);
    }
  }

  private extractToken(headers: any): string | null {
    const authHeader = headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
