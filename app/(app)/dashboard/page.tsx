"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// ── Brand ─────────────────────────────────────────────────────────────────────
const C = {
  green:   "#1b3428",
  yellow:  "#e7c74c",
  cream:   "#ede8d9",
  surface: "#e4dfd0",
  border:  "#cac5b8",
  muted:   "#6e726c",
  white:   "#ffffff",
};

// ── Demo match pool ───────────────────────────────────────────────────────────
const ALL_MATCHES = [
  {
    id: "1", name: "Margaret", age: 71, city: "Phoenix",
    fitness: "Beginner", time: "Morning",
    interests: ["Chair Yoga", "Gardening", "Reading", "Walking"],
    bio: "Retired schoolteacher who loves being outdoors and starting the day with a little movement. I'd love a partner for morning chair yoga — it has changed my whole day.",
    matchPct: 97,
    photo: "/other_assets/marg.jpg",
  },
  {
    id: "2", name: "Robert", age: 68, city: "Scottsdale",
    fitness: "Moderate", time: "Morning",
    interests: ["Walking", "Music", "Cooking", "Photography"],
    bio: "Former engineer who walks three miles every morning and plays guitar most evenings. Looking for a walking buddy to keep each other accountable.",
    matchPct: 91,
    photo: "/other_assets/Robert.png",
  },
  {
    id: "3", name: "Dorothy", age: 74, city: "Mesa",
    fitness: "Beginner", time: "Afternoon",
    interests: ["Stretching", "Painting", "Birdwatching", "Gardening"],
    bio: "Moved to Mesa five years ago and still building my social circle. I do watercolor painting and early birdwatching at Riparian Preserve most Tuesdays.",
    matchPct: 88,
    photo: "/other_assets/Dorothy.png",
  },
];

const HOBBIES  = ["Gardening", "Coffee & Conversation", "Birdwatching", "Cooking", "Music", "Reading", "Arts & Crafts", "Travel Stories", "Faith & Spirituality", "Volunteering"];
const WORKOUTS = ["Walking", "Chair Yoga", "Stretching", "Resistance Bands", "Swimming", "Cycling", "Tai Chi", "Light Hiking"];
const TIMES      = ["Morning", "Afternoon", "Evening"];
const LEVELS     = ["Beginner — I take it easy", "Light Mover — I'm somewhat active", "Regularly Active — I exercise most days"];
const GOALS      = [
  { value: "friend", label: "Find a genuine friend" },
  { value: "active", label: "Stay active with someone" },
  { value: "both",   label: "Both — a friend I can move with" },
  { value: "lonely", label: "I've been feeling isolated and want connection" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = "survey" | "matching" | "dashboard";
interface Profile { name: string; goal: string; hobbies: string[]; workouts: string[]; time: string; level: string }
interface Match   { id: string; name: string; age: number; city: string; fitness: string; time: string; interests: string[]; bio: string; matchPct: number; photo?: string }

// ── Shared overlay shell ───────────────────────────────────────────────────────
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      backgroundColor: C.cream,
      overflowY: "auto",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "3rem 1.5rem 5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "680px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Image src="/brand_assets/JoynLogo.png" alt="Joyn" width={110} height={40} style={{ objectFit: "contain" }} priority />
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Step 1: Survey ────────────────────────────────────────────────────────────
function Survey({ onComplete }: { onComplete: (p: Profile) => void }) {
  const [name,     setName]     = useState("");
  const [goal,     setGoal]     = useState("");
  const [hobbies,  setHobbies]  = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<string[]>([]);
  const [time,     setTime]     = useState("");
  const [level,    setLevel]    = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("joyn_firstname");
    if (saved) setName(saved);
  }, []);

  function toggleHobby(a: string)   { setHobbies(prev  => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]); }
  function toggleWorkout(a: string)  { setWorkouts(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]); }

  const valid = name.trim() && goal && hobbies.length > 0 && workouts.length > 0 && time && level;

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (valid) onComplete({ name: name.trim(), goal, hobbies, workouts, time, level });
  }

  return (
    <Overlay>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "0.75rem" }}>
          Step 1 of 2 · Your Profile
        </p>
        <h1 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 2.75rem)", color: C.green, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "0.875rem" }}>
          Let&apos;s find your<br />perfect companion
        </h1>
        <p style={{ fontSize: "1.1rem", color: C.muted, lineHeight: 1.65 }}>
          Tell us a little about yourself. It only takes a minute.
        </p>
      </div>

      <form onSubmit={submit}>
        <Card>
          {/* 1. Name */}
          <Question label="What is your first name?">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Barbara"
              required
              style={inputStyle}
            />
          </Question>

          {/* 2. Goal — friendship / loneliness focused */}
          <Question label="What are you hoping to find through Joyn?">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {GOALS.map(g => (
                <RadioPill key={g.value} label={g.label} selected={goal === g.value} onClick={() => setGoal(g.value)} />
              ))}
            </div>
          </Question>

          {/* 3. Hobbies */}
          <Question label="What are your hobbies and interests? (pick at least one)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
              {HOBBIES.map(a => (
                <CheckPill key={a} label={a} selected={hobbies.includes(a)} onClick={() => toggleHobby(a)} />
              ))}
            </div>
          </Question>

          {/* 4. Workouts */}
          <Question label="What kinds of exercise or movement do you enjoy? (pick at least one)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
              {WORKOUTS.map(a => (
                <CheckPill key={a} label={a} selected={workouts.includes(a)} onClick={() => toggleWorkout(a)} />
              ))}
            </div>
          </Question>

          {/* 4. Time */}
          <Question label="When do you prefer to connect with someone?">
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {TIMES.map(t => (
                <RadioPill key={t} label={t} selected={time === t} onClick={() => setTime(t)} />
              ))}
            </div>
          </Question>

          {/* 5. Fitness level — last */}
          <Question label="How would you describe your current activity level?" last>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {LEVELS.map(l => (
                <RadioPill key={l} label={l} selected={level === l} onClick={() => setLevel(l)} />
              ))}
            </div>
          </Question>
        </Card>

        <button
          type="submit"
          disabled={!valid}
          style={{
            width: "100%", marginTop: "1.75rem",
            backgroundColor: valid ? C.green : C.border,
            color: valid ? C.yellow : C.muted,
            fontFamily: "var(--font-epilogue)",
            fontWeight: 800, fontSize: "1.15rem",
            padding: "1.1rem", borderRadius: "100px",
            border: "none", cursor: valid ? "pointer" : "default",
            transition: "background-color 0.2s",
            minHeight: "60px",
          }}
        >
          Find My Matches →
        </button>
      </form>
    </Overlay>
  );
}

