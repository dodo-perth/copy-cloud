import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import db from "../db";
import {
  generateRoomCode,
  generateSecureHash,
  generateId,
} from "../utils/code-generator";
import { detectContentType } from "../utils/content-detect";

const router = Router();

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const uniqueName = `${generateId()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// POST /api/rooms - Create a room instantly with content
router.post("/", upload.single("image"), (req: Request, res: Response) => {
  try {
    const { secure } = req.body;
    const isSecure = secure === "true" || secure === true;

    const roomId = generateId();
    const code = isSecure ? generateSecureHash() : generateRoomCode();

    // Expires in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    db.prepare(
      "INSERT INTO rooms (id, code, is_secure, expires_at) VALUES (?, ?, ?, ?)"
    ).run(roomId, code, isSecure ? 1 : 0, expiresAt);

    // If content is provided, create item immediately
    let item = null;
    if (req.file) {
      // Image upload
      const itemId = generateId();
      db.prepare(
        "INSERT INTO items (id, room_id, content_type, content, original_filename) VALUES (?, ?, ?, ?, ?)"
      ).run(itemId, roomId, "image", req.file.filename, req.file.originalname);
      item = {
        id: itemId,
        content_type: "image",
        content: req.file.filename,
        original_filename: req.file.originalname,
      };
    } else if (req.body.content) {
      const contentType = detectContentType(req.body.content);
      const itemId = generateId();
      db.prepare(
        "INSERT INTO items (id, room_id, content_type, content) VALUES (?, ?, ?, ?)"
      ).run(itemId, roomId, contentType, req.body.content);
      item = {
        id: itemId,
        content_type: contentType,
        content: req.body.content,
      };
    }

    res.status(201).json({
      id: roomId,
      code,
      is_secure: isSecure,
      expires_at: expiresAt,
      item,
    });
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// GET /api/rooms/:code - Get room + items by code
router.get("/:code", (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const room = db
      .prepare(
        "SELECT * FROM rooms WHERE code = ? AND expires_at > datetime('now')"
      )
      .get(code) as any;

    if (!room) {
      res.status(404).json({ error: "Room not found or expired" });
      return;
    }

    const items = db
      .prepare(
        "SELECT id, content_type, content, original_filename, created_at FROM items WHERE room_id = ? ORDER BY created_at ASC"
      )
      .all(room.id);

    res.json({
      id: room.id,
      code: room.code,
      is_secure: !!room.is_secure,
      created_at: room.created_at,
      expires_at: room.expires_at,
      items,
    });
  } catch (err) {
    console.error("Error fetching room:", err);
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// POST /api/rooms/:code/items - Add item to existing room
router.post(
  "/:code/items",
  upload.single("image"),
  (req: Request, res: Response) => {
    try {
      const { code } = req.params;

      const room = db
        .prepare(
          "SELECT * FROM rooms WHERE code = ? AND expires_at > datetime('now')"
        )
        .get(code) as any;

      if (!room) {
        res.status(404).json({ error: "Room not found or expired" });
        return;
      }

      let item;
      if (req.file) {
        const itemId = generateId();
        db.prepare(
          "INSERT INTO items (id, room_id, content_type, content, original_filename) VALUES (?, ?, ?, ?, ?)"
        ).run(
          itemId,
          room.id,
          "image",
          req.file.filename,
          req.file.originalname
        );
        item = {
          id: itemId,
          content_type: "image",
          content: req.file.filename,
          original_filename: req.file.originalname,
        };
      } else if (req.body.content) {
        const contentType = detectContentType(req.body.content);
        const itemId = generateId();
        db.prepare(
          "INSERT INTO items (id, room_id, content_type, content) VALUES (?, ?, ?, ?)"
        ).run(itemId, room.id, contentType, req.body.content);
        item = {
          id: itemId,
          content_type: contentType,
          content: req.body.content,
        };
      } else {
        res.status(400).json({ error: "No content provided" });
        return;
      }

      res.status(201).json(item);
    } catch (err) {
      console.error("Error adding item:", err);
      res.status(500).json({ error: "Failed to add item" });
    }
  }
);

// DELETE /api/rooms/:code/items/:itemId - Delete an item
router.delete("/:code/items/:itemId", (req: Request, res: Response) => {
  try {
    const { code, itemId } = req.params;

    const room = db
      .prepare("SELECT id FROM rooms WHERE code = ?")
      .get(code) as any;

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    db.prepare("DELETE FROM items WHERE id = ? AND room_id = ?").run(
      itemId,
      room.id
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
