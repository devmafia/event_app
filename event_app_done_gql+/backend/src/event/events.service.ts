import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Events, Seats } from '../models/models';
import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { Event } from '../dtos/models.dtos';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events) private readonly eventModel: typeof Events,
    @InjectModel(Seats) private readonly seatModel: typeof Seats,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventModel.findAll({ include: [Seats] });
  }

  async getEventById(id: number): Promise<Events> {
    const event = await this.eventModel.findByPk(id, { include: [Seats] });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async createEvent(createEventDto: CreateEventDto, imagePath: string): Promise<Event> {
    const image = imagePath.replace(/\\/g, '/');
    const eventData = {...createEventDto, image};
    const event = await this.eventModel.create({
      ...eventData,
    });

    const seats = Array.from({ length: createEventDto.availableSeats }, (_, i) => ({
      eventId: event.id,
      seatNumber: `${i + 1}`,
      isBooked: false,
    }));
    await this.seatModel.bulkCreate(seats);

    return event;
  }

  async updateEvent(
    id: number,
    updateEventDto: Partial<UpdateEventDto>,
    imagePath?: string,
  ): Promise<Event> {
    const event = await this.getEventById(id);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (imagePath) {
      event.image = imagePath.replace(/\\/g, '/');
    }

    const { date, ...otherData } = updateEventDto;

    const updatedEventData = {
      id: id,
      ...otherData,
      date: date || event.date,
      image: event.image
    };

    await event.update(updatedEventData);

    return event;
  }

  async deleteEvent(id: number) {
    const event = await this.getEventById(id);
    await event.destroy();
    return true;
  }
}
