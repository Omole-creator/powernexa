"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function ConditionalChrome({
  header,
  footer,
  whatsapp,
  analytics,
  jsonLd,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  whatsapp: ReactNode;
  analytics: ReactNode;
  jsonLd: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  // Admin and customers' private My System pages get no site chrome (and no
  // analytics, so private links never land in the page-view table).
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/my-system");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {jsonLd}
      {analytics}
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {whatsapp}
    </>
  );
}
