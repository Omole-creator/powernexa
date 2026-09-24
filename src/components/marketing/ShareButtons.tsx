"use client";

import { useEffect, useState } from "react";
import { SocialIcon, type SocialNetwork } from "@/components/layout/SocialIcon";
import { SOCIAL_HANDLE } from "@/lib/constants";

type Props = {
  url: string;
  title: string;
  label?: string;
  className?: string;
};

function shareLinks(url: string, title: string): { network: SocialNetwork; label: string; href: string; color: string }[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { network: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, color: "hover:bg-[#25D366]" },
    { network: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, color: "hover:bg-[#1877F2]" },
    { network: "x", label: "X", href: `https://x.com/intent/post?text=${t}&url=${u}&via=${SOCIAL_HANDLE.slice(1)}`, color: "hover:bg-black" },
    { network: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, color: "hover:bg-[#0A66C2]" },
  ];
}

export function ShareButtons({ url, title, label = "Share", className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Only phones and some browsers have the system share sheet (it also
    // reaches Instagram and TikTok, which have no share link of their own).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // Closing the share sheet throws; nothing to do.
    }
  };

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full bg-mist text-navy transition hover:-translate-y-0.5 hover:text-white";

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      <span className="mr-1 text-sm font-semibold text-navy">{label}</span>
      {shareLinks(url, title).map((link) => (
        <a
          key={link.network}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          title={`Share on ${link.label}`}
          className={`${buttonClass} ${link.color}`}
        >
          <SocialIcon network={link.network} className="h-[18px] w-[18px]" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        title="Copy link"
        className={`${buttonClass} hover:bg-orange`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>
      {canNativeShare ? (
        <button
          type="button"
          onClick={nativeShare}
          aria-label="More ways to share"
          title="More ways to share"
          className={`${buttonClass} hover:bg-navy`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
        </button>
      ) : null}
      <span role="status" className="text-xs font-medium text-green-700">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
