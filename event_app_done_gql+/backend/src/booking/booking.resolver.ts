import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookingsService } from './booking.service';
import { CreateBookingDto, BookingDto } from '../dtos/booking.dto';

@Resolver()
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Query(() => [BookingDto])
  async getBookings(@Args('id', { nullable: true }) eventId?: number, @Args('userId', { nullable: true }) userId?: number) {
    return this.bookingsService.getBookings(eventId, userId);
  }

  @Mutation(() => BookingDto)
  async createBooking(@Args('input') createBookingInput: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingInput);
  }

  @Mutation(() => Boolean)
  async deleteBooking(@Args('id') bookingId: number) {
    await this.bookingsService.deleteBooking(bookingId);
    return true;
  }
}
