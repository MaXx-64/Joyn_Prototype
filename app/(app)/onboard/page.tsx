"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hi! I'm Jo 👋 I'm here to help you find the perfect workout partner. This will only take about 3 minutes. First — what's your name?",
    },
  ],
};

const STEPS = ["About You", "Your Interests", "Get Matched"];

interface OnboardingProfile {
  name?: string;
  city?: string;
  fitness_level?: string;
  interests?: string[];
  age?: number;
  connection_preference?: string;
  health_goals?: string[];
  preferred_time?: string;
}

export default function OnboardPage() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  // Prevent double-save if the effect fires twice
  const hasSaved = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
    messages: [WELCOME_MESSAGE],
  });

  // Auto-scroll + step tracker
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const userCount = messages.filter((m) => m.role === "user").length;
    if (userCount >= 4) setStep(2);
    else if (userCount >= 2) setStep(1);
    else setStep(0);
  }, [messages]);

  // Detect completed profile JSON in the latest assistant message
  useEffect(() => {
    if (hasSaved.current) return;

    const lastBot = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastBot) return;

    const text = lastBot.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");

    const match = text.match(/<profile>([\s\S]*?)<\/profile>/);
    if (!match) return;

    let profileData: OnboardingProfile;
    try {
      profileData = JSON.parse(match[1].trim());
    } catch {
      return; // JSON not complete yet — wait for next message
    }

    hasSaved.current = true;
    saveProfileAndEmbed(profileData);
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveProfileAndEmbed(data: OnboardingProfile) {
    setSaving(true);
    setSaveError("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSaveError("Session expired. Please sign in again.");
        setSaving(false);
        hasSaved.current = false;
        return;
      }

      // ── 1. Upsert core profile ───────────────────────────────────────
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: data.name ?? null,
        age: data.age ?? null,
        city: data.city ?? null,
        fitness_level: data.fitness_level?.toLowerCase() ?? null,
        health_goals: data.health_goals ?? [],
        connection_preference: data.connection_preference ?? "both",
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        throw new Error(`Profile save failed: ${profileError.message}`);
      }

      // ── 2. Map interests → interest IDs and save junction rows ───────
      if (Array.isArray(data.interests) && data.interests.length > 0) {
        const { data: allInterests } = await supabase
          .from("interests")
          .select("id, name");

        if (allInterests) {
          const lowerUserInterests = data.interests.map((i) => i.toLowerCase());
          const junctionRows = allInterests
            .filter((i) => lowerUserInterests.includes(i.name.toLowerCase()))
            .map((i) => ({ user_id: user.id, interest_id: i.id }));

          if (junctionRows.length > 0) {
            // upsert so re-running onboarding doesn't create duplicates
            await supabase
              .from("user_interests")
              .upsert(junctionRows, { onConflict: "user_id,interest_id" });
          }
        }
      }

      // ── 3. Generate semantic embedding for AI matching ────────────────
      const embedRes = await fetch("/api/ai/match/embed", { method: "POST" });
      if (!embedRes.ok) {
        // Non-fatal — matching will generate the embedding on first visit
        console.warn("[onboard] Embedding generation skipped:", await embedRes.text());
      }

      // ── 4. Go to dashboard ────────────────────────────────────────────
      router.push("/dashboard");
    } catch (err) {
      console.error("[onboard] Save error:", err);
      setSaveError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setSaving(false);
      hasSaved.current = false;
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || status !== "ready") return;
    sendMessage({ text: inputValue });
    setInputValue("");
    inputRef.current?.focus();
  }

  const isStreaming = status === "streaming" || status === "submitted";

  // ── Saving overlay ────────────────────────────────────────────────────────
  if (saving) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#FEF9ED",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-lexend), sans-serif",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "#173124",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-epilogue), serif",
          fontWeight: 700,
          fontSize: "1.25rem",
          animation: "jo-pulse 1.8s ease-in-out infinite",
        }}>
          Jo
        </div>
        <div>
          <p style={{
            fontFamily: "var(--font-epilogue), serif",
            fontWeight: 700,
            fontSize: "1.75rem",
            color: "#173124",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}>
            Setting up your profile…
          </p>
          <p style={{ fontSize: "1.0625rem", color: "#727973" }}>
            Finding your best matches — this only takes a moment 🌻
          </p>
        </div>
        <style>{`
          @keyframes jo-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(23,49,36,0.4); }
            50% { box-shadow: 0 0 0 16px rgba(23,49,36,0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FEF9ED",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-lexend), sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        backgroundColor: "#F8F3E8",
        padding: "1.5rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <p className="label-meta" style={{ marginBottom: "0.25rem" }}>Getting Started</p>
          <h1 style={{
            fontFamily: "var(--font-epilogue), serif",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#173124",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            Meet Jo, your guide
          </h1>
        </div>

        {/* Step tracker */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: i <= step ? "#173124" : "#E7E2D7",
              border: `2px solid ${i <= step ? "#173124" : "#C2C8C2"}`,
              borderRadius: "3rem",
              padding: "0.375rem 1rem",
              transition: "all 0.3s ease",
            }}>
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: i <= step ? "#735C00" : "#C2C8C2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#FFFFFF",
                flexShrink: 0,
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: i <= step ? "#FFFFFF" : "#727973",
                whiteSpace: "nowrap",
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Error banner ── */}
      {saveError && (
        <div style={{
          backgroundColor: "#FEE2E2",
          border: "1px solid #FCA5A5",
          color: "#991B1B",
          padding: "0.875rem 2.5rem",
          fontSize: "0.95rem",
          fontWeight: 500,
        }}>
          {saveError} — please refresh and try again.
        </div>
      )}

      {/* ── Chat area ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "2rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        maxWidth: "800px",
        width: "100%",
        margin: "0 auto",
        alignSelf: "center",
      }}>
        {messages.map((message) => {
          const isBot = message.role === "assistant";
          const rawText = message.parts
            .filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join("");

          // Strip the <profile> block from displayed text — it's internal data
          const displayText = rawText.replace(/<profile>[\s\S]*?<\/profile>/g, "").trim();
          if (!displayText) return null;

          return (
            <div key={message.id} style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-end",
              flexDirection: isBot ? "row" : "row-reverse",
              animation: "fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              {isBot && (
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#173124",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-epilogue), serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                  border: "2px solid #E5E0D5",
                }}>
                  Jo
                </div>
              )}
              <div style={{
                maxWidth: "72%",
                backgroundColor: isBot ? "#E7E2D7" : "#173124",
                color: isBot ? "#173124" : "#FFFFFF",
                border: isBot ? "2px solid #C2C8C2" : "none",
                borderRadius: isBot ? "0.5rem 2rem 2rem 2rem" : "2rem 0.5rem 2rem 2rem",
                padding: "1.125rem 1.5rem",
                fontSize: "1.0625rem",
                lineHeight: 1.7,
              }}>
                {displayText}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isStreaming && (
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#173124",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-epilogue), serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              flexShrink: 0,
              border: "2px solid #E5E0D5",
            }}>
              Jo
            </div>
            <div style={{
              backgroundColor: "#E7E2D7",
              border: "2px solid #C2C8C2",
              borderRadius: "0.5rem 2rem 2rem 2rem",
              padding: "1.125rem 1.5rem",
              display: "flex",
              gap: "0.4rem",
              alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#727973",
                  animation: `fade-in 0.6s ease ${i * 0.2}s infinite alternate`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{ backgroundColor: "#F8F3E8", padding: "1.5rem 2.5rem" }}>
        <form onSubmit={handleSend} style={{
          display: "flex",
          gap: "1rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}>
          <input
            ref={inputRef}
            type="text"
            className="input-base"
            placeholder={isStreaming ? "Jo is thinking..." : "Type your message..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isStreaming}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={isStreaming || !inputValue.trim()}
            className="btn-primary"
            style={{
              padding: "0 1.75rem",
              opacity: isStreaming || !inputValue.trim() ? 0.5 : 1,
              cursor: isStreaming || !inputValue.trim() ? "not-allowed" : "pointer",
              flexShrink: 0,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
