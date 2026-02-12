import db from "../db";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

function cleanupExpiredRooms(): void {
  // Find expired rooms and their image items
  const expiredItems = db
    .prepare(
      `SELECT i.content, i.content_type FROM items i 
       JOIN rooms r ON i.room_id = r.id 
       WHERE r.expires_at <= datetime('now')`
    )
    .all() as { content: string; content_type: string }[];

  // Delete uploaded files for expired items
  for (const item of expiredItems) {
    if (item.content_type === "image") {
      const filePath = path.join(UPLOADS_DIR, item.content);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // Ignore file deletion errors
      }
    }
  }

  // Delete expired rooms (cascade deletes items)
  const result = db
    .prepare("DELETE FROM rooms WHERE expires_at <= datetime('now')")
    .run();

  if (result.changes > 0) {
    console.log(`[cleanup] Deleted ${result.changes} expired room(s)`);
  }
}

export function startCleanupScheduler(intervalMs = 30_000): NodeJS.Timeout {
  // Run immediately on start
  cleanupExpiredRooms();

  // Then run periodically
  return setInterval(cleanupExpiredRooms, intervalMs);
}
