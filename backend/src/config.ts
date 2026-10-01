import type { CookieOptions } from 'express';
import dotenv from 'dotenv';
import ms, { StringValue } from 'ms';

dotenv.config();

export const { PORT = 3000 } = process.env;
export const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;
export const { UPLOAD_PATH = 'images' } = process.env;
export const { UPLOAD_PATH_TEMP = 'temp' } = process.env;
export const { ORIGIN_ALLOW = 'http://localhost:5173' } = process.env;
export const { AUTH_REFRESH_TOKEN_EXPIRY = '7d' } = process.env;
export const { AUTH_ACCESS_TOKEN_EXPIRY = '10m' } = process.env;

export const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'dev-access-token-secret',
  expiry: AUTH_ACCESS_TOKEN_EXPIRY as StringValue,
};

export const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'dev-refresh-token-secret',
  expiry: AUTH_REFRESH_TOKEN_EXPIRY as StringValue,
  cookie: {
    name: 'refreshToken',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY as StringValue),
      path: '/',
    } as CookieOptions,
  },
};
