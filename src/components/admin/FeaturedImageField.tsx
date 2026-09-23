"use client";

import { useRef, useState, type DragEvent } from "react";
import { uploadBlogImage } from "@/lib/blog-image-upload";

// Below this width the image gets stretched on the post page and looks soft.
const MIN_SHARP_WIDTH = 1200;

export function FeaturedImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadBlogImage(file);
      setNaturalWidth(null);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal/80">Featured image</label>
      <p className="mt-0.5 text-xs text-charcoal/50">
        Shown at the top of the post, as the blog card thumbnail, and when the link is shared. Use a landscape photo at
        least {MIN_SHARP_WIDTH}px wide.
      </p>
      <input type="hidden" name="featuredImage" value={value} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`mt-2 overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          dragActive ? "border-orange bg-orange/5" : "border-line"
        }`}
      >
        {value ? (
          <div className="relative aspect-[16/9] w-full bg-mist">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              onLoad={(e) => setNaturalWidth(e.currentTarget.naturalWidth)}
              className="h-full w-full object-cover"
            />
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-navy">
                Uploading...
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-1 text-sm text-charcoal/60 hover:bg-mist disabled:opacity-60"
          >
            <span className="font-semibold text-navy">{uploading ? "Uploading..." : "Upload image"}</span>
            <span className="text-xs">or drag a photo here</span>
          </button>
        )}
      </div>

      {value ? (
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-semibold text-orange hover:text-orange-dark disabled:opacity-40"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => {
              setNaturalWidth(null);
              onChange("");
            }}
            disabled={uploading}
            className="text-sm font-semibold text-charcoal/60 hover:text-red-600 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      ) : null}

      {value && naturalWidth !== null && naturalWidth < MIN_SHARP_WIDTH ? (
        <p className="mt-2 text-sm font-medium text-amber-700">
          This image is only {naturalWidth}px wide, so it will look blurry on the post. Upload a larger photo if you
          have one.
        </p>
      ) : null}
      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
