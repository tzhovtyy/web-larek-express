import { promises as fs } from 'fs';
import cron from 'node-cron';
import path from 'path';
import { TEMP_DIR } from './files';

const TEMP_FILE_TTL = 60 * 60 * 1000;
const CLEAR_TEMP_SCHEDULE = '0 * * * *';

export const clearTempDir = async () => {
  const now = Date.now();
  const entries = await fs.readdir(TEMP_DIR).catch(() => [] as string[]);

  await Promise.all(
    entries
      .filter((name) => !name.startsWith('.'))
      .map(async (name) => {
        const filePath = path.join(TEMP_DIR, name);
        const stats = await fs.stat(filePath).catch(() => null);

        if (stats?.isFile() && now - stats.mtimeMs > TEMP_FILE_TTL) {
          await fs.rm(filePath, { force: true }).catch(() => {});
        }
      }),
  );
};

const scheduleClearTempDir = () => cron.schedule(CLEAR_TEMP_SCHEDULE, clearTempDir);

export default scheduleClearTempDir;
