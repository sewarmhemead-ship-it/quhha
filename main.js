(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const euro = (cents) => (cents / 100).toLocaleString("de-AT", { style: "currency", currency: "EUR" });

  /* ---------- Geschmacksprofil: Rauten statt Punkte ---------- */
  $$(".dots").forEach((el) => {
    const v = Number(el.dataset.value);
    el.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < v ? "on" : ""}"></i>`).join("");
  });

  /* ---------- Rautenkaskade wie auf der Packung ---------- */
  const rauten = $("[data-rauten]");
  if (rauten) {
    const s = 34, gap = 10, step = s + gap;
    const rows = [3, 4, 5, 6, 5, 6, 5, 4, 3, 2];
    let out = "";
    rows.forEach((n, r) => {
      for (let c = 0; c < n; c++) {
        const x = 300 - c * step - (r % 2 ? step / 2 : 0);
        const y = r * (step * 0.72);
        out += `<rect x="${x}" y="${y}" width="${s}" height="${s}" transform="rotate(45 ${x + s / 2} ${y + s / 2})"/>`;
      }
    });
    rauten.setAttribute("viewBox", "0 -30 360 460");
    rauten.setAttribute("preserveAspectRatio", "xMaxYMid meet");
    rauten.innerHTML = out;
  }

  /* ---------- Packung: Rauten, Punkte, Drehen ---------- */
  const packRauten = $("[data-rauten-pack]");
  if (packRauten) {
    const s = 30, step = 40;
    const rows = [2, 3, 4, 3, 4, 3, 4, 3, 2];
    let out = "";
    rows.forEach((n, r) => {
      for (let c = 0; c < n; c++) {
        const x = 130 - c * step - (r % 2 ? step / 2 : 0), y = r * 29;
        out += `<rect x="${x}" y="${y}" width="${s}" height="${s}" transform="rotate(45 ${x + s / 2} ${y + s / 2})"/>`;
      }
    });
    packRauten.setAttribute("viewBox", "0 -10 160 270");
    packRauten.setAttribute("preserveAspectRatio", "xMaxYMax meet");
    packRauten.innerHTML = out;
  }
  $$("[data-pips]").forEach((el) => {
    const v = Number(el.dataset.pips);
    el.innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="${i < v ? "on" : ""}"></span>`).join("");
  });

  const pouch = $("[data-pouch]"), body = $("[data-pouch-body]");
  if (pouch) {
    let rot = 0, tilt = 0, dragging = false, startX = 0, startRot = 0;
    const draw = (animate) => {
      const t = `rotateX(${tilt}deg) rotateY(${rot}deg)`;
      if (window.gsap && animate && !reduce) gsap.to(body, { transform: t, duration: 1, ease: "power3.out" });
      else body.style.transform = t;
      const back = Math.round(((rot % 360) + 360) % 360 / 180) % 2 === 1;
      $$("[data-side]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.side) === (back ? 1 : 0))));
    };
    const snap = () => { rot = Math.round(rot / 180) * 180; draw(true); };
    const showSide = (wantBack) => {
      const isBack = Math.round(rot / 180) % 2 !== 0;
      if (wantBack !== isBack) rot += 180;
      draw(true);
    };
    $$("[data-side]").forEach((b) => b.addEventListener("click", () => showSide(b.dataset.side === "1")));
    window.qahwahPouch = { showSide };
    pouch.addEventListener("pointerdown", (e) => { dragging = true; startX = e.clientX; startRot = rot; pouch.setPointerCapture(e.pointerId); });
    pouch.addEventListener("pointermove", (e) => {
      if (dragging) { rot = startRot + (e.clientX - startX) * 0.6; tilt = 0; draw(false); return; }
      if (reduce || e.pointerType !== "mouse") return;
      const r = pouch.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      tilt = -dy * 8;
      gsap.to(body, { transform: `rotateX(${tilt}deg) rotateY(${Math.round(rot / 180) * 180 + dx * 18}deg)`, duration: 0.6, ease: "power2.out" });
    });
    const end = () => { if (dragging) { dragging = false; snap(); } };
    pouch.addEventListener("pointerup", end);
    pouch.addEventListener("pointercancel", end);
    pouch.addEventListener("pointerleave", () => { if (!dragging) { tilt = 0; draw(true); } });
    draw(false);
  }

  /* ---------- Geschichte: großes Bild wechselt mit der Station ---------- */
  const stations = $$(".timeline li");
  const stageImgs = $$("[data-stage-i]");
  if (stations.length && stageImgs.length && "IntersectionObserver" in window) {
    const show = (i) => {
      stageImgs.forEach((el, j) => el.classList.toggle("is-active", j === i));
      stations.forEach((el, j) => el.classList.toggle("is-active", j === i));
    };
    // Aktiv ist die Station, die gerade die Bildschirmmitte kreuzt
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) show(stations.indexOf(e.target)); });
    }, { rootMargin: "-50% 0px -50% 0px" });
    stations.forEach((li) => io.observe(li));
    show(0);
  }

  /* ---------- Kopfleiste ---------- */
  const bar = $("[data-bar]");
  const onScroll = () => bar.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.6);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menü ---------- */
  const menu = $("#menu");
  const menuBtn = $("[data-menu-open]");
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) $("a", menu).focus(); else menuBtn.focus();
  };
  menuBtn.addEventListener("click", () => setMenu(true));
  $("[data-menu-close]").addEventListener("click", () => setMenu(false));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => { menu.hidden = true; document.body.style.overflow = ""; menuBtn.setAttribute("aria-expanded", "false"); }));

  /* ---------- Warenkorb (lokal, bis die Kasse angebunden ist) ---------- */
  const KEY = "qahwah-cart";
  const product = { id: "oman-500", name: "Oman, Premium Blend 500 g", img: "assets/img/oman-front.png", price: Number($("[data-price]").dataset.price) };
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };

  const cartEl = $("#cart"), scrim = $("[data-scrim]"), cartBtn = $("[data-cart-open]");
  const render = () => {
    const qty = cart[product.id] || 0;
    $("[data-cart-count]").textContent = qty;
    $("[data-cart-total]").textContent = euro(qty * product.price);
    $("[data-cart-body]").innerHTML = qty
      ? `<div class="cart__item"><img src="${product.img}" alt=""><div><strong>${product.name}</strong><br>${qty} × ${euro(product.price)}</div><button type="button" data-remove>Entfernen</button></div>`
      : `<p class="cart__empty">Dein Warenkorb ist leer. Der Oman Blend wartet weiter oben.</p>`;
    const rm = $("[data-remove]");
    if (rm) rm.addEventListener("click", () => { delete cart[product.id]; save(); render(); });
  };
  const setCart = (open) => {
    cartEl.hidden = scrim.hidden = !open;
    cartBtn.setAttribute("aria-expanded", String(open));
    if (open) $("[data-cart-close]").focus(); else cartBtn.focus();
  };
  cartBtn.addEventListener("click", () => setCart(true));
  $("[data-cart-close]").addEventListener("click", () => setCart(false));
  scrim.addEventListener("click", () => setCart(false));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!cartEl.hidden) setCart(false);
    if (!menu.hidden) setMenu(false);
  });

  const form = $("[data-buy]"), qtyInput = $("input[name=qty]", form), status = $("[data-buy-status]");
  $$("[data-qty]", form).forEach((b) => b.addEventListener("click", () => {
    qtyInput.value = Math.min(20, Math.max(1, Number(qtyInput.value || 1) + Number(b.dataset.qty)));
  }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = Math.min(20, Math.max(1, Number(qtyInput.value) || 1));
    cart[product.id] = (cart[product.id] || 0) + n;
    save(); render();
    status.textContent = `${n} × Oman im Warenkorb.`;
  });
  render();

  /* ---------- Bewegung ---------- */
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Banner: jede Zeile doppelt, damit der Lauf nahtlos ist
  const banners = $$("[data-banner]").map((el) => {
    const track = $("[data-track]", el);
    const set = $(".banner__set", track);
    track.append(set.cloneNode(true), set.cloneNode(true));
    return { el, track, set, dir: Number(el.dataset.banner), x: 0 };
  });

  // Mit der Maus über ein Logo: es dreht sich
  banners.forEach((b) => $$("img", b.track).forEach((img) => img.addEventListener("mouseenter", () => {
    if (!reduce && !gsap.isTweening(img)) gsap.to(img, { rotationY: "+=360", duration: 0.9, ease: "back.out(1.5)" });
  })));

  if (reduce) return;

  // Das eine große Moment: Hero-Auftritt (übernimmt das Intro, falls aktiv)
  if (!document.documentElement.classList.contains("has-intro")) {
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from("[data-hero-art]", { clipPath: "inset(100% 0 0 0)", y: 60, duration: 1.6 })
      .from("[data-hero-art] img", { scale: 1.12, duration: 2.2 }, 0)
      .from("[data-hero-line]", { opacity: 0, y: 16, duration: 1 }, 0.9)
      .from(".bar", { opacity: 0, duration: 0.8 }, 1);
  }

  // Bücher richten sich beim Scrollen auf
  gsap.from('[data-book="a"]', { rotation: -24, x: -120, y: 80, scrollTrigger: { trigger: ".manifest", start: "top 85%", end: "center center", scrub: 1 } });
  gsap.from('[data-book="b"]', { rotation: 12, x: 120, y: -40, scrollTrigger: { trigger: ".manifest", start: "top 85%", end: "center center", scrub: 1 } });

  // Banner laufen gleichmäßig gegeneinander; Scrollen gibt etwas Schwung
  let boost = 0, visible = false;
  ScrollTrigger.create({
    trigger: ".pour", start: "top bottom", end: "bottom top",
    onToggle: (self) => {
      visible = self.isActive;
    },
    onUpdate: (self) => {
      boost = Math.min(4, Math.abs(self.getVelocity()) / 400);
    },
  });
  gsap.ticker.add((time, dt) => {
    if (!visible) return;
    boost *= 0.94;
    const speed = (0.06 * dt) * (1 + boost);
    banners.forEach((b) => {
      const w = b.set.offsetWidth;
      b.x += speed * b.dir;
      b.x = ((b.x % w) + w) % w - w; // zwischen -w und 0 halten
      gsap.set(b.track, { x: b.x });
    });
  });
})();
