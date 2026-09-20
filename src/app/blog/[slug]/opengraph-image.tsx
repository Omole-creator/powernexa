import { ImageResponse } from "next/og";
import { getPublishedPostBySlug } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  const title = post?.title ?? "PowerNexa Solutions";
  const category = post?.category ?? "Solar & Inverter";

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
            {category}
          </span>
          <span style={{ color: "#ffffff", fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
            {title}
          </span>
        </div>

        <div style={{ display: "flex", height: 8, width: "100%", background: "#f58220", borderRadius: 999 }} />
      </div>
    ),
    { ...size }
  );
}
