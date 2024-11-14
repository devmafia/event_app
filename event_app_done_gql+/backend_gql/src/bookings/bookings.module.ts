import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bookings, Events, Seats, BookingSeats, BookingEvents } from '../models/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Bookings, Events, Seats, BookingSeats, BookingEvents]),
  ],
  providers: [BookingsService, BookingsResolver]
})
export class BookingsModule {}
