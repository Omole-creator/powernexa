import { ImageResponse } from "next/og";
import { DEFAULT_LEAD_MAGNET } from "@/lib/lead-magnets";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = DEFAULT_LEAD_MAGNET.title;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#092b4c",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#f58220", display: "flex" }} />
          <span style={{ color: "#ffffff", fontSize: 28, fontWeight: 700 }}>PowerNexa Solutions</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              alignSelf: "flex-start",
              background: "rgba(245,130,32,0.18)",
              color: "#ffc857",
              padding: "8px 20px",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Free checklist
          </span>
          <span style={{ color: "#ffffff", fontSize: 60, fontWeight: 700, lineHeight: 1.12, maxWidth: 1050 }}>
            {DEFAULT_LEAD_MAGNET.title}
          </span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 28 }}>
            2 pages. Ask these before you pay any installer.
          </span>
        </div>

        <div style={{ display: "flex", height: 8, width: "100%", background: "#f58220", borderRadius: 999 }} />
      </div>
    ),
    { ...size }
  );
}
