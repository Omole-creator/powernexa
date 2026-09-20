import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="PowerNexa Solutions" width={1536} height={1024} className="h-14 w-auto object-contain" />
        </div>
        <h1 className="mt-6 text-center font-display text-xl font-bold text-navy">Staff & partner login</h1>
        <p className="mt-1 text-center text-sm text-charcoal/55">Leads, analytics, and the blog editor.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
