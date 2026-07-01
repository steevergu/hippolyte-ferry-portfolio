/* ── HAMBURGER MENU ── */
const navToggle  = document.querySelector(".nav-toggle");
const siteNav    = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");



if (navToggle && siteNav) {
  const navOverlay = document.getElementById("nav-overlay");

  const openMenu = () => {
    siteNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Fermer le menu");
    document.body.classList.add("nav-open");
    if (navOverlay) navOverlay.classList.add("is-active");
  };

  const closeMenu = () => {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
    document.body.classList.remove("nav-open");
    if (navOverlay) navOverlay.classList.remove("is-active");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  /* Fermeture via Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* Fermeture au clic sur un lien du menu */
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  /* Fermeture au clic sur l'overlay */
  if (navOverlay) navOverlay.addEventListener("click", closeMenu);

  document.addEventListener("click", (e) => {
    if (siteNav.classList.contains("is-open") &&
        !siteNav.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* Fermeture au resize > 820px */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  }, { passive: true });
}

/* ── INTRO SCREEN ── */
const siteIntro = document.getElementById("site-intro");
if (siteIntro) {
  setTimeout(() => {
    siteIntro.classList.add("is-leaving");
    siteIntro.addEventListener("transitionend", () => siteIntro.remove(), { once: true });
  }, 900);
}

const header = document.querySelector(".site-header");
const year = document.getElementById("year");
const scrollTopBtn = document.querySelector(".scroll-top");
const scrollProgress = document.querySelector(".scroll-progress");
const revealItems = document.querySelectorAll(".reveal");
const cards = document.querySelectorAll(".project-card");
const filterButtons = document.querySelectorAll(".filter-chip");

if (year) {
  year.textContent = `© ${new Date().getFullYear()}`;
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setScrollTopState = () => {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle("is-visible", window.scrollY > 400);
};

const setScrollProgress = () => {
  if (!scrollProgress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
};

setHeaderState();
setScrollTopState();
setScrollProgress();
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("scroll", setScrollTopState, { passive: true });
window.addEventListener("scroll", setScrollProgress, { passive: true });

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  });
});

const setActiveFilter = (filter) => {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  cards.forEach((card) => {
    const matches = filter === "all" || card.dataset.category === filter;
    card.hidden = !matches;
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter || "all");
  });
});

if (filterButtons.length) {
  setActiveFilter("all");
}

/* ── ABOUT FOLDER (cascade + tilt 3D interactif) ── */
const aboutFolder = document.querySelector(".about-folder");

