import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://copy-cloud.vercel.app";
const SITE_NAME = "Copy Cloud";
const SITE_DESCRIPTION =
  "Instantly share text, links, images, and more between devices. Paste anything and get a 6-digit code or QR — no sign-up required. Content auto-expires in 5 minutes for privacy.";

export const metadata: Metadata = {
  verification: {
    google: "yLq1hH6HPMvSx9JOM_i1QHUQSlCy-9V0-sAU0BVMsFI",
  },
  title: {
    default: `${SITE_NAME} — Instant Copy & Paste Across Devices`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "copy paste online",
    "share clipboard",
    "cross device clipboard",
    "instant file sharing",
    "QR code sharing",
    "text sharing",
    "link sharing",
    "image sharing",
    "temporary clipboard",
    "copy cloud",
    "online clipboard",
    "device to device transfer",
    "share text between devices",
    "share links between phone and computer",
    "클립보드 공유",
    "기기간 복사 붙여넣기",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Instant Copy & Paste Across Devices`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copy Cloud — share anything instantly with a code or QR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Instant Copy & Paste Across Devices`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

// JSON-LD structured data for rich search results
function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Instant text sharing between devices",
      "QR code for quick mobile access",
      "Image drag & drop upload",
      "YouTube link preview",
      "Google Maps address detection",
      "Secure sharing mode",
      "Auto-expires after 5 minutes",
      "No sign-up required",
    ],
    browserRequirements: "Requires a modern web browser",
    softwareVersion: "1.0.0",
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2563278096701182"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
