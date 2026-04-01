"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import HubSpotCaptureForm from "@/components/HubSpotCaptureForm";

const C = {
  green:     "#1b3428",
  greenDark: "#142a20",
  greenDeep: "#0f1f17",
  yellow:    "#e7c74c",
  gold:      "#6e5f14",
  cream:     "#ede8d9",
  tint:      "#e8f5f3",
  white:     "#ffffff",
};

export default function HomePage() {
  const [tick, setTick] = useState(0);
  const rep = (tick % 12) + 1;
  const set = (Math.floor(tick / 12) % 3) + 1;
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-lexend), sans-serif", backgroundColor: C.cream, color: C.green, overflowX: "hidden" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes speak-bar {
          0%, 100% { height: 4px; }
          50%       { height: 18px; }
        }
        @keyframes progress-fill {
          from { width: 0% }
          to   { width: 66% }
        }
        @keyframes timer-colon {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .pulse-dot {
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        @keyframes jg-pull { 0%,100%{transform:translateX(0);opacity:0.75} 50%{transform:translateX(-6px);opacity:1} }
        @keyframes jg-fade { 0%,100%{opacity:0.2} 50%{opacity:1} }
        .jg-arrow { animation: jg-pull 1.5s ease-in-out infinite; }
        .jg-label { animation: jg-fade 1.5s ease-in-out infinite; }
        .progress-fill {
          animation: progress-fill 2s ease-out forwards;
        }
        .timer-colon {
          animation: timer-colon 1s step-end infinite;
        }
        @keyframes btn-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(27,52,40,0); }
          50%       { box-shadow: 0 0 18px 4px rgba(27,52,40,0.22); }
        }
        .btn-primary {
          transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 24px rgba(27,52,40,0.28);
        }
        .btn-primary:active {
          transform: translateY(0) scale(0.98);
        }
        .btn-demo {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          animation: btn-glow 2.5s ease-in-out infinite;
        }
        .btn-demo:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 10px 32px rgba(231,199,76,0.45);
        }
        .btn-demo:active {
          transform: translateY(0) scale(0.98);
        }
        /* ── Mobile ── */
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-mobile-cta { display: flex !important; }
          .hero-section { padding: 3rem 1.25rem !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .hero-mock { display: none !important; }
          .section-pad { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .two-col-grid { grid-template-columns: 1fr !important; gap: 1.75rem !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
          .guide-card { padding: 1.75rem !important; }
          .cta-section { padding: 4rem 1.25rem !important; }
          .video-section { padding: 2rem 1.25rem !important; }
          .matching-strip { padding: 1.25rem !important; gap: 1rem !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        backgroundColor: C.cream,
        padding: "1.125rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1.5px solid rgba(27,52,40,0.12)",
      }}>
        <Image src="/brand_assets/JoynLogo.png" alt="Joyn" width={96} height={34} style={{ objectFit: "contain" }} priority />
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a href="#problem" style={{ color: C.green, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none" }}>The Problem</a>
          <a href="#how-it-works" style={{ color: C.green, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none" }}>How It Works</a>
          <a href="/dashboard" style={{ color: C.green, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none" }}>Try the Demo</a>
          <a href="#join" className="btn-primary" style={{ backgroundColor: C.green, color: C.yellow, fontFamily: "var(--font-epilogue)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.625rem 1.5rem", borderRadius: "100px", textDecoration: "none" }}>
            Take the First Step
          </a>
        </div>
        <a href="#join" className="nav-mobile-cta btn-primary" style={{ display: "none", backgroundColor: C.green, color: C.yellow, fontFamily: "var(--font-epilogue)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.625rem 1.25rem", borderRadius: "100px", textDecoration: "none" }}>
          Join
        </a>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section" style={{ backgroundColor: C.cream, padding: "5rem 2.5rem 5rem", overflow: "hidden", position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 60% 80% at 10% 50%, rgba(27,52,40,0.05) 0%, transparent 70%),
                       radial-gradient(ellipse 50% 60% at 90% 20%, rgba(231,199,76,0.07) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 50% at 50% 100%, rgba(27,52,40,0.04) 0%, transparent 60%)`,
          pointerEvents: "none",
        }} />

        <div className="hero-grid" style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 480px", gap: "4rem", alignItems: "center" }}>

          {/* Left copy */}
          <div>
            <p style={{ fontFamily: "var(--font-epilogue)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "1.25rem" }}>
              ASU Loneliness Innovation Challenge · Arizona
            </p>

            <Image src="/brand_assets/JoynLogo.png" alt="Joyn" width={180} height={64} style={{ objectFit: "contain", objectPosition: "left", display: "block", marginBottom: "1.25rem" }} />

            <h1 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(2.75rem, 5vw, 4rem)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.green, marginBottom: "0.5rem" }}>
              Move Together.
            </h1>
            <h1 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(2.75rem, 5vw, 4rem)", lineHeight: 0.97, letterSpacing: "-0.03em", marginBottom: "2rem" }}>
              <span style={{ color: C.green }}>Age with </span><span style={{ color: C.yellow }}>Joy!</span>
            </h1>

            <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "#3a5244", marginBottom: "2.5rem", maxWidth: "520px" }}>
              Retirement often ends the friendships that came with the schedule. Joyn pairs retired adults with a real exercise partner — and an AI{" "}
              <strong style={{ color: C.green }}>Joy Guide</strong> virtual trainer who runs the workout so the two of them can focus on each other. Real people. Real connection. One session at a time.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
              <a href="#join" className="btn-primary" style={{ backgroundColor: C.green, color: C.yellow, fontFamily: "var(--font-epilogue)", fontWeight: 700, fontSize: "1rem", padding: "0.9rem 2rem", borderRadius: "100px", textDecoration: "none" }}>
                Take the First Step
              </a>
            </div>

            {/* Stat pill strip */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {[
                { stat: "1 in 3", label: "retired adults feel isolated from others", cite: "— U of M, 2024" },
                { stat: "50%",    label: "greater survival with strong social ties",  cite: "— Holt-Lunstad" },
              ].map((p, i) => (
                <div key={i} style={{ backgroundColor: C.tint, borderRadius: "100px", padding: "0.625rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.05rem", fontWeight: 800, color: C.green, fontFamily: "var(--font-epilogue)" }}>{p.stat}</span>
                  <span style={{ fontSize: "0.825rem", color: "#4a6358", fontWeight: 500 }}>{p.label}</span>
                  <span style={{ fontSize: "0.72rem", color: "#8aaa98" }}>{p.cite}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mock App Card */}
          <div className="hero-mock" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-40px", background: `radial-gradient(ellipse at center, rgba(27,52,40,0.1) 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ transform: "rotate(-1.5deg)", position: "relative", zIndex: 1, borderRadius: "24px", overflow: "hidden", backgroundColor: C.white, boxShadow: `0 24px 64px rgba(27,52,40,0.14), 0 4px 16px rgba(27,52,40,0.08)` }}>

              {/* Card header */}
              <div style={{ padding: "1.25rem 1.5rem 1rem", borderBottom: `1.5px solid ${C.tint}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Image src="/brand_assets/JoynLogoMono.png" alt="Joyn" width={64} height={22} style={{ objectFit: "contain" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#7a9e8e" }}>Your Sessions</span>
              </div>

              {/* Your Match */}
              <div style={{ padding: "1.25rem 1.5rem", backgroundColor: C.tint }}>
                <p style={{ fontFamily: "var(--font-epilogue)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.green, marginBottom: "0.75rem" }}>Your Match</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <img src="/other_assets/marg.jpg" alt="Margaret" style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "1.125rem", color: C.greenDark }}>Margaret, 71</p>
                    <p style={{ fontSize: "0.9375rem", color: "#7a9e8e" }}>Phoenix, AZ</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                  {["Gardening", "Coffee & Conversation", "Resistance Bands", "English"].map(tag => (
                    <span key={tag} style={{ backgroundColor: C.white, color: C.green, fontSize: "0.78rem", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: "100px", border: `1px solid rgba(27,52,40,0.15)` }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Next Session */}
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1.5px solid ${C.tint}` }}>
                <p style={{ fontFamily: "var(--font-epilogue)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7a9e8e", marginBottom: "0.75rem" }}>Next Session</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{ width: "40px", height: "40px", backgroundColor: C.tint, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "1rem", color: C.greenDark }}>Tomorrow</p>
                      <p style={{ fontSize: "0.875rem", color: "#7a9e8e" }}>10:00 AM</p>
                    </div>
                  </div>
                  <span style={{ backgroundColor: C.green, color: C.white, fontSize: "0.875rem", fontWeight: 700, padding: "0.5rem 1.25rem", borderRadius: "100px" }}>Join Call</span>
                </div>
              </div>

              {/* Streak */}
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: C.greenDark }}>5-week streak</p>
                  <p style={{ fontSize: "1.25rem" }}>🔥</p>
                </div>
                <div style={{ height: "8px", backgroundColor: C.tint, borderRadius: "100px", overflow: "hidden" }}>
                  <div style={{ width: "78%", height: "100%", background: `linear-gradient(90deg, ${C.green}, #2d6048)`, borderRadius: "100px" }} />
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#7a9e8e", marginTop: "0.375rem" }}>78% of your wellness goal this month</p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ── The Problem ── */}
      <section id="problem" className="section-pad" style={{ backgroundColor: C.green, padding: "6rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 80% at 10% 30%, rgba(232,245,243,0.05) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 90% 70%, rgba(231,199,76,0.07) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "var(--font-epilogue)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.yellow, marginBottom: "1rem" }}>The Problem</p>
            <h2 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 2.75rem)", color: C.white, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Two Silent Epidemics. One Platform.
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, maxWidth: "560px", margin: "1rem auto 0" }}>
              Loneliness and physical inactivity aren&apos;t lifestyle problems — they&apos;re public health emergencies.
            </p>
          </div>

          <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
            {/* Loneliness */}
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "3.5rem", color: C.yellow, letterSpacing: "-0.04em", lineHeight: 1 }}>1 in 4</p>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>older adults experience social isolation</p>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>— CDC, Health Effects of Social Isolation</p>
              </div>
              <div style={{ backgroundColor: "rgba(231,199,76,0.1)", borderLeft: `4px solid ${C.yellow}`, borderRadius: "0 16px 16px 0", padding: "1.5rem 1.75rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: "0.5rem" }}>
                  &ldquo;Adults with strong social ties have a 50% greater likelihood of survival — an effect comparable to smoking 15 cigarettes a day.&rdquo;
                </p>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>— Holt-Lunstad et al., meta-analysis of 308,849 participants</p>
              </div>
              <p style={{ fontSize: "0.975rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>
                Retirement comes with a silence nobody warns about. The colleagues disappear. The schedule disappears. The built-in reason to get dressed and show up — gone. Joyn gives it back.
              </p>
            </div>

            {/* Physical Inactivity */}
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "3.5rem", color: C.yellow, letterSpacing: "-0.04em", lineHeight: 1 }}>~60%</p>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>lower dementia risk from just 35–70 min of activity per week</p>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>— Wanigatunga et al., Johns Hopkins, 2025</p>
              </div>
              <div style={{ backgroundColor: "rgba(232,245,243,0.08)", borderLeft: `4px solid rgba(255,255,255,0.3)`, borderRadius: "0 16px 16px 0", padding: "1.5rem 1.75rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: "0.5rem" }}>
                  &ldquo;35–70 minutes of activity per week showed ~60% lower dementia risk — even in frail older adults.&rdquo;
                </p>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>— Wanigatunga et al., Johns Hopkins Bloomberg School of Public Health, 2025</p>
              </div>
              <p style={{ fontSize: "0.975rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>
                Most people know they should move more. What&apos;s missing isn&apos;t information — it&apos;s someone who notices when a partner doesn&apos;t show up. Joyn provides that person.
              </p>
            </div>
          </div>

          {/* Gap statement */}
          <div style={{ backgroundColor: "rgba(231,199,76,0.12)", border: `1px solid rgba(231,199,76,0.25)`, borderRadius: "24px", padding: "3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <p style={{ fontSize: "clamp(1.125rem, 2.25vw, 1.625rem)", fontWeight: 700, color: C.white, lineHeight: 1.55, maxWidth: "780px", margin: "0 auto" }}>
              Joyn is not a fitness app with a social feature.<br />
              <span style={{ color: C.yellow }}>It is a human connection platform that uses movement as its medium.</span><br />
              The workout is the vehicle. The relationship is the destination.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="section-pad" style={{ backgroundColor: C.tint, padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "var(--font-epilogue)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem" }}>How It Works</p>
            <h2 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 2.75rem)", color: C.green, letterSpacing: "-0.02em" }}>
              From Isolated to Connected in Four Steps.
            </h2>
          </div>

          {/* 4 Steps */}
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
            {[
              { num: "01", title: "Share a bit about yourself",   desc: "A warm 3-minute onboarding chat covering interests, hobbies, and schedule. No forms — just conversation." },
              { num: "02", title: "Meet a compatible partner",   desc: "Joyn introduces a matched partner — shared interests, same language, same time of day." },
              { num: "03", title: "Pick a time, make it routine", desc: "Choose a recurring slot that works for both members. Joyn handles reminders so no one misses a session." },
              { num: "04", title: "Show up. That's all.",         desc: "The Joy Guide takes care of the rest — the workout, the icebreaker, and every conversation after. Silence never has a chance.", highlight: true },
            ].map((step, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "2rem", color: C.yellow, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "-16px", position: "relative", zIndex: 2, paddingLeft: "1.75rem" }}>
                  {step.num}
                </div>
                <div style={{ marginTop: 0, padding: "1.75rem", backgroundColor: step.highlight ? C.green : C.white, borderRadius: "20px", boxShadow: step.highlight ? `0 4px 24px rgba(27,52,40,0.25)` : `0 4px 24px rgba(27,52,40,0.07)` }}>
                  <h3 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 700, fontSize: "1.05rem", color: step.highlight ? C.white : C.green, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>{step.title}</h3>
                  <p style={{ fontSize: "0.925rem", color: step.highlight ? "rgba(255,255,255,0.8)" : "#4a6358", lineHeight: 1.65 }}>{step.desc}</p>
                </div>
                {i < 3 && (
                  <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill={C.white} />
                      <path d="M12 10l6 6-6 6" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Matching strip */}
          <div className="matching-strip" style={{ backgroundColor: C.white, borderRadius: "20px", padding: "1.75rem 2.25rem", display: "flex", alignItems: "center", gap: "1.5rem", boxShadow: `0 4px 24px rgba(27,52,40,0.07)`, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img src="/other_assets/Robert.png" alt="Robert" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0 }} />
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: C.green, opacity: 0.3 + i * 0.25 }} />)}
              </div>
              <Image src="/brand_assets/Joy_Smile.png" alt="Joy Guide" width={48} height={48} style={{ borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: C.yellow, opacity: 0.3 + i * 0.25 }} />)}
              </div>
              <img src="/other_assets/Dorothy.png" alt="Dorothy" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0 }} />
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <p style={{ fontWeight: 700, fontSize: "1.05rem", color: C.greenDark }}>Joyn found a match in 8 seconds</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                {["Resistance Bands", "English", "Morning Person", "Phoenix, AZ"].map(tag => (
                  <span key={tag} style={{ backgroundColor: C.tint, color: C.green, fontSize: "0.78rem", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: "100px" }}>{tag}</span>
                ))}
              </div>
            </div>
            <a href="#join" className="btn-primary" style={{ backgroundColor: C.green, color: C.yellow, fontFamily: "var(--font-epilogue)", fontWeight: 700, fontSize: "0.9rem", padding: "0.75rem 1.5rem", borderRadius: "100px", textDecoration: "none", whiteSpace: "nowrap" }}>
              Take the First Step
            </a>
          </div>
        </div>
      </section>

      {/* ── Joy Guide — Two Superpowers ── */}
      <section style={{ backgroundColor: C.white, padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "var(--font-epilogue)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem" }}>Meet the Joy Guide</p>
            <h2 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 2.75rem)", color: C.green, letterSpacing: "-0.02em" }}>One Guide. Two Superpowers.</h2>
            <p style={{ fontSize: "1.05rem", color: "#4a6358", lineHeight: 1.75, maxWidth: "560px", margin: "1rem auto 0" }}>
              The hardest part of any new friendship is the first five minutes. The Joy Guide eliminates that entirely.
            </p>
          </div>

          <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3.5rem" }}>
            {/* Fitness Lead */}
            <div className="guide-card" style={{ backgroundColor: C.tint, borderRadius: "24px", padding: "3rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", backgroundColor: "rgba(27,52,40,0.06)" }} />
              <div style={{ width: "60px", height: "60px", backgroundColor: C.green, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-epilogue)", fontSize: "1.5rem", fontWeight: 800, color: C.green, letterSpacing: "-0.02em", marginBottom: "1rem" }}>Fitness Lead</h3>
              <p style={{ fontSize: "0.975rem", color: "#4a6358", lineHeight: 1.75, marginBottom: "1.75rem" }}>Demonstrates every exercise on-screen, counts reps, and adapts to each person's pace. No wondering what comes next — full attention stays on the partner, not the workout.</p>
              {/* Animated exercise graphic + Now Playing + Reps — horizontal */}
              <div style={{ display: "flex", alignItems: "stretch", borderRadius: "12px", overflow: "hidden", boxShadow: `0 4px 16px rgba(27,52,40,0.1)` }}>
                {/* Image */}
                <div style={{ position: "relative", width: "90px", flexShrink: 0 }}>
                  <img src="/other_assets/SeatedBandRow.png" alt="Seated Band Row" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g className="jg-arrow">
                      <line x1="32" y1="33" x2="22" y2="33" stroke={C.yellow} strokeWidth="2" strokeLinecap="round"/>
                      <polyline points="27,29 22,33 27,37" stroke={C.yellow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <text className="jg-label" x="50" y="92" textAnchor="middle" fontSize="7" fontWeight="700" fill={C.yellow} fontFamily="Arial,sans-serif" letterSpacing="0.1em">PULL BACK</text>
                  </svg>
                </div>
                {/* Info panel */}
                <div style={{ backgroundColor: C.white, flex: 1, padding: "0.75rem 1rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <div className="pulse-dot" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#4ade80", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "0.55rem", fontWeight: 700, color: "#7a9e8e", letterSpacing: "0.1em", textTransform: "uppercase" }}>Now Playing</p>
                      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: C.greenDark }}>Seated Band Row · Set {set} of 3</p>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <p style={{ fontSize: "0.55rem", fontWeight: 700, color: "#7a9e8e", letterSpacing: "0.1em", textTransform: "uppercase" }}>Reps</p>
                      <p style={{ fontFamily: "var(--font-epilogue)", fontSize: "0.75rem", fontWeight: 800, color: C.green }}>{rep}<span style={{ color: "#7a9e8e", fontWeight: 500 }}>/12</span></p>
                    </div>
                    <div style={{ display: "flex", gap: "3px" }}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <div key={i} style={{
                          flex: 1, height: "6px", borderRadius: "100px",
                          backgroundColor: i < rep ? C.green : "rgba(27,52,40,0.12)",
                          transform: i === rep - 1 ? "scaleY(1.5)" : "scaleY(1)",
                          transition: "background-color 0.2s ease, transform 0.2s ease",
                          boxShadow: i === rep - 1 ? `0 0 4px ${C.green}` : "none",
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Host */}
            <div className="guide-card" style={{ backgroundColor: C.cream, borderRadius: "24px", padding: "3rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", backgroundColor: "rgba(231,199,76,0.1)" }} />
              <div style={{ width: "60px", height: "60px", backgroundColor: C.yellow, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-epilogue)", fontSize: "1.5rem", fontWeight: 800, color: C.gold, letterSpacing: "-0.02em", marginBottom: "1rem" }}>Social Host</h3>
              <p style={{ fontSize: "0.975rem", color: "#4a6358", lineHeight: 1.75, marginBottom: "1.75rem" }}>Opens every session with an icebreaker built from shared interests. Keeps conversation flowing during rest periods. By the end of the first session, members already feel like old friends.</p>
              <div style={{ backgroundColor: C.white, borderRadius: "14px", padding: "1rem 1.25rem", boxShadow: `0 2px 12px rgba(231,199,76,0.12)` }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>💬 Joy Guide prompt</p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                  <Image src="/brand_assets/Joy_Smile.png" alt="Joy Guide" width={40} height={40} style={{ borderRadius: "50%", objectFit: "contain", flexShrink: 0, backgroundColor: C.green, padding: "4px" }} />
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: C.greenDark, lineHeight: 1.5 }}>&ldquo;While you rest — Ask Margaret about her hobbies. You might have something in common!&rdquo;</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom callout */}
          <div style={{ textAlign: "center", padding: "2.5rem", backgroundColor: C.greenDark, borderRadius: "24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(27,52,40,0.4) 0%, transparent 70%)`, pointerEvents: "none" }} />
            <p style={{ fontSize: "clamp(1.25rem, 2.25vw, 1.5rem)", fontWeight: 700, color: C.white, lineHeight: 1.55, maxWidth: "680px", margin: "0 auto 1rem", position: "relative", zIndex: 1 }}>
              &ldquo;The Joy Guide doesn&apos;t replace human connection —<br />it creates the conditions for it.&rdquo;
            </p>
            <p style={{ fontSize: "0.925rem", color: "rgba(255,255,255,0.45)", position: "relative", zIndex: 1 }}>The workout is the vehicle. The relationship is the destination.</p>
          </div>
        </div>
      </section>

      {/* ── Mock Video Call ── */}
      <div className="video-section section-pad" style={{ backgroundColor: C.greenDark, padding: "4rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%, rgba(27,52,40,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(231,199,76,0.06) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginBottom: "2rem" }}>
            The Joy Guide leads every session — workouts and conversation, all in one.
          </p>
          <div style={{ backgroundColor: "#1f1f1f", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
            {/* Top bar */}
            <div style={{ padding: "0.75rem 1.25rem", backgroundColor: "#2d2d2d", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#2D8CFF"/><path d="M4 8.5C4 7.67 4.67 7 5.5 7H13.5C14.33 7 15 7.67 15 8.5V15.5C15 16.33 14.33 17 13.5 17H5.5C4.67 17 4 16.33 4 15.5V8.5Z" fill="white"/><path d="M15.5 10.5L20 8V16L15.5 13.5V10.5Z" fill="white"/></svg>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Joyn Session · 3 participants</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div className="pulse-dot" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#4ade80" }} />
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>24<span className="timer-colon">:</span>17</span>
              </div>
            </div>
            {/* Video tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3px", padding: "3px", backgroundColor: "#111" }}>
              {/* You */}
              <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#2a2a2a", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.5rem" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>Camera off</p>
                <div style={{ position: "absolute", bottom: "8px", left: "8px", backgroundColor: "rgba(0,0,0,0.55)", borderRadius: "6px", padding: "3px 8px" }}>
                  <span style={{ color: C.white, fontSize: "0.75rem", fontWeight: 600 }}>Ruth</span>
                </div>
              </div>
              {/* Joy Guide */}
              <div style={{ position: "relative", aspectRatio: "4/3", background: "linear-gradient(145deg, #0d2320 0%, #1a3d38 100%)", border: `1.5px solid rgba(27,52,40,0.5)`, borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image src="/brand_assets/Joy_Smile.png" alt="Joy Guide" width={80} height={80} style={{ objectFit: "contain" }} />
                <div style={{ position: "absolute", bottom: "8px", left: "8px", backgroundColor: "rgba(27,52,40,0.85)", borderRadius: "6px", padding: "3px 10px" }}>
                  <span style={{ color: C.white, fontSize: "0.75rem", fontWeight: 700 }}>Joy Guide</span>
                </div>
              </div>
              {/* Margaret */}
              <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#111", borderRadius: "6px", overflow: "hidden" }}>
                <img src="/other_assets/marg.jpg" alt="Margaret" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: "8px", left: "8px", backgroundColor: "rgba(0,0,0,0.55)", borderRadius: "6px", padding: "3px 8px" }}>
                  <span style={{ color: C.white, fontSize: "0.75rem", fontWeight: 600 }}>Margaret, 71</span>
                </div>
              </div>
            </div>
            {/* Joy Guide bar */}
            <div style={{ padding: "1rem 1.5rem", backgroundColor: "#161616", display: "flex", alignItems: "center", gap: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: "80px", flexShrink: 0, position: "relative" }}>
                <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  <img src="/other_assets/SeatedBandRow.png" alt="Seated Band Row" style={{ width: "100%", borderRadius: "8px", display: "block" }} />
                  <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g className="jg-arrow">
                      <line x1="32" y1="33" x2="22" y2="33" stroke={C.yellow} strokeWidth="2" strokeLinecap="round"/>
                      <polyline points="27,29 22,33 27,37" stroke={C.yellow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <text className="jg-label" x="50" y="90" textAnchor="middle" fontSize="7" fontWeight="700" fill={C.yellow} fontFamily="Arial,sans-serif" letterSpacing="0.1em">PULL BACK</text>
                  </svg>
                </div>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", marginTop: "4px" }}>Joy Guide</p>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <div className="pulse-dot" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#4ade80", flexShrink: 0 }} />
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Now Playing · Set 2 of 3</p>
                </div>
                <p style={{ fontSize: "1rem", fontWeight: 800, color: C.white, lineHeight: 1.2, marginBottom: "4px" }}>Seated Band Row</p>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>Pull elbows back toward hips · Keep shoulders down · 12 reps</p>
                <div style={{ marginTop: "6px", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "100px", overflow: "hidden" }}>
                  <div className="progress-fill" style={{ width: "0%", height: "100%", background: `linear-gradient(90deg, ${C.green}, #2d6048)`, borderRadius: "100px" }} />
                </div>
              </div>
              <div style={{ backgroundColor: "rgba(231,199,76,0.15)", borderRadius: "12px", padding: "0.875rem 1.125rem", flexShrink: 0, maxWidth: "220px" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: C.yellow, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>💬 Rest Period Prompt</p>
                <p style={{ fontSize: "0.875rem", color: C.white, lineHeight: 1.5 }}>&ldquo;Margaret — what hobby did you pick up after retiring?&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lead Capture CTA ── */}
      <section id="join" className="cta-section section-pad" style={{ backgroundColor: C.green, padding: "7rem 2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 80% at 50% 50%, rgba(232,245,243,0.04) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-1rem", right: "3%", fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(6rem, 18vw, 16rem)", color: "rgba(255,255,255,0.025)", letterSpacing: "-0.05em", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>JOYN</div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-epilogue)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.yellow, marginBottom: "1rem" }}>Joyn the Experience</p>
          <h2 style={{ fontFamily: "var(--font-epilogue)", fontWeight: 900, fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)", color: C.white, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem" }}>
            Make real connections.
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.68)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            Walk through the full Joyn experience — from matching to a live session with the Joy Guide. See the workout, hear the conversation, and feel what it's like when loneliness finally has an answer.
          </p>
          {/* Feature bullets */}
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {["Personalized Workout Experience", "Matched by interests & schedule", "No gym or equipment needed", "Real people. Real friendship."].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: C.yellow, fontSize: "1rem" }}>✓</span>
                <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
          <HubSpotCaptureForm />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: C.greenDeep, padding: "2.5rem 2.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <Image src="/brand_assets/JoynLogoMono.png" alt="Joyn" width={76} height={26} style={{ objectFit: "contain", opacity: 0.65 }} />
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.32)", marginTop: "0.4rem" }}>Move Together. Age with Joy.</p>
          </div>
          <p style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.28)" }}>&copy; 2026 Joyn &middot; ASU Loneliness Innovation Challenge &middot; Arizona</p>
        </div>
      </footer>

    </div>
  );
}
