"use client";

import { useEffect } from "react";

interface AdSenseProps {
  adClient: string;
  adSlot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export function AdSense({
  adClient,
  adSlot,
  format = "auto",
  responsive = true,
  className = "",
}: AdSenseProps) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch {
      // AdSense not loaded
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
