
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingsService } from './booking.service';
import { BookingsResolver } from './booking.resolver';
import {Bookings, Events, Seats, BookingSeats, BookingEvents } from '../models/models';


@Module({
  imports: [
    SequelizeModule.forFeature([Bookings, Events, Seats, BookingSeats, BookingEvents]),
  ],
  providers: [BookingsService, BookingsResolver],
})
export class BookingModule {}
