import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { logout } from "@/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/leads", label: "Leads", icon: "📥" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "📩" },
  { href: "/admin/accounts", label: "Revenue & Expenses", icon: "📒" },
  { href: "/admin/pricing", label: "Equipment Pricing", icon: "💰" },
  { href: "/admin/systems", label: "My System Pages", icon: "🔆" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/audit-log", label: "Audit Log", icon: "🔍" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
] as const;

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-navy text-white lg:flex">
        <div className="flex h-20 items-center px-6">
          <div className="inline-flex rounded-xl bg-white p-2">
            <Image
              src="/images/logo-transparent.png"
              alt="PowerNexa Solutions"
              width={1536}
              height={1024}
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs text-white/50">{user.email}</p>
          <Link href="/" className="mt-2 block text-xs font-medium text-white/70 hover:text-white">
            ← View live site
          </Link>
          <form action={logout}>
            <button type="submit" className="mt-3 w-full rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">
              Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-5 lg:hidden">
          <Image
            src="/images/logo.png"
            alt="PowerNexa Solutions"
            width={1536}
            height={1024}
            className="h-9 w-auto object-contain"
          />
          <form action={logout}>
            <button type="submit" className="text-xs font-semibold text-navy">
              Log out
            </button>
          </form>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-navy hover:bg-mist"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
