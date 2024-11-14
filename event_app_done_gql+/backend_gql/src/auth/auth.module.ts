import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersEvents, Administrator } from '../models/models';

@Module({
  imports: [
    SequelizeModule.forFeature([UsersEvents, Administrator]),
    JwtModule.register({}),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
