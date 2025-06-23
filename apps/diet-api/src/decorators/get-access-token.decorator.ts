import { type FastifyRequest } from 'fastify';
import { decode } from 'jsonwebtoken';
import { JwtReadDto, JwtReadSchema } from '@/dto';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTHORIZATION_HEADER } from '@/constants';
import { Nullable } from '@curseit/types';

export const GetAccessToken = createParamDecorator<boolean, Nullable<JwtReadDto>>(
  (
    throwOnNotFound = true,
    ctx: ExecutionContext,
  ) => {
    const request = ctx
      .switchToHttp()
      .getRequest<FastifyRequest>();


    const header = request.headers[AUTHORIZATION_HEADER];  
    const token = header?.replace('Bearer ', '');
    if (!token && throwOnNotFound) {
      throw new UnauthorizedException();
    } else if (!token) {
      return null;
    }

    const decodedToken = decode(token);
    const hasToken = decodedToken && typeof decodedToken !== 'string';
    if (!hasToken && throwOnNotFound) {
      throw new UnauthorizedException();
    } else if (!hasToken) {
      return null;
    }

    const validatedToken = JwtReadSchema.safeParse(decodedToken);
    if (!validatedToken.success && throwOnNotFound) {
      throw new UnauthorizedException();
    } else if (!validatedToken.success) {
      return null;
    }

    return validatedToken.data;
  },
);
