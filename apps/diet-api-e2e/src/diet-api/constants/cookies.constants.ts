import { JWT_REGEX_STRING } from '@curseit/jwt';

const REFRESH_TOKEN_PARAMS = `Max-Age=\\d+; Path=\\/; HttpOnly; Secure; SameSite=Strict`;

export const ACCESS_TOKEN_REGEX = new RegExp(JWT_REGEX_STRING);
export const ID_TOKEN_COOKIE_REGEX = new RegExp(`^id_token=${JWT_REGEX_STRING}`);
export const REFRESH_TOKEN_COOKIE_REGEX = new RegExp(
  `^refresh_token=${JWT_REGEX_STRING}; ${REFRESH_TOKEN_PARAMS}`,
);
export const ID_TOKEN_COOKIE_DELETION_REGEX = /^id_token=; Path=\/;/;
export const REFRESH_TOKEN_COOKIE_DELETION_REGEX = /^refresh_token=; Path=\/;/;
