import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "outlineWhite" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-orange text-white hover:bg-orange-dark shadow-[0_8px_20px_-6px_rgba(245,130,32,0.55)] hover:shadow-[0_10px_24px_-6px_rgba(245,130,32,0.7)] hover:-translate-y-0.5",
  secondary: "bg-navy text-white hover:bg-navy-ink hover:-translate-y-0.5",
  outline: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
  outlineWhite: "border-2 border-white text-white hover:bg-white hover:text-navy",
  ghost: "text-navy hover:bg-mist",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type LinkButtonProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  href,
  ...props
}: LinkButtonProps | (NativeButtonProps & { href?: undefined })) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
