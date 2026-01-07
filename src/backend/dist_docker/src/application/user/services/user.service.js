"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const exceptions_1 = require("../../../core/user/exceptions");
const helpers_1 = require("../../../shared/helpers");
const enums_1 = require("../../../shared/enums");
class UserService {
    userRepository;
    logger;
    constructor(userRepository, logger) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.logger.setContext(UserService.name);
    }
    async getListOfUsers(query) {
        if (query.search) {
            query.search = (0, helpers_1.buildSearchString)(query.search);
        }
        try {
            if (!query.limit)
                query.limit = 10;
            if (!query.sortOrder)
                query.sortOrder = enums_1.ESortOrder.DESC;
            query.limit += 1;
            const data = await this.userRepository.findAll(query, { includeRole: true });
            const nextCursor = data.length === query.limit ? data[data.length - 1].id : null;
            if (nextCursor) {
                data.pop();
            }
            return {
                items: data.map((user) => user.toJSON()),
                nextCursor,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get list of users: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getUserProfile(id) {
        try {
            const user = await this.userRepository.findById(id, { includeRole: true });
            if (!user) {
                throw new exceptions_1.UserNotFoundException(id);
            }
            return user.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to get user profile by id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateProfile(userId, body) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.UserNotFoundException(userId);
            }
            Object.assign(user, body);
            user.search = (0, helpers_1.buildSearchString)(user.name, user.email, user.phone);
            user.updatedAt = new Date();
            return this.userRepository.update(user);
        }
        catch (error) {
            this.logger.error(`Failed to update user profile for id ${userId}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteUser(userId) {
        const user = await this.userRepository.findById(userId, { includeRole: true });
        if (!user) {
            throw new exceptions_1.UserNotFoundException(userId);
        }
        if (user.role?.type === enums_1.EUserType.ADMIN) {
            throw new exceptions_1.RootAdminCannotBeDeletedException();
        }
        const result = await this.userRepository.delete(user.id);
        return { success: result };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map