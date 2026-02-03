import { app } from "electron"
import { resolve as pr } from 'path'
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const isProd = app.isPackaged
// export const userDir = app.getPath('userData')
export const coreDir = isProd ? pr(process.resourcesPath, 'core') : pr(__dirname, '../../core')
export const listsPath = pr(coreDir, 'lists')
export const binPath = pr(coreDir, 'bin')
