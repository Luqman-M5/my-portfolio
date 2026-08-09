import { useEffect } from "react";

// GPU-driven CSS animation — no JS loop, no performance cost per frame.
// The browser hands the conic-gradient rotation to the graphics card entirely.
export function BorderBeam({
  children,
  duration = 8,
  thickness = 1.5,
  colorFrom = "var(--accent)",
  borderRadius = "1rem",
}) {
  useEffect(() => {
    // Inject @property and @keyframes once — needed for conic-gradient animation
    if (document.getElementById("border-beam-keyframes")) return;
    const style = document.createElement("style");
    style.id = "border-beam-keyframes";
    style.textContent = `
      @property --beam-angle {
        syntax: "<angle>";
        inherits: false;
        initial-value: 0deg;
      }
      @keyframes beam-spin {
        to { --beam-angle: 360deg; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        borderRadius,
        isolation: "isolate",
      }}
    >
      {/* Rotating beam — sits behind content */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: `-${thickness}px`,
          borderRadius: `calc(${borderRadius} + ${thickness}px)`,
          background: `conic-gradient(
            from var(--beam-angle),
            transparent 70%,
            ${colorFrom} 85%,
            transparent 100%
          )`,
          animation: `beam-spin ${duration}s linear infinite`,
          zIndex: -1,
        }}
      />
      {/* Inner mask — hides beam inside the card, only edge shows */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: `${thickness}px`,
          borderRadius: `calc(${borderRadius} - ${thickness}px)`,
          background: "var(--surface)",
          zIndex: -1,
        }}
      />
      {children}
    </div>
  );
}