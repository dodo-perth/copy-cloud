export type ContentType = "youtube" | "map" | "url" | "image" | "text";

const YOUTUBE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]+/i;

const GOOGLE_MAPS_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:google\.com\/maps|maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl)[\w\-.~:/?#[\]@!$&'()*+,;=%]*/i;

const URL_REGEX =
  /^https?:\/\/[\w\-.~:/?#[\]@!$&'()*+,;=%]+$/i;

export function detectContentType(text: string): ContentType {
  const trimmed = text.trim();

  if (YOUTUBE_REGEX.test(trimmed)) {
    return "youtube";
  }

  if (GOOGLE_MAPS_REGEX.test(trimmed)) {
    return "map";
  }

  if (URL_REGEX.test(trimmed)) {
    return "url";
  }

  return "text";
}
