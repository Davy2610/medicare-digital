import { readFileSync } from "node:fs"
import pg from "pg"

const file = process.argv[2]
if (!file) {
  console.error("Usage: node scripts/run-sql.mjs <path-to-sql>")
  process.exit(1)
}

const sql = readFileSync(file, "utf8")
const client = new pg.Client({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
})

try {
  await client.connect()
  await client.query(sql)
  console.log("[v0] SQL applied successfully:", file)
} catch (err) {
  console.error("[v0] SQL failed:", err.message)
  process.exit(1)
} finally {
  await client.end()
}
