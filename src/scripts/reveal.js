// Scroll reveal — vanilla JS, no library.
// Add [data-reveal] to any element and it fades in once it enters the viewport.
// Stagger with style="transition-delay: 80ms" etc on siblings.

const els = document.querySelectorAll("[data-reveal]");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduced) {
  els.forEach((el) => el.classList.add("visible"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );
  els.forEach((el) => io.observe(el));
}