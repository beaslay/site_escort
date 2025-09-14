import React, { useEffect } from "react";
import "../styles/qui-je-suis.css";

export default function QuiJeSuis() {
  useEffect(() => {
    document.documentElement.classList.add("qjs-theme");
    return () => { document.documentElement.classList.remove("qjs-theme"); };
  }, []);
  return (
    <section id="qjs-root" className="qjs-wrap" />
  );
}
