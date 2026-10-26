/* EXPERIMENT „Leitsatz“: „Eine Tasse voller Geschichte.“ zwischen Geschichte
   und Ausschank. Die Wörter richten sich beim Scrollen nacheinander auf. */
(() => {
  const text = "Eine Tasse voller Geschichte.";
  const section = document.createElement("section");
  section.className = "leitsatz";
  section.setAttribute("aria-label", "Leitsatz");
  section.innerHTML = `<p>${text.split(" ").map((w) => `<span>${w}</span>`).join(" ")}</p>`;
  document.querySelector("#ausschank").before(section);

  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.from(section.querySelectorAll("span"), {
    yPercent: 110, rotation: 6, opacity: 0, stagger: 0.25, ease: "power3.out",
    scrollTrigger: { trigger: section, start: "top 80%", end: "center 55%", scrub: 1 },
  });
  ScrollTrigger.refresh();
})();
