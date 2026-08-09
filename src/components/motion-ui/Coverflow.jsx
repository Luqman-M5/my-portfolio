import { useState, useEffect } from "react";

// Single card with prev/next on mobile, 3D coverflow on desktop.
// Blur removed entirely — it was fighting readability.
// Buttons live outside the perspective container so they're never hidden.

function Card({ project, isCenter }) {
  const cardStyle = {
    background: "var(--surface)",
    border: `1px solid ${isCenter ? "var(--accent)" : "var(--border)"}`,
    borderRadius: "1rem",
    padding: "1.5rem",
    height: "100%",
    transition: "border-color 0.4s ease",
    boxSizing: "border-box",
  };

  return (
    <div style={cardStyle}>
      <h3
        className="font-display text-lg font-semibold mb-3"
        style={{ color: "var(--ink)" }}
      >
        {project.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tools.map((t) => (
          <span
            key={t}
            className="rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            {t}
          </span>
        ))}
      </div>

      <ul className="flex flex-col gap-2 mb-5">
        {project.points.map((pt, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            <span
              className="mt-2 h-1 w-1 flex-shrink-0 rounded-full"
              style={{
                background: "var(--accent-lo)",
                border: "1px solid var(--accent)",
              }}
            />
            {pt}
          </li>
        ))}
      </ul>

      {isCenter && (
        <div
          className="pt-4 font-mono text-sm"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          
           <a href={project.href}
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            View project
          </a>
        </div>
      )}
    </div>
  );
}

// ── Desktop: 3D coverflow ──────────────────────────────────────────────────
function CoverflowDesktop({ projects, active, setActive }) {
  return (
    <div
      style={{
        perspective: "1200px",
        perspectiveOrigin: "50% 40%",
        position: "relative",
        // Height is driven by the center card — side cards scale down inside it
        height: "480px",
        width: "100%",
        overflow: "visible",
      }}
    >
      {projects.map((project, i) => {
        const offset = i - active;
        const abs = Math.abs(offset);
        if (abs > 2) return null;

        const isCenter = offset === 0;

        return (
          <div
            key={i}
            onClick={() => !isCenter && setActive(i)}
            style={{
              position: "absolute",
              width: "min(400px, 80vw)",
              top: 0,
              left: "50%",
              cursor: isCenter ? "default" : "pointer",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `
                translateX(calc(-50% + ${offset * 52}%))
                translateZ(${isCenter ? 0 : -100}px)
                rotateY(${offset * -26}deg)
                scale(${isCenter ? 1 : 0.84 - abs * 0.03})
              `,
              opacity: isCenter ? 1 : abs === 1 ? 0.55 : 0.2,
              zIndex: 10 - abs,
              // No blur — improves readability significantly
            }}
          >
            <Card project={project} isCenter={isCenter} />
          </div>
        );
      })}
    </div>
  );
}

// ── Mobile: single card, fade swap ────────────────────────────────────────
function CoverflowMobile({ projects, active }) {
  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      <div
        key={active}
        style={{
          animation: "fadeIn 0.3s ease",
        }}
      >
        <Card project={projects[active]} isCenter={true} />
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Shared controls ────────────────────────────────────────────────────────
function Controls({ active, total, setActive }) {
  const prev = () => setActive((i) => Math.max(0, i - 1));
  const next = () => setActive((i) => Math.min(total - 1, i + 1));

  const btnStyle = (disabled) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "40px",
    width: "40px",
    borderRadius: "9999px",
    border: `1px solid ${disabled ? "var(--border)" : "var(--accent)"}`,
    color: disabled ? "var(--muted)" : "var(--accent)",
    opacity: disabled ? 0.4 : 1,
    background: "var(--surface)",
    cursor: disabled ? "default" : "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  });

  return (
    // position: relative + zIndex keeps buttons above everything
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        marginTop: "1.5rem",
        position: "relative",
        zIndex: 20,
      }}
    >
      <button onClick={prev} disabled={active === 0} style={btnStyle(active === 0)} aria-label="Previous">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Project ${i + 1}`}
            style={{
              width: i === active ? "24px" : "8px",
              height: "8px",
              borderRadius: "9999px",
              background: i === active ? "var(--accent)" : "var(--border)",
              transition: "all 0.3s ease",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      <button onClick={next} disabled={active === total - 1} style={btnStyle(active === total - 1)} aria-label="Next">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
export function Coverflow({ projects }) {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Keyboard navigation
  const handleKey = (e) => {
    if (e.key === "ArrowLeft") setActive((i) => Math.max(0, i - 1));
    if (e.key === "ArrowRight") setActive((i) => Math.min(projects.length - 1, i + 1));
  };

  return (
    <div onKeyDown={handleKey} tabIndex={0} style={{ outline: "none" }}>
      {isMobile ? (
        <CoverflowMobile projects={projects} active={active} />
      ) : (
        <CoverflowDesktop projects={projects} active={active} setActive={setActive} />
      )}
      <Controls active={active} total={projects.length} setActive={setActive} />
      <p className="text-center font-mono text-xs mt-3" style={{ color: "var(--muted)" }}>
        {active + 1} / {projects.length}
      </p>
    </div>
  );
}