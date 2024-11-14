import { Injectable } from '@nestjs/common';
import { UsersEvents } from '../models/models';
import { CreateUserDto, UpdateUserDto, GetUserDto } from '../dtos/dtos.dto';

@Injectable()
export class UsersService {
  async getUserById(getUserDto: GetUserDto): Promise<UsersEvents> {
    const { id } = getUserDto;
    return UsersEvents.findByPk(id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UsersEvents> {
    const { username, email, password } = createUserDto;
    const user = await UsersEvents.create({ username, email, password });
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UsersEvents> {
    const updatedUser = await UsersEvents.update(updateUserDto, { where: { id } });
    if (updatedUser[0] === 0) {
      throw new Error('User not found');
    }
    return UsersEvents.findByPk(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await UsersEvents.destroy({ where: { id } });
    return result > 0;
  }
}
