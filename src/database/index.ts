//* Libraries imports
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
// import { migrate } from "drizzle-orm/bun-sqlite/migrator"

//* Local imports
import { env } from "../env";

const sqlite = new Database(env.DATABASE_URL);
const db = drizzle({ client: sqlite });
// migrate(db, { migrationsFolder: './drizzle' });

export { db };