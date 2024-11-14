import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersEvents } from '../models/models';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([UsersEvents])
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {
  configure() {
  }
}
