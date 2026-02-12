"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  CloudUpload,
  Clipboard,
  Loader2,
  Timer,
  Copy,
  Check,
  RotateCcw,
  ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  createRoom,
  createRoomWithImage,
  getRoom,
  CreateRoomResponse,
  Room,
} from "@/lib/api";
import { ContentRenderer } from "@/components/content-renderer";
import { AdSense } from "@/components/adsense";
import { t } from "@/lib/i18n";

type AppState = "idle" | "uploading" | "shared" | "fetching" | "received";

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [secure, setSecure] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [sharedRoom, setSharedRoom] = useState<CreateRoomResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);

  const [receivedRoom, setReceivedRoom] = useState<Room | null>(null);

  const [codeCopied, setCodeCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();

  const showPlaceholder = !pasteText && !isFocused;

  useEffect(() => {
    if (appState !== "shared" || !sharedRoom) return;
    const expiresAt = new Date(sharedRoom.expires_at).getTime();

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        toast.info(t("clipboard_expired"));
        handleReset();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, sharedRoom]);

  const handlePasteSubmit = useCallback(async () => {
    if (!pasteText.trim()) return;
    setAppState("uploading");
    try {
      const room = await createRoom(pasteText.trim(), secure);
      setSharedRoom(room);
      setAppState("shared");
      toast.success(t("clipboard_created"));
    } catch {
      toast.error(t("failed_create"));
      setAppState("idle");
    }
  }, [pasteText, secure]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      setAppState("uploading");
      try {
        const room = await createRoomWithImage(file, secure);
        setSharedRoom(room);
        setAppState("shared");
        toast.success(t("image_uploaded"));
      } catch {
        toast.error(t("failed_upload"));
        setAppState("idle");
      }
    },
    [secure]
  );

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handlePasteEvent = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) handleImageUpload(file);
          return;
        }
      }
    },
    [handleImageUpload]
  );

  const handleCodeComplete = useCallback(async (code: string) => {
    if (!code || code.length < 6) return;
    setAppState("fetching");
    try {
      const room = await getRoom(code);
      setReceivedRoom(room);
      setAppState("received");
    } catch {
      toast.error(t("not_found"));
      setAppState("idle");
      setCodeInput("");
    }
  }, []);

  // Auto-fetch from ?code= URL param (QR scan landing)
  useEffect(() => {
    const initialCode = searchParams.get("code");
    if (initialCode && initialCode.length >= 6) {
      if (initialCode.length === 6) {
        setCodeInput(initialCode.toUpperCase());
      }
      handleCodeComplete(initialCode);
    }
  }, [searchParams, handleCodeComplete]);

  const handleCopyCode = useCallback(async () => {
    if (!sharedRoom) return;
    await navigator.clipboard.writeText(sharedRoom.code);
    setCodeCopied(true);
    toast.success(t("code_copied"));
    setTimeout(() => setCodeCopied(false), 2000);
  }, [sharedRoom]);

  const handleReset = useCallback(() => {
    setAppState("idle");
    setPasteText("");
    setCodeInput("");
    setSharedRoom(null);
    setReceivedRoom(null);
    setTimeLeft(300);
    setCodeCopied(false);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const shareUrl =
    typeof window !== "undefined" && sharedRoom
      ? `${window.location.origin}?code=${sharedRoom.code}`
      : "";

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* SEO: visually hidden heading for crawlers */}
      <h1 className="sr-only">
        Copy Cloud — Instant Copy &amp; Paste Across Devices
      </h1>
      <p className="sr-only">
        Share text, links, YouTube videos, Google Maps addresses, and images
        between your phone and computer instantly. Get a 6-digit code or QR
        code — no account needed. Content auto-expires in 5 minutes.
      </p>

      <div className="w-full max-w-md space-y-5">
        {/* === IDLE / UPLOADING STATE === */}
        {(appState === "idle" || appState === "uploading") && (
          <>
            {/* Paste Area */}
            <section aria-label="Share content">
            <Card className="p-0 overflow-hidden">
              <div
                className="relative"
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {/* Branded placeholder with blinking cursor */}
                {showPlaceholder && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 pb-10">
                    <div className="flex items-center">
                      <span className="text-[1.65rem] font-light tracking-[-0.02em] text-foreground/60">
                        copy
                      </span>
                      <span className="text-[1.65rem] font-medium tracking-[-0.02em] text-foreground/80 ml-[0.25em]">
                        cloud
                      </span>
                      <span
                        className="inline-block w-[1.5px] h-6 bg-foreground/25 ml-1"
                        style={{
                          animation: "blink-caret 1s step-end infinite",
                        }}
                      />
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground/35 mt-1 tracking-[0.04em]">
                      {t("placeholder_sub")}
                    </p>
                  </div>
                )}

                <textarea
                  ref={textareaRef}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onPaste={handlePasteEvent}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handlePasteSubmit();
                    }
                  }}
                  className="w-full h-36 resize-none bg-transparent p-4 text-sm outline-none relative z-10"
                  disabled={appState === "uploading"}
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      disabled={appState === "uploading"}
                    >
                      <ImageIcon className="h-5 w-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        id="secure"
                        checked={secure}
                        onCheckedChange={setSecure}
                        disabled={appState === "uploading"}
                      />
                      <Label
                        htmlFor="secure"
                        className="text-xs text-muted-foreground cursor-pointer"
                      >
                        {t("secure")}
                      </Label>
                    </div>
                  </div>
                  <button
                    onClick={handlePasteSubmit}
                    disabled={appState === "uploading" || !pasteText.trim()}
                    className="btn-share"
                  >
                    {appState === "uploading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CloudUpload className="h-4 w-4" />
                    )}
                    {t("share")}
                  </button>
                </div>
              </div>
            </Card>
            </section>

            {/* Divider */}
            <div className="flex items-center gap-4" role="separator">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground font-medium">
                {t("or_receive")}
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Code Input */}
            <section aria-label="Receive content">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 justify-center">
                  <Clipboard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {t("enter_code")}
                  </p>
                </div>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={codeInput}
                    inputMode="text"
                    aria-label="6-digit sharing code"
                    onChange={(val) => {
                      setCodeInput(val.toUpperCase());
                      if (val.length === 6) {
                        handleCodeComplete(val);
                      }
                    }}
                    disabled={appState === "uploading"}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-12 w-12 text-lg font-mono font-bold" />
                      <InputOTPSlot index={1} className="h-12 w-12 text-lg font-mono font-bold" />
                      <InputOTPSlot index={2} className="h-12 w-12 text-lg font-mono font-bold" />
                      <InputOTPSlot index={3} className="h-12 w-12 text-lg font-mono font-bold" />
                      <InputOTPSlot index={4} className="h-12 w-12 text-lg font-mono font-bold" />
                      <InputOTPSlot index={5} className="h-12 w-12 text-lg font-mono font-bold" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </Card>
            </section>
          </>
        )}

        {/* === FETCHING STATE === */}
        {appState === "fetching" && (
          <Card className="p-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {t("fetching")}
              </p>
            </div>
          </Card>
        )}

        {/* === SHARED STATE (after paste) === */}
        {appState === "shared" && sharedRoom && (
          <Card className="p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Badge
                  variant={timeLeft <= 60 ? "destructive" : "secondary"}
                  className="font-mono text-sm"
                >
                  <Timer className="mr-1 h-3 w-3" />
                  {formatTime(timeLeft)}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Normal mode - QR + Code */}
              {!sharedRoom.is_secure && (
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded bg-white p-3">
                    <QRCodeSVG value={shareUrl} size={160} level="M" />
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <p className="text-2xl font-mono font-bold tracking-[0.35em] group-hover:text-primary transition-colors">
                      {sharedRoom.code}
                    </p>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      {codeCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </div>
              )}

              {/* Secure mode - QR only */}
              {sharedRoom.is_secure && (
                <div className="flex flex-col items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    Secure
                  </Badge>
                  <div className="rounded bg-white p-3">
                    <QRCodeSVG value={shareUrl} size={160} level="M" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("scan_to_receive")}
                  </p>
                </div>
              )}

              {sharedRoom.item && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {t("shared_content")}
                    </p>
                    <ContentRenderer item={sharedRoom.item} />
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* === RECEIVED STATE === */}
        {appState === "received" && receivedRoom && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-mono">
                  {receivedRoom.code}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {receivedRoom.items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {t("no_content")}
                </p>
              ) : (
                <div className="space-y-4">
                  {receivedRoom.items.map((item) => (
                    <div key={item.id}>
                      <ContentRenderer item={item} />
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("new_clipboard")}
              </Button>
            </div>
          </Card>
        )}

        <footer className="text-center">
          <p className="text-xs text-muted-foreground/40">
            {t("expires_footer")}
          </p>
        </footer>

        {/* AdSense */}
        <AdSense
          adClient="ca-pub-2563278096701182"
          adSlot="7587477132"
          className="mt-4"
        />
      </div>

      {/* SEO: noscript fallback for crawlers */}
      <noscript>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Copy Cloud — Instant Copy &amp; Paste Across Devices</h2>
          <p>
            Copy Cloud lets you instantly share text, links, YouTube videos,
            Google Maps addresses, and images between any devices. Simply paste
            your content to get a 6-digit code or QR code. No account or
            installation needed — content automatically expires after 5 minutes
            for your privacy and security.
          </p>
          <h3>Features</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>Instant text, link, and image sharing</li>
            <li>6-digit code for quick access</li>
            <li>QR code for mobile scanning</li>
            <li>YouTube link detection with preview</li>
            <li>Google Maps address detection</li>
            <li>Secure mode with encrypted hash URL</li>
            <li>Auto-expires in 5 minutes</li>
            <li>No sign-up required</li>
          </ul>
        </div>
      </noscript>
    </main>
  );
}
