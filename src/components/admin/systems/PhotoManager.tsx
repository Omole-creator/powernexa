"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePhotoAction } from "@/actions/customer-systems";
import { prepareImage } from "@/lib/blog-image-upload";
import type { SystemPhoto } from "@/lib/customer-systems";

export function PhotoManager({ systemId, photos }: { systemId: number; photos: SystemPhoto[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<{ busy: boolean; error?: string }>({ busy: false });

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setStatus({ busy: true });
    try {
      for (const original of Array.from(files)) {
        const { file } = await prepareImage(original);
        const body = new FormData();
        body.append("file", file);
        body.append("systemId", String(systemId));
        if (caption.trim()) body.append("caption", caption.trim());
        const res = await fetch("/api/admin/system-photo", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed.");
      }
      setCaption("");
      setStatus({ busy: false });
      router.refresh();
    } catch (error) {
      setStatus({ busy: false, error: error instanceof Error ? error.message : "Upload failed." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs font-semibold text-navy">
          Caption (optional)
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Battery and inverter, finished"
            className="mt-1 w-64 rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-orange"
          />
        </label>
        <button
          type="button"
          disabled={status.busy}
          onClick={() => fileRef.current?.click()}
          className="rounded-full bg-navy px-5 py-2 text-xs font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
        >
          {status.busy ? "Uploading..." : "Upload photos"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      </div>
      {status.error ? <p className="text-xs font-medium text-red-600">{status.error}</p> : null}

      {photos.length === 0 ? (
        <p className="text-sm text-charcoal/50">No photos yet. Add the finished installation, the wiring and the labels.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <PhotoTile key={photo.id} photo={photo} systemId={systemId} />
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoTile({ photo, systemId }: { photo: SystemPhoto; systemId: number }) {
  const [isPending, startTransition] = useTransition();
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-white">
      {photo.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.url} alt={photo.caption ?? "Installation photo"} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center text-xs text-charcoal/40">Not available</div>
      )}
      <figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
        <span className="truncate text-charcoal/70">{photo.caption ?? "No caption"}</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm("Delete this photo?")) startTransition(() => deletePhotoAction(photo.id, systemId));
          }}
          className="shrink-0 font-semibold text-charcoal/50 hover:text-red-600"
        >
          {isPending ? "..." : "Delete"}
        </button>
      </figcaption>
    </figure>
  );
}
