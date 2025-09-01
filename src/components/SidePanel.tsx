import React, { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = { open: boolean; onClose: () => void; children?: React.ReactNode };

export default function SidePanel({ open, onClose, children }: Props) {
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLElement|null>(null);
  const selector = useMemo(() =>
    'a,button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])', []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const el = panelRef.current as HTMLElement;
    el.querySelector<HTMLElement>(selector)?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const f = el.querySelectorAll<HTMLElement>(selector);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && active === last) { first.focus(); e.preventDefault(); }
    }
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previous?.focus?.(); };
  }, [open, onClose, selector]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          id="sidepanel"
          ref={(n) => (panelRef.current = n)}
          role="menu"
          aria-label="Navigation"
          className={`sidepanel ${open ? "pop-seq" : ""}`}
          initial={{ opacity: 0, scale: 0.96, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -6 }}
          transition={{
            type: "tween",
            ease: [0.2, 0.8, 0.2, 1],
            duration: prefersReduced ? 0 : 0.22,
          }}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) onClose();
          }}
        >
          <div className="divider" aria-hidden="true" />
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
