import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, GetUserDto } from '../dtos/dtos.dto';
import { UsersEvents } from '../models/models';
import { UserGuard } from './user/user.guard';

@Resolver(() => UsersEvents)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UsersEvents)
  @UseGuards(UserGuard)
  async getUser(@Args('getUserData') getUserDto: GetUserDto) {
    return this.usersService.getUserById(getUserDto);
  }

  @Mutation(() => UsersEvents)
  async createUser(
    @Args('createUserData') createUserDto: CreateUserDto,
  ) {
    return this.usersService.createUser(createUserDto);
  }

  @Mutation(() => UsersEvents)
  @UseGuards(UserGuard)
  async updateUserName(
    @Args('id') id: number,
    @Args('updateUserData') updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Mutation(() => UsersEvents)
  @UseGuards(UserGuard)
  async updateUserEmail(
    @Args('id') id: number,
    @Args('updateUserData') updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Mutation(() => UsersEvents)
  @UseGuards(UserGuard)
  async updateUserPassword(
    @Args('id') id: number,
    @Args('updateUserData') updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Mutation(() => Boolean)
  @UseGuards(UserGuard)
  async deleteUser(@Args('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
