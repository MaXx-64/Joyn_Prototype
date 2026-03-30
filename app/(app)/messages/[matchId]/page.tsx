"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";

const mockPartners: Record<string, { name: string; initials: string }> = {
  "1": { name: "Margaret", initials: "MW" },
  "2": { name: "Robert", initials: "RJ" },
  "3": { name: "Dorothy", initials: "DL" },
};

type Message = {
  id: string;
  content: string;
  fromMe: boolean;
  time: string;
};

const initialMessages: Record<string, Message[]> = {
  "1": [
    { id: "a1", content: "Hi Margaret! I saw we were matched and wanted to say hello 😊", fromMe: true, time: "10:02 AM" },
    { id: "a2", content: "Oh how lovely! I'm so glad you reached out. I've been hoping to find someone to walk with in the mornings.", fromMe: false, time: "10:15 AM" },
    { id: "a3", content: "That sounds wonderful! I'd love to join you for a morning walk.", fromMe: false, time: "10:16 AM" },
  ],
  "2": [
    { id: "b1", content: "Robert, looking forward to our session on Thursday!", fromMe: true, time: "Yesterday" },
    { id: "b2", content: "Looking forward to our session on Thursday!", fromMe: false, time: "Yesterday" },
  ],
  "3": [
    { id: "c1", content: "Dorothy, how was birdwatching this morning?", fromMe: true, time: "8:30 AM" },
    { id: "c2", content: "The birdwatching at Riparian was amazing this morning.", fromMe: false, time: "9:00 AM" },
  ],
};

export default function ThreadPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const partner = mockPartners[matchId] ?? { name: "Your Match", initials: "?" };
  const [messages, setMessages] = useState<Message[]>(initialMessages[matchId] ?? []);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    const newMsg: Message = {
      id: String(Date.now()),
      content: text,
      fromMe: true,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      style={{
        fontFamily: "'Lexend', sans-serif",
        color: "#173124",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "720px",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FEF9ED",
          borderBottom: "1px solid #C2C8C2",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexShrink: 0,
        }}
      >
        <Link
          href="/messages"
          style={{
            color: "#727973",
            textDecoration: "none",
            fontSize: "1.25rem",
            minWidth: "44px",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ←
        </Link>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#173124",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Epilogue', serif",
            fontWeight: 700,
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {partner.initials}
        </div>
        <div>
          <p
            style={{
              fontFamily: "'Epilogue', serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#173124",
              lineHeight: 1.2,
            }}
          >
            {partner.name}
          </p>
          <Link
            href={`/match/${matchId}`}
            style={{ fontSize: "0.8rem", color: "#735C00", textDecoration: "none" }}
          >
            View profile →
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div
        aria-live="polite"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.875rem",
          backgroundColor: "#F8F3E8",
        }}
      >
        {messages.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#727973",
              fontSize: "1.0625rem",
              marginTop: "2rem",
            }}
          >
            Say hello to {partner.name}! Send your first message below.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: msg.fromMe ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: "0.5rem",
            }}
          >
            {!msg.fromMe && (
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#173124",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Epilogue', serif",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  flexShrink: 0,
                }}
              >
                {partner.initials}
              </div>
            )}
            <div style={{ maxWidth: "72%" }}>
              <div
                style={{
                  backgroundColor: msg.fromMe ? "#173124" : "#E7E2D7",
                  color: msg.fromMe ? "#FFFFFF" : "#173124",
                  border: msg.fromMe ? "none" : "2px solid #C2C8C2",
                  borderRadius: msg.fromMe ? "1.5rem 0.375rem 1.5rem 1.5rem" : "0.375rem 1.5rem 1.5rem 1.5rem",
                  padding: "0.875rem 1.125rem",
                  fontSize: "1.0625rem",
                  lineHeight: 1.6,
                }}
              >
                {msg.content}
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#727973",
                  marginTop: "0.25rem",
                  textAlign: msg.fromMe ? "right" : "left",
                }}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div
        style={{
          backgroundColor: "#FEF9ED",
          borderTop: "1px solid #C2C8C2",
          padding: "1rem 1.25rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "flex-end",
          flexShrink: 0,
        }}
      >
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          aria-label={`Message ${partner.name}`}
          style={{
            flex: 1,
            resize: "none",
            border: "2px solid #C2C8C2",
            borderRadius: "1rem",
            padding: "0.875rem 1rem",
            fontFamily: "'Lexend', sans-serif",
            fontSize: "1.0625rem",
            color: "#173124",
            backgroundColor: "#FFFFFF",
            minHeight: "52px",
            maxHeight: "120px",
            lineHeight: 1.5,
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          aria-label="Send message"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: inputValue.trim() ? "#173124" : "#C2C8C2",
            color: "#FFFFFF",
            border: "none",
            cursor: inputValue.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            flexShrink: 0,
            transition: "background-color 0.15s",
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
