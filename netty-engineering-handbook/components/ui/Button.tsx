import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CommonProps = {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  className?: string;
};

const variants = {
  primary: "border-accent/50 bg-accent text-[#17120d] hover:bg-[#e0b487]",
  secondary: "border-border bg-panel text-text hover:border-accent/50 hover:bg-card",
  ghost: "border-transparent bg-transparent text-muted hover:text-text"
};

export function Button({ variant = "primary", className, children, ...props }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      className={cn(
        "inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition",
        variants[variant],
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
