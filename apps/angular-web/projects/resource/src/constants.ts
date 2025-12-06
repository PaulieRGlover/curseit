export const PATH = 'path';
export const VALIDATION_SUCCESS = 'validation:success';
export const VALIDATION_FAILURE = 'validation:failure';
export const USE_AUTHORIZATION = 'authorization';
export const AUTHORIZATION_TOKEN_KEY = 'authorization:token-key';

export const ERROR_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
