import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#092b4c",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{ width: 18, height: 18, borderRadius: 999, background: "#f58220", display: "flex" }} />
          <span style={{ color: "#ffc857", fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            Lagos, Nigeria
          </span>
        </div>
        <span style={{ color: "#ffffff", fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
          PowerNexa Solutions
        </span>
        <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 32, marginTop: 20, maxWidth: 900 }}>
          {SITE_TAGLINE}
        </span>
        <div style={{ display: "flex", height: 10, width: 220, background: "#f58220", borderRadius: 999, marginTop: 40 }} />
      </div>
    ),
    { ...size }
  );
}
