import { Resolver, Query, Mutation, Args, Int  } from '@nestjs/graphql';
import { EventsService } from './event.service';
import { Events } from '../models/models';
import { CreateEventDto, UpdateEventDto } from 'src/dtos/dtos.dto';

@Resolver(() => Events)
export class EventResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [Events])
  async getAllEvents() {
    return this.eventsService.findAll();
  }

  @Query(() => Events, { nullable: true })
  async getEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Events)
  async createEvent(@Args('createEventDto') createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Mutation(() => Events)
  async updateEvent(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateEventDto') updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Mutation(() => Boolean)
  async deleteEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.remove(id);
  }
}
