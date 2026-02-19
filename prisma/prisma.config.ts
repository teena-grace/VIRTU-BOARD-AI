
// prisma/prisma.config.ts
import Database from 'better-sqlite3'

const databaseUrl = process.env.DATABASE_URL || './dev.db'

// Remove "file:" prefix if present
const dbPath = databaseUrl.replace('file:', '')

const db = new Database(dbPath)

export default {
  db: {
    url: databaseUrl,
    adapter: db
  }
}