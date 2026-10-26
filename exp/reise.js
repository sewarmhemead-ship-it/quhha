/* EXPERIMENT „Reise“: Die Geschichte bleibt stehen, beim Scrollen reist man
   vom Jemen bis nach Salzburg. Ohne diese Datei bleibt die normale Liste. */
(() => {
  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const story = document.querySelector(".story");
  const items = [...story.querySelectorAll(".timeline li")];
  // Ein Farbton pro Station: Glut, Meer, Kaffeehaus, Sepia, Heimat
  const tones = ["#2E170D", "#05303D", "#2F2316", "#272620", "#022E28"];

  const places = items.map((li) => {
    const el = document.createElement("span");
    el.className = "journey__place";
    el.setAttribute("aria-hidden", "true");
    el.textContent = li.querySelector("h3").textContent;
    story.prepend(el);
    return el;
  });
  const dots = document.createElement("ol");
  dots.className = "journey__dots";
  dots.setAttribute("aria-hidden", "true");
  dots.innerHTML = items.map((li) => `<li>${li.querySelector(".timeline__when").textContent}</li>`).join("");
  story.append(dots);
  const dotEls = [...dots.children];

  gsap.matchMedia().add("(min-width: 900px)", () => {
      story.classList.add("is-journey");
      gsap.set(items.slice(1), { autoAlpha: 0 });
      gsap.set(places.slice(1), { autoAlpha: 0 });
      gsap.set(story, { backgroundColor: tones[0] });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: {
          trigger: story, pin: true, start: "top top",
          end: () => "+=" + window.innerHeight * items.length,
          scrub: 0.6,
          onUpdate: (self) => {
            const i = Math.round(self.progress * (items.length - 1));
            dotEls.forEach((d, j) => d.classList.toggle("is-on", j <= i));
          },
        },
      });
      for (let i = 1; i < items.length; i++) {
        tl.to(items[i - 1], { autoAlpha: 0, y: -60 }, i - 1)
          .fromTo(items[i], { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0 }, i - 0.6)
          .to(places[i - 1], { autoAlpha: 0, x: -120 }, i - 1)
          .fromTo(places[i], { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0 }, i - 0.6)
          .to(story, { backgroundColor: tones[i] }, i - 1);
      }
      tl.to(".story__rauten", { y: -120, rotation: 8, duration: items.length - 1, ease: "none" }, 0);

      return () => {
        story.classList.remove("is-journey");
        gsap.set([...items, ...places, story, ".story__rauten"], { clearProps: "all" });
      };
  });
})();
