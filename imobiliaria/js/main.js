/* ============================================================
   CREDMOBILIARIA — Animações GSAP
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Preloader ---------- */
const preloader = document.getElementById("preloader");
const preloaderFill = document.getElementById("preloaderFill");

const loadTl = gsap.timeline();

loadTl
  .to(".preloader__letter", {
    y: 0,
    opacity: 1,
    stagger: 0.055,
    duration: 0.55,
    ease: "back.out(1.8)",
    startAt: { y: 40, opacity: 0 }
  })
  .to(preloaderFill, { width: "100%", duration: 0.9, ease: "power2.inOut" }, "-=0.3")
  .to(".preloader__letter", {
    y: -30,
    opacity: 0,
    stagger: 0.03,
    duration: 0.35,
    ease: "power2.in"
  })
  .to(preloaderFill, { opacity: 0, duration: 0.25 })
  .to(preloader, {
    yPercent: -100,
    duration: 0.8,
    ease: "power4.inOut",
    onComplete: () => {
      preloader.style.display = "none";
      heroTl.play();
    }
  });

/* ---------- Hero ---------- */
const heroTl = gsap.timeline({ paused: true });

heroTl
  .from("#heroBg img", { scale: 1.25, duration: 1.6, ease: "power2.out" }, 0)
  .from(".hero__overlay", { opacity: 0, duration: 1.2, ease: "power1.out" }, 0)
  .from(".navbar__inner > *", { y: -24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 }, 0.15)
  .from("[data-hero]", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 }, 0.3)
  .from("[data-hero-line]", { yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.14 }, 0.45)
  .from(
    ".hero__stats .hero-stat",
    { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 },
    0.85
  );

/* Parallax do fundo do hero */
gsap.to("#heroBg img", {
  yPercent: 18,
  scale: 1.12,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

/* ---------- Contadores ---------- */
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = +el.dataset.count;
  const obj = { val: 0 };

  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () =>
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toLocaleString("pt-BR");
        }
      })
  });
});

/* ---------- Títulos: revelam palavra por palavra ---------- */
function wrapWords(el) {
  [...el.childNodes].forEach((node) => {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(" "));
          return;
        }
        const outer = document.createElement("span");
        outer.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;";
        const inner = document.createElement("span");
        inner.style.display = "inline-block";
        inner.textContent = part;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      el.replaceChild(frag, node);
    } else if (node.nodeType === 1 && node.tagName !== "BR") {
      wrapWords(node);
    }
  });
}

document.querySelectorAll(".section__title").forEach((title) => {
  title.removeAttribute("data-reveal");
  wrapWords(title);

  gsap.from(title.querySelectorAll("span > span"), {
    yPercent: 115,
    duration: 0.85,
    ease: "power4.out",
    stagger: 0.055,
    scrollTrigger: {
      trigger: title,
      start: "top 88%",
      once: true
    }
  });
});

/* ---------- Reveals gerais ---------- */

/* Elementos que ganham animação própria (não usar reveal genérico) */
[".servicos__grid", ".imoveis__grid", ".depoimentos__grid"].forEach((sel) => {
  document.querySelectorAll(`${sel} [data-reveal]`).forEach((el) => el.removeAttribute("data-reveal"));
});
document.querySelector(".sobre__visual")?.removeAttribute("data-reveal");
document.querySelector(".contato__form")?.removeAttribute("data-reveal");

/* Formulário de contato: entrada 3D + campos em sequência */
gsap.from(".contato__form", {
  y: 60,
  opacity: 0,
  rotationY: -8,
  transformPerspective: 900,
  transformOrigin: "center left",
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".contato__form", start: "top 85%", once: true }
});

gsap.from(".contato__form .form-field, .contato__form .btn, .contato__form .form-note", {
  y: 18,
  opacity: 0,
  duration: 0.55,
  stagger: 0.07,
  delay: 0.35,
  ease: "power2.out",
  scrollTrigger: { trigger: ".contato__form", start: "top 85%", once: true }
});

gsap.utils.toArray("[data-reveal]").forEach((el, i) => {
  gsap.from(el, {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 88%",
      once: true
    }
  });
});

/* Stagger nos grids (cards entram em sequência, com leve rotação 3D) */
[".servicos__grid", ".imoveis__grid", ".depoimentos__grid"].forEach((sel) => {
  const grid = document.querySelector(sel);
  if (!grid) return;

  gsap.from(grid.children, {
    y: 60,
    opacity: 0,
    rotationX: -6,
    transformPerspective: 900,
    transformOrigin: "top center",
    duration: 0.85,
    ease: "power3.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger: grid,
      start: "top 82%",
      once: true
    }
  });
});

/* ---------- Sobre: imagens revelam com clip-path ---------- */
gsap.from(".sobre__img--main", {
  clipPath: "inset(100% 0% 0% 0%)",
  duration: 1.1,
  ease: "power4.out",
  scrollTrigger: { trigger: ".sobre", start: "top 70%", once: true }
});

gsap.from(".sobre__img--float", {
  clipPath: "inset(0% 100% 0% 0%)",
  duration: 1.1,
  delay: 0.25,
  ease: "power4.out",
  scrollTrigger: { trigger: ".sobre", start: "top 70%", once: true }
});

