"use client";

import Link from "next/link";

// Mock data: 5 days since last connection (disconnected state)
// To show connected state, change DAYS_SINCE to 2
const DAYS_SINCE = 5;
const COMPANION_NAME = "Margaret";
const COMPANION_ID = "1";
const CONNECTED_THRESHOLD = 3;

export function ConnectionNudgeWidget() {
  const isDisconnected = DAYS_SINCE > CONNECTED_THRESHOLD;

  return (
    <div
      style={{
        backgroundColor: "#E7E2D7",
        border: "2px solid #C2C8C2",
        borderRadius: "2rem",
        padding: "1.5rem",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#735C00",
          marginBottom: "0.875rem",
        }}
      >
        Your Connections
      </p>

      {isDisconnected ? (
        <>
          <p style={{ fontSize: "1.0625rem", color: "#173124", lineHeight: 1.6, marginBottom: "0.875rem" }}>
            You haven&apos;t connected with anyone in {DAYS_SINCE} days — want to reach out to {COMPANION_NAME}?
          </p>
          <Link
            href={`/match/${COMPANION_ID}`}
            style={{
              display: "inline-block",
              backgroundColor: "#735C00",
              color: "#FFFFFF",
              fontWeight: 600,
              padding: "0.625rem 1.25rem",
              borderRadius: "3rem",
              fontSize: "0.95rem",
              textDecoration: "none",
              minHeight: "44px",
              lineHeight: "1.5",
            }}
          >
            Reach out to {COMPANION_NAME} →
          </Link>
        </>
      ) : (
        <p style={{ fontSize: "1.0625rem", color: "#173124", lineHeight: 1.6 }}>
          You connected with {COMPANION_NAME} {DAYS_SINCE} days ago. Keep it up! 🌻
        </p>
      )}
    </div>
  );
}
