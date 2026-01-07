export declare class RoleException extends Error {
    constructor(message: string);
}
export declare class RoleNotFoundException extends RoleException {
    constructor(identifier?: string);
}
export declare class RoleUpdateException extends RoleException {
    constructor(message: string);
}
export declare class RoleDeletionException extends RoleException {
    constructor(message: string);
}
export declare class RoleAlreadyExistsException extends RoleException {
    constructor(name: string);
}
export declare class RoleRootAdminCannotBeDeletedException extends RoleException {
    constructor();
}
export declare class RoleRootAdminCannotBeUpdatedException extends RoleException {
    constructor();
}
export declare class RoleGuestCannotBeDeletedException extends RoleException {
    constructor();
}
export declare class RoleGuestCannotBeUpdatedException extends RoleException {
    constructor();
}
