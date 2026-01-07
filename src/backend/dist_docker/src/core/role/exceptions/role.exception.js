"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleGuestCannotBeUpdatedException = exports.RoleGuestCannotBeDeletedException = exports.RoleRootAdminCannotBeUpdatedException = exports.RoleRootAdminCannotBeDeletedException = exports.RoleAlreadyExistsException = exports.RoleDeletionException = exports.RoleUpdateException = exports.RoleNotFoundException = exports.RoleException = void 0;
class RoleException extends Error {
    constructor(message) {
        super(message);
        this.name = 'RoleException';
    }
}
exports.RoleException = RoleException;
class RoleNotFoundException extends RoleException {
    constructor(identifier) {
        super(identifier ? `Role with identifier ${identifier} not found` : 'Role not found');
        this.name = 'RoleNotFoundException';
    }
}
exports.RoleNotFoundException = RoleNotFoundException;
class RoleUpdateException extends RoleException {
    constructor(message) {
        super(`Failed to update role: ${message}`);
        this.name = 'RoleUpdateException';
    }
}
exports.RoleUpdateException = RoleUpdateException;
class RoleDeletionException extends RoleException {
    constructor(message) {
        super(`Failed to delete role: ${message}`);
        this.name = 'RoleDeletionException';
    }
}
exports.RoleDeletionException = RoleDeletionException;
class RoleAlreadyExistsException extends RoleException {
    constructor(name) {
        super(`Role with name ${name} already exists`);
        this.name = 'RoleAlreadyExistsException';
    }
}
exports.RoleAlreadyExistsException = RoleAlreadyExistsException;
class RoleRootAdminCannotBeDeletedException extends RoleException {
    constructor() {
        super('Root admin cannot be deleted');
        this.name = 'RoleRootAdminCannotBeDeletedException';
    }
}
exports.RoleRootAdminCannotBeDeletedException = RoleRootAdminCannotBeDeletedException;
class RoleRootAdminCannotBeUpdatedException extends RoleException {
    constructor() {
        super('Root admin cannot be updated');
        this.name = 'RoleRootAdminCannotBeUpdatedException';
    }
}
exports.RoleRootAdminCannotBeUpdatedException = RoleRootAdminCannotBeUpdatedException;
class RoleGuestCannotBeDeletedException extends RoleException {
    constructor() {
        super('Guest cannot be deleted');
        this.name = 'RoleGuestCannotBeDeletedException';
    }
}
exports.RoleGuestCannotBeDeletedException = RoleGuestCannotBeDeletedException;
class RoleGuestCannotBeUpdatedException extends RoleException {
    constructor() {
        super('Guest cannot be updated');
        this.name = 'RoleGuestCannotBeUpdatedException';
    }
}
exports.RoleGuestCannotBeUpdatedException = RoleGuestCannotBeUpdatedException;
//# sourceMappingURL=role.exception.js.map