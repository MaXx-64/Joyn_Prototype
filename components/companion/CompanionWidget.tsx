"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";

const WELCOME_MESSAGE: UIMessage = {
  id: "companion-welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hi there! 😊 How are you feeling today? I'm Jo, and I'm here whenever you want to chat.",
    },
  ],
};

export function CompanionWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/companion" }),
    messages: [WELCOME_MESSAGE],
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Mobile detection — full-screen panel below 480px
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Focus trap: keep Tab key inside the panel while open
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = panel!.querySelectorAll<HTMLElement>(
        'button, textarea, [href], [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleSend() {
    if (!inputValue.trim() || isStreaming) return;
    sendMessage({ text: inputValue });
    setInputValue("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const sendDisabled = !inputValue.trim() || isStreaming;

  // Panel dimensions: full-screen on mobile, fixed on desktop
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        zIndex: 200,
      }
    : {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "min(380px, calc(100vw - 48px))",
        height: "min(520px, calc(100vh - 48px))",
        borderRadius: "2rem",
        zIndex: 200,
      };

  return (
    <>
      {/* ── Collapsed trigger button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Jo companion chat"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 200,
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#173124",
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-epilogue), serif",
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: "0 4px 20px rgba(23,49,36,0.35)",
            flexDirection: "column",
            gap: "2px",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(23,49,36,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(23,49,36,0.35)";
          }}
        >
          <span style={{ fontSize: "1rem", fontWeight: 700 }}>Jo</span>
          {/* Pulsing online indicator */}
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              display: "block",
              animation: "jo-pulse 2s ease-in-out infinite",
            }}
          />
        </button>
      )}

      {/* ── Expanded chat panel ── */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Jo companion chat"
          aria-modal="true"
          style={{
            ...panelStyle,
            backgroundColor: "#FEF9ED",
            border: isMobile ? "none" : "2px solid #C2C8C2",
            display: "flex",
            flexDirection: "column",
            boxShadow: isMobile ? "none" : "0 8px 40px rgba(23,49,36,0.2)",
            overflow: "hidden",
            fontFamily: "var(--font-lexend), sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#173124",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-epilogue), serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#FFFFFF",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                Jo
                <span
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#4CAF50",
                    border: "2px solid #173124",
                  }}
                />
              </div>
              <div>
                <p
                  style={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Jo
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.875rem",
                    margin: 0,
                  }}
                >
                  Your Joyn companion
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Jo companion chat"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.375rem",
                flexShrink: 0,
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
            >
              ×
            </button>
          </div>

          {/* Message list */}
          <div
            aria-live="polite"
            aria-label="Conversation with Jo"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {messages.map((message) => {
              const isBot = message.role === "assistant";
              const text = message.parts
                .filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("");

              return (
                <div
                  key={message.id}
                  style={{
                    display: "flex",
                    flexDirection: isBot ? "row" : "row-reverse",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  {isBot && (
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        backgroundColor: "#173124",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-epilogue), serif",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        flexShrink: 0,
                      }}
                    >
                      Jo
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "80%",
                      backgroundColor: isBot ? "#E7E2D7" : "#173124",
                      color: isBot ? "#173124" : "#FFFFFF",
                      border: isBot ? "2px solid #C2C8C2" : "none",
                      borderRadius: isBot
                        ? "0.375rem 1.5rem 1.5rem 1.5rem"
                        : "1.5rem 0.375rem 1.5rem 1.5rem",
                      padding: "0.875rem 1.125rem",
                      fontSize: "1.125rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isStreaming && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    backgroundColor: "#173124",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-epilogue), serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    flexShrink: 0,
                  }}
                >
                  Jo
                </div>
                <div
                  style={{
                    backgroundColor: "#E7E2D7",
                    border: "2px solid #C2C8C2",
                    borderRadius: "0.375rem 1.5rem 1.5rem 1.5rem",
                    padding: "0.875rem 1.125rem",
                    display: "flex",
                    gap: "0.35rem",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        backgroundColor: "#727973",
                        animation: `jo-dot 1.2s ease ${i * 0.2}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              padding: "0.875rem 1rem",
              borderTop: "2px solid #C2C8C2",
              backgroundColor: "#F8F3E8",
              display: "flex",
              gap: "0.625rem",
              alignItems: "flex-end",
              flexShrink: 0,
            }}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? "Jo is thinking…" : "Type a message…"}
              disabled={isStreaming}
              rows={1}
              aria-label="Message Jo"
              style={{
                flex: 1,
                resize: "none",
                border: "2px solid #C2C8C2",
                borderRadius: "1rem",
                padding: "0.875rem 1rem",
                fontFamily: "var(--font-lexend), sans-serif",
                fontSize: "1rem",
                color: "#173124",
                backgroundColor: "#FFFFFF",
                minHeight: "52px",
                maxHeight: "120px",
                lineHeight: 1.5,
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#173124"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#C2C8C2"; }}
            />
            <button
              onClick={handleSend}
              disabled={sendDisabled}
              aria-label="Send message"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: sendDisabled ? "#C2C8C2" : "#173124",
                color: "#FFFFFF",
                border: "none",
                cursor: sendDisabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                flexShrink: 0,
                transition: "background-color 0.15s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!sendDisabled) e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes jo-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes jo-dot {
          0% { opacity: 0.3; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
