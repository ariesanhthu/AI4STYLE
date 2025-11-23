export class UserException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserException';
  }
}

export class UserNotFoundException extends UserException {
  constructor(identifier: string) {
    super(`User with identifier ${identifier} not found`);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends UserException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}
