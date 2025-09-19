import { connectToDatabase, dbAll } from "~/lib/sqlite";
import type { Trip } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const rows = await dbAll(db)(
      `SELECT * FROM trips 
       WHERE deletedAt = 0 
       ORDER BY updatedAt DESC`
    );

    // 解析 days JSON 字符串
    const trips = rows.map((row: any) => ({
      ...row,
      days: JSON.parse(row.days || "[]"),
    }));

    return trips as Trip[];
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch trips",
    });
  }
});
