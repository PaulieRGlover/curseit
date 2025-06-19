import * as z from 'zod/v4-mini';

export enum ErrorStatusCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export const errorStatusCodesSchema = z.enum(ErrorStatusCodes);
