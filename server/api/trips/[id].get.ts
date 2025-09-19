import { connectToDatabase, dbGet } from "~/lib/sqlite";
import type { Trip } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Trip ID is required",
      });
    }

    const db = await connectToDatabase();
    const row = await dbGet(db)(
      `SELECT * FROM trips WHERE id = ? AND deletedAt = 0`,
      [id]
    );

    if (!row) {
      throw createError({
        statusCode: 404,
        statusMessage: "Trip not found",
      });
    }

    // 解析 days JSON 字符串
    const trip = {
      ...row,
      days: JSON.parse(row.days || "[]"),
    };

    return trip as Trip;
  } catch (error) {
    console.error("Failed to fetch trip:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch trip",
    });
  }
});
