import { UserService } from '@/application/user/services/user.service';
import { BaseUserController } from './base-user.controller';
export declare class UserClientController extends BaseUserController {
    protected readonly userService: UserService;
    constructor(userService: UserService);
}
