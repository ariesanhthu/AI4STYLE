export declare class UserException extends Error {
    constructor(message: string);
}
export declare class UserNotFoundException extends UserException {
    constructor(identifier: string);
}
export declare class UserAlreadyExistsException extends UserException {
    constructor(email: string);
}
export declare class RootAdminCannotBeDeletedException extends UserException {
    constructor();
}
