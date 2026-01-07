"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootAdminCannotBeDeletedException = exports.UserAlreadyExistsException = exports.UserNotFoundException = exports.UserException = void 0;
class UserException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserException';
    }
}
exports.UserException = UserException;
class UserNotFoundException extends UserException {
    constructor(identifier) {
        super(`User with identifier ${identifier} not found`);
        this.name = 'UserNotFoundException';
    }
}
exports.UserNotFoundException = UserNotFoundException;
class UserAlreadyExistsException extends UserException {
    constructor(email) {
        super(`User with email ${email} already exists`);
        this.name = 'UserAlreadyExistsException';
    }
}
exports.UserAlreadyExistsException = UserAlreadyExistsException;
class RootAdminCannotBeDeletedException extends UserException {
    constructor() {
        super('Root admin cannot be deleted');
        this.name = 'RootAdminCannotBeDeletedException';
    }
}
exports.RootAdminCannotBeDeletedException = RootAdminCannotBeDeletedException;
//# sourceMappingURL=user.exception.js.map