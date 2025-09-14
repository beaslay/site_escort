import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/styles.css";

function Secretariat(){
  return (
    <main style={{padding:"40px 20px", maxWidth: 980, margin: "0 auto", color: "#fff"}}>
      <h1>Secrétariat</h1>
      <p>Page dédiée au secrétariat. Contenu à définir.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Secretariat />);

