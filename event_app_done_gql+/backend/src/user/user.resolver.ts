import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
// import { CreateUserDto } from '../dtos/user.dto';
import { UserEvent } from '../dtos/models.dtos';
import { UserResponse } from '../dtos/user.dto';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserAuthGuard)
  @Query(() => UserEvent, { name: 'getUserdata' })
  async getUserdata(@Args('userId', { type: () => Int }) userId: number): Promise<UserEvent> {
    return this.userService.getUserById(userId);
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => UserResponse)
  async updateUsername(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('username') username: string,
  ): Promise<UserResponse> {
    return this.userService.updateUsername(userId, username);
  }
  @UseGuards(UserAuthGuard)
  @Mutation(() => UserResponse)
  async updateEmail(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('email') email: string,
  ): Promise<UserResponse> {
    return this.userService.updateEmail(userId, email);
  }
  @UseGuards(UserAuthGuard)
  @Mutation(() => UserResponse)
  async updatePassword(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('password') password: string,
  ): Promise<UserResponse> {
    return this.userService.updatePassword(userId, password);
  }
  @UseGuards(UserAuthGuard)
  @Mutation(() => UserResponse)
  async deleteUser(@Args('userId', { type: () => Int }) userId: number): Promise<UserResponse> {
    return this.userService.deleteUser(userId);
  }
}
