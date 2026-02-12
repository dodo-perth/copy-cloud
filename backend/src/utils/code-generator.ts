import { nanoid } from "nanoid";
import crypto from "crypto";
import db from "../db";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing chars: 0,O,1,I

export function generateRoomCode(): string {
  let code: string;
  let attempts = 0;

  do {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    attempts++;

    // Check if code already exists
    const existing = db
      .prepare("SELECT id FROM rooms WHERE code = ?")
      .get(code);
    if (!existing) break;
  } while (attempts < 100);

  return code;
}

export function generateSecureHash(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateId(): string {
  return nanoid(21);
}