if (aboutFolder) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const aboutAnims = aboutFolder.querySelectorAll(".about-anim");
  const aboutKeywords = aboutFolder.querySelectorAll(".about-kw");
  const aboutBody = aboutFolder.querySelector(".about-folder__body");
  const aboutTextEl = aboutFolder.querySelector(".about-text");

  if (!reduceMotion) {
    aboutFolder.classList.add("is-armed");
    aboutAnims.forEach((el, i) => {
      el.style.transitionDelay = `${i * 130}ms`;
    });
  }

  aboutKeywords.forEach((el, i) => {
    el.style.transitionDelay = `${420 + i * 120}ms`;
  });

  /* découpe le texte en mots pour le surlignage au scroll */
  let aboutWords = [];
  if (aboutTextEl) {
    const textNodes = [];
    const walker = document.createTreeWalker(aboutTextEl, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      if (!node.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "about-word";
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });

    aboutWords = Array.from(aboutTextEl.querySelectorAll(".about-word"));
  }

  if (reduceMotion) {
    if (aboutTextEl) {
      aboutTextEl.style.setProperty("--about-sheen-opacity", "0");
      aboutTextEl.style.setProperty("--about-sheen-x", "0%");
    }
    aboutWords.forEach((w) => {
      w.classList.add("is-lit");
      w.style.setProperty("--word-progress", "1");
      w.style.setProperty("--word-opacity", "1");
      w.style.setProperty("--word-shift", "0em");
      w.style.setProperty("--word-glow", "12px");
    });
  } else if (aboutWords.length) {
    let lastProgress = -1;
    let ticking = false;

    const applyHighlight = () => {
      ticking = false;
      const rect = aboutBody.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const start = vh * 0.85;
      const end = vh * 0.32;
      let p = (start - rect.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
      if (Math.abs(p - lastProgress) < 0.002) return;

      aboutTextEl.style.setProperty(
        "--about-sheen-opacity",
        Math.min(0.5, p * 0.55).toFixed(3)
      );
      aboutTextEl.style.setProperty(
        "--about-sheen-x",
        `${(-60 + p * 120).toFixed(2)}%`
      );

      const revealWindow = 0.2;
      const stagger = 1 - revealWindow;

      aboutWords.forEach((word, i) => {
        const anchor = aboutWords.length > 1 ? i / (aboutWords.length - 1) : 0;
        const wordProgress = Math.max(
          0,
          Math.min(1, (p - anchor * stagger) / revealWindow)
        );

        word.style.setProperty("--word-progress", wordProgress.toFixed(3));
        word.style.setProperty(
          "--word-opacity",
          (0.18 + wordProgress * 0.82).toFixed(3)
        );
        word.style.setProperty(
          "--word-shift",
          `${((1 - wordProgress) * 0.32).toFixed(3)}em`
        );
        word.style.setProperty("--word-glow", `${(wordProgress * 18).toFixed(2)}px`);
        word.classList.toggle("is-lit", wordProgress > 0.96);
      });

      /* flash teal sur les mots-clés quand ils arrivent au seuil de lisibilité */
      aboutKeywords.forEach((kw) => {
        if (kw.dataset.decoded) return;
        const kwWords = kw.querySelectorAll(".about-word");
        if (!kwWords.length) return;
        const avg = Array.from(kwWords).reduce(
          (s, w) => s + parseFloat(w.style.getPropertyValue("--word-progress") || "0"), 0
        ) / kwWords.length;
        if (avg > 0.72) {
          kw.dataset.decoded = "1";
          kw.classList.add("is-decoding");
          setTimeout(() => kw.classList.remove("is-decoding"), 750);
        }
      });

      lastProgress = p;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyHighlight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    applyHighlight();
  }

  /* ── TITLE TEXT SCRAMBLE ── */
  function scrambleTitle(el, dur) {
    if (!el || reduceMotion) return;
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$!%#&?";
    const original = el.textContent;
    const t0 = performance.now();
    el.classList.add("is-scrambling");

    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); /* ease-out cubic */

      let out = "";
      for (let i = 0; i < original.length; i++) {
        const c = original[i];
        if (c === " " || c === "." || c === ",") { out += c; continue; }
        out += e > (i / original.length) * 0.85
          ? c
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }

      el.textContent = out;

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = original;
        el.classList.remove("is-scrambling");
      }
    };

    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutFolder.classList.add("is-revealed");
            const titleEl = aboutFolder.querySelector(".about-folder__title");
            setTimeout(() => scrambleTitle(titleEl, 1050), 80);
            aboutObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    aboutObserver.observe(aboutFolder);
  } else {
    aboutFolder.classList.add("is-revealed");
  }

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const MAX_TILT = 3;

    aboutFolder.addEventListener("pointermove", (event) => {
      const b = aboutBody.getBoundingClientRect();
      const px = (event.clientX - b.left) / b.width;
      const py = (event.clientY - b.top) / b.height;
      aboutFolder.style.setProperty("--about-ry", `${((px - 0.5) * MAX_TILT * 2).toFixed(2)}deg`);
      aboutFolder.style.setProperty("--about-rx", `${((0.5 - py) * MAX_TILT * 2).toFixed(2)}deg`);
      aboutBody.style.setProperty("--about-mx", `${(px * 100).toFixed(1)}%`);
      aboutBody.style.setProperty("--about-my", `${(py * 100).toFixed(1)}%`);
    });

    aboutFolder.addEventListener("pointerenter", () => {
      aboutFolder.classList.add("is-hovered");
    });

    aboutFolder.addEventListener("pointerleave", () => {
      aboutFolder.classList.remove("is-hovered");
      aboutFolder.style.setProperty("--about-rx", "0deg");
      aboutFolder.style.setProperty("--about-ry", "0deg");
    });
  }
}

/* ── HOVER REVEAL (image qui suit le curseur) ── */
const hoverList = document.getElementById("hoverList");
const hoverCursor = document.getElementById("hoverCursor");

if (hoverList && hoverCursor && window.matchMedia("(pointer: fine)").matches) {
  const cursorInner = hoverCursor.querySelector(".hr-cursor-inner");
  const items = hoverList.querySelectorAll(".hover-reveal__item");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let active = false;
  let rafId = null;

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  const loop = () => {
    currentX = lerp(currentX, targetX, 0.15);
    currentY = lerp(currentY, targetY, 0.15);
    hoverCursor.style.left = `${currentX}px`;
    hoverCursor.style.top = `${currentY}px`;
    rafId = requestAnimationFrame(loop);
  };

  const preload = new Set();
  items.forEach((item) => {
    const src = item.dataset.img;
    if (src && !preload.has(src)) {
      const img = new Image();
      img.src = src;
      preload.add(src);
    }
  });

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const src = item.dataset.img;
      if (src) cursorInner.style.backgroundImage = `url("${src}")`;
      hoverCursor.classList.add("is-active");
      active = true;
      if (!rafId) loop();
    });

    item.addEventListener("mouseleave", () => {
      hoverCursor.classList.remove("is-active");
      active = false;
    });
  });

  hoverList.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!active) {
      currentX = targetX;
      currentY = targetY;
    }
  });
}
