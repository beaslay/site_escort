import React from "react";
import "../styles/chat.css";

export default function ChatShell(){
  return (
    <div className="chat-shell">
      <div className="chat-shell__container">
        <header className="chat-shell__header">
          <h2 className="chat-shell__title">Chat Header</h2>
          <p className="chat-shell__subtitle">Placeholder for conversation details.</p>
        </header>

        <section className="chat-shell__feed" aria-label="Chat feed">
          <div className="chat-shell__placeholder">Feed area (scrollable).</div>
        </section>

        <footer className="chat-shell__composer">
          <p className="chat-shell__placeholder">Composer area (input controls go here).</p>
        </footer>
      </div>
    </div>
  );
}
