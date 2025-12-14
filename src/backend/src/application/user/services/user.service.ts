import { GetListUserDto, UpdateUserDto } from '../dtos';
import { type IUserRepository } from '@/core/user/interfaces';
import { ILoggerService } from '@/shared/interfaces';
import { RootAdminCannotBeDeletedException, UserNotFoundException } from '@/core/user/exceptions';
import { buildSearchString } from '@/shared/helpers';
import { ERole, ESortOrder, EUserType } from '@/shared/enums';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async getListOfUsers(query: GetListUserDto) {
    if (query.search) {
      query.search = buildSearchString(query.search);
    }
    try {
      if (!query.limit) query.limit = 10;
      if (!query.sortOrder) query.sortOrder = ESortOrder.DESC;
      query.limit += 1;
      const data = await this.userRepository.findAll(query, { includeRole: true });
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
      const user = await this.userRepository.findById(id, { includeRole: true });
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

  async updateProfile(userId: string, body: UpdateUserDto) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundException(userId);
      }

      Object.assign(user, body);
      user.search = buildSearchString(user.name, user.email, user.phone);
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

  async deleteUser (userId: string) {
    const user = await this.userRepository.findById(userId, { includeRole: true });
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    if (user.role?.type === EUserType.ADMIN) {
      throw new RootAdminCannotBeDeletedException();
    }
    const result = await this.userRepository.delete(user.id);
    return { success: result };
  }
}
