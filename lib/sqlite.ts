import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { config } from "../config";

let db: sqlite3.Database | null = null;

export async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    // 确保数据库目录存在
    const dbDir = path.join(process.cwd(), config.database.directory);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, config.database.filename);

    db = new sqlite3.Database(dbPath);

    // 启用外键约束
    await promisify(db.run.bind(db))("PRAGMA foreign_keys = ON");

    // 创建表
    await createTables();

    console.log("Connected to SQLite database");
    return db;
  } catch (error) {
    console.error("Failed to connect to SQLite database:", error);
    throw error;
  }
}

async function createTables() {
  if (!db) throw new Error("Database not connected");

  const run = promisify(db.run.bind(db));

  // 创建 trips 表
  await run(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      cover TEXT,
      startAt TEXT NOT NULL,
      endAt TEXT NOT NULL,
      days TEXT NOT NULL, -- JSON 字符串
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      deletedAt INTEGER DEFAULT 0
    )
  `);

  // 创建索引
  await run(
    "CREATE INDEX IF NOT EXISTS idx_trips_deletedAt ON trips(deletedAt)"
  );
  await run(
    "CREATE INDEX IF NOT EXISTS idx_trips_updatedAt ON trips(updatedAt)"
  );
  await run("CREATE INDEX IF NOT EXISTS idx_trips_title ON trips(title)");
}

export async function closeDatabase() {
  if (db) {
    await promisify(db.close.bind(db))();
    db = null;
    console.log("Disconnected from SQLite database");
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase() first.");
  }
  return db;
}

// 辅助函数
export const dbRun = (db: sqlite3.Database) => promisify(db.run.bind(db));
export const dbGet = (db: sqlite3.Database) => promisify(db.get.bind(db));
export const dbAll = (db: sqlite3.Database) => promisify(db.all.bind(db));
