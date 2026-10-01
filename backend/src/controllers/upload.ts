import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import { toPublicPath } from '../utils/files';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new BadRequestError('Файл не загружен'));
  }

  try {
    return res.status(201).send({
      fileName: toPublicPath(req.file.filename),
      originalName: req.file.originalname,
    });
  } catch (error) {
    return next(error);
  }
};

export default uploadFile;
