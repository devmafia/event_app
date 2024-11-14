import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBookingDto } from '../dtos/dtos.dto';
import { Bookings, Events, Seats, BookingEvents, BookingSeats } from '../models/models';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Bookings) private readonly bookingModel: typeof Bookings,
    @InjectModel(Events) private readonly eventModel: typeof Events,
    @InjectModel(Seats) private readonly seatModel: typeof Seats,
    @InjectModel(BookingSeats) private readonly bookingSeatModel: typeof BookingSeats,
    @InjectModel(BookingEvents) private readonly bookingEventModel: typeof BookingEvents,
  ) {}

  async getBookings(eventId?: number, userId?: number): Promise<Bookings[]> {
    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (userId) where.userId = userId;

    return this.bookingModel.findAll({
      where,
      include: [{ model: Events, as: 'events' }, { model: Seats, as: 'seats' }],
    });
  }

  async bookEvents(createBookingDto: CreateBookingDto): Promise<Bookings> {
    const { userId, events, guestName, guestEmail, phone } = createBookingDto;
    const transaction = await this.bookingModel.sequelize.transaction();

    try {
      const booking = await this.bookingModel.create(
        { userId, guestName, guestEmail, phone, totalPrice: 0 },
        { transaction },
      );

      let totalPrice = 0;

      for (const { eventId, seats } of events) {
        const event = await this.eventModel.findByPk(eventId, { transaction });
        if (!event || event.availableSeats < seats.length) {
          throw new Error(`Insufficient seats for event ${eventId}`);
        }

        for (const seatId of seats) {
          const seat = await this.seatModel.findByPk(seatId, { transaction });
          if (!seat || seat.isBooked) {
            throw new Error(`Seat ${seatId} is already booked`);
          }

          seat.isBooked = true;
          await seat.save({ transaction });
        }

        event.availableSeats -= seats.length;
        await event.save({ transaction });

        await this.bookingEventModel.create({ bookingId: booking.id, eventId }, { transaction });

        for (const seatId of seats) {
          await this.bookingSeatModel.create({ bookingId: booking.id, seatId, eventId }, { transaction });
        }

        totalPrice += parseFloat(event.price) * seats.length;
      }

      booking.totalPrice = totalPrice;
      await booking.save({ transaction });

      await transaction.commit();
      return booking;
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error booking events');
    }
  }

  async deleteBooking(bookingId: number): Promise<boolean> {
    const transaction = await this.bookingModel.sequelize.transaction();

    try {
      const booking = await this.bookingModel.findByPk(bookingId, {
        include: [
          {
            model: Seats,
            through: { attributes: [] },
          },
          {
            model: Events,
            through: { attributes: [] },
          }
        ],
        transaction,
      });

      if (!booking) throw new NotFoundException('Booking not found');

      const eventIds = booking.events.map(event => event.id);
      const seatCountByEvent: { [key: number]: number } = {};

      for (const seat of booking.seats) {
        await this.seatModel.update({ isBooked: false }, { where: { id: seat.id }, transaction });
        const eventId = seat.eventId;
        seatCountByEvent[eventId] = (seatCountByEvent[eventId] || 0) + 1;
      }

      for (const eventId of eventIds) {
        if (seatCountByEvent[eventId]) {
          const event = await this.eventModel.findByPk(eventId, { transaction });
          if (event) {
            event.availableSeats += seatCountByEvent[eventId];
            await event.save({ transaction });
          }
        }
      }

      await this.bookingEventModel.destroy({ where: { bookingId }, transaction });
      await this.bookingSeatModel.destroy({ where: { bookingId }, transaction });
      await this.bookingModel.destroy({ where: { id: bookingId }, transaction });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error deleting booking');
    }
  }
}
