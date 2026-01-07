export declare class AuthException extends Error {
    constructor(message: string);
}
export declare class EmailAlreadyRegisteredException extends AuthException {
    constructor(email: string);
}
export declare class InvalidCredentialsException extends AuthException {
    constructor();
}
export declare class InvalidOtpException extends AuthException {
    constructor();
}
export declare class UserNotFoundException extends AuthException {
    constructor();
}
export declare class RoleNotFoundException extends AuthException {
    constructor();
}
export declare class InvalidRefreshTokenException extends AuthException {
    constructor();
}
export declare class OldPasswordIncorrectException extends AuthException {
    constructor();
}