gsap.from(".sobre__exp", {
  scale: 0,
  rotation: -10,
  duration: 0.7,
  delay: 0.5,
  ease: "back.out(2)",
  scrollTrigger: { trigger: ".sobre", start: "top 70%", once: true }
});

/* Badge "10+ anos" flutua suavemente */
gsap.to(".sobre__exp", {
  y: -8,
  duration: 1.7,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  delay: 1.4
});

/* ---------- Imóveis: chips entram depois do card ---------- */
document.querySelectorAll(".imovel-card").forEach((card) => {
  gsap.from(card.querySelectorAll(".imovel-card__features span"), {
    y: 14,
    opacity: 0,
    duration: 0.5,
    stagger: 0.07,
    delay: 0.35,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      once: true
    }
  });
});

/* ---------- Depoimentos: estrelas estouram ---------- */
document.querySelectorAll(".depo-card").forEach((card) => {
  gsap.from(card.querySelectorAll(".depo-card__stars svg"), {
    scale: 0,
    opacity: 0,
    duration: 0.45,
    stagger: 0.06,
    delay: 0.3,
    ease: "back.out(2.5)",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      once: true
    }
  });
});

/* ---------- Parallax das imagens flutuantes ---------- */
gsap.utils.toArray("[data-parallax]").forEach((el) => {
  const speed = +el.dataset.parallaxSpeed || 30;

  gsap.to(el, {
    y: speed,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2
    }
  });
});

/* ---------- Marquee infinito (acelera com a rolagem) ---------- */
const marqueeTrack = document.getElementById("marqueeTrack");
if (marqueeTrack) {
  const marqueeTween = gsap.to(marqueeTrack, {
    xPercent: -50,
    ease: "none",
    duration: 22,
    repeat: -1
  });

  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 1500);
      gsap.to(marqueeTween, { timeScale: v, duration: 0.25, overwrite: "auto" });
      gsap.to(marqueeTween, { timeScale: 1, duration: 1.4, delay: 0.3, overwrite: false });
    }
  });
}

/* ---------- Tilt 3D + brilho que segue o mouse nos cards de serviço ---------- */
document.querySelectorAll(".serv-card").forEach((card) => {
  gsap.set(card, { transformPerspective: 900 });

  const tiltX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
  const tiltY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    tiltX(-py * 10);
    tiltY(px * 12);

    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });

  card.addEventListener("mouseleave", () => {
    tiltX(0);
    tiltY(0);
  });
});

/* ---------- Navbar ---------- */
const navbar = document.getElementById("navbar");
const navBurger = document.getElementById("navBurger");
const navMenu = document.getElementById("navMenu");

ScrollTrigger.create({
  start: "top -60",
  onUpdate: (self) => navbar.classList.toggle("is-scrolled", self.scroll() > 60)
});

navBurger.addEventListener("click", () => {
  navBurger.classList.toggle("is-active");
  navMenu.classList.toggle("is-open");
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navBurger.classList.remove("is-active");
    navMenu.classList.remove("is-open");
  });
});

/* Link ativo conforme a seção visível */
const sections = document.querySelectorAll("section[id]");

sections.forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: "top 55%",
    end: "bottom 55%",
    onToggle: (self) => {
      if (!self.isActive) return;
      document
        .querySelectorAll(".navbar__link")
        .forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${sec.id}`));
    }
  });
});

/* ---------- WhatsApp flutua suavemente ---------- */
gsap.to("#whatsFloat", {
  y: -10,
  duration: 1.4,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});

/* ---------- Navbar esconde ao rolar para baixo, volta ao subir ---------- */
ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: (self) => {
    const y = self.direction === 1 && self.scroll() > 500 ? -110 : 0;
    gsap.to(navbar, { yPercent: y, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  }
});

/* ---------- Barra de progresso de scroll ---------- */
gsap.to("#progress", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    start: 0,
    end: "max",
    scrub: 0.3
  }
});

/* ---------- Botões magnéticos ---------- */
document.querySelectorAll(".btn--gold").forEach((btn) => {
  const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
  const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });

  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    xTo((e.clientX - r.left - r.width / 2) * 0.35);
    yTo((e.clientY - r.top - r.height / 2) * 0.35);
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
  });
});

/* ---------- Detalhes finais ---------- */

/* Indicador de scroll do hero some ao rolar */
gsap.to(".hero__scroll", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "25% top",
    scrub: true
  }
});

/* Colunas do footer entram em sequência */
gsap.from(".footer__grid > div", {
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.12,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".footer",
    start: "top 88%",
    once: true
  }
});

/* ---------- Formulário ---------- */
const form = document.getElementById("formContato");
const formSuccess = document.getElementById("formSuccess");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.style.display = "flex";
    gsap.from(formSuccess, { y: 10, opacity: 0, duration: 0.5, ease: "power2.out" });
    form.reset();

    gsap.delayedCall(5, () => gsap.to(formSuccess, { opacity: 0, duration: 0.4, onComplete: () => (formSuccess.style.display = "none") }));
  });
}

/* ---------- Ano no footer ---------- */
document.getElementById("ano").textContent = new Date().getFullYear();
