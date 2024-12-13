import { Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import { UserService } from './user.service';
// import { CreateUserDto } from '../dtos/user.dto';
// import { UserEvent } from '../dtos/models.dtos';
import { DeleteUserDto, UserResponse } from '../dtos/user.dto';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UpdateUsernameInput, UpdateEmailInput, UpdatePasswordInput } from '../dtos/user.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserAuthGuard)
  @Query(() => UserResponse)
  async getUserdata(@Args('userId', { type: () => Int }) userId: number): Promise<UserResponse> {
    const user = this.userService.getUserById(userId);
    return user;
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => UserResponse)
  async updateUsername(
    @Args('variables') variables: UpdateUsernameInput
  ): Promise<UserResponse> {
    const { id, username } = variables;
    return this.userService.updateUsername(id, username);
  }

  // @UseGuards(UserAuthGuard)
  @Mutation(() => UserResponse)
  async updateEmail(
    @Args('variables') variables: UpdateEmailInput
  ): Promise<UserResponse> {
    const { id, email } = variables;
    return this.userService.updateEmail(id, email);
  }

  // @UseGuards(UserAuthGuard)
  @Mutation(() => Boolean)
  async updatePassword(
    @Args('variables') variables: UpdatePasswordInput): Promise<boolean> {
    const { id, password } = variables;
    return this.userService.updatePassword(id, password);
  }
  // @UseGuards(UserAuthGuard)
  @Mutation(() => Boolean)
  async deleteUser(@Args('variables') variables: DeleteUserDto): Promise<boolean> {
    const { userId }= variables;
    return this.userService.deleteUser(userId);
  }
}
