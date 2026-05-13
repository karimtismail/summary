"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sidebar } from "@/components/docs/Sidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const portalRoot = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : openButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((element) => element.offsetParent !== null || element === document.activeElement);

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  const drawer = open ? (
    <div className="fixed inset-0 z-50 h-dvh w-dvw lg:hidden">
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" onClick={() => setOpen(false)} />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        className="absolute left-0 top-0 h-dvh w-[92vw] max-w-sm overflow-y-auto border-r border-border bg-bg p-4 shadow-soft sm:p-5"
      >
        <div className="mb-5 flex items-center justify-between">
          <span id="mobile-navigation-title" className="text-sm font-semibold text-text">
            Handbook
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-muted transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-muted transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </button>
      {drawer && portalRoot ? createPortal(drawer, portalRoot) : null}
    </>
  );
}
