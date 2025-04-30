import { type FastifyRequest } from 'fastify';
import { decode } from 'jsonwebtoken';
import { JwtReadDto, JwtReadSchema } from '@/dto';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTHORIZATION_HEADER } from '@/constants';

export const GetAccessToken = createParamDecorator<undefined, JwtReadDto>(
  (
    _: unknown,
    ctx: ExecutionContext,
  ) => {
    const request = ctx
      .switchToHttp()
      .getRequest<FastifyRequest>();


    const header = request.headers[AUTHORIZATION_HEADER];  
    const token = header?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException();
    }

    const decodedToken = decode(token);
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new UnauthorizedException();
    }

    const validatedToken = JwtReadSchema.safeParse(decodedToken);
    if (!validatedToken.success) {
      throw new UnauthorizedException();
    }

    return validatedToken.data;
  },
);
