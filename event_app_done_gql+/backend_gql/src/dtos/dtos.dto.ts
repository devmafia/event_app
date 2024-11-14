import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsInt, IsPositive, IsNumber, IsDate} from 'class-validator';
import { Type } from 'class-transformer';

// userDtos
@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string;
}

@InputType()
export class GetUserDto {
  @Field()
  @IsInt()
  @IsPositive()
  id: number;
}

// authDtos
@InputType()
export class RegisterDto {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class LoginAdminDto {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  password: string;
}

// eventDtos

@InputType()
export class CreateEventDto {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @Field()
  @IsString()
  category: string;

  @Field()
  @IsString()
  price: string;

  @Field()
  @IsString()
  place: string;

  @Field()
  @IsNumber()
  availableSeats: number;
}

@InputType()
export class UpdateEventDto {
  @Field()
  @IsString()
  title?: string;

  @Field()
  @IsString()
  description?: string;

  @Field()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @Field()
  @IsString()
  category?: string;

  @Field()
  @IsString()
  price?: string;

  @Field()
  @IsString()
  place?: string;

  @Field()
  @IsNumber()
  availableSeats?: number;

  @Field()
  @IsString()
  image?: string;

  @Field()
  @IsString()
  protocol: string;

  @Field()
  @IsString()
  host? : string;

}

// bookingDto

@InputType()
export class CreateBookingDto {
  @Field()
  userId: number;

  @Field(() => [EventSeatsInput])
  events: EventSeatsInput[];

  @Field()
  guestName: string;

  @Field()
  guestEmail: string;

  @Field()
  phone: string;
}

@InputType()
class EventSeatsInput {
  @Field()
  eventId: number;

  @Field(() => [Number])
  seats: number[];
}
