export const API = {
  AUTH: {
    BASE: 'auth',
    REFRESH: 'refresh',
    SIGN_UP: 'sign-up',
    SIGN_IN: 'sign-in',
    SIGN_OUT: 'sign-out',
  },
  FRIDGE: {
    BASE: 'fridge',
    FOODS: 'foods',
    FOOD: 'food',
  },
} as const;

export const ERROR_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
