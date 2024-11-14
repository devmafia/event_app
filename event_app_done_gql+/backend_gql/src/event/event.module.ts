import { Module } from '@nestjs/common';
import { EventsService } from './event.service';
import { EventResolver } from './event.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Events, Seats } from '../models/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Events, Seats]),
  ],
  providers: [EventsService, EventResolver]
})
export class EventModule {}
