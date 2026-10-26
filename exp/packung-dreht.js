/* EXPERIMENT „Packung dreht“: Beim Lesen des Geschmacksprofils zeigt die
   Packung von selbst ihre Rückseite, beim Kaufen wieder die Vorderseite.
   Nur Desktop, dort bleibt die Packung neben dem Text stehen. */
(() => {
  if (!window.gsap || !window.qahwahPouch) return;
  gsap.matchMedia().add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const st = ScrollTrigger.create({
      trigger: ".profile", start: "top 60%", end: "bottom 45%",
      onEnter: () => qahwahPouch.showSide(true),
      onEnterBack: () => qahwahPouch.showSide(true),
      onLeave: () => qahwahPouch.showSide(false),
      onLeaveBack: () => qahwahPouch.showSide(false),
    });
    return () => st.kill();
  });
})();
