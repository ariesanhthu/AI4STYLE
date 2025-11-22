import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInterface } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserInterface;
  },
);
