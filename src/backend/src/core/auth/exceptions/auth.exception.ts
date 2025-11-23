export class AuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthException';
  }
}

export class EmailAlreadyRegisteredException extends AuthException {
  constructor(email: string) {
    super(`Email ${email} is already registered`);
    this.name = 'EmailAlreadyRegisteredException';
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsException';
  }
}

export class InvalidOtpException extends AuthException {
  constructor() {
    super('Invalid OTP');
    this.name = 'InvalidOtpException';
  }
}

export class UserNotFoundException extends AuthException {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundException';
  }
}

export class RoleNotFoundException extends AuthException {
  constructor() {
    super('Role not found');
    this.name = 'RoleNotFoundException';
  }
}

export class InvalidRefreshTokenException extends AuthException {
  constructor() {
    super('Invalid refresh token');
    this.name = 'InvalidRefreshTokenException';
  }
}

export class OldPasswordIncorrectException extends AuthException {
  constructor() {
    super('Old password is incorrect');
    this.name = 'OldPasswordIncorrectException';
  }
}
