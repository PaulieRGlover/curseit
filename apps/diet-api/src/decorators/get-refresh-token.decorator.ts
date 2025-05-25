import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';

import { type FastifyRequest } from 'fastify';
import { decode } from 'jsonwebtoken';

import { JwtReadDto, JwtReadSchema } from '@/dto';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/modules/auth/constants';

export const GetRefreshToken = createParamDecorator<undefined, JwtReadDto>(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    const token = request.cookies[REFRESH_TOKEN_COOKIE_NAME];
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
