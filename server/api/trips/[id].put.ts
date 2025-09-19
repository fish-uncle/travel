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

    const body = await readBody(event);
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

    // 构建更新字段
    const updateFields = [];
    const updateValues = [];

    if (body.title !== undefined) {
      updateFields.push("title = ?");
      updateValues.push(body.title);
    }
    if (body.cover !== undefined) {
      updateFields.push("cover = ?");
      updateValues.push(body.cover);
    }
    if (body.startAt !== undefined) {
      updateFields.push("startAt = ?");
      updateValues.push(body.startAt);
    }
    if (body.endAt !== undefined) {
      updateFields.push("endAt = ?");
      updateValues.push(body.endAt);
    }
    if (body.days !== undefined) {
      updateFields.push("days = ?");
      updateValues.push(JSON.stringify(body.days));
    }

    updateFields.push("updatedAt = ?");
    updateValues.push(Date.now());
    updateValues.push(id);

    await dbRun(db)(
      `UPDATE trips SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to update trip:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update trip",
    });
  }
});
