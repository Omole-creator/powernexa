"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { SITE_NAME } from "@/lib/constants";
import type { CustomerQuote } from "@/lib/quote";
import { buildWhatsAppUrl, toWhatsAppNumber } from "@/lib/whatsapp";
import { QuoteDocument } from "./QuoteDocument";

type Status =
  | { kind: "idle" }
  | { kind: "working" }
  | { kind: "ready"; file: File } // made, but the phone wants a fresh tap before it shares
  | { kind: "downloaded"; waUrl: string }
  | { kind: "error"; message: string };

// Turns the quote into a real PDF file in the browser and hands it to the
// phone's (or Windows') share sheet, where WhatsApp is one tap away. Where a
// browser can't share files, the PDF downloads and a button opens the
// customer's WhatsApp chat to attach it.
export function ShareQuoteButton({
  quote,
  disabled,
  className = "",
}: {
  quote: CustomerQuote;
  disabled?: boolean;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [rendering, setRendering] = useState(false);
  const holder = useRef<HTMLDivElement>(null);

  const waNumber = toWhatsAppNumber(quote.customer.phone);
  const message = `Hi ${quote.customer.name}, here is your quote from ${SITE_NAME}${quote.number ? ` (${quote.number})` : ""}.`;
  const fileName = `PowerNexa-Quote-${quote.number || quote.date}-${quote.customer.name.replace(/[^\w]+/g, "-")}.pdf`.replace(/-+/g, "-");

  const share = async (file: File) => {
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: fileName, text: message });
        setStatus({ kind: "idle" });
        return;
      } catch (error) {
        const name = (error as Error).name;
        // Closed the share sheet: keep the file for another try.
        if (name === "AbortError") return setStatus({ kind: "ready", file });
        // Making the PDF took too long for the browser to count it as the
        // same tap. One more tap shares it straight away.
        if (name === "NotAllowedError") return setStatus({ kind: "ready", file });
      }
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    setStatus({ kind: "downloaded", waUrl: waNumber ? buildWhatsAppUrl(message, waNumber) : buildWhatsAppUrl(message, "") });
  };

  const onClick = async () => {
    if (disabled || status.kind === "working") return;
    if (status.kind === "ready") return share(status.file);
    setStatus({ kind: "working" });
    flushSync(() => setRendering(true));
    try {
      const file = await makePdf(holder.current!, fileName);
      await share(file);
    } catch (error) {
      console.error(error);
      setStatus({ kind: "error", message: "Could not make the PDF. Try again, or use Preview and print to PDF." });
    } finally {
      setRendering(false);
    }
  };

  const label =
    status.kind === "working"
      ? "Making the PDF..."
      : status.kind === "ready"
        ? "PDF ready: tap to send on WhatsApp"
        : "Send PDF on WhatsApp";

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || status.kind === "working"}
        className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed ${disabled ? "bg-[#25D366]/40" : "bg-[#25D366] hover:bg-[#1eb457]"} ${className}`}
      >
        <WhatsAppIcon />
        {label}
      </button>
      {status.kind === "downloaded" ? (
        <span className="flex flex-wrap items-center gap-2 text-xs text-charcoal/70">
          This browser can&apos;t share files, so the PDF downloaded.
          <a href={status.waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#128C4B] underline">
            Open WhatsApp{waNumber ? ` with ${quote.customer.name}` : ""}
          </a>
          and attach it.
        </span>
      ) : null}
      {status.kind === "error" ? <span className="text-xs font-medium text-red-600">{status.message}</span> : null}
      {rendering ? (
        // Off-screen copy at A4 width, captured block by block.
        <div ref={holder} aria-hidden="true" style={{ position: "fixed", left: -10000, top: 0, width: 800 }}>
          <QuoteDocument quote={quote} />
        </div>
      ) : null}
    </>
  );
}

const A4 = { width: 210, height: 297, margin: 12 };

async function makePdf(holder: HTMLElement, fileName: string): Promise<File> {
  const [{ toJpeg, getFontEmbedCSS }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
  await document.fonts.ready;
  // Wait for the logo, or it comes out blank.
  await Promise.all(Array.from(holder.querySelectorAll("img")).map((img) => img.decode().catch(() => {})));

  const article = holder.querySelector("article")!;
  const blocks = Array.from(article.children) as HTMLElement[];
  const fontEmbedCSS = await getFontEmbedCSS(article);
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const contentWidth = A4.width - A4.margin * 2;
  const pageBottom = A4.height - A4.margin;
  const mmPerPx = contentWidth / blocks[0].getBoundingClientRect().width;

  let y = A4.margin;
  let prevBottom: number | null = null;
  for (const block of blocks) {
    const rect = block.getBoundingClientRect();
    if (rect.height === 0) continue;
    const image = await toJpeg(block, { quality: 0.92, pixelRatio: 2, backgroundColor: "#ffffff", fontEmbedCSS, style: { margin: "0" } });
    let width = contentWidth;
    let height = rect.height * mmPerPx;
    // A block taller than a page is shrunk to fit rather than cut through a line.
    if (height > pageBottom - A4.margin) {
      width *= (pageBottom - A4.margin) / height;
      height = pageBottom - A4.margin;
    }
    const gap = prevBottom === null ? 0 : Math.max(0, rect.top - prevBottom) * mmPerPx;
    if (y + gap + height > pageBottom && y > A4.margin) {
      pdf.addPage();
      y = A4.margin;
    } else {
      y += gap;
    }
    pdf.addImage(image, "JPEG", A4.margin, y, width, height);
    y += height;
    prevBottom = rect.bottom;
  }

  return new File([pdf.output("blob")], fileName, { type: "application/pdf" });
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 9.43 9.44c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.3 11.3 0 0 0 12.05.72C5.8.72.7 5.8.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.6l6-1.57a11.3 11.3 0 0 0 5.43 1.38h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02" />
    </svg>
  );
}
