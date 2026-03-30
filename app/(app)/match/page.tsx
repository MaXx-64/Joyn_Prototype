"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MOCK_MATCHES, type MatchCandidate } from "@/lib/ai/matching";

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchCandidate[]>(MOCK_MATCHES);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("");

  useEffect(() => {
    fetch("/api/ai/match/candidates")
      .then((r) => r.json())
      .then((data) => {
        if (data.matches?.length > 0) {
          setMatches(data.matches);
          setSource(data.source ?? "");
        }
      })
      .catch(() => {/* keep mock data on error */})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-lexend), sans-serif", color: "#173124", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ backgroundColor: "#FEF9ED", padding: "2.5rem 2.5rem 2rem" }}>
        <p style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#727973",
          marginBottom: "0.5rem",
        }}>
          Your Connections
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
          <h1 style={{
            fontFamily: "var(--font-epilogue), serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: "#173124",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>
            My Matches
          </h1>
          {/* AI badge — shown when we have real ranked results */}
          {!loading && source === "real" && (
            <span style={{
              backgroundColor: "#E7F5ED",
              border: "2px solid #4CAF50",
              color: "#1A5C30",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "0.2rem 0.75rem",
              borderRadius: "3rem",
              letterSpacing: "0.04em",
            }}>
              ✦ AI Ranked
            </span>
          )}
        </div>
        <p style={{ fontSize: "0.95rem", color: "#727973", marginTop: "0.5rem" }}>
          {loading
            ? "Finding your best matches…"
            : `${matches.length} people near you who share your interests`}
        </p>
      </div>

      {/* Match cards */}
      <div style={{ backgroundColor: "#F8F3E8", padding: "2.5rem", minHeight: "calc(100vh - 160px)" }}>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "720px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                backgroundColor: "#E7E2D7",
                border: "2px solid #C2C8C2",
                borderRadius: "2rem",
                padding: "1.75rem",
                height: "160px",
                animation: "match-shimmer 1.6s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Real cards */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "720px" }}>
            {matches.map((match) => (
              <div key={match.id} style={{
                backgroundColor: "#E7E2D7",
                border: "2px solid #C2C8C2",
                borderRadius: "2rem",
                padding: "1.75rem",
                transition: "box-shadow 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>

                  {/* Avatar */}
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#173124",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-epilogue), serif",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    flexShrink: 0,
                    letterSpacing: "-0.01em",
                  }}>
                    {match.initials}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: "var(--font-epilogue), serif",
                      fontWeight: 700,
                      fontSize: "1.375rem",
                      color: "#173124",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}>
                      {match.name}, {match.age}
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#727973", marginTop: "0.2rem" }}>
                      {match.city}, AZ
                    </p>
                  </div>

                  {/* Match % */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-epilogue), serif",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      color: "#735C00",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}>
                      {match.matchPct}%
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#727973", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      match
                    </p>
                  </div>
                </div>

                {/* Interest tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  <span style={{
                    backgroundColor: "#173124",
                    color: "#FFFFFF",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.25rem 0.875rem",
                    borderRadius: "3rem",
                    textTransform: "capitalize",
                  }}>
                    {match.fitness}
                  </span>
                  {match.interests.map((interest) => (
                    <span key={interest} style={{
                      backgroundColor: "#E5E0D5",
                      border: "2px solid #C2C8C2",
                      color: "#173124",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      padding: "0.2rem 0.75rem",
                      borderRadius: "3rem",
                    }}>
                      {interest}
                    </span>
                  ))}
                </div>

                <Link href={`/match/${match.id}`} style={{
                  backgroundColor: "#173124",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  padding: "0.625rem 1.5rem",
                  borderRadius: "3rem",
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "opacity 0.15s",
                }}>
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes match-shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
