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
    default: "Network Systems Handbook",
    template: "%s | Network Systems Handbook"
  },
  description: "A premium long-form engineering handbook for Java NIO, Netty, Kafka, protocols, and production network systems updated for 2026."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ReadingProgress />
          <header className="sticky top-0 z-30 border-b border-border bg-bg/86 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
              <MobileSidebar />
              <Link href="/" className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-accent shadow-inset">
                  <BookOpenText className="h-4 w-4" />
                </span>
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
                <Link className="transition hover:text-text" href="/handbook/performance/backpressure">
                  Production
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
