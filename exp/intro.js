/* EXPERIMENT „Intro“ – wird im <head> geladen, damit kein Hero-Blitz entsteht.
   Läuft einmal pro Besuch; Klick, Taste oder Scrollen überspringt es. */
(() => {
  const KEY = "qahwah-intro";
  let seen = false;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
  if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("has-intro");

  document.addEventListener("DOMContentLoaded", () => {
    const intro = document.querySelector("[data-intro]");
    const box = document.querySelector("[data-letterbox]");
    const done = () => {
      document.documentElement.classList.remove("has-intro");
      intro?.remove(); box?.remove();
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };
    if (!window.gsap || !intro) return done();

    const q = (s) => intro.querySelector(s);
    if (matchMedia("(pointer: coarse)").matches) q(".intro__hint").textContent = "Tippen zum Überspringen";
    const heroImg = document.querySelector("[data-hero-art] img");

    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: done });
    tl
      // 1. Buchstaben steigen auf
      .fromTo(q(".intro__letters"), { clipPath: "inset(100% 0 0 0)", y: 40 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.1 }, 0.2)
      // 2. Die vier Rauten fallen an ihren Platz
      .from(intro.querySelectorAll(".intro__raute"), { y: -260, opacity: 0, rotation: -90, duration: 0.9, ease: "back.out(1.8)", stagger: 0.09 }, 0.75)
      // 3. QAHWAH schreibt sich aus
      .fromTo(q(".intro__word"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.inOut" }, 1.35)
      .from(q(".intro__hint"), { opacity: 0, duration: 0.6 }, 0.6)
      // 4. Vorhang auf
      .to(q(".intro__stage"), { scale: 0.92, opacity: 0, filter: "blur(6px)", duration: 0.6, ease: "power2.in" }, 2.35)
      .to(q(".intro__half--top"), { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.6)
      .to(q(".intro__half--bottom"), { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, 2.6)
      .to(q(".intro__hint"), { opacity: 0, duration: 0.3 }, 2.35)
      // 5. Der Hero: aus dem Dunkel, langsamer Zoom, Kinobalken fahren weg
      .fromTo(heroImg, { scale: 1.35 }, { scale: 1, duration: 3, ease: "power3.out" }, 2.6)
      .fromTo(".hero", { filter: "brightness(.2)" }, { filter: "brightness(1)", duration: 2.2, ease: "power2.out", clearProps: "filter" }, 2.6)
      .to(box.children, { height: 0, duration: 1.3, ease: "expo.inOut" }, 3.7)
      .from("[data-hero-line]", { opacity: 0, y: 16, duration: 1 }, 4.1)
      .from(".bar", { opacity: 0, y: -10, duration: 0.8 }, 4.2);

    const skip = () => { if (tl.progress() < 1) tl.progress(1); };
    intro.addEventListener("click", skip);
    addEventListener("keydown", skip, { once: true });
    addEventListener("wheel", skip, { once: true, passive: true });
    addEventListener("touchmove", skip, { once: true, passive: true });
  });
})();
