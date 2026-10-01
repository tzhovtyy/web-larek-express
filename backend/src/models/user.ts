import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';
import validator from 'validator';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config';
import UnauthorizedError from '../errors/unauthorized-error';

const SALT_ROUNDS = 10;

export interface IUserToken {
  token: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: IUserToken[];
}

export interface IUserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

interface IUserModel extends Model<IUser, Record<string, unknown>, IUserMethods> {
  findUserByCredentials(email: string, password: string): Promise<UserDocument>;
}

const tokenSchema = new Schema<IUserToken>(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Ё-мое',
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Поле "email" должно быть заполнено'],
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Поле "email" должно быть валидным email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      minlength: [6, 'Минимальная длина поля "password" - 6'],
      select: false,
    },
    tokens: {
      type: [tokenSchema],
      default: [],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

userSchema.methods.generateAccessToken = function generateAccessToken() {
  return jwt.sign({ _id: this._id.toString() }, ACCESS_TOKEN.secret, {
    expiresIn: ACCESS_TOKEN.expiry,
  });
};

userSchema.methods.generateRefreshToken = async function generateRefreshToken() {
  const refreshToken = jwt.sign({ _id: this._id.toString() }, REFRESH_TOKEN.secret, {
    expiresIn: REFRESH_TOKEN.expiry,
  });

  await this.updateOne({ $push: { tokens: { token: refreshToken } } });

  return refreshToken;
};

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email: string,
  password: string,
) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }

  return user;
};

export default mongoose.model<IUser, IUserModel>('user', userSchema);
