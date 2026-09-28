/*
 * Shared chrome and motion for every Light Academy page:
 * header, footer, course search, scroll progress, reveal-on-scroll,
 * magnetic buttons and the guided tour engine.
 */
(function () {
  const A = window.ACADEMY;
  const U = window.ACADEMY_UTIL;
  const base = U.base();
  const isHome = document.body.dataset.page === "home";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.ACADEMY_UTIL.reduceMotion = reduceMotion;

  /* ---------- Header ---------- */
  function homeLink(hash) {
    return isHome ? hash : base + "index.html" + hash;
  }

  function renderHeader() {
    const el = document.getElementById("site-header");
    if (!el) return;
    const links = [
      ["Home", "#home"],
      ["Roles", "#roles"],
      ["Certifications", "#certifications"],
      ["For partners", "#partners"]
    ];
    el.innerHTML =
      '<div class="container header-inner">' +
      '<a class="brand" href="' + homeLink("#home") + '" aria-label="Light Academy home">' + U.logoMark() +
      '<span class="brand-text">Light <span>Academy</span></span></a>' +
      '<button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>' +
      '<nav class="nav" aria-label="Primary">' +
      '<span class="nav-indicator" aria-hidden="true"></span>' +
      links.map(([label, hash]) => '<a class="nav-link" data-section="' + hash.slice(1) + '" href="' + homeLink(hash) + '">' + label + "</a>").join("") +
      "</nav>" +
      '<button class="search-trigger" type="button" data-tour="search">' + U.icon("search") + '<span>Search courses</span><kbd>/</kbd></button>' +
      '<div class="avatar-wrap">' +
      '<button class="avatar" type="button" aria-haspopup="true" aria-expanded="false">' + A.learner.initials + "</button>" +
      '<div class="avatar-menu glass" role="menu"></div>' +
      "</div>" +
      "</div>";

    const header = el;
    const toggle = el.querySelector(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    el.querySelectorAll(".nav-link").forEach((a) =>
      a.addEventListener("click", () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );

    // Avatar menu: quick resume.
    const feat = U.featuredPath();
    const role = feat.role;
    const menu = el.querySelector(".avatar-menu");
    menu.innerHTML =
      '<p class="avatar-name">' + U.escape(A.learner.name) + "</p>" +
      '<p class="avatar-meta">' + U.escape(role.name) + " path · " + feat.pct + "%</p>" +
      '<div class="avatar-bar"><span style="width:' + feat.pct + '%"></span></div>' +
      (feat.nextIndex >= 0
        ? '<a role="menuitem" href="' + U.lessonUrl(role.slug, feat.nextIndex) + '">' + (feat.started ? "Resume: " : "Start: ") + U.escape(role.courses[feat.nextIndex].title) + "</a>"
        : "") +
      '<a role="menuitem" href="' + homeLink("#certifications") + '">My certifications</a>';
    const avatar = el.querySelector(".avatar");
    avatar.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = el.querySelector(".avatar-wrap").classList.toggle("open");
      avatar.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", () => {
      el.querySelector(".avatar-wrap").classList.remove("open");
      avatar.setAttribute("aria-expanded", "false");
    });

    el.querySelector(".search-trigger").addEventListener("click", openSearch);

    // Condense header after scrolling.
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (isHome) setupScrollSpy(el);
  }

  function moveIndicator(nav, link) {
    const ind = nav.querySelector(".nav-indicator");
    if (!link) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = link.offsetWidth + "px";
    ind.style.transform = "translateX(" + link.offsetLeft + "px)";
  }

  function setupScrollSpy(header) {
    const nav = header.querySelector(".nav");
    const links = Array.from(nav.querySelectorAll(".nav-link"));
    const sections = links.map((l) => document.getElementById(l.dataset.section)).filter(Boolean);
    let current = null;
    function update() {
      const probe = window.innerHeight * 0.35;
      let active = sections[0];
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top <= probe) active = s;
      });
      if (active === current) return;
      current = active;
      links.forEach((l) => l.classList.toggle("active", l.dataset.section === active.id));
      moveIndicator(nav, links.find((l) => l.dataset.section === active.id));
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => {
      current = null;
      update();
    });
    // Fonts shift link widths, so measure again once they load.
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      current = null;
      update();
    });
    update();
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML =
      '<div class="container footer-inner">' +
      '<p><span class="footer-brand">Light</span> <span class="accent-text">Academy</span>, the customer learning academy for Light.</p>' +
      '<p class="muted">Concept mockup · not a live product.</p>' +
      "</div>";
  }

  /* ---------- Icons ---------- */
  function fillIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((n) => {
      if (!n.firstChild) n.innerHTML = U.icon(n.dataset.icon);
    });
    (root || document).querySelectorAll(".mini-mark:empty, .progress-card-mark:empty, .start-banner-bigmark:empty").forEach((n) => {
      n.innerHTML = U.logoMark();
    });
  }
  window.ACADEMY_UTIL.fillIcons = fillIcons;

  /* ---------- Reveal on scroll ---------- */
  let revealObserver;
  function observeReveals(root) {
    const items = (root || document).querySelectorAll(".reveal:not(.is-visible)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              revealObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    items.forEach((i) => revealObserver.observe(i));
  }
  window.ACADEMY_UTIL.observeReveals = observeReveals;

  /* ---------- Scroll progress ---------- */
  function setupScrollProgress() {
    const bar = document.querySelector(".scroll-progress span");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- Magnetic buttons and cursor glows ---------- */
  function setupPointerEffects() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
    document.addEventListener("pointermove", (e) => {
      const glow = e.target.closest && e.target.closest(".glow-track");
      if (glow) {
        const r = glow.getBoundingClientRect();
        glow.style.setProperty("--mx", e.clientX - r.left + "px");
        glow.style.setProperty("--my", e.clientY - r.top + "px");
      }
    });
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

  /* ---------- Course search (Cmd/Ctrl+K or /) ---------- */
  let searchEl;
  function allCourses() {
    const list = [];
    const gs = A.getStarted;
    gs.courses.forEach((c, i) => list.push({ course: c, role: { slug: gs.slug, name: "Get started" }, index: i }));
    A.roles.forEach((r) => r.courses.forEach((c, i) => list.push({ course: c, role: r, index: i })));
    return list;
  }

  function buildSearch() {
    searchEl = document.createElement("div");
    searchEl.className = "search-overlay";
    searchEl.innerHTML =
      '<div class="search-dialog glass" role="dialog" aria-modal="true" aria-label="Search courses">' +
      '<div class="search-input-row">' + U.icon("search") +
      '<input type="search" placeholder="Search courses, e.g. reconciliation" aria-label="Search courses" autocomplete="off" />' +
      "<kbd>esc</kbd></div>" +
      '<ul class="search-results" role="listbox"></ul>' +
      '<p class="search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>enter</kbd> to open</span></p>' +
      "</div>";
    document.body.appendChild(searchEl);
    const input = searchEl.querySelector("input");
    const list = searchEl.querySelector(".search-results");
    const data = allCourses();
    let active = 0;
    let shown = [];

    function render() {
      const q = input.value.trim().toLowerCase();
      shown = data.filter((d) => !q || d.course.title.toLowerCase().includes(q) || d.role.name.toLowerCase().includes(q)).slice(0, 8);
      active = Math.min(active, Math.max(shown.length - 1, 0));
      if (!shown.length) {
        list.innerHTML = '<li class="search-empty">No courses match "' + U.escape(input.value) + '"</li>';
        return;
      }
      list.innerHTML = shown
        .map(
          (d, i) =>
            '<li role="option" aria-selected="' + (i === active) + '"><a href="' + U.lessonUrl(d.role.slug, d.index) + '" style="--i:' + i + '">' +
            "<span>" + U.escape(d.course.title) + "</span>" +
            '<span class="search-role">' + U.escape(d.role.name) + "</span></a></li>"
        )
        .join("");
    }
    input.addEventListener("input", () => {
      active = 0;
      render();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + shown.length) % Math.max(shown.length, 1);
        render();
      } else if (e.key === "Enter" && shown[active]) {
        window.location.href = U.lessonUrl(shown[active].role.slug, shown[active].index);
      }
    });
    searchEl.addEventListener("click", (e) => {
      if (e.target === searchEl) closeSearch();
    });
    render();
  }

  function openSearch() {
    if (!searchEl) buildSearch();
    searchEl.classList.add("open");
    document.body.classList.add("no-scroll");
    const input = searchEl.querySelector("input");
    input.value = "";
    input.dispatchEvent(new Event("input"));
    input.focus();
  }
  function closeSearch() {
    if (!searchEl) return;
    searchEl.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  document.addEventListener("keydown", (e) => {
    const typing = /input|textarea/i.test(document.activeElement.tagName);
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape") {
      closeSearch();
    }
  });

  /* ---------- Guided tour ---------- */
  function Tour(steps, opts) {
    this.steps = steps.filter((s) => document.querySelector(s.target));
    this.opts = opts || {};
    this.i = 0;
  }
  Tour.prototype.start = function () {
    if (!this.steps.length) return;
    this.overlay = document.createElement("div");
    this.overlay.className = "tour-overlay";
    this.overlay.innerHTML =
      '<div class="tour-spot"></div>' +
      '<div class="tour-card glass" role="dialog" aria-live="polite">' +
      '<p class="tour-count"></p><h3 class="tour-title"></h3><p class="tour-body"></p>' +
      '<div class="tour-dots"></div>' +
      '<div class="tour-actions"><button class="tour-skip" type="button">Skip tour</button>' +
      '<span><button class="btn btn-ghost btn-sm tour-back" type="button">Back</button>' +
      '<button class="btn btn-dark btn-sm tour-next" type="button">Next</button></span></div></div>';
    document.body.appendChild(this.overlay);
    this.spot = this.overlay.querySelector(".tour-spot");
    this.card = this.overlay.querySelector(".tour-card");
    this.overlay.querySelector(".tour-dots").innerHTML = this.steps.map(() => "<span></span>").join("");
    this.overlay.querySelector(".tour-skip").onclick = () => this.end();
    this.overlay.querySelector(".tour-back").onclick = () => this.go(this.i - 1);
    this.overlay.querySelector(".tour-next").onclick = () => (this.i === this.steps.length - 1 ? this.end() : this.go(this.i + 1));
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.end();
    });
    this.onKey = (e) => {
      if (e.key === "Escape") this.end();
      if (e.key === "ArrowRight") this.overlay.querySelector(".tour-next").click();
      if (e.key === "ArrowLeft" && this.i > 0) this.go(this.i - 1);
    };
    this.onMove = () => this.position();
    document.addEventListener("keydown", this.onKey);
    window.addEventListener("resize", this.onMove);
    window.addEventListener("scroll", this.onMove, { passive: true });
    requestAnimationFrame(() => this.overlay.classList.add("open"));
    this.go(0);
  };
  Tour.prototype.go = function (i) {
    this.i = i;
    const step = this.steps[i];
    if (step.before) step.before();
    const target = document.querySelector(step.target);
    this.target = target;
    const r = target.getBoundingClientRect();
    const top = r.top + window.scrollY - Math.max((window.innerHeight - r.height) / 2, 90);
    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? "auto" : "smooth" });

    this.card.classList.remove("in");
    const c = this.card;
    c.querySelector(".tour-count").textContent = "Step " + (i + 1) + " of " + this.steps.length;
    c.querySelector(".tour-title").textContent = step.title;
    c.querySelector(".tour-body").textContent = step.body;
    c.querySelector(".tour-back").style.visibility = i === 0 ? "hidden" : "visible";
    c.querySelector(".tour-next").textContent = i === this.steps.length - 1 ? "Finish" : "Next";
    c.querySelectorAll(".tour-dots span").forEach((d, j) => d.classList.toggle("on", j === i));
    this.position();
    setTimeout(() => {
      this.position();
      c.classList.add("in");
      c.querySelector(".tour-next").focus({ preventScroll: true });
    }, reduceMotion ? 0 : 420);
  };
  Tour.prototype.position = function () {
    if (!this.target) return;
    const pad = 10;
    const r = this.target.getBoundingClientRect();
    const s = this.spot.style;
    s.left = r.left - pad + "px";
    s.top = r.top - pad + "px";
    s.width = r.width + pad * 2 + "px";
    s.height = r.height + pad * 2 + "px";
    const cw = Math.min(340, window.innerWidth - 32);
    const ch = this.card.offsetHeight;
    let top = r.bottom + pad + 16;
    let left = r.left + r.width / 2 - cw / 2;
    if (top + ch > window.innerHeight - 16) top = r.top - pad - 16 - ch;
    if (top < 16) {
      // Target fills the screen: park the card in the bottom corner instead of covering it.
      top = window.innerHeight - ch - 20;
      left = window.innerWidth - cw - 20;
    }
    left = Math.max(16, Math.min(left, window.innerWidth - cw - 16));
    this.card.style.width = cw + "px";
    this.card.style.left = left + "px";
    this.card.style.top = top + "px";
  };
  Tour.prototype.end = function () {
    document.removeEventListener("keydown", this.onKey);
    window.removeEventListener("resize", this.onMove);
    window.removeEventListener("scroll", this.onMove);
    this.overlay.classList.remove("open");
    setTimeout(() => this.overlay.remove(), 300);
    try {
      localStorage.setItem("la-tour-done", "1");
    } catch (e) {}
    if (this.opts.onEnd) this.opts.onEnd();
  };
  window.ACADEMY_UTIL.Tour = Tour;

  /* ---------- Boot ---------- */
  renderHeader();
  renderFooter();
  fillIcons();
  setupScrollProgress();
  document.addEventListener("DOMContentLoaded", () => {
    observeReveals();
    setupPointerEffects();
  });
  window.ACADEMY_UTIL.openSearch = openSearch;
})();
