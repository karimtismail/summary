import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { MobileSidebar } from "@/components/docs/MobileSidebar";
import { ReadingProgress } from "@/components/docs/ReadingProgress";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { contentCurrentAsOf, handbookName } from "@/lib/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Engineering Systems Handbook",
    template: "%s | Engineering Systems Handbook"
  },
  description: "A premium long-form engineering handbook for runtime internals, distributed systems, protocols, performance, data platforms, and production engineering updated for 2026."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ReadingProgress />
          <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-2.5 px-4 sm:gap-3 sm:px-6 lg:px-8">
              <MobileSidebar />
              <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-panel text-accent shadow-inset">
                  <BookOpenText className="h-4 w-4" />
                </span>
                <span className="truncate text-sm font-semibold text-text sm:hidden">Systems Handbook</span>
                <span className="hidden text-sm font-semibold text-text sm:inline">{handbookName}</span>
              </Link>
              <nav className="ml-auto hidden items-center gap-6 text-sm text-muted md:flex">
                <Link className="transition hover:text-text" href="/handbook">
                  Topics
                </Link>
                <Link className="transition hover:text-text" href="/handbook/cheatsheets">
                  Cheat sheets
                </Link>
                <Link className="transition hover:text-text" href="/handbook/foundations/blocking-io">
                  Start
                </Link>
                <Link className="transition hover:text-text" href="/handbook/mastery/architecture">
                  Architecture
                </Link>
              </nav>
              <span className="hidden rounded-md border border-border bg-panel px-2.5 py-1 text-xs text-muted xl:inline">Current as of {contentCurrentAsOf}</span>
              <div className="ml-auto md:ml-2">
                <ThemeToggle />
              </div>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
