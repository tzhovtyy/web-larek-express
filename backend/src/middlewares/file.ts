import crypto from 'crypto';
import multer from 'multer';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../config';
import BadRequestError from '../errors/bad-request-error';
import { TEMP_DIR, ensureTempDir } from '../utils/files';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureTempDir()
      .then(() => cb(null, TEMP_DIR))
      .catch((error: Error) => cb(error, TEMP_DIR));
  },
  filename: (_req, file, cb) => {
    cb(null, `${crypto.randomBytes(8).toString('hex')}${ALLOWED_FILE_TYPES[file.mimetype]}`);
  },
});

const fileFilter: NonNullable<multer.Options['fileFilter']> = (_req, file, cb) => {
  if (!ALLOWED_FILE_TYPES[file.mimetype]) {
    cb(new BadRequestError('Допустимы только изображения png, jpg, jpeg, gif и svg'));
    return;
  }

  cb(null, true);
};

export default multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE, files: 1 } });
