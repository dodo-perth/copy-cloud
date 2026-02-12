const translations = {
  en: {
    placeholder_sub: "paste anything — text, links, or drop an image",
    secure: "Secure",
    share: "Share",
    or_receive: "OR RECEIVE",
    enter_code: "Enter 6-digit code",
    fetching: "Fetching clipboard...",
    scan_to_receive: "Scan to receive",
    shared_content: "Shared content:",
    no_content: "No content in this clipboard",
    new_clipboard: "New clipboard",
    expires_footer: "content expires after 5 minutes",
    clipboard_created: "Clipboard created!",
    image_uploaded: "Image uploaded!",
    failed_create: "Failed to create clipboard",
    failed_upload: "Failed to upload image",
    not_found: "Room not found or expired",
    clipboard_expired: "Clipboard expired",
    code_copied: "Code copied!",
    copied: "Copied to clipboard",
    failed_copy: "Failed to copy",
    open_youtube: "Open in YouTube",
    open_maps: "Open in Google Maps",
    open_link: "Open link",
    download: "Download",
    copy_text: "Copy",
    copied_text: "Copied",
  },
  ko: {
    placeholder_sub: "텍스트, 링크, 이미지를 붙여넣으세요",
    secure: "보안",
    share: "공유",
    or_receive: "또는 받기",
    enter_code: "6자리 코드 입력",
    fetching: "클립보드 가져오는 중...",
    scan_to_receive: "스캔하여 받기",
    shared_content: "공유된 콘텐츠:",
    no_content: "클립보드에 콘텐츠가 없습니다",
    new_clipboard: "새 클립보드",
    expires_footer: "콘텐츠는 5분 후 만료됩니다",
    clipboard_created: "클립보드 생성 완료!",
    image_uploaded: "이미지 업로드 완료!",
    failed_create: "클립보드 생성 실패",
    failed_upload: "이미지 업로드 실패",
    not_found: "존재하지 않거나 만료된 코드입니다",
    clipboard_expired: "클립보드가 만료되었습니다",
    code_copied: "코드 복사됨!",
    copied: "클립보드에 복사됨",
    failed_copy: "복사 실패",
    open_youtube: "YouTube에서 열기",
    open_maps: "Google Maps에서 열기",
    open_link: "링크 열기",
    download: "다운로드",
    copy_text: "복사",
    copied_text: "복사됨",
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["en"];

function getLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || "en";
  if (lang.startsWith("ko")) return "ko";
  return "en";
}

let currentLocale: Locale | null = null;

export function t(key: TranslationKey): string {
  if (!currentLocale) currentLocale = getLocale();
  return translations[currentLocale][key] || translations.en[key];
}

export function getDetectedLocale(): Locale {
  if (!currentLocale) currentLocale = getLocale();
  return currentLocale;
}
