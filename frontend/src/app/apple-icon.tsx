import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #146ef5, #0b5cd5)",
          borderRadius: "36px",
          fontFamily: "system-ui, sans-serif",
          fontSize: "80px",
          fontWeight: 700,
          color: "white",
          letterSpacing: "-0.02em",
        }}
      >
        CC
      </div>
    ),
    { ...size }
  );
}
