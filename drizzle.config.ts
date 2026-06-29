import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './modules/Core/db/migrations',
  schema: './modules/Core/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './modules/Core/db/schema.db',
  },
});