// ── Step 2: Matching ───────────────────────────────────────────────────────────
function Matching({ profile, onConnect }: { profile: Profile; onConnect: (m: Match) => void }) {
  const [phase, setPhase] = useState<"loading" | "results">("loading");

  useEffect(() => {
    const t = setTimeout(() => setPhase("results"), 2800);
    return () => clearTimeout(t);
  }, []);

  const matches = ALL_MATCHES.slice(0, 3);

  if (phase === "loading") {
    return (
      <Overlay>
        <div style={{ textAlign: "center", paddingTop: "4rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🔍</div>
          <h2 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "2rem", color: C.green, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Finding people near you…
          </h2>
          <p style={{ fontSize: "1.1rem", color: C.muted, lineHeight: 1.65, maxWidth: "420px", margin: "0 auto" }}>
            We&apos;re matching you by fitness level, shared interests, and schedule — just a moment.
          </p>
          <LoadingDots />
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "0.75rem" }}>
          Step 2 of 2 · Your Matches
        </p>
        <h1 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 2.75rem)", color: C.green, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "0.875rem" }}>
          We found 3 companions<br />for you, {profile.name}!
        </h1>
        <p style={{ fontSize: "1.1rem", color: C.muted }}>
          Choose someone to connect with first.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {matches.map((m, i) => (
          <MatchCard key={m.id} match={m} profile={profile} rank={i} onConnect={() => onConnect(m)} />
        ))}
      </div>
    </Overlay>
  );
}

