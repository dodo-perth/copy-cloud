import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Copy Cloud — Instant Copy & Paste Across Devices";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-0.02em",
            }}
          >
            copy
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "-0.02em",
              marginLeft: "12px",
            }}
          >
            cloud
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: "700px",
            margin: 0,
          }}
        >
          Instantly share text, links & images between devices.
          No sign-up — just paste and go.
        </p>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
          }}
        >
          {["6-Digit Code", "QR Sharing", "Auto-Expires", "Secure Mode"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <p
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.05em",
          }}
        >
          copy-cloud.vercel.app
        </p>
      </div>
    ),
    { ...size }
  );
}
