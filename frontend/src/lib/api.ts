const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface RoomItem {
  id: string;
  content_type: "text" | "youtube" | "map" | "url" | "image";
  content: string;
  original_filename?: string;
  created_at?: string;
}

export interface Room {
  id: string;
  code: string;
  is_secure: boolean;
  created_at: string;
  expires_at: string;
  items: RoomItem[];
}

export interface CreateRoomResponse {
  id: string;
  code: string;
  is_secure: boolean;
  expires_at: string;
  item: RoomItem | null;
}

// Create room with text content
export async function createRoom(
  content: string,
  secure = false
): Promise<CreateRoomResponse> {
  const res = await fetch(`${API_BASE}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, secure }),
  });
  if (!res.ok) throw new Error("Failed to create room");
  return res.json();
}

// Create room with image
export async function createRoomWithImage(
  file: File,
  secure = false
): Promise<CreateRoomResponse> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("secure", String(secure));

  const res = await fetch(`${API_BASE}/api/rooms`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create room");
  return res.json();
}

// Get room by code
export async function getRoom(code: string): Promise<Room> {
  const res = await fetch(`${API_BASE}/api/rooms/${code}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Room not found or expired");
    throw new Error("Failed to fetch room");
  }
  return res.json();
}

// Get image URL
export function getImageUrl(filename: string): string {
  return `${API_BASE}/uploads/${filename}`;
}
