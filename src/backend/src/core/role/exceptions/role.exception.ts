export class RoleException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoleException';
  }
}

export class RoleNotFoundException extends RoleException {
  constructor(identifier?: string) {
    super(identifier ? `Role with identifier ${identifier} not found` : 'Role not found');
    this.name = 'RoleNotFoundException';
  }
}

export class RoleUpdateException extends RoleException {
  constructor(message: string) {
    super(`Failed to update role: ${message}`);
    this.name = 'RoleUpdateException';
  }
}

export class RoleDeletionException extends RoleException {
  constructor(message: string) {
    super(`Failed to delete role: ${message}`);
    this.name = 'RoleDeletionException';
  }
}

export class RoleAlreadyExistsException extends RoleException {
  constructor(name: string) {
    super(`Role with name ${name} already exists`);
    this.name = 'RoleAlreadyExistsException';
  }
}

export class RoleRootAdminCannotBeDeletedException extends RoleException {
  constructor() {
    super('Root admin cannot be deleted');
    this.name = 'RoleRootAdminCannotBeDeletedException';
  }
}

export class RoleRootAdminCannotBeUpdatedException extends RoleException {
  constructor() {
    super('Root admin cannot be updated');
    this.name = 'RoleRootAdminCannotBeUpdatedException';
  }
}

export class RoleGuestCannotBeDeletedException extends RoleException {
  constructor() {
    super('Guest cannot be deleted');
    this.name = 'RoleGuestCannotBeDeletedException';
  }
}

export class RoleGuestCannotBeUpdatedException extends RoleException {
  constructor() {
    super('Guest cannot be updated');
    this.name = 'RoleGuestCannotBeUpdatedException';
  }
}

