import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/styles.css";
import ChatShell from "./components/ChatShell";

function SecretariatPage(){
  return (
    <main
      className="secretariat-page"
      style={{
        padding: "40px 20px",
        maxWidth: 980,
        margin: "0 auto",
        color: "#fff"
      }}
    >
      <h1>Secrétariat</h1>
      <p>Page dédiée au secrétariat. Contenu à définir.</p>
      <div style={{ marginTop: 32 }}>
        <ChatShell />
      </div>
    </main>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<SecretariatPage />);
}
