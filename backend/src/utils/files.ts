import { promises as fs } from 'fs';
import path from 'path';
import { UPLOAD_PATH, UPLOAD_PATH_TEMP } from '../config';
import BadRequestError from '../errors/bad-request-error';

export const PUBLIC_DIR = path.join(__dirname, '..', 'public');
export const UPLOAD_DIR = path.join(PUBLIC_DIR, UPLOAD_PATH);
export const TEMP_DIR = path.join(PUBLIC_DIR, UPLOAD_PATH_TEMP);

export const toPublicPath = (fileName: string) => `/${UPLOAD_PATH}/${fileName}`;

const normalizeFileName = (fileName: string) => {
  const name = path.basename(String(fileName));
  return name === '' || name === '.' || name === '..' ? null : name;
};

const exists = (target: string) =>
  fs
    .access(target)
    .then(() => true)
    .catch(() => false);

export const ensureTempDir = () => fs.mkdir(TEMP_DIR, { recursive: true });

export interface IMovedImage {
  fileName: string;
  moved: boolean;
}

export const moveImageFromTemp = async (fileName: string): Promise<IMovedImage> => {
  const name = normalizeFileName(fileName);

  if (!name) {
    throw new BadRequestError('Некорректное имя файла');
  }

  const tempPath = path.join(TEMP_DIR, name);
  const uploadPath = path.join(UPLOAD_DIR, name);

  if (!(await exists(tempPath))) {
    if (await exists(uploadPath)) {
      return { fileName: toPublicPath(name), moved: false };
    }

    throw new BadRequestError('Загруженный файл не найден во временной директории');
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.rename(tempPath, uploadPath);

  return { fileName: toPublicPath(name), moved: true };
};

export const removeImage = async (fileName: string) => {
  const name = normalizeFileName(fileName);

  if (!name) {
    return;
  }

  await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
};

export const removeTempImage = async (fileName: string) => {
  const name = normalizeFileName(fileName);

  if (!name) {
    return;
  }

  await fs.rm(path.join(TEMP_DIR, name), { force: true });
};
