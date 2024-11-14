import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { Bookings } from '../models/models';
import { CreateBookingDto } from '../dtos/dtos.dto';

@Resolver(() => Bookings)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Query(() => [Bookings])
  async getBookings(
    @Args('eventId', { nullable: true }) eventId?: number,
    @Args('userId', { nullable: true }) userId?: number,
  ) {
    return this.bookingsService.getBookings(eventId, userId);
  }

  @Mutation(() => Bookings)
  async bookEvents(@Args('createBookingDto') createBookingDto: CreateBookingDto) {
    return this.bookingsService.bookEvents(createBookingDto);
  }

  @Mutation(() => Boolean)
  async deleteBooking(@Args('bookingId') bookingId: number) {
    return this.bookingsService.deleteBooking(bookingId);
  }
}
