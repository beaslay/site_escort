 
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SidePanel from "./components/SidePanel";
import MenuToggle from "./components/MenuToggle";

export default function App(){
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement|null>(null);
  const rafRef = useRef<number|null>(null);
  const lastSpot = useRef<{ el: HTMLAnchorElement | null; x: number; y: number }>({ el: null, x: 0, y: 0 });
  
  // Spotlight: suit la souris sur les liens (optimisé via requestAnimationFrame)
  const onSpotlightMove: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    lastSpot.current = { el, x, y };
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        const s = lastSpot.current;
        if (s.el) {
          s.el.style.setProperty('--x', `${s.x}px`);
          s.el.style.setProperty('--y', `${s.y}px`);
        }
        rafRef.current = null;
      });
    }
  };
  const onSpotlightLeave: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const el = e.currentTarget;
    el.style.removeProperty('--x');
    el.style.removeProperty('--y');
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = open ? "hidden" : "";
    return () => { root.style.overflow = ""; };
  }, [open]);

  // Mesure la hauteur réelle du bouton et l'expose via --btn-h
  useEffect(() => {
    const setBtnH = () => {
      const el = btnRef.current;
      if (!el) return;
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--btn-h', `${h}px`);
    };
    setBtnH();

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && btnRef.current) {
      ro = new ResizeObserver(() => setBtnH());
      ro.observe(btnRef.current);
    }
    window.addEventListener('resize', setBtnH);
    return () => {
      ro?.disconnect?.();
      window.removeEventListener('resize', setBtnH);
      document.documentElement.style.removeProperty('--btn-h');
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Fermer sur clic à l'extérieur du bouton et du menu
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent){
      const t = e.target as HTMLElement;
      if (!t.closest('#sidepanel') && !t.closest('.julien-btn')) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="julien-btn"
        ref={btnRef}
        aria-expanded={open}
        aria-controls="sidepanel"
        onClick={() => setOpen(o => !o)}
      >
        Julien™
        <MenuToggle open={open} />
      </button>

      <SidePanel open={open} onClose={() => setOpen(false)}>
        <ul className="sp-nav">
          <li><a className="sp-link" href="#secretariat" onMouseMove={onSpotlightMove} onMouseLeave={onSpotlightLeave}>Secrétariat</a></li>
          <li><a className="sp-link" href="#qui" onMouseMove={onSpotlightMove} onMouseLeave={onSpotlightLeave}>Qui je suis&nbsp;?</a></li>
          <li><a className="sp-link" href="#portfolio" onMouseMove={onSpotlightMove} onMouseLeave={onSpotlightLeave}>Portfolio</a></li>
          <li><a className="sp-link" href="#services" onMouseMove={onSpotlightMove} onMouseLeave={onSpotlightLeave}>Services</a></li>
        </ul>
      </SidePanel>

      <main className="stage">
        <figure className="quote">
          <motion.q
            initial={{ y: 32, opacity: 0, filter: "blur(2px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: prefersReduced ? 0 : 3.9, ease: [0.2, 0.8, 0.2, 1] }}
          >
            La vérité c’est l’affaire de l’âme, non du corps.
          </motion.q>
          <a className="cta" href="#secretariat">Secrétariat</a>
        </figure>
      </main>
    </>
  );
}
