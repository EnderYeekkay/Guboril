import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { sqliteTable } from 'drizzle-orm/sqlite-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = new Database(path.join(__dirname, 'main.db'), {
    fileMustExist: false,
    verbose: console.log
})
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')
export const db = drizzle(sqlite)
