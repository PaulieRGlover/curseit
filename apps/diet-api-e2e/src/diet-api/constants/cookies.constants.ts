export const ACCESS_TOKEN_REGEXP = /([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)/;
export const ID_TOKEN_COOKIE_REGEXP =
  /^id_token=([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)/;
export const REFRESH_TOKEN_COOKIE_REGEXP =
  /^refresh_token=([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+); Max-Age=\d+; Path=\/; HttpOnly; Secure; SameSite=Strict/;
export const ID_TOKEN_COOKIE_DELETION_REGEXP = /^id_token=; Path=\/;/;
export const REFRESH_TOKEN_COOKIE_DELETION_REGEXP = /^refresh_token=; Path=\/;/;
