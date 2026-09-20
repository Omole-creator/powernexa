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
  const isAdmin = pathname?.startsWith("/admin");

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
