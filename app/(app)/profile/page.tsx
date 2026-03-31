"use client";

import { useEffect, useState } from "react";

const C = {
  green:   "#1b3428",
  yellow:  "#e7c74c",
  cream:   "#ede8d9",
  surface: "#e4dfd0",
  border:  "#cac5b8",
  muted:   "#6e726c",
  white:   "#ffffff",
};

const GOAL_LABELS: Record<string, string> = {
  friend:  "Find a genuine friend",
  active:  "Stay active with someone",
  both:    "A friend I can be active with",
  lonely:  "Looking for connection after feeling isolated",
};

interface Profile {
  name: string;
  goal: string;
  hobbies: string[];
  workouts: string[];
  time: string;
  level: string;
}

interface Match {
  id?: string;
  name: string;
  age: number;
  city: string;
  fitness: string;
  interests: string[];
  bio: string;
  matchPct: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [match,   setMatch]   = useState<Match | null>(null);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem("joyn_profile");
      const m = localStorage.getItem("joyn_match");
      if (p) setProfile(JSON.parse(p));
      if (m) setMatch(JSON.parse(m));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!profile) {
    return (
      <div style={{ padding: "4rem 2.5rem", textAlign: "center", fontFamily: "var(--font-lexend), sans-serif", color: C.green }}>
        <p style={{ fontSize: "1.1rem", color: C.muted, marginBottom: "1.5rem" }}>
          No profile found. Complete the survey on the dashboard first.
        </p>
        <a href="/dashboard" style={{ backgroundColor: C.green, color: C.yellow, fontFamily: "var(--font-epilogue)", fontWeight: 700, fontSize: "1rem", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none" }}>
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-lexend), sans-serif", color: C.green, minHeight: "100vh", backgroundColor: C.cream }}>

      {/* Header */}
      <div style={{ backgroundColor: C.cream, padding: "2.5rem 2.5rem 2rem", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ display: "inline-block", backgroundColor: C.yellow, color: C.green, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.25rem 0.75rem", borderRadius: "100px", marginBottom: "0.875rem" }}>
          Demo Mode
        </span>
        <h1 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "2.25rem", color: C.green, letterSpacing: "-0.03em", lineHeight: 1 }}>
          {profile.name}&apos;s Profile
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", padding: "2.5rem", alignItems: "start" }}>

        {/* Left — profile details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <Section title="About Me">
            <Row label="Name"         value={profile.name} />
            <Row label="Looking for"  value={GOAL_LABELS[profile.goal] ?? profile.goal} />
            <Row label="Best time"    value={profile.time} />
            <Row label="Activity level" value={profile.level.split(" — ")[0]} />
          </Section>

          <Section title="Hobbies & Interests">
            <TagCloud tags={profile.hobbies} />
          </Section>

          <Section title="Exercise & Movement">
            <TagCloud tags={profile.workouts} />
          </Section>

        </div>

        {/* Right — companion match */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {match && (
            <Section title="Your Companion Match">
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0, backgroundColor: C.green, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.375rem" }}>
                  {match.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.375rem", color: C.green, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {match.name}, {match.age}
                  </p>
                  <p style={{ fontSize: "0.95rem", color: C.muted, marginTop: "0.2rem" }}>{match.city}, AZ · {match.fitness}</p>
                </div>
                <div style={{ backgroundColor: C.yellow, borderRadius: "1rem", padding: "0.5rem 0.875rem", textAlign: "center", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.25rem", color: C.green, lineHeight: 1 }}>{match.matchPct}%</p>
                  <p style={{ fontSize: "0.6rem", color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7 }}>match</p>
                </div>
              </div>
              <p style={{ fontSize: "0.975rem", color: "#3d4a40", lineHeight: 1.7, marginBottom: "1.25rem" }}>{match.bio}</p>
              <TagCloud tags={match.interests} />
              <div style={{ marginTop: "1.25rem" }}>
                <a href={`/messages/${match.id ?? "1"}`} style={{ display: "inline-block", backgroundColor: C.green, color: C.yellow, fontFamily: "var(--font-epilogue)", fontWeight: 700, fontSize: "1rem", padding: "0.75rem 1.5rem", borderRadius: "100px", textDecoration: "none", minHeight: "48px", lineHeight: "1.5" }}>
                  Message {match.name} →
                </a>
              </div>
            </Section>
          )}

          <Section title="Preferences">
            <Row label="Preferred time"   value={profile.time} />
            <Row label="Activity level"   value={profile.level.split(" — ")[0]} />
            <Row label="Goal"             value={GOAL_LABELS[profile.goal] ?? profile.goal} />
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1.75rem", overflow: "hidden", boxShadow: "0 2px 12px rgba(27,52,40,0.06)" }}>
      <div style={{ padding: "1.125rem 1.75rem", borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted }}>{title}</p>
      </div>
      <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
      <p style={{ fontSize: "0.9rem", color: C.muted, fontWeight: 500, flexShrink: 0 }}>{label}</p>
      <p style={{ fontSize: "0.9rem", color: C.green, fontWeight: 600, textAlign: "right" }}>{value}</p>
    </div>
  );
}

function TagCloud({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {tags.map(tag => (
        <span key={tag} style={{ backgroundColor: C.surface, color: C.green, border: `1px solid ${C.border}`, fontSize: "0.875rem", fontWeight: 500, padding: "0.3rem 0.875rem", borderRadius: "100px" }}>
          {tag}
        </span>
      ))}
    </div>
  );
}
