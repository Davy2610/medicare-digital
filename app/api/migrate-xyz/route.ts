import { readFileSync } from "node:fs"
import path from "node:path"
import { Client } from "pg"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function pick() {
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ""
  )
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get("diag") === "1") {
    return Response.json({
      nonPooling: (process.env.POSTGRES_URL_NON_POOLING || "").length,
      url: (process.env.POSTGRES_URL || "").length,
      prisma: (process.env.POSTGRES_PRISMA_URL || "").length,
      host: (process.env.POSTGRES_HOST || "").length,
      user: (process.env.POSTGRES_USER || "").length,
      db: (process.env.POSTGRES_DATABASE || "").length,
      pass: (process.env.POSTGRES_PASSWORD || "").length,
    })
  }

  const connectionString = pick()
  const sqlPath = path.join(process.cwd(), "scripts", "001_init_auth_schema.sql")
  const sql = readFileSync(sqlPath, "utf8")
  const client = new Client(
    connectionString
      ? { connectionString }
      : {
          host: process.env.POSTGRES_HOST,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          port: 5432,
          ssl: { rejectUnauthorized: false },
        },
  )
  try {
    await client.connect()
    await client.query(sql)
    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ ok: false, error: (err as Error).message }, { status: 500 })
  } finally {
    await client.end()
  }
}
