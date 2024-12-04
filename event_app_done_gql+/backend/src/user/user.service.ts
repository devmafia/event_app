import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bookings, UsersEvents  } from '../models/models';
import { UserResponse } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UsersEvents) private readonly userModel: typeof UsersEvents,
    @InjectModel(Bookings) private readonly bookingsModel: typeof Bookings,
  ) {}

  async getUserById(userId: number): Promise<UsersEvents> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
  //   const { username, email, password } = createUserDto;
  //   const newUser = await this.userModel.create({ username, email, password });
  //   return { message: 'User created successfully', user: newUser };
  // }

  async updateUsername(userId: number, username: string): Promise<UserResponse> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.username = username;
    await user.save();
    return { message: 'Username updated successfully', user };
  }

  async updateEmail(userId: number, email: string): Promise<UserResponse> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.email = email;
    await user.save();
    return { message: 'Email updated successfully', user };
  }

  async updatePassword(userId: number, password: string): Promise<UserResponse> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = password;
    await user.save();
    return { message: 'Password updated successfully', user };
  }

  async deleteUser(userId: number): Promise<UserResponse> {
    try {
      await this.bookingsModel.destroy({ where: { userId } });
      const deletedUser = await this.userModel.destroy({ where: { id: userId } });
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
      console.error(error);
    }
  }
}
