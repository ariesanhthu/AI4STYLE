import { GetListUserDto, UpdateUserProfileDto } from '../dtos';
import { type IUserRepository } from '@/core/user/interfaces';
import { ILoggerService } from '@/shared/interfaces';
import { UserNotFoundException } from '@/core/user/exceptions';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async getListOfUsers(query: GetListUserDto) {
    try {
      query.limit += 1;
      const data = await this.userRepository.findAll(query);
      const nextCursor =
        data.length === query.limit ? data[data.length - 1].id : null;
      if (nextCursor) {
        data.pop();
      }
      return {
        items: data.map((user) => user.toJSON()),
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get list of users: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUserProfile(id: string) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new UserNotFoundException(id);
      }
      return user.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get user profile by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateProfile(userId: string, body: UpdateUserProfileDto) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundException(userId);
      }

      Object.assign(user, body);
      user.updatedAt = new Date();
      return this.userRepository.update(user);
    } catch (error) {
      this.logger.error(
        `Failed to update user profile for id ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
