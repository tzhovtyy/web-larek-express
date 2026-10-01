import dotenv from 'dotenv';

dotenv.config();

export const { PORT = 3000 } = process.env;
export const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;
export const { UPLOAD_PATH = 'images' } = process.env;
export const { UPLOAD_PATH_TEMP = 'temp' } = process.env;
export const { ORIGIN_ALLOW = 'http://localhost:5173' } = process.env;
export const { AUTH_REFRESH_TOKEN_EXPIRY = '7d' } = process.env;
export const { AUTH_ACCESS_TOKEN_EXPIRY = '1m' } = process.env;
