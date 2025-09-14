import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/styles.css";

function Services(){
  return (
    <main style={{padding:"40px 20px", maxWidth: 980, margin: "0 auto", color: "#fff"}}>
      <h1>Services</h1>
      <p>Page dédiée aux services. Contenu à définir.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Services />);

