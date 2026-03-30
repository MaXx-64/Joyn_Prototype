import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ fontFamily: "var(--font-lexend), sans-serif", backgroundColor: "#FEF9ED", color: "#173124", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        backgroundColor: "#FEF9ED",
        padding: "1.25rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "2px solid #E5E0D5",
      }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-epilogue), serif",
            fontWeight: 900,
            fontSize: "1.75rem",
            color: "#173124",
            letterSpacing: "-0.04em",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          JOYN
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href="/sign-in" style={{ color: "#173124", fontWeight: 500, fontSize: "1rem", textDecoration: "none" }}>
            Sign In
          </Link>
          <Link href="/sign-up" className="btn-primary" style={{ padding: "0.625rem 1.5rem", fontSize: "1rem" }}>
            Join Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ backgroundColor: "#F8F3E8", padding: "6rem 2.5rem 5rem", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "5fr 4fr", gap: "5rem", alignItems: "center" }}>

          {/* Left — editorial headline */}
          <div className="animate-fade-up">
            <p className="label-meta" style={{ marginBottom: "1.25rem" }}>
              Arizona&apos;s Senior Connection Platform
            </p>
            <h1 style={{
              fontFamily: "var(--font-epilogue), serif",
              fontWeight: 900,
              fontSize: "clamp(3rem, 6vw, 5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#173124",
              marginBottom: "2rem",
            }}>
              Move<br />
              <span style={{ color: "#735C00" }}>Together.</span><br />
              Age with<br />Joy.
            </h1>
            <p style={{
              fontSize: "1.25rem",
              lineHeight: 1.7,
              color: "#4A5C50",
              marginBottom: "2.5rem",
              maxWidth: "480px",
            }}>
              Find your workout partner. Build real friendship. Research shows just{" "}
              <strong style={{ color: "#173124" }}>35 minutes of activity per week</strong>{" "}
              reduces dementia risk by 60%.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/sign-up" className="btn-primary animate-fade-up delay-200">
                Join Free — It&apos;s Simple
              </Link>
              <a href="#how-it-works" className="btn-secondary animate-fade-up delay-300">
                See How It Works
              </a>
            </div>
          </div>

          {/* Right — stat card */}
          <div className="animate-fade-up delay-400">
            <div className="card-base" style={{ padding: "2.5rem", position: "relative", overflow: "hidden" }}>
              {/* Decorative corner accent */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, transparent 60%, #C2C8C2 60%)",
                borderTopRightRadius: "3rem",
                opacity: 0.4,
              }} />

              <p className="label-meta" style={{ marginBottom: "1rem" }}>
                The Loneliness Reality
              </p>
              <p style={{
                fontFamily: "var(--font-epilogue), serif",
                fontWeight: 900,
                fontSize: "4.5rem",
                lineHeight: 1,
                color: "#173124",
                letterSpacing: "-0.04em",
                marginBottom: "0.5rem",
              }}>
                1 in 3
              </p>
              <p style={{ fontSize: "1.25rem", fontWeight: 500, color: "#173124", marginBottom: "1rem", lineHeight: 1.4 }}>
                seniors aged 50–80 feel<br />isolated from others
              </p>
              <p style={{ fontSize: "0.85rem", color: "#727973", marginBottom: "2rem" }}>
                University of Michigan National Poll<br />on Healthy Aging, 2023
              </p>
              <div style={{
                backgroundColor: "#173124",
                borderRadius: "2rem",
                padding: "1.25rem 1.5rem",
              }}>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
                  <span style={{ color: "#E8C84A", fontWeight: 700 }}>Joyn</span> is building the antidote — one workout partnership at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ backgroundColor: "#173124", padding: "3rem 2.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
          {[
            { stat: "41–45%", label: "lower dementia risk with regular physical activity" },
            { stat: "50%", label: "greater survival odds with strong social connections" },
            { stat: "1 in 4", label: "older adults currently experience social isolation" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "1rem" }}>
              <p style={{
                fontFamily: "var(--font-epilogue), serif",
                fontWeight: 900,
                fontSize: "2.75rem",
                color: "#E8C84A",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "0.75rem",
              }}>
                {item.stat}
              </p>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ backgroundColor: "#FEF9ED", padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Asymmetric header — label left, headline right */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "end", marginBottom: "4rem" }}>
            <div>
              <p className="label-meta">Platform Features</p>
            </div>
            <h2 style={{
              fontFamily: "var(--font-epilogue), serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
              color: "#173124",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              Everything you need to move, connect, and thrive.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {[
              {
                icon: "🤝",
                tag: "AI Matching",
                title: "Smart Workout Partners",
                desc: "Paired by fitness level, interests, time zone, and language. Our AI finds someone truly compatible — not just nearby.",
              },
              {
                icon: "📹",
                tag: "Virtual Sessions",
                title: "Move Together on Video",
                desc: "Chair yoga, stretching, and light resistance — together on video call. No gym membership, no transportation needed.",
              },
              {
                icon: "📅",
                tag: "Scheduler",
                title: "Build a Real Routine",
                desc: "Built-in calendar with streaks and reminders. Celebrate milestones and keep each other accountable.",
              },
              {
                icon: "📍",
                tag: "Event Discovery",
                title: "Arizona Events, Curated",
                desc: "Walking groups, community classes, and social gatherings — surfaced by AI and filtered to your interests.",
              },
            ].map((f, i) => (
              <div key={i} className="card-base" style={{ padding: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "2.75rem", lineHeight: 1 }}>{f.icon}</div>
                  <span className="label-meta" style={{ color: "#727973" }}>{f.tag}</span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-epilogue), serif",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "#173124",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "1.125rem", color: "#4A5C50", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ backgroundColor: "#F8F3E8", padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="label-meta" style={{ marginBottom: "1rem" }}>Simple as 1-2-3</p>
            <h2 style={{
              fontFamily: "var(--font-epilogue), serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
              color: "#173124",
              letterSpacing: "-0.02em",
            }}>
              How It Works
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              {
                num: "01",
                title: "Tell us about yourself",
                desc: "A warm 3-minute chat with Jo, our AI guide. Just answer a few simple questions — no forms, no typing, just conversation.",
              },
              {
                num: "02",
                title: "Meet your match",
                desc: "Our AI pairs you with a compatible workout partner — same fitness level, shared interests, and your preferred schedule.",
              },
              {
                num: "03",
                title: "Move together",
                desc: "Schedule your first session, build a streak, and grow a real friendship. Every week gets a little easier.",
              },
            ].map((step, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: "2rem",
                alignItems: "center",
                backgroundColor: "#E7E2D7",
                border: "2px solid #C2C8C2",
                borderRadius: "2rem",
                padding: "2rem 2.5rem",
              }}>
                <div style={{
                  fontFamily: "var(--font-epilogue), serif",
                  fontWeight: 900,
                  fontSize: "2.5rem",
                  color: "#735C00",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-epilogue), serif",
                    fontWeight: 700,
                    fontSize: "1.375rem",
                    color: "#173124",
                    marginBottom: "0.5rem",
                    letterSpacing: "-0.02em",
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "1.125rem", color: "#4A5C50", lineHeight: 1.7, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: "#173124", padding: "7rem 2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative large number behind */}
        <div style={{
          position: "absolute",
          bottom: "-2rem",
          right: "5%",
          fontFamily: "var(--font-epilogue), serif",
          fontWeight: 900,
          fontSize: "clamp(8rem, 20vw, 18rem)",
          color: "rgba(255,255,255,0.03)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}>
          JOYN
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="label-meta" style={{ color: "#E8C84A", marginBottom: "1.25rem" }}>
            Join Today
          </p>
          <h2 style={{
            fontFamily: "var(--font-epilogue), serif",
            fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            color: "#FFFFFF",
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}>
            Ready to find your<br />workout partner?
          </h2>
          <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.75)", marginBottom: "2.5rem" }}>
            Free. Simple. Takes less than 5 minutes.
          </p>
          <Link href="/sign-up" className="btn-gold" style={{ fontSize: "1.25rem", padding: "1.125rem 2.5rem" }}>
            Join Free — Start Today
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: "#F8F3E8", padding: "3rem 2.5rem" }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-epilogue), serif",
              fontWeight: 900,
              fontSize: "1.5rem",
              color: "#173124",
              letterSpacing: "-0.04em",
            }}>
              JOYN
            </p>
            <p style={{ fontSize: "0.9rem", color: "#727973", marginTop: "0.25rem" }}>
              Move Together. Age with Joy.
            </p>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link href="/sign-up" style={{ color: "#173124", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>Join Free</Link>
            <Link href="/sign-in" style={{ color: "#173124", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>Sign In</Link>
            <a href="mailto:hello@joynapp.com" style={{ color: "#173124", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>Contact</a>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#727973" }}>
            © 2026 Joyn. Arizona&apos;s Senior Connection Platform.
          </p>
        </div>
      </footer>

    </div>
  );
}
