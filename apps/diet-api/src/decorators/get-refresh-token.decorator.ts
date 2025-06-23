import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';

import { type FastifyRequest } from 'fastify';
import { decode } from 'jsonwebtoken';

import { JwtReadDto, JwtReadSchema } from '@/dto';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/modules/auth/constants';
import { Nullable } from '@curseit/types';

export const GetRefreshToken = createParamDecorator<boolean, Nullable<JwtReadDto>>(
  (throwOnNotFound = true, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    const token = request.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!token && throwOnNotFound) {
      throw new UnauthorizedException();
    } else if (!token) {
      return null;
    }

    const decodedToken = decode(token);
    const hasToken = decodedToken || typeof decodedToken !== 'string';
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
