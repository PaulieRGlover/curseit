import { UserDto } from '@/dto';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { type FastifyRequest } from 'fastify';

type DecoratorData = keyof UserDto | undefined;
type DecoratorOutput = UserDto | UserDto[keyof UserDto];

export const GetUser = createParamDecorator<DecoratorData, DecoratorOutput>(
  (
    data,
    ctx: ExecutionContext,
  ) => {
    const request = ctx
      .switchToHttp()
      .getRequest<FastifyRequest>();

    if (!request.user) {
      throw new UnauthorizedException();
    }

    return data ? request.user[data] : request.user;
  },
);
