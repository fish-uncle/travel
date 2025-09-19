import { connectToDatabase, dbRun } from "~/lib/sqlite";
import type { Trip } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const db = await connectToDatabase();

    const now = Date.now();
    const id = crypto.randomUUID();

    const tripData = {
      id,
      title: body.title,
      cover: body.cover || null,
      startAt: body.startAt,
      endAt: body.endAt,
      days: JSON.stringify(body.days || []),
      createdAt: now,
      updatedAt: now,
      deletedAt: 0,
    };

    await dbRun(db)(
      `INSERT INTO trips (id, title, cover, startAt, endAt, days, createdAt, updatedAt, deletedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tripData.id,
        tripData.title,
        tripData.cover,
        tripData.startAt,
        tripData.endAt,
        tripData.days,
        tripData.createdAt,
        tripData.updatedAt,
        tripData.deletedAt,
      ]
    );

    return { id };
  } catch (error) {
    console.error("Failed to create trip:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create trip",
    });
  }
});