function MatchCard({ match, profile, rank, onConnect }: { match: Match; profile: Profile; rank: number; onConnect: () => void }) {
  const allProfileInterests = [...profile.hobbies, ...profile.workouts];
  const sharedInterests = match.interests.filter(i => allProfileInterests.includes(i));

  return (
    <div style={{
      backgroundColor: C.white,
      border: rank === 0 ? `2px solid ${C.yellow}` : `1.5px solid ${C.border}`,
      borderRadius: "1.75rem",
      padding: "1.75rem",
      boxShadow: rank === 0 ? `0 4px 24px rgba(231,199,76,0.2)` : "0 2px 12px rgba(27,52,40,0.06)",
      position: "relative",
    }}>
      {rank === 0 && (
        <span style={{
          position: "absolute", top: "-14px", left: "1.75rem",
          backgroundColor: C.yellow, color: C.green,
          fontSize: "0.7rem", fontWeight: 800,
          letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "0.25rem 0.875rem", borderRadius: "100px",
        }}>
          Best Match
        </span>
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
        {match.photo ? (
          <img src={match.photo} alt={match.name} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0 }} />
        ) : (
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0,
            backgroundColor: C.green, color: C.white,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.25rem",
          }}>
            {match.name[0]}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.4rem", color: C.green, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {match.name}, {match.age}
          </p>
          <p style={{ fontSize: "1rem", color: C.muted, marginTop: "0.2rem" }}>
            {match.city}, AZ · {match.fitness}
          </p>
        </div>

        <div style={{ backgroundColor: C.yellow, borderRadius: "1rem", padding: "0.5rem 1rem", textAlign: "center", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.375rem", color: C.green, lineHeight: 1 }}>
            {match.matchPct}%
          </p>
          <p style={{ fontSize: "0.65rem", color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7 }}>match</p>
        </div>
      </div>

      {/* Bio */}
      <p style={{ fontSize: "1rem", color: "#3d4a40", lineHeight: 1.7, marginBottom: "1.125rem" }}>
        {match.bio}
      </p>

      {/* Shared interests */}
      {sharedInterests.length > 0 && (
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, marginBottom: "0.5rem" }}>
            You both enjoy
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {sharedInterests.map(i => (
              <span key={i} style={{
                backgroundColor: "#e8f5f3", color: C.green,
                border: `1.5px solid rgba(27,52,40,0.18)`,
                fontSize: "0.875rem", fontWeight: 600,
                padding: "0.3rem 0.875rem", borderRadius: "100px",
              }}>{i}</span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onConnect}
        style={{
          width: "100%", backgroundColor: rank === 0 ? C.green : C.surface,
          color: rank === 0 ? C.yellow : C.green,
          fontFamily: "var(--font-epilogue)", fontWeight: 800,
          fontSize: "1.05rem", padding: "0.9rem 1.5rem",
          borderRadius: "100px", border: "none", cursor: "pointer",
          minHeight: "56px", transition: "opacity 0.15s",
        }}
      >
        Connect with {match.name} →
      </button>
    </div>
  );
}

// ── Step 3: Dashboard ─────────────────────────────────────────────────────────
function openJoy() { window.dispatchEvent(new CustomEvent("joyn:open-companion")); }

const GOAL_LABELS: Record<string, string> = {
  friend:  "Find a genuine friend",
  active:  "Stay active with someone",
  both:    "A friend I can be active with",
  lonely:  "Looking for connection",
};

function Dashboard({ profile, match, onReset }: { profile: Profile; match: Match; onReset: () => void }) {
  const greeting = getGreeting();

  return (
    <div style={{ fontFamily: "var(--font-lexend), sans-serif", color: C.green, minHeight: "100vh", backgroundColor: C.cream }}>

      {/* Header */}
      <div style={{
        backgroundColor: C.cream, padding: "2.5rem 2.5rem 2rem",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <span style={{
            display: "inline-block", backgroundColor: C.yellow, color: C.green,
            fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", padding: "0.25rem 0.75rem", borderRadius: "100px",
            marginBottom: "0.875rem",
          }}>
            Demo Mode
          </span>
          <h1 style={{
            fontFamily: "var(--font-epilogue)", fontWeight: 900,
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: C.green,
            letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.5rem",
          }}>
            {greeting}, {profile.name} 🌻
          </h1>
          <p style={{ fontSize: "1rem", color: C.muted }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div style={{
          backgroundColor: C.green, borderRadius: "2rem", padding: "1rem 1.75rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          <span style={{ fontSize: "1.5rem" }}>🔥</span>
          <div>
            <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.4rem", color: C.yellow, lineHeight: 1, letterSpacing: "-0.02em" }}>
              5-day streak
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", marginTop: "0.1rem" }}>Keep it going!</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "2.5rem", padding: "2.5rem", alignItems: "start" }}>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Your match */}
          <section>
            <SectionLabel>Your New Companion</SectionLabel>
            <div style={{
              backgroundColor: C.white, border: `2px solid ${C.yellow}`,
              borderRadius: "1.75rem", padding: "2rem",
              boxShadow: "0 4px 24px rgba(231,199,76,0.15)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", marginBottom: "1.25rem" }}>
                {match.photo ? (
                  <img src={match.photo} alt={match.name} style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: "72px", height: "72px", borderRadius: "50%", flexShrink: 0,
                    backgroundColor: C.green, color: C.white,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.5rem",
                  }}>
                    {match.name[0]}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.5rem", color: C.green, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {match.name}, {match.age}
                  </p>
                  <p style={{ fontSize: "1rem", color: C.muted, marginTop: "0.25rem" }}>{match.city}, AZ</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                    {match.interests.map(i => (
                      <span key={i} style={{
                        backgroundColor: C.surface, color: C.green,
                        border: `1px solid ${C.border}`,
                        fontSize: "0.875rem", fontWeight: 500,
                        padding: "0.25rem 0.75rem", borderRadius: "100px",
                      }}>{i}</span>
                    ))}
                  </div>
                </div>
                <div style={{ backgroundColor: C.yellow, borderRadius: "1rem", padding: "0.5rem 0.875rem", textAlign: "center", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.25rem", color: C.green, lineHeight: 1 }}>{match.matchPct}%</p>
                  <p style={{ fontSize: "0.6rem", color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7 }}>match</p>
                </div>
              </div>
              <p style={{ fontSize: "1rem", color: "#3d4a40", lineHeight: 1.7, marginBottom: "1.5rem" }}>{match.bio}</p>
              <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                <BigButton primary href={`/messages/${match.id}`}>Say Hello to {match.name} 👋</BigButton>
                <BigButton href="/sessions">Schedule a Session 📅</BigButton>
              </div>
            </div>
          </section>

          {/* Next session */}
          <section>
            <SectionLabel>Your First Session</SectionLabel>
            <div style={{
              backgroundColor: C.white, border: `1.5px solid ${C.border}`,
              borderRadius: "1.75rem", padding: "1.75rem",
              boxShadow: "0 2px 12px rgba(27,52,40,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{
                  backgroundColor: C.green, borderRadius: "1rem",
                  padding: "0.875rem 1.125rem", textAlign: "center", flexShrink: 0,
                }}>
                  <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 800, fontSize: "1.25rem", color: C.yellow, lineHeight: 1 }}>Sat</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", marginTop: "0.1rem" }}>Apr 5</p>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 700, fontSize: "1.25rem", color: C.green, letterSpacing: "-0.02em" }}>
                    {profile.workouts[0] ?? "Morning Walk"} with {match.name}
                  </p>
                  <p style={{ fontSize: "1rem", color: C.muted, marginTop: "0.2rem" }}>
                    {profile.time === "Morning" ? "9:00 AM" : profile.time === "Afternoon" ? "2:00 PM" : "5:00 PM"} · Online via Zoom
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "1.25rem" }}>
                <BigButton primary href="/sessions">Join Session →</BigButton>
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Joy Guide intro */}
          <div style={{ backgroundColor: C.green, borderRadius: "1.75rem", padding: "1.75rem", color: C.white }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.yellow, marginBottom: "0.875rem" }}>
              Your Joy Guide
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", marginBottom: "1.25rem" }}>
              Hi {profile.name}! I&apos;m Joy, your AI guide. I&apos;ll be there every session to lead the workout and make sure you and {match.name} have a great time together.
            </p>
            <BigButton yellow onClick={openJoy}>Chat with Joy 💬</BigButton>
          </div>

          {/* What to expect */}
          <div style={{ backgroundColor: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1.75rem", padding: "1.75rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted, marginBottom: "1.25rem" }}>
              What to Expect
            </p>
            {[
              { icon: "👋", text: `Say hello to ${match.name} and introduce yourself` },
              { icon: "📅", text: "Schedule your first session together" },
              { icon: "🎯", text: "Joy will guide you both through the workout" },
              { icon: "💬", text: "Chat and get to know each other" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{icon}</span>
                <p style={{ fontSize: "0.975rem", color: "#3d4a40", lineHeight: 1.55 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Events nearby */}
          <div style={{ backgroundColor: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1.75rem", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted }}>Events Near You</p>
              <a href="/events" style={{ fontSize: "0.82rem", color: C.green, fontWeight: 600, textDecoration: "none" }}>See all →</a>
            </div>
            {[
              { name: "Cesar Chavez Senior Walk", date: "April 3",  location: "Phoenix" },
              { name: "Tempe Senior Expo",        date: "April 14", location: "Tempe"   },
              { name: "Uptown Farmers Market",    date: "April 22", location: "Phoenix" },
            ].map((ev, idx, arr) => (
              <a key={ev.name} href="/events" style={{
                display: "block", padding: "1rem 1.5rem", textDecoration: "none",
                borderBottom: idx < arr.length - 1 ? `1px solid ${C.border}` : "none",
                backgroundColor: C.white, transition: "background-color 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.surface; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.white; }}
              >
                <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 600, fontSize: "0.975rem", color: C.green }}>{ev.name}</p>
                <p style={{ fontSize: "0.85rem", color: C.muted, marginTop: "0.1rem" }}>{ev.date} · {ev.location}, AZ</p>
              </a>
            ))}
          </div>

          {/* Your profile summary */}
          <div style={{ backgroundColor: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1.75rem", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted }}>Your Profile</p>
              <a href="/profile" style={{ fontSize: "0.82rem", color: C.green, fontWeight: 600, textDecoration: "none" }}>Edit →</a>
            </div>
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <ProfileRow label="Looking for"    value={GOAL_LABELS[profile.goal] ?? profile.goal} />
              <ProfileRow label="Hobbies"        value={profile.hobbies.join(", ")} />
              <ProfileRow label="Exercise"       value={profile.workouts.join(", ")} />
              <ProfileRow label="Best time"      value={profile.time} />
              <ProfileRow label="Activity level" value={profile.level.split(" — ")[0]} />
            </div>
            <div style={{ padding: "0 1.5rem 1.25rem" }}>
              <button onClick={onReset} style={{
                fontSize: "0.8rem", color: C.muted, background: "none",
                border: "none", cursor: "pointer", textDecoration: "underline", padding: 0,
              }}>
                Reset demo / start over
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────
function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, marginBottom: "0.2rem" }}>{label}</p>
      <p style={{ fontSize: "0.95rem", color: C.green, fontWeight: 500, lineHeight: 1.4 }}>{value}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted, marginBottom: "0.875rem" }}>
      {children}
    </p>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: C.white, border: `1.5px solid ${C.border}`,
      borderRadius: "1.75rem", overflow: "hidden",
      boxShadow: "0 2px 16px rgba(27,52,40,0.07)",
    }}>
      {children}
    </div>
  );
}

function Question({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      padding: "1.75rem 2rem",
      borderBottom: last ? "none" : `1px solid ${C.border}`,
    }}>
      <p style={{ fontSize: "1.1rem", fontWeight: 600, color: C.green, marginBottom: "1.125rem", lineHeight: 1.4 }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function RadioPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "0.875rem",
      padding: "0.875rem 1.25rem",
      border: selected ? `2px solid ${C.green}` : `1.5px solid ${C.border}`,
      borderRadius: "0.875rem",
      backgroundColor: selected ? C.green : C.white,
      color: selected ? C.white : C.green,
      fontSize: "1.025rem", fontWeight: selected ? 600 : 400,
      cursor: "pointer", textAlign: "left",
      transition: "background-color 0.15s, border-color 0.15s",
      minHeight: "52px",
    }}>
      <span style={{
        width: "18px", height: "18px", borderRadius: "50%",
        border: selected ? `5px solid ${C.yellow}` : `2px solid ${C.border}`,
        backgroundColor: selected ? C.green : C.white,
        flexShrink: 0, transition: "border 0.15s",
      }} />
      {label}
    </button>
  );
}

function CheckPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: "0.625rem 1.125rem",
      border: selected ? `2px solid ${C.green}` : `1.5px solid ${C.border}`,
      borderRadius: "100px",
      backgroundColor: selected ? C.green : C.white,
      color: selected ? C.white : C.green,
      fontSize: "1rem", fontWeight: selected ? 600 : 400,
      cursor: "pointer",
      transition: "background-color 0.15s, border-color 0.15s",
      minHeight: "44px",
    }}>
      {selected ? "✓ " : ""}{label}
    </button>
  );
}

