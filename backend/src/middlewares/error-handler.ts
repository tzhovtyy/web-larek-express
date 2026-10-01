import { isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { MAX_FILE_SIZE_MB } from '../config';

interface IHttpError extends Error {
  statusCode?: number;
}

const multerMessages: Record<string, string> = {
  LIMIT_FILE_SIZE: `Размер файла не должен превышать ${MAX_FILE_SIZE_MB} МБ`,
  LIMIT_FILE_COUNT: 'Можно загрузить только один файл',
  LIMIT_UNEXPECTED_FILE: 'Файл должен передаваться в поле "file"',
};

const errorHandler = (err: IHttpError, _req: Request, res: Response, _next: NextFunction) => {
  if (isCelebrateError(err)) {
    const [details] = [...err.details.values()];
    res.status(400).send({ message: details.message });
    return;
  }

  if (err instanceof MulterError) {
    res.status(400).send({ message: multerMessages[err.code] || 'Не удалось загрузить файл' });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });
};

export default errorHandler;
