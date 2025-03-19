//* Libraries imports
import { defineConfig } from 'drizzle-kit';

//* Local imports
import { env } from './src/env';

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
