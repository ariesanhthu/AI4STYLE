"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldPasswordIncorrectException = exports.InvalidRefreshTokenException = exports.RoleNotFoundException = exports.UserNotFoundException = exports.InvalidOtpException = exports.InvalidCredentialsException = exports.EmailAlreadyRegisteredException = exports.AuthException = void 0;
class AuthException extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthException';
    }
}
exports.AuthException = AuthException;
class EmailAlreadyRegisteredException extends AuthException {
    constructor(email) {
        super(`Email ${email} is already registered`);
        this.name = 'EmailAlreadyRegisteredException';
    }
}
exports.EmailAlreadyRegisteredException = EmailAlreadyRegisteredException;
class InvalidCredentialsException extends AuthException {
    constructor() {
        super('Invalid email or password');
        this.name = 'InvalidCredentialsException';
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
class InvalidOtpException extends AuthException {
    constructor() {
        super('Invalid OTP');
        this.name = 'InvalidOtpException';
    }
}
exports.InvalidOtpException = InvalidOtpException;
class UserNotFoundException extends AuthException {
    constructor() {
        super('User not found');
        this.name = 'UserNotFoundException';
    }
}
exports.UserNotFoundException = UserNotFoundException;
class RoleNotFoundException extends AuthException {
    constructor() {
        super('Role not found');
        this.name = 'RoleNotFoundException';
    }
}
exports.RoleNotFoundException = RoleNotFoundException;
class InvalidRefreshTokenException extends AuthException {
    constructor() {
        super('Invalid refresh token');
        this.name = 'InvalidRefreshTokenException';
    }
}
exports.InvalidRefreshTokenException = InvalidRefreshTokenException;
class OldPasswordIncorrectException extends AuthException {
    constructor() {
        super('Old password is incorrect');
        this.name = 'OldPasswordIncorrectException';
    }
}
exports.OldPasswordIncorrectException = OldPasswordIncorrectException;
//# sourceMappingURL=auth.exception.js.map