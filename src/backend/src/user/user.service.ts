import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "./repositories/user.repository.interface";
import { GetListUserDto, UpdateUserProfileDto } from "./dtos";

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async getListOfUsers(query: GetListUserDto) {
    return this.userRepository.findAll(query);
  }

  async getUserProfile(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user.toJSON();
  }

  async updateProfile(userId: string, body: UpdateUserProfileDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    Object.assign(user, body);
    return this.userRepository.update(user);
  }
}