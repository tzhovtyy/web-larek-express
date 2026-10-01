import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Error as MongooseError, Types } from 'mongoose';
import { REFRESH_TOKEN } from '../config';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import User, { UserDocument } from '../models/user';

const publicUser = (user: UserDocument) => ({ email: user.email, name: user.name });

const sendAuthResponse = async (res: Response, user: UserDocument, statusCode = 200) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);

  return res.status(statusCode).send({
    user: publicUser(user),
    success: true,
    accessToken,
  });
};

const verifyRefreshTokenFromCookies = (req: Request) => {
  const refreshToken = req.cookies?.[REFRESH_TOKEN.cookie.name];

  if (!refreshToken) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN.secret) as JwtPayload;
    return { refreshToken: refreshToken as string, userId: payload._id };
  } catch (_error) {
    throw new UnauthorizedError('Невалидный refresh-токен');
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    return await sendAuthResponse(res, user, 201);
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    return await sendAuthResponse(res, user);
  } catch (error) {
    return next(error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken, userId } = verifyRefreshTokenFromCookies(req);

    if (!Types.ObjectId.isValid(userId)) {
      throw new UnauthorizedError('Невалидный refresh-токен');
    }

    const user = await User.findOne({ _id: userId, 'tokens.token': refreshToken });
    if (!user) {
      throw new UnauthorizedError('Невалидный refresh-токен');
    }
    await user.updateOne({ $pull: { tokens: { token: refreshToken } } });

    return await sendAuthResponse(res, user);
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken, userId } = verifyRefreshTokenFromCookies(req);

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Передан невалидный _id пользователя');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    await user.updateOne({ $pull: { tokens: { token: refreshToken } } });

    const { maxAge: _maxAge, ...clearOptions } = REFRESH_TOKEN.cookie.options;
    res.clearCookie(REFRESH_TOKEN.cookie.name, clearOptions);

    return res.send({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.send({ user: publicUser(user), success: true });
  } catch (error) {
    return next(error);
  }
};
