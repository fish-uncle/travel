import { connectToDatabase, dbAll } from "~/lib/sqlite";
import type { Trip } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const keyword = query.keyword as string;

    if (!keyword) {
      throw createError({
        statusCode: 400,
        statusMessage: "Search keyword is required",
      });
    }

    const db = await connectToDatabase();
    const rows = await dbAll(db)(
      `SELECT * FROM trips 
       WHERE deletedAt = 0 AND title LIKE ? 
       ORDER BY updatedAt DESC`,
      [`%${keyword}%`]
    );

    // 解析 days JSON 字符串
    const trips = rows.map((row: any) => ({
      ...row,
      days: JSON.parse(row.days || "[]"),
    }));

    return trips as Trip[];
  } catch (error) {
    console.error("Failed to search trips:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to search trips",
    });
  }
});
