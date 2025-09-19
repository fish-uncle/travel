import { connectToDatabase, dbRun, dbGet } from "~/lib/sqlite";

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

    // 检查行程是否存在
    const existingTrip = await dbGet(db)(
      `SELECT id FROM trips WHERE id = ? AND deletedAt = 0`,
      [id]
    );

    if (!existingTrip) {
      throw createError({
        statusCode: 404,
        statusMessage: "Trip not found",
      });
    }

    // 软删除
    await dbRun(db)(
      `UPDATE trips SET deletedAt = ?, updatedAt = ? WHERE id = ?`,
      [Date.now(), Date.now(), id]
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to delete trip:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete trip",
    });
  }
});
