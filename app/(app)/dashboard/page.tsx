import Link from "next/link";
import { MoodWidget } from "@/components/dashboard/MoodWidget";
import { ConnectionNudgeWidget } from "@/components/dashboard/ConnectionNudgeWidget";

const mockMatches = [
  {
    id: "1",
    name: "Margaret",
    age: 71,
    city: "Phoenix",
    interests: ["Chair Yoga", "Gardening", "Reading"],
    fitness: "Beginner",
    initials: "MW",
    matchPct: 97,
  },
  {
    id: "2",
    name: "Robert",
    age: 68,
    city: "Scottsdale",
    interests: ["Walking", "Music", "Cooking"],
    fitness: "Moderate",
    initials: "RJ",
    matchPct: 91,
  },
  {
    id: "3",
    name: "Dorothy",
    age: 74,
    city: "Mesa",
    interests: ["Stretching", "Painting", "Birdwatching"],
    fitness: "Beginner",
    initials: "DL",
    matchPct: 88,
  },
];

const mockSessions = [
  { id: "1", partner: "Margaret", activity: "Chair Yoga", dateLabel: "Tomorrow", time: "10:00 AM" },
  { id: "2", partner: "Robert", activity: "Morning Walk", dateLabel: "Thursday", time: "8:30 AM" },
];

const mockEvents = [
  { id: "1", name: "Chandler Senior Center Yoga", date: "April 3", location: "Chandler, AZ", category: "Fitness" },
  { id: "2", name: "Desert Botanical Garden Walk", date: "April 7", location: "Phoenix, AZ", category: "Social" },
  { id: "3", name: "Sun City Card & Board Games", date: "April 10", location: "Sun City, AZ", category: "Social" },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ fontFamily: "var(--font-lexend), sans-serif", color: "#173124", minHeight: "100vh" }}>

      {/* ── Greeting header ── */}
      <div style={{
        backgroundColor: "#FEF9ED",
        padding: "2.5rem 2.5rem 2rem",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <p className="label-meta" style={{ marginBottom: "0.5rem" }}>Your Dashboard</p>
          <h1 style={{
            fontFamily: "var(--font-epilogue), serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: "#173124",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}>
            Good morning 🌻
          </h1>
          <p style={{ fontSize: "1rem", color: "#727973" }}>{today}</p>
        </div>

        {/* Streak badge */}
        <div style={{
          backgroundColor: "#173124",
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
              color: "#E8C84A",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              7-day connection streak
            </p>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginTop: "0.1rem" }}>Keep it going!</p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "5fr 4fr",
        gap: "2.5rem",
        padding: "2.5rem",
        backgroundColor: "#F8F3E8",
        minHeight: "calc(100vh - 160px)",
      }}>

        {/* LEFT — Workout Partners */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <p className="label-meta">Your Companions</p>
            <span style={{ fontSize: "0.85rem", color: "#727973" }}>AI-matched for you</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {mockMatches.map((match) => (
              <div key={match.id} className="card-base" style={{ padding: "1.75rem" }}>
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
                    <p style={{ fontSize: "0.9rem", color: "#727973", marginTop: "0.2rem" }}>{match.city}, AZ</p>
                  </div>

                  {/* Match % */}
                  <div style={{ textAlign: "right" }}>
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
                    <p style={{ fontSize: "0.7rem", color: "#727973", textTransform: "uppercase", letterSpacing: "0.08em" }}>match</p>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  <span style={{
                    backgroundColor: "#173124",
                    color: "#FFFFFF",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.25rem 0.875rem",
                    borderRadius: "3rem",
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

                <Link href={`/match/${match.id}`} className="btn-primary" style={{ padding: "0.625rem 1.5rem", fontSize: "0.95rem" }}>
                  Connect
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Widgets + Sessions + Events */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

          {/* Mood check-in */}
          <MoodWidget />

          {/* Connection nudge */}
          <ConnectionNudgeWidget />

          {/* Sessions */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <p className="label-meta">Your Upcoming Meetups</p>
              <Link href="/sessions" style={{ fontSize: "0.85rem", color: "#735C00", textDecoration: "none", fontWeight: 600 }}>
                Plan new →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {mockSessions.map((session) => (
                <div key={session.id} className="card-base" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div>
                      <p style={{
                        fontFamily: "var(--font-epilogue), serif",
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: "#173124",
                        letterSpacing: "-0.02em",
                        marginBottom: "0.2rem",
                      }}>
                        {session.activity}
                      </p>
                      <p style={{ fontSize: "0.9rem", color: "#727973" }}>
                        with {session.partner} · {session.dateLabel} at {session.time}
                      </p>
                    </div>
                  </div>
                  <button style={{
                    backgroundColor: "#735C00",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    padding: "0.5rem 1.25rem",
                    borderRadius: "3rem",
                    fontSize: "0.9rem",
                    border: "none",
                    cursor: "pointer",
                    minHeight: "40px",
                    transition: "transform 0.15s ease",
                  }}>
                    Join Meetup
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <p className="label-meta">Arizona Events</p>
              <Link href="/events" style={{ fontSize: "0.85rem", color: "#735C00", textDecoration: "none", fontWeight: 600 }}>
                See all →
              </Link>
            </div>

            <div style={{ backgroundColor: "#E7E2D7", border: "2px solid #C2C8C2", borderRadius: "2rem", overflow: "hidden" }}>
              {mockEvents.map((event, idx) => (
                <div key={event.id} className="ledger-row" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  borderBottom: idx < mockEvents.length - 1 ? "1px solid #D4CFCA" : "none",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-epilogue), serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#173124",
                      marginBottom: "0.15rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {event.name}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#727973" }}>
                      {event.date} · {event.location}
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: event.category === "Fitness" ? "#173124" : "#E5E0D5",
                    color: event.category === "Fitness" ? "#FFFFFF" : "#173124",
                    border: event.category === "Fitness" ? "none" : "2px solid #C2C8C2",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "0.2rem 0.75rem",
                    borderRadius: "3rem",
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
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