function BigButton({ children, primary, yellow, href, onClick }: { children: React.ReactNode; primary?: boolean; yellow?: boolean; href?: string; onClick?: () => void }) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    backgroundColor: primary ? C.green : yellow ? C.yellow : C.surface,
    color: primary ? C.yellow : yellow ? C.green : C.green,
    fontFamily: "var(--font-epilogue)",
    fontWeight: 700, fontSize: "1rem",
    padding: "0.75rem 1.5rem", borderRadius: "100px",
    border: "none", cursor: "pointer",
    minHeight: "52px", textDecoration: "none",
    transition: "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
  };

  const lift = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
    e.currentTarget.style.boxShadow = primary
      ? "0 8px 24px rgba(27,52,40,0.28)"
      : yellow
      ? "0 8px 24px rgba(231,199,76,0.35)"
      : "0 4px 16px rgba(27,52,40,0.12)";
  };
  const drop = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "";
  };

  if (href) return (
    <a href={href} style={base} onMouseEnter={lift} onMouseLeave={drop}>{children}</a>
  );
  return (
    <button onClick={onClick} style={base} onMouseEnter={lift} onMouseLeave={drop}>{children}</button>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: "0.625rem", justifyContent: "center", marginTop: "2.5rem" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: "12px", height: "12px", borderRadius: "50%", backgroundColor: C.green,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-10px);opacity:1} }`}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.9rem 1.125rem",
  border: `1.5px solid ${C.border}`, borderRadius: "0.875rem",
  backgroundColor: C.white, color: C.green,
  fontSize: "1.05rem", outline: "none",
  boxSizing: "border-box",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const LS_PROFILE = "joyn_profile";
const LS_MATCH   = "joyn_match";

async function pushSurveyToHubSpot(profile: Profile) {
  const email = sessionStorage.getItem("joyn_email");
  if (!email) return; // no email stored — skip

  const portalId = "20194411";
  const formGuid = "d0e301f1-0778-43e9-bf42-3108cdb88df0";

  try {
    await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "email",               value: email },
            { name: "firstname",           value: profile.name },
            { name: "joyn_goal",           value: profile.goal },
            { name: "joyn_hobbies",        value: profile.hobbies.join("; ") },
            { name: "joyn_workouts",       value: profile.workouts.join("; ") },
            { name: "joyn_preferred_time", value: profile.time },
            { name: "joyn_fitness_level",  value: profile.level },
          ],
          context: {
            pageUri:  typeof window !== "undefined" ? window.location.href : "",
            pageName: "Joyn Demo — Survey",
          },
        }),
      }
    );
  } catch {
    // Non-blocking — silently ignore if HubSpot is unavailable
  }
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [step,    setStep]    = useState<Step | null>(null); // null = loading
  const [profile, setProfile] = useState<Profile | null>(null);
  const [match,   setMatch]   = useState<Match | null>(null);

  // On mount: restore from localStorage or start fresh
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(LS_PROFILE);
      const savedMatch   = localStorage.getItem(LS_MATCH);
      if (savedProfile && savedMatch) {
        setProfile(JSON.parse(savedProfile));
        setMatch(JSON.parse(savedMatch));
        setStep("dashboard");
        return;
      }
    } catch { /* corrupt storage — fall through to survey */ }
    setStep("survey");
  }, []);

  function handleSurveyComplete(p: Profile) {
    localStorage.setItem(LS_PROFILE, JSON.stringify(p));
    setProfile(p);
    setStep("matching");
    pushSurveyToHubSpot(p);
  }

  function handleConnect(m: Match) {
    localStorage.setItem(LS_MATCH, JSON.stringify(m));
    setMatch(m);
    setStep("dashboard");
  }

  function handleReset() {
    localStorage.removeItem(LS_PROFILE);
    localStorage.removeItem(LS_MATCH);
    setProfile(null);
    setMatch(null);
    setStep("survey");
  }

  if (step === null) return null; // hydrating
  if (step === "survey")              return <Survey onComplete={handleSurveyComplete} />;
  if (step === "matching" && profile) return <Matching profile={profile} onConnect={handleConnect} />;
  if (step === "dashboard" && profile && match) return <Dashboard profile={profile} match={match} onReset={handleReset} />;
  return null;
}
