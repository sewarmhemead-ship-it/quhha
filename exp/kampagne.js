/* EXPERIMENT „Kampagne“: Rauten öffnen sich nacheinander, danach leichte Tiefe beim Scrollen. */
(() => {
  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const tiles = gsap.utils.toArray(".rf");
  if (!tiles.length) return;
  gsap.from(tiles, {
    clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
    duration: 1, ease: "expo.out", stagger: { each: 0.12, from: "random" },
    scrollTrigger: { trigger: ".rauten-feld", start: "top 75%" },
  });
  tiles.forEach((el, i) => {
    gsap.fromTo(el.querySelector("img") || el, { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: ".kampagne", start: "top bottom", end: "bottom top", scrub: true },
    });
  });
  gsap.from(".kampagne__text h2", {
    yPercent: 30, opacity: 0, duration: 1.2, ease: "expo.out",
    scrollTrigger: { trigger: ".kampagne", start: "top 70%" },
  });
})();
