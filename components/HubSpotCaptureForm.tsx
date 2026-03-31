"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ── HubSpot config — run setup-hubspot.mjs to create the form, then paste the GUID here ──
const PORTAL_ID = "20194411";
const FORM_GUID = "d0e301f1-0778-43e9-bf42-3108cdb88df0";

const C = {
  green:  "#1b3428",
  yellow: "#e7c74c",
  white:  "#ffffff",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function HubSpotCaptureForm() {
  const router = useRouter();
  const [fields, setFields] = useState({ firstname: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus]   = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    if (!FORM_GUID) {
      setStatus("error");
      setErrorMsg("Form not configured yet — run setup-hubspot.mjs and add the GUID.");
      return;
    }

    try {
      const url = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: fields.firstname },
            { name: "email",     value: fields.email     },
          ],
          context: {
            pageUri:  typeof window !== "undefined" ? window.location.href : "",
            pageName: "Joyn Homepage",
          },
          legalConsentOptions: {
            consent: {
              consentToProcess: true,
              text: "I agree to Joyn's use of my information to provide the demo experience.",
              communications: consent ? [
                {
                  value: true,
                  subscriptionTypeId: 999,
                  text: "I agree to receive updates and news from Joyn.",
                },
              ] : [],
            },
          },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        let msg = `HTTP ${res.status}`;
        try { const j = JSON.parse(txt); msg = j.message || msg; } catch (_) {}
        throw new Error(msg);
      }

      sessionStorage.setItem("joyn_firstname", fields.firstname);
      sessionStorage.setItem("joyn_email", fields.email);
      router.push("/dashboard");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  /* ── Form ── */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "10px",
    border: "1.5px solid rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.07)",
    color: C.white,
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
    display: "block",
    marginBottom: "0.4rem",
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ marginBottom: "0.875rem" }}>
        <label style={labelStyle}>First Name</label>
        <input required type="text" placeholder="Barbara" value={fields.firstname} onChange={set("firstname")} style={inputStyle} />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Email</label>
        <input required type="email" placeholder="barbara@example.com" value={fields.email} onChange={set("email")} style={inputStyle} />
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", marginBottom: "1.5rem", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          style={{ marginTop: "2px", accentColor: C.yellow, width: "15px", height: "15px", flexShrink: 0 }}
        />
        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
          I&apos;d like to receive updates about Joyn&apos;s launch and news. You can unsubscribe at any time.
        </span>
      </label>

      {status === "error" && (
        <p style={{ fontSize: "0.82rem", color: "#f87171", marginBottom: "1rem", textAlign: "center" }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        style={{
          width: "100%",
          backgroundColor: C.yellow,
          color: C.green,
          fontFamily: "var(--font-epilogue)",
          fontWeight: 800,
          fontSize: "1.05rem",
          padding: "1rem",
          borderRadius: "100px",
          border: "none",
          cursor: status === "submitting" ? "wait" : "pointer",
          opacity: status === "submitting" ? 0.7 : 1,
        }}
      >
        {status === "submitting" ? "Joining…" : "Try the Demo →"}
      </button>

      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.875rem", textAlign: "center" }}>
        Free to explore · No account required · Launching in Arizona
      </p>
    </form>
  );
}
