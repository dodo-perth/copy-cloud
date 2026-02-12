"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";

interface QrDialogProps {
  code: string;
  isSecure: boolean;
}

export function QrDialog({ code, isSecure }: QrDialogProps) {
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}?code=${code}`
    : "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="mr-2 h-4 w-4" />
          QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isSecure ? "Secure Share" : `Code: ${code}`}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-xl bg-white p-4">
            <QRCodeSVG value={shareUrl} size={200} level="M" />
          </div>
          {!isSecure && (
            <p className="text-2xl font-mono font-bold tracking-[0.3em] text-center">
              {code}
            </p>
          )}
          <p className="text-xs text-muted-foreground text-center">
            Scan QR code or enter the code on another device
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
