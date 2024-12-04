import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from "../dtos/event.dto"

@Controller('admin')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const { image, ...eventData } = createEventDto;

    return this.eventsService.createEvent(eventData, image);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const { image, ...eventData } = updateEventDto;

    return this.eventsService.updateEvent(id, eventData, image);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
