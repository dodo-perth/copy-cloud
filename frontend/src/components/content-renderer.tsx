"use client";

import { RoomItem, getImageUrl } from "@/lib/api";
import { extractYouTubeId } from "@/lib/content-detect";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Copy,
  ExternalLink,
  Play,
  MapPin,
  Download,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContentRendererProps {
  item: RoomItem;
}

export function ContentRenderer({ item }: ContentRendererProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(t("copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("failed_copy"));
    }
  };

  switch (item.content_type) {
    case "youtube": {
      const videoId = extractYouTubeId(item.content);
      return (
        <div className="space-y-3">
          {videoId && (
            <div className="aspect-video w-full overflow-hidden rounded">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => window.open(item.content, "_blank")}
              className="flex-1"
            >
              <Play className="mr-2 h-4 w-4" />
              {t("open_youtube")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(item.content)}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      );
    }

    case "map":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground break-all">
            {item.content}
          </p>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => window.open(item.content, "_blank")}
              className="flex-1"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {t("open_maps")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(item.content)}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      );

    case "url":
      return (
        <div className="space-y-3">
          <p className="text-sm text-primary break-all underline underline-offset-2">
            {item.content}
          </p>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => window.open(item.content, "_blank")}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("open_link")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(item.content)}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <div className="overflow-hidden rounded">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(item.content)}
              alt={item.original_filename || "Uploaded image"}
              className="w-full object-contain max-h-64"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const a = document.createElement("a");
                a.href = getImageUrl(item.content);
                a.download = item.original_filename || "image";
                a.click();
              }}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("download")}
            </Button>
          </div>
        </div>
      );

    case "text":
    default:
      return (
        <div className="space-y-3">
          <p className="text-sm whitespace-pre-wrap break-all leading-relaxed">
            {item.content}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(item.content)}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t("copied_text")}
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {t("copy_text")}
              </>
            )}
          </Button>
        </div>
      );
  }
}
