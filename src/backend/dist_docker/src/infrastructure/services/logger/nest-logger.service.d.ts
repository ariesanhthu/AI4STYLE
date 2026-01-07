import { ILoggerService } from '@/shared/interfaces';
export declare class NestLoggerService implements ILoggerService {
    private logger;
    constructor(context?: string);
    setContext(context: string): void;
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
}
