import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ObjectType, Field , InputType} from '@nestjs/graphql';
import { UserEvent } from './models.dtos';

@InputType()
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
@InputType()
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

@ObjectType()
export class UserResponse {
  @Field()
  message: string;

  @Field(() => UserEvent, { nullable: true })
  user?: UserEvent;
}
