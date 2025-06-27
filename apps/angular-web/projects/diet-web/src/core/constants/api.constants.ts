export const API = {
  REFRESH: 'auth/refresh',
  SIGN_UP: 'auth/sign-up',
  SIGN_IN: 'auth/sign-in',
  SIGN_OUT: 'auth/sign-out',
} as const;

export const ERROR_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
