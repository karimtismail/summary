"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/docs/Sidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-muted lg:hidden"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/60" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[92vw] max-w-sm overflow-y-auto border-r border-border bg-bg p-4 shadow-soft sm:p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-text">Handbook</span>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-muted"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
