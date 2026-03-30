"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FEF9ED",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "var(--font-lexend), sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#E7E2D7",
          border: "2px solid #C2C8C2",
          borderRadius: "3rem",
          padding: "3rem",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 0 60px 0 rgba(23,49,36,0.05)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/">
            <span
              style={{
                fontFamily: "'Epilogue', serif",
                fontWeight: 800,
                fontSize: "2rem",
                color: "#173124",
                letterSpacing: "-0.02em",
              }}
            >
              JOYN
            </span>
          </Link>
          <p style={{ fontSize: "0.875rem", color: "#727973", marginTop: "0.25rem" }}>
            Move Together. Age with Joy.
          </p>
        </div>

        <h1
          style={{
            fontFamily: "'Epilogue', serif",
            fontWeight: 700,
            fontSize: "1.875rem",
            color: "#173124",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem", color: "#173124" }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="input-base"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem", color: "#173124" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-base"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#FEE2E2",
                border: "2px solid #FCA5A5",
                borderRadius: "1rem",
                padding: "0.75rem 1rem",
                color: "#991B1B",
                fontSize: "1rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "1rem",
            color: "#727973",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            style={{ color: "#173124", fontWeight: 600, textDecoration: "underline" }}
          >
            Join Free
          </Link>
        </p>
      </div>
    </div>
  );
}
