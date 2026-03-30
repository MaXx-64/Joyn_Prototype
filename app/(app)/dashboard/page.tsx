"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MoodWidget } from "@/components/dashboard/MoodWidget";
import { ConnectionNudgeWidget } from "@/components/dashboard/ConnectionNudgeWidget";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("Friend");
  const [matches, setMatches] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch User Profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();
          if (profile?.full_name) {
            setUserName(profile.full_name.split(" ")[0]);
          }
        }

        // 2. Fetch Matches, Events, Sessions in parallel
        const [matchesRes, eventsRes, sessionsRes] = await Promise.all([
          fetch("/api/ai/match/candidates").then((r) => r.json()).catch(() => ({ matches: [] })),
          fetch("/api/events").then((r) => r.json()).catch(() => ({ events: [] })),
          fetch("/api/sessions").then((r) => r.json()).catch(() => ({ sessions: [] }))
        ]);

        if (matchesRes?.matches?.length > 0) {
          setMatches(matchesRes.matches.slice(0, 3)); // show top 3 on dashboard
        }
        if (eventsRes?.events) setEvents(eventsRes.events);
        if (sessionsRes?.sessions) setSessions(sessionsRes.sessions);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase]);

  // Find the top match for the nudge widget
  const topMatch = matches.length > 0 ? matches[0] : null;

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
            Good morning, {userName} 🌻
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
              0-day connection streak
            </p>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginTop: "0.1rem" }}>Start your streak today!</p>
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
            {loading ? (
              // Loading Shimmer
              [1, 2, 3].map((i) => (
                <div key={i} style={{
                  backgroundColor: "#E7E2D7",
                  border: "2px solid #C2C8C2",
                  borderRadius: "2rem",
                  padding: "1.75rem",
                  height: "160px",
                  animation: "dashboard-shimmer 1.6s ease-in-out infinite",
                }} />
              ))
            ) : matches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "#E7E2D7", borderRadius: "2rem", border: "2px solid #C2C8C2" }}>
                <p style={{ fontWeight: 600, color: "#173124", fontSize: "1.2rem", marginBottom: "0.5rem" }}>No matches yet</p>
                <p style={{ color: "#727973" }}>We are analyzing your profile to find the perfect companions.</p>
              </div>
            ) : (
              matches.map((match) => (
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
                    {match.interests?.map((interest: string) => (
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
              ))
            )}
          </div>
        </div>

        {/* RIGHT — Widgets + Sessions + Events */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* Mood check-in */}
          <MoodWidget />

          {/* Connection nudge */}
          <ConnectionNudgeWidget 
            companionName={topMatch?.name} 
            companionId={topMatch?.id} 
            daysSince={0} // Force "new match" nudge
          />

          {/* Sessions */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <p className="label-meta">Your Upcoming Meetups</p>
              <Link href="/sessions" style={{ fontSize: "0.85rem", color: "#735C00", textDecoration: "none", fontWeight: 600 }}>
                Plan new →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {loading ? (
                <div style={{
                  backgroundColor: "#E7E2D7",
                  border: "2px solid #C2C8C2",
                  borderRadius: "2rem",
                  padding: "1.5rem",
                  height: "100px",
                  animation: "dashboard-shimmer 1.6s ease-in-out infinite",
                }} />
              ) : sessions.length === 0 ? (
                <div className="card-base" style={{ padding: "1.5rem", textAlign: "center" }}>
                   <p style={{  color: "#727973", fontSize: "0.95rem" }}>No upcoming meetups yet.</p>
                </div>
              ) : (
                sessions.map((session) => (
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
                ))
              )}
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
              {loading ? (
                 <div style={{
                  padding: "1.5rem",
                  height: "150px",
                  animation: "dashboard-shimmer 1.6s ease-in-out infinite",
                }} />
              ) : events.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center" }}>
                   <p style={{  color: "#727973", fontSize: "0.95rem" }}>No events found.</p>
                </div>
              ) : (
                events.map((event, idx) => (
                  <div key={event.id} className="ledger-row" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    borderBottom: idx < events.length - 1 ? "1px solid #D4CFCA" : "none",
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes dashboard-shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
