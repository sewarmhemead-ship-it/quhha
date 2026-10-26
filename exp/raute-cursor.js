/* EXPERIMENT „Rauten-Cursor“ */
(() => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const el = document.createElement("div");
  el.className = "raute-cursor is-hidden";
  el.setAttribute("aria-hidden", "true");
  document.body.append(el);
  document.documentElement.classList.add("has-raute");

  const fast = matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap;
  const setX = fast ? (v) => (el.style.left = v + "px") : gsap.quickTo(el, "left", { duration: 0.25, ease: "power3" });
  const setY = fast ? (v) => (el.style.top = v + "px") : gsap.quickTo(el, "top", { duration: 0.25, ease: "power3" });

  addEventListener("pointermove", (e) => {
    setX(e.clientX); setY(e.clientY);
    el.classList.remove("is-hidden");
    el.classList.toggle("is-big", !!e.target.closest("a, button, [data-pouch], .banner img"));
  });
  document.addEventListener("pointerleave", () => el.classList.add("is-hidden"));
})();
