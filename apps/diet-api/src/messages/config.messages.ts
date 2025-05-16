export const CONFIG_MESSAGES = {
  INVALID_HASH_SECRET: 'Invalid HASH_SECRET in .env file',
  INVALID_PORT: 'Invalid PORT in .env file',
  INVALID_DATABASE_URL: 'Invalid DATABASE_URL in .env file',
  INVALID_JWT_SECRETS: 'Invalid jwt secrets in .env file',
  TTL_WRONG_FORMAT: (value: unknown) => `TTL value in .env file should be expressed in a string representing a time span [zeit/ms](https://github.com/zeit/ms.js); provided value: ${value?.toString()}`,
};
