"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
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
        fontFamily: "'Lexend', sans-serif",
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
          Create your Joyn account
        </h1>

        {success ? (
          <div
            style={{
              backgroundColor: "#173124",
              color: "#FFFFFF",
              borderRadius: "1rem",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem", fontWeight: 600 }}>
              🌻 You&apos;re in!
            </p>
            <p style={{ fontSize: "1rem", opacity: 0.9 }}>
              Check your email to confirm your account, then sign in to get started.
            </p>
            <Link
              href="/sign-in"
              style={{
                display: "inline-block",
                marginTop: "1.25rem",
                backgroundColor: "#735C00",
                color: "#FFFFFF",
                padding: "0.75rem 1.5rem",
                borderRadius: "3rem",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label
                htmlFor="fullName"
                style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem", color: "#173124" }}
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="input-base"
                placeholder="Margaret Wilson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem", color: "#173124" }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input-base"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "1rem",
            color: "#727973",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/sign-in"
            style={{ color: "#173124", fontWeight: 600, textDecoration: "underline" }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
