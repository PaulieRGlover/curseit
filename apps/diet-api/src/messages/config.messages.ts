export const CONFIG_MESSAGES = {
  INVALID_HASHING_CONFIG: (error: object) => `Invalid hashing configuration in .env file: ${error}`,
  INVALID_APP_CONFIG: (error: object) => `Invalid app configuration in .env file: ${error}`,
  INVALID_DATABASE_CONFIG: (error: object) => `Invalid database configuration in .env file: ${error}`,
  INVALID_JWT_CONFIG: (error: object) => `Invalid jwt configuration in .env file: ${error}`,
  TTL_WRONG_FORMAT: (value: unknown) => `TTL value in .env file should be a string representing a time span [zeit/ms](https://github.com/zeit/ms.js); provided value: ${value?.toString()}`,
};
