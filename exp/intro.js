/* EXPERIMENT „Intro“ – wird im <head> geladen, damit kein Hero-Blitz entsteht.
   1. Bei jedem Öffnen: Logo baut sich auf, Vorhang, Hero wie ein Filmanfang.
   2. Bei jedem Sprung zu einem Abschnitt (Menü, Logo): das Logo als Ladebildschirm.
   Klick, Taste oder Scrollen überspringt das Intro. */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.documentElement;
  root.classList.add("has-intro");

  document.addEventListener("DOMContentLoaded", () => {
    const intro = document.querySelector("[data-intro]");
    const box = document.querySelector("[data-letterbox]");
    if (!window.gsap || !intro) { root.classList.remove("has-intro"); return; }

    const q = (s) => intro.querySelector(s);
    const halves = [q(".intro__half--top"), q(".intro__half--bottom")];
    const rauten = intro.querySelectorAll(".intro__raute");
    const hint = q(".intro__hint");
    if (matchMedia("(pointer: coarse)").matches) hint.textContent = "Tippen zum Überspringen";

    // Logo aufbauen – gemeinsam für Intro und Ladebildschirm
    const buildLogo = (tl, at, speed = 1) => tl
      .fromTo(q(".intro__letters"), { clipPath: "inset(100% 0 0 0)", y: 40 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.1 * speed, ease: "expo.out" }, at)
      .fromTo(rauten, { y: -260, opacity: 0, rotation: -90 }, { y: 0, opacity: 1, rotation: 0, duration: 0.9 * speed, ease: "back.out(1.8)", stagger: 0.09 * speed }, at + 0.55 * speed)
      .fromTo(q(".intro__word"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.8 * speed, ease: "power3.inOut" }, at + 1.15 * speed);
    const openCurtain = (tl, at) => tl
      .to(q(".intro__stage"), { scale: 0.92, opacity: 0, filter: "blur(6px)", duration: 0.5, ease: "power2.in" }, at)
      .to(halves[0], { yPercent: -100, duration: 1, ease: "expo.inOut" }, at + 0.2)
      .to(halves[1], { yPercent: 100, duration: 1, ease: "expo.inOut" }, at + 0.2);
    const hide = () => {
      intro.classList.remove("is-on");
      root.classList.remove("has-intro", "is-loading");
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };

    /* ---------- 1. Intro beim Öffnen ---------- */
    const heroImg = document.querySelector("[data-hero-art] img");
    const intro1 = gsap.timeline({ onComplete: () => { box?.remove(); hide(); } });
    buildLogo(intro1, 0.2);
    intro1.from(hint, { opacity: 0, duration: 0.6 }, 0.6).to(hint, { opacity: 0, duration: 0.3 }, 2.35);
    openCurtain(intro1, 2.35);
    intro1
      .fromTo(heroImg, { scale: 1.35 }, { scale: 1, duration: 3, ease: "power3.out" }, 2.6)
      .fromTo(".hero", { filter: "brightness(.2)" }, { filter: "brightness(1)", duration: 2.2, ease: "power2.out", clearProps: "filter" }, 2.6)
      .to(box.children, { height: 0, duration: 1.3, ease: "expo.inOut" }, 3.7)
      .from("[data-hero-line]", { opacity: 0, y: 16, duration: 1 }, 4.1)
      .from(".bar", { opacity: 0, y: -10, duration: 0.8 }, 4.2);

    const skipIntro = () => { if (intro1.progress() < 1) intro1.progress(1); };
    intro.addEventListener("click", skipIntro);
    addEventListener("keydown", skipIntro, { once: true });
    addEventListener("wheel", skipIntro, { once: true, passive: true });
    addEventListener("touchmove", skipIntro, { once: true, passive: true });

    /* ---------- 2. Ladebildschirm bei Abschnittswechsel ---------- */
    let busy = false;
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains("skip") || busy || intro1.progress() < 1) return;
      const id = a.getAttribute("href").slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      busy = true;

      // Menü schließen, falls offen
      const menu = document.getElementById("menu");
      if (menu && !menu.hidden) { menu.hidden = true; document.body.style.overflow = ""; }

      intro.classList.add("is-on");
      root.classList.add("is-loading");
      gsap.set(q(".intro__stage"), { scale: 1, opacity: 1, filter: "none" });
      gsap.set(hint, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => { hide(); busy = false; } });
      tl.fromTo(halves[0], { yPercent: -100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" }, 0)
        .fromTo(halves[1], { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" }, 0);
      buildLogo(tl, 0.45, 0.6);
      tl.add(() => {
        const top = id === "top" ? 0 : target.getBoundingClientRect().top + scrollY;
        scrollTo({ top, behavior: "instant" });
        history.pushState(null, "", "#" + id);
        if (window.ScrollTrigger) ScrollTrigger.update();
      }, 1.55);
      openCurtain(tl, 1.65);
      intro.addEventListener("click", () => tl.timeScale(3), { once: true });
    });
  });
})();
