import Link from "next/link";
import { MoodWidget } from "@/components/dashboard/MoodWidget";

// ── Static demo data — no auth required ──────────────────────────────────────

const DEMO_USER = { name: "Barbara", streakDays: 5 };

const DEMO_MATCHES = [
  {
    id: "1",
    name: "Margaret",
    age: 71,
    city: "Phoenix",
    fitness: "Beginner",
    interests: ["Chair Yoga", "Gardening", "Reading", "Walking"],
    bio: "Retired schoolteacher who loves being outdoors and staying active. I'd love a partner for morning chair yoga sessions — it's changed my whole day.",
    initials: "MW",
    matchPct: 97,
  },
  {
    id: "2",
    name: "Robert",
    age: 68,
    city: "Scottsdale",
    fitness: "Moderate",
    interests: ["Walking", "Music", "Cooking", "Photography"],
    bio: "Former engineer who walks 3 miles every morning and plays guitar most evenings. Looking for a walking buddy to keep each other accountable.",
    initials: "RJ",
    matchPct: 91,
  },
  {
    id: "3",
    name: "Dorothy",
    age: 74,
    city: "Mesa",
    fitness: "Beginner",
    interests: ["Stretching", "Painting", "Birdwatching", "Gardening"],
    bio: "Moved to Mesa five years ago and still building my social circle. I do watercolor painting and early birdwatching at Riparian Preserve most Tuesdays.",
    initials: "DL",
    matchPct: 88,
  },
];

const DEMO_SESSION = {
  activity: "Morning Walk",
  partner: "Robert",
  dateLabel: "This Saturday",
  time: "8:00 AM",
  location: "Scottsdale Greenbelt Trail",
  partnerId: "2",
};

const DEMO_EVENTS = [
  { id: "1", name: "Cesar Chavez Senior Walk", date: "April 3", location: "Phoenix, AZ", category: "Fitness" },
  { id: "2", name: "Tempe Senior Expo", date: "April 14", location: "Tempe, AZ", category: "Social" },
  { id: "3", name: "Silver Linings Senior Expo", date: "April 18", location: "Sun Lakes, AZ", category: "Social" },
  { id: "4", name: "Uptown Farmers Market Meetup", date: "April 22", location: "Phoenix, AZ", category: "Social" },
];

// ── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  green:    "#1b3428",
  yellow:   "#e7c74c",
  goldText: "#8a7520",
  cream:    "#ede8d9",
  surface:  "#e4dfd0",
  border:   "#cac5b8",
  muted:    "#6e726c",
  white:    "#ffffff",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function today() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div style={{ fontFamily: "var(--font-lexend), sans-serif", color: C.green, minHeight: "100vh", backgroundColor: C.cream }}>

      {/* ── Header ── */}
      <div style={{
        backgroundColor: C.cream,
        padding: "2.5rem 2.5rem 2rem",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div>
          {/* Demo badge */}
          <span style={{
            display: "inline-block",
            backgroundColor: C.yellow,
            color: C.green,
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "0.2rem 0.625rem",
            borderRadius: "3rem",
            marginBottom: "0.875rem",
          }}>
            Demo Mode
          </span>
          <h1 style={{
            fontFamily: "var(--font-epilogue), serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: C.green,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}>
            Good morning, {DEMO_USER.name} 🌻
          </h1>
          <p style={{ fontSize: "1rem", color: C.muted }}>{today()}</p>
        </div>

        {/* Streak badge */}
        <div style={{
          backgroundColor: C.green,
          borderRadius: "2rem",
          padding: "1rem 1.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <span style={{ fontSize: "1.5rem" }}>🔥</span>
          <div>
            <p style={{
              fontFamily: "var(--font-epilogue), serif",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: C.yellow,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              {DEMO_USER.streakDays}-day streak
            </p>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginTop: "0.1rem" }}>
              Keep it going!
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1px",
        backgroundColor: C.border,
        borderBottom: `1px solid ${C.border}`,
      }}>
        {[
          { label: "AI Matches Found", value: "3", icon: "👥" },
          { label: "Upcoming Meetup", value: "1", icon: "📅" },
          { label: "Events Near You", value: "4", icon: "📍" },
        ].map((stat) => (
          <div key={stat.label} style={{
            backgroundColor: C.surface,
            padding: "1.125rem 2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
          }}>
            <span style={{ fontSize: "1.375rem" }}>{stat.icon}</span>
            <div>
              <p style={{
                fontFamily: "var(--font-epilogue), serif",
                fontWeight: 800,
                fontSize: "1.625rem",
                color: C.green,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.1rem" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "5fr 4fr",
        gap: "2.5rem",
        padding: "2.5rem",
        minHeight: "calc(100vh - 220px)",
      }}>

        {/* ── LEFT: Companions ── */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <p style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: C.muted,
            }}>
              Your Companions
            </p>
            <span style={{ fontSize: "0.8rem", color: C.goldText, fontWeight: 500 }}>AI-matched for you</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {DEMO_MATCHES.map((match) => (
              <div key={match.id} style={{
                backgroundColor: C.white,
                border: `1.5px solid ${C.border}`,
                borderRadius: "1.75rem",
                padding: "1.75rem",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                boxShadow: "0 2px 12px 0 rgba(27,52,40,0.06)",
              }}>

                {/* Top row: avatar + name + match % */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  {/* Avatar */}
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: C.green,
                    color: C.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-epilogue), serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    flexShrink: 0,
                    letterSpacing: "-0.01em",
                  }}>
                    {match.initials}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: "var(--font-epilogue), serif",
                      fontWeight: 700,
                      fontSize: "1.3rem",
                      color: C.green,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}>
                      {match.name}, {match.age}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: C.muted, marginTop: "0.15rem" }}>
                      {match.city}, AZ · {match.fitness}
                    </p>
                  </div>

                  {/* Match % */}
                  <div style={{
                    backgroundColor: C.yellow,
                    borderRadius: "1rem",
                    padding: "0.4rem 0.875rem",
                    textAlign: "center",
                    flexShrink: 0,
                  }}>
                    <p style={{
                      fontFamily: "var(--font-epilogue), serif",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: C.green,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}>
                      {match.matchPct}%
                    </p>
                    <p style={{ fontSize: "0.6rem", color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7 }}>match</p>
                  </div>
                </div>

                {/* Bio */}
                <p style={{
                  fontSize: "0.9375rem",
                  color: "#3d4a40",
                  lineHeight: 1.6,
                  marginBottom: "1.125rem",
                }}>
                  {match.bio}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
                  {match.interests.map((interest) => (
                    <span key={interest} style={{
                      backgroundColor: C.surface,
                      border: `1.5px solid ${C.border}`,
                      color: C.green,
                      fontSize: "0.775rem",
                      fontWeight: 500,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "3rem",
                    }}>
                      {interest}
                    </span>
                  ))}
                </div>

                <Link href={`/match/${match.id}`} style={{
                  display: "inline-block",
                  backgroundColor: C.green,
                  color: C.white,
                  fontWeight: 600,
                  padding: "0.625rem 1.5rem",
                  borderRadius: "3rem",
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  minHeight: "44px",
                  lineHeight: "1.5",
                }}>
                  Connect with {match.name} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Widgets ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Mood check-in */}
          <MoodWidget />

          {/* Connection nudge */}
          <div style={{
            backgroundColor: C.green,
            borderRadius: "1.75rem",
            padding: "1.5rem",
            color: C.white,
          }}>
            <p style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: C.yellow,
              marginBottom: "0.875rem",
            }}>
              Say Hello
            </p>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.65, marginBottom: "1rem", color: "rgba(255,255,255,0.9)" }}>
              Margaret is your closest match. It&apos;s a great day to say hello and introduce yourself.
            </p>
            <Link href="/match/1" style={{
              display: "inline-block",
              backgroundColor: C.yellow,
              color: C.green,
              fontWeight: 700,
              padding: "0.625rem 1.25rem",
              borderRadius: "3rem",
              fontSize: "0.95rem",
              textDecoration: "none",
              minHeight: "44px",
              lineHeight: "1.5",
            }}>
              Say hello to Margaret →
            </Link>
          </div>

          {/* Upcoming meetup */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: C.muted,
              }}>
                Upcoming Meetup
              </p>
              <Link href="/sessions" style={{ fontSize: "0.825rem", color: C.goldText, textDecoration: "none", fontWeight: 600 }}>
                Plan new →
              </Link>
            </div>

            <div style={{
              backgroundColor: C.white,
              border: `1.5px solid ${C.border}`,
              borderRadius: "1.75rem",
              padding: "1.5rem",
              boxShadow: "0 2px 12px 0 rgba(27,52,40,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                {/* Date block */}
                <div style={{
                  backgroundColor: C.green,
                  borderRadius: "0.875rem",
                  padding: "0.625rem 0.875rem",
                  textAlign: "center",
                  flexShrink: 0,
                  minWidth: "52px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-epilogue), serif",
                    fontWeight: 800,
                    fontSize: "1.375rem",
                    color: C.yellow,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}>
                    Sat
                  </p>
                  <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", marginTop: "0.1rem", fontWeight: 500 }}>Apr 5</p>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: "var(--font-epilogue), serif",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: C.green,
                    letterSpacing: "-0.02em",
                    marginBottom: "0.2rem",
                  }}>
                    {DEMO_SESSION.activity}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: C.muted, lineHeight: 1.5 }}>
                    with {DEMO_SESSION.partner} · {DEMO_SESSION.time}<br />
                    {DEMO_SESSION.location}
                  </p>
                </div>
              </div>

              <Link href={`/match/${DEMO_SESSION.partnerId}`} style={{
                display: "inline-block",
                marginTop: "1rem",
                backgroundColor: C.yellow,
                color: C.green,
                fontWeight: 700,
                padding: "0.5rem 1.25rem",
                borderRadius: "3rem",
                fontSize: "0.875rem",
                textDecoration: "none",
                minHeight: "40px",
                lineHeight: "1.5",
              }}>
                Message Robert →
              </Link>
            </div>
          </div>

          {/* Events */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: C.muted,
              }}>
                Arizona Events
              </p>
              <Link href="/events" style={{ fontSize: "0.825rem", color: C.goldText, textDecoration: "none", fontWeight: 600 }}>
                See all →
              </Link>
            </div>

            <div style={{
              backgroundColor: C.white,
              border: `1.5px solid ${C.border}`,
              borderRadius: "1.75rem",
              overflow: "hidden",
              boxShadow: "0 2px 12px 0 rgba(27,52,40,0.06)",
            }}>
              {DEMO_EVENTS.map((event, idx) => (
                <div key={event.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  backgroundColor: idx % 2 === 0 ? C.white : C.cream,
                  borderBottom: idx < DEMO_EVENTS.length - 1 ? `1px solid ${C.border}` : "none",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-epilogue), serif",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: C.green,
                      marginBottom: "0.1rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {event.name}
                    </p>
                    <p style={{ fontSize: "0.775rem", color: C.muted }}>
                      {event.date} · {event.location}
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: event.category === "Fitness" ? C.green : C.surface,
                    color: event.category === "Fitness" ? C.white : C.green,
                    border: event.category === "Fitness" ? "none" : `1.5px solid ${C.border}`,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.7rem",
                    borderRadius: "3rem",
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    flexShrink: 0,
                  }}>
                    {event.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
