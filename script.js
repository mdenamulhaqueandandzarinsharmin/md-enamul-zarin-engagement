document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================== COVER + MUSIC ===================== */
  const cover = document.getElementById("cover");
  const openBtn = document.getElementById("openBtn");
  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");

  function setToggle() {
    const playing = music && !music.paused;
    toggle.classList.toggle("playing", playing);
    toggle.classList.toggle("muted", !playing);
  }

  function playMusic() {
    if (!music) return;
    music.volume = 0.4;
    music.play().then(setToggle).catch(setToggle);
  }

  openBtn.addEventListener("click", () => {
    cover.classList.add("open");
    document.body.classList.remove("locked");
    playMusic();
    setTimeout(() => (cover.style.display = "none"), 1500);
    revealOnScroll();
  });

  toggle.addEventListener("click", () => {
    if (music.paused) { playMusic(); } else { music.pause(); setToggle(); }
  });
  setToggle();

  /* ===================== SCROLL REVEAL ===================== */
  const reveals = document.querySelectorAll(".reveal");
  function revealOnScroll() {
    const h = window.innerHeight;
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < h - 80) el.classList.add("visible");
    });
  }
  window.addEventListener("scroll", revealOnScroll, { passive: true });
  window.addEventListener("resize", revealOnScroll);
  revealOnScroll();

  /* ===================== ACTIVE NAV ===================== */
  const sections = document.querySelectorAll("main section");
  const navLinks = document.querySelectorAll(".nav-link");
  function updateNav() {
    let current = sections[0].id;
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 220) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* ===================== COUNTDOWN ===================== */
  // 27 Dec 2026, 12:00 PM India time (UTC+5:30)
  const target = new Date("2026-12-27T12:00:00+05:30").getTime();
  const els = { d: cdD, h: cdH, m: cdM, s: cdS };
  const pad = n => String(n).padStart(2, "0");

  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5); diff %= 36e5;
    const m = Math.floor(diff / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);
    els.d.textContent = pad(d);
    els.h.textContent = pad(h);
    els.m.textContent = pad(m);
    els.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ===================== BUTTERFLIES (per card) ===================== */
  if (!reduceMotion) {
    const img = new Image();
    img.src = "img/butterfly.webp";

    const stages = [...document.querySelectorAll(".butterfly-canvas")].map(canvas => {
      const parent = canvas.parentElement;
      const stage = { canvas, parent, ctx: canvas.getContext("2d"), w: 0, h: 0, list: [] };
      const resize = () => {
        stage.w = canvas.width = parent.clientWidth;
        stage.h = canvas.height = parent.clientHeight;
      };
      resize();
      window.addEventListener("resize", resize);
      const make = () => ({
        x: Math.random() * stage.w, y: Math.random() * stage.h,
        tx: Math.random() * stage.w, ty: Math.random() * stage.h,
        speed: 0.35 + Math.random() * 0.35, flap: Math.random() * 6.28
      });
      stage.list = [make(), make()];
      stage.make = make;
      return stage;
    });

    function frame() {
      stages.forEach(s => {
        s.ctx.clearRect(0, 0, s.w, s.h);
        s.list.forEach(b => {
          const dx = b.tx - b.x, dy = b.ty - b.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 20) {
            b.tx = 30 + Math.random() * (s.w - 60);
            b.ty = 30 + Math.random() * (s.h - 60);
          }
          b.x += (dx / dist) * b.speed;
          b.y += (dy / dist) * b.speed + Math.sin(b.flap) * 0.3;
          b.flap += 0.12;
          const size = 40, sx = 0.35 + Math.abs(Math.sin(b.flap)) * 0.65;
          const ang = Math.atan2(dy, dx) + Math.PI / 2;
          s.ctx.save();
          s.ctx.translate(b.x, b.y);
          s.ctx.rotate(ang * 0.25);
          s.ctx.shadowColor = "rgba(255, 215, 150, .9)";
          s.ctx.shadowBlur = 14;
          s.ctx.scale(sx, 1);
          s.ctx.drawImage(img, -size / 2, -size / 2, size, size * (img.height / img.width));
          s.ctx.restore();
        });
      });
      requestAnimationFrame(frame);
    }
    img.onload = frame;
  }

  /* ===================== PETALS + SPARKLES ===================== */
  if (!reduceMotion) {
    const fx = document.getElementById("fx");

    function petal() {
      if (document.hidden) return;
      const p = document.createElement("div");
      const size = 22 + Math.random() * 26;
      p.className = "petal";
      p.style.left = Math.random() * 100 + "vw";
      p.style.width = p.style.height = size + "px";
      p.style.setProperty("--drift", Math.random() * 160 - 80 + "px");
      p.style.animationDuration = 9 + Math.random() * 6 + "s";
      fx.appendChild(p);
      setTimeout(() => p.remove(), 15500);
    }
    setInterval(petal, 1100);

    function sparkle() {
      if (document.hidden) return;
      const s = document.createElement("div");
      s.className = "sparkle";
      s.style.left = Math.random() * 100 + "vw";
      s.style.top = Math.random() * 100 + "vh";
      const size = 3 + Math.random() * 5;
      s.style.width = s.style.height = size + "px";
      fx.appendChild(s);
      setTimeout(() => s.remove(), 2300);
    }
    setInterval(sparkle, 450);
  }
});