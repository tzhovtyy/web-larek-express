import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESS_TOKEN } from '../config';
import UnauthorizedError from '../errors/unauthorized-error';

const auth = (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const accessToken = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(accessToken, ACCESS_TOKEN.secret) as JwtPayload;
    req.user = { _id: String(payload._id) };
    return next();
  } catch (_error) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};

export default auth;
