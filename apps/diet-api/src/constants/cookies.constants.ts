import { DAY } from '@curseit/basic-time';
import { CookieSerializeOptions } from 'fastify-cookie';

export const ID_TOKEN_COOKIE_NAME = 'id_token';

export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

export const ID_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
  sameSite: 'lax',
  path: '/',
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 30 * DAY,
};
