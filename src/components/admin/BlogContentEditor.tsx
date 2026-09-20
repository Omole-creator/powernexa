"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { MarkdownContent } from "@/components/marketing/MarkdownContent";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

type Selection = { start: number; end: number };

export function BlogContentEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  function getSelection(): Selection {
    const el = textareaRef.current;
    if (!el) return { start: value.length, end: value.length };
    return { start: el.selectionStart, end: el.selectionEnd };
  }

  function focusAndSelect(start: number, end: number) {
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(start, end);
    });
  }

  function wrapSelection(prefix: string, suffix: string = prefix, placeholder = "text") {
    const { start, end } = getSelection();
    const current = valueRef.current;
    const selected = current.slice(start, end) || placeholder;
    const next = current.slice(0, start) + prefix + selected + suffix + current.slice(end);
    onChange(next);
    focusAndSelect(start + prefix.length, start + prefix.length + selected.length);
  }

  function prefixLine(linePrefix: string) {
    const { start, end } = getSelection();
    const current = valueRef.current;
    const lineStart = current.lastIndexOf("\n", start - 1) + 1;
    const next = current.slice(0, lineStart) + linePrefix + current.slice(lineStart);
    onChange(next);
    focusAndSelect(start + linePrefix.length, end + linePrefix.length);
  }

  function insertLink() {
    const { start, end } = getSelection();
    const current = valueRef.current;
    const selected = current.slice(start, end) || "link text";
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    const markdown = `[${selected}](${url})`;
    const next = current.slice(0, start) + markdown + current.slice(end);
    onChange(next);
    focusAndSelect(start + markdown.length, start + markdown.length);
  }

  async function uploadFile(file: File) {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files can be uploaded.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(`"${file.name}" is larger than 5MB.`);
      return;
    }

    const { start } = getSelection();
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/blog-image", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      const alt = file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();
      const markdown = `![${alt}](${data.url})\n`;
      const current = valueRef.current;
      const next = current.slice(0, start) + markdown + current.slice(start);
      onChange(next);
      focusAndSelect(start + markdown.length, start + markdown.length);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
    if (file) {
      e.preventDefault();
      void uploadFile(file);
    }
  }

  const buttonClass =
    "rounded-lg px-2.5 py-1.5 text-sm font-semibold text-charcoal/70 hover:bg-mist hover:text-navy disabled:opacity-40 disabled:pointer-events-none";

  return (
    <div className="mt-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border border-b-0 border-line bg-mist/60 px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          <button type="button" title="Bold" className={`${buttonClass} font-bold`} onClick={() => wrapSelection("**")}>
            B
          </button>
          <button type="button" title="Italic" className={`${buttonClass} italic`} onClick={() => wrapSelection("*")}>
            I
          </button>
          <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
          <button type="button" title="Heading 2" className={buttonClass} onClick={() => prefixLine("## ")}>
            H2
          </button>
          <button type="button" title="Heading 3" className={buttonClass} onClick={() => prefixLine("### ")}>
            H3
          </button>
          <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
          <button type="button" title="Bullet list" className={buttonClass} onClick={() => prefixLine("- ")}>
            • List
          </button>
          <button type="button" title="Numbered list" className={buttonClass} onClick={() => prefixLine("1. ")}>
            1. List
          </button>
          <button type="button" title="Quote" className={buttonClass} onClick={() => prefixLine("> ")}>
            Quote
          </button>
          <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
          <button type="button" title="Link" className={buttonClass} onClick={insertLink}>
            Link
          </button>
          <button
            type="button"
            title="Insert image"
            className={buttonClass}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading..." : "Image"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadFile(file);
              e.target.value = "";
            }}
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-white p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`rounded-md px-3 py-1 font-semibold ${tab === "write" ? "bg-navy text-white" : "text-charcoal/60"}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-md px-3 py-1 font-semibold ${tab === "preview" ? "bg-navy text-white" : "text-charcoal/60"}`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className={tab === "write" ? "block" : "hidden"}>
        <textarea
          ref={textareaRef}
          name="content"
          required
          rows={20}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onPaste={handlePaste}
          placeholder="Write in Markdown: ## for headings, - for bullet points. Drag and drop, paste, or use the Image button to add pictures."
          className={`w-full rounded-b-xl border px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 ${
            dragActive ? "border-orange bg-orange/5" : "border-line"
          }`}
        />
      </div>

      {tab === "preview" ? (
        <div className="min-h-[280px] rounded-b-xl border border-line bg-white px-6 py-5">
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-sm text-charcoal/50">Nothing to preview yet. Write some content first.</p>
          )}
        </div>
      ) : null}

      {uploadError ? <p className="mt-2 text-sm font-medium text-red-600">{uploadError}</p> : null}
    </div>
  );
}
