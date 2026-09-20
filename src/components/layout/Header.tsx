import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS } from "@/lib/constants";
import { HeaderCtas } from "./HeaderCtas";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 shadow-[0_1px_0_rgba(9,43,76,0.07),0_12px_28px_-22px_rgba(9,43,76,0.35)] backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="PowerNexa Solutions home">
          <Image
            src="/images/logo.png"
            alt="PowerNexa Solutions"
            width={1536}
            height={1024}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-semibold text-charcoal/80 transition hover:text-orange"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <HeaderCtas />
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
