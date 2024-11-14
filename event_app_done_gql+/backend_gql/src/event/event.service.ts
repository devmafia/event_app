import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Events, Seats } from "../models/models.js";
import fs from 'fs';
import path from 'path';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEventDto, UpdateEventDto } from 'src/dtos/dtos.dto.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events) private eventModel: typeof Events,
    @InjectModel(Seats) private seatModel: typeof Seats,
  ) {}

  async findAll(): Promise<Events[]> {
    try {
      return await this.eventModel.findAll({ include: [{ model: Seats, as: 'seats' }] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch events');
    }
  }

  async findOne(id: number): Promise<Events> {
    const event = await this.eventModel.findByPk(id, { include: [{ model: Seats, as: 'seats' }] });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Events> {
    try {
      const event = await this.eventModel.create(createEventDto);
      const seats = Array.from({ length: createEventDto.availableSeats }, (_, i) => ({
        eventId: event.id,
        seatNumber: `${i + 1}`,
        isBooked: false,
      }));

      await this.seatModel.bulkCreate(seats);

      return event;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Events> {
    const event = await this.findOne(id);

    if (updateEventDto.image) {
      if (event.image) {
        try {
          const oldImagePath = path.join(__dirname, '..', 'assets', path.basename(event.image));
          await fs.promises.unlink(oldImagePath);
          console.log('Old image deleted successfully');
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      event.image = `${updateEventDto.protocol}://${updateEventDto.host}/assets/${updateEventDto.image}`;
    }

    await event.update(updateEventDto);
    return event;
  }

  async remove(id: number): Promise<boolean> {
    const event = await this.findOne(id);

    if (event.image) {
      try {
        const imagePath = path.join(__dirname, '..', 'assets', path.basename(event.image));
        await fs.promises.unlink(imagePath);
        console.log('Image deleted successfully');
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await this.eventModel.destroy({ where: { id } });
    return true;
  }
}
