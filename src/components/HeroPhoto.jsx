import { BorderBeam } from "./motion-ui/BorderBeam.jsx";

// Drop-in replacement for the static circle in Hero.astro.
// BorderBeam traces the rounded edge with a slow amber sweep.
export function HeroPhoto({ src, alt = "Luqman Muhammed" }) {
  return (
    <BorderBeam duration={10} thickness={3} borderRadius="9999px">
      <div
        style={{
          width: "clamp(160px, 20vw, 500px)",
          height: "clamp(160px, 20vw, 500px)",
          borderRadius: "9999px",
          overflow: "hidden",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
        ) : (
          // Initials fallback — remove once you add your photo
          <span style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 600, color: "var(--accent)" }}>
            LM
          </span>
        )}
      </div>
    </BorderBeam>
  );
}