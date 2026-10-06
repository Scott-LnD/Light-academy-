/* Homepage: hero progress, expanding role cards, certifications, help, what's new, FAQ, tour. */
(function () {
  const A = window.ACADEMY;
  const U = window.ACADEMY_UTIL;
  const reduceMotion = U.reduceMotion;

  // Stagger the hero headline word by word.
  document.querySelectorAll(".hero-title .word").forEach((w, i) => w.style.setProperty("--i", i));

  /* ---------- Hero progress card ---------- */
  const feat = U.featuredPath();
  const inRole = feat.role;
  const nextCourse = feat.nextIndex >= 0 ? inRole.courses[feat.nextIndex] : null;
  const card = document.getElementById("progress-card");
  card.href = U.lessonUrl(inRole.slug, feat.nextIndex >= 0 ? feat.nextIndex : null);
  card.querySelector(".progress-card-title").textContent = feat.complete
    ? inRole.name + " path complete"
    : feat.started
      ? inRole.name + " path in progress"
      : "Start the " + inRole.name + " path";
  card.querySelector(".progress-card-sub").textContent = feat.done + " of " + feat.total + " lessons complete";
  card.querySelector(".progress-card-next").firstElementChild.innerHTML = nextCourse
    ? (feat.started ? "Next up" : "First up") + " · <strong>" + U.escape(nextCourse.title) + "</strong>"
    : "<strong>All lessons done.</strong> Time to get certified.";

  function animateRing() {
    const fill = card.querySelector(".ring-fill");
    const value = card.querySelector(".ring-value");
    const circ = 2 * Math.PI * 33;
    const target = feat.pct;
    fill.style.strokeDasharray = String(circ);
    fill.style.strokeDashoffset = String(circ);
    if (reduceMotion) {
      fill.style.strokeDashoffset = String(circ * (1 - target / 100));
      value.textContent = target + "%";
      return;
    }
    const dur = 1400;
    const t0 = performance.now() + 500;
    function tick(now) {
      const t = Math.min(Math.max((now - t0) / dur, 0), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      fill.style.strokeDashoffset = String(circ * (1 - (target / 100) * eased));
      value.textContent = Math.round(target * eased) + "%";
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  animateRing();

  /* ---------- Get started banner ---------- */
  const gs = A.getStarted;
  const gsState = U.pathState(gs.slug);
  document.querySelector(".start-banner-sub").textContent = gs.summary + " · " + gs.courses.length + " courses";
  const gsPill = document.querySelector(".start-banner .pill");
  if (gsState.complete) {
    gsPill.innerHTML = U.icon("check") + "Completed";
  } else {
    gsPill.className = "pill pill-start";
    gsPill.innerHTML = (gsState.started ? gsState.done + " of " + gsState.total + " done" : "Start here") + U.icon("arrow");
  }

  /* ---------- Role grid: cards expand in place to show their path ---------- */
  const grid = document.getElementById("role-grid");

  grid.innerHTML = A.roles
    .map(
      (r, i) =>
        '<div class="role-card reveal" data-role="' + r.slug + '" style="--d:' + i * 0.07 + 's">' +
        '<button class="role-toggle" type="button" aria-expanded="false" aria-controls="role-panel-' + r.slug + '" id="role-btn-' + r.slug + '">' +
        (r.startHere ? '<span class="tag">Start here</span>' : "") +
        '<span class="role-icon">' + U.pixel(r.icon) + "</span>" +
        '<span class="role-name">' + U.escape(r.name) + "</span>" +
        '<span class="role-sub">' + U.escape(r.subtitle) + "</span>" +
        '<span class="role-foot"><span>' + r.courses.length + " courses</span>" +
        '<span class="role-view text-link"><span class="rv-open">View path</span><span class="rv-close">Close</span> ' + U.icon("arrow") + "</span></span>" +
        "</button>" +
        '<div class="role-panel" id="role-panel-' + r.slug + '" role="region" aria-labelledby="role-btn-' + r.slug + '" inert><div class="role-panel-inner"></div></div>' +
        "</div>"
    )
    .join("");

  function panelHtml(r) {
    const st = U.pathState(r.slug);
    const done = st.done;
    const firstOpen = st.nextIndex;
    const pct = st.pct;
    return (
      '<div class="path-head">' +
      '<div class="path-head-text"><p>' + U.escape(r.description) + "</p></div>" +
      '<a class="btn btn-primary" href="' + U.lessonUrl(r.slug, done && firstOpen >= 0 ? firstOpen : null) + '">' + (st.complete ? "Review path" : done ? "Resume path" : "Start path") + ' <span class="btn-icon">' + U.icon("arrow") + "</span></a>" +
      "</div>" +
      (done ? '<div class="path-meter" aria-label="' + pct + '% complete"><span style="--w:' + pct + '%"></span></div>' : "") +
      '<ol class="course-list">' +
      r.courses
        .map((c, i) => {
          const completed = st.doneIds.has(c.id);
          const next = st.started && i === firstOpen;
          return (
            '<li style="--i:' + i + '"><a class="course-row' + (completed ? " is-done" : "") + (next ? " is-next" : "") + '" href="' + U.lessonUrl(r.slug, i) + '">' +
            '<span class="course-num">' + (completed ? U.icon("check") : i + 1) + "</span>" +
            '<span class="course-title">' + U.escape(c.title) + (next ? '<span class="pill pill-next">Up next</span>' : "") + "</span>" +
            '<span class="course-meta">' + (completed ? "Completed" : U.escape(c.time)) + "</span>" +
            '<span class="course-go">' + U.icon("arrow") + "</span>" +
            "</a></li>"
          );
        })
        .join("") +
      "</ol>"
    );
  }

  const cards = Array.from(grid.querySelectorAll(".role-card"));
  const EXPAND_MS = reduceMotion ? 0 : 450;
  let openCard = null;
  let busy = Promise.resolve();

  // Animate every card from where it was to where it ends up (FLIP).
  function flip(change) {
    const before = new Map(cards.map((c) => [c, c.getBoundingClientRect()]));
    change();
    if (reduceMotion) return;
    cards.forEach((c) => {
      const a = before.get(c);
      const b = c.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      c.animate([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }], { duration: EXPAND_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    });
  }

  function columns() {
    return getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length || 1;
  }

  // The open card moves to the start of its row and spans the full width,
  // so the rest of that row (and everything after it) slides below it.
  function placeCards() {
    const cols = columns();
    cards.forEach((c, i) => (c.style.order = String(i * 2)));
    if (openCard) {
      const i = cards.indexOf(openCard);
      openCard.style.order = String(Math.floor(i / cols) * cols * 2 - 1);
    }
  }

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  function collapse() {
    if (!openCard) return Promise.resolve();
    const card = openCard;
    card.classList.remove("open");
    card.querySelector(".role-toggle").setAttribute("aria-expanded", "false");
    card.querySelector(".role-panel").inert = true;
    return wait(EXPAND_MS * 0.6).then(() => {
      flip(() => {
        openCard = null;
        card.classList.remove("expanded");
        placeCards();
      });
      if (location.hash.indexOf("#role-") === 0) history.replaceState(null, "", location.pathname + location.search + "#roles");
    });
  }

  function expand(card, opts) {
    const r = U.findRole(card.dataset.role);
    card.querySelector(".role-panel-inner").innerHTML = panelHtml(r);
    U.fillIcons(card);
    flip(() => {
      openCard = card;
      card.classList.add("expanded");
      placeCards();
    });
    // Let the layout move first, then open the panel.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        card.classList.add("open");
        card.querySelector(".role-toggle").setAttribute("aria-expanded", "true");
        card.querySelector(".role-panel").inert = false;
      })
    );
    history.replaceState(null, "", "#role-" + r.slug);
    if (!opts || opts.scroll !== false) {
      setTimeout(() => {
        const top = card.getBoundingClientRect().top;
        if (top < 70 || top > window.innerHeight * 0.6) {
          window.scrollTo({ top: top + window.scrollY - 90, behavior: reduceMotion ? "auto" : "smooth" });
        }
      }, EXPAND_MS * 0.5);
    }
    return wait(EXPAND_MS);
  }

  // Queue changes so quick clicks never fight each other.
  function openRole(slug, opts) {
    busy = busy.then(() => {
      const card = cards.find((c) => c.dataset.role === slug);
      if (!card) return;
      if (openCard === card) return opts && opts.toggle ? collapse() : null;
      return collapse().then(() => expand(card, opts));
    });
    return busy;
  }
  function closeRole() {
    busy = busy.then(collapse);
    return busy;
  }

  grid.addEventListener("click", (e) => {
    const toggle = e.target.closest(".role-toggle");
    if (toggle) openRole(toggle.closest(".role-card").dataset.role, { toggle: true });
  });
  // Click anywhere outside the open card to close it.
  document.addEventListener("click", (e) => {
    if (openCard && !openCard.contains(e.target) && !e.target.closest(".tour-overlay, .role-toggle")) closeRole();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openCard && !document.querySelector(".tour-overlay, .search-overlay.open")) {
      const btn = openCard.querySelector(".role-toggle");
      closeRole().then(() => btn.focus({ preventScroll: true }));
    }
  });
  window.addEventListener("resize", () => {
    if (openCard) placeCards();
  });

  // Deep link: index.html#role-controller opens that path.
  const hashRole = (location.hash.match(/^#role-(.+)$/) || [])[1];
  if (hashRole && cards.some((c) => c.dataset.role === hashRole)) {
    setTimeout(() => {
      document.getElementById("roles").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      openRole(hashRole, { scroll: false });
    }, 150);
  }

  /* ---------- Certifications ---------- */
  document.getElementById("cert-grid").innerHTML = A.certifications
    .map((c, i) => {
      const cs = U.pathState(c.role);
      const progress = cs.started && !cs.complete;
      const label = cs.complete ? "Ready for assessment" : progress ? "In progress" : "Locked";
      return (
        '<a class="cert-card reveal" href="' + U.lessonUrl(c.role) + '" style="--d:' + (0.1 + i * 0.1) + 's">' +
        '<span class="cert-icon">' + U.pixel(cs.started ? "check" : "lock") + "</span>" +
        "<h3>" + U.escape(c.name) + "</h3>" +
        "<p>" + U.escape(c.description) + "</p>" +
        '<span class="pill ' + (cs.started ? "pill-live" : "pill-locked") + '">' + label + "</span>" +
        "</a>"
      );
    })
    .join("");

  /* ---------- What's new: Flash cards that open in a window ---------- */
  const flashGrid = document.getElementById("flash-grid");
  const flashes = A.flashes || [];
  const toSec = (t) => t.split(":").reduce((acc, n) => acc * 60 + Number(n), 0);
  const esc = U.escape;

  function flashCover(f, big) {
    return (
      '<span class="flash-cover' + (big ? " big" : "") + '" aria-hidden="true">' +
      '<span class="flash-cover-word">Flash</span><span class="flash-cover-num">#' + f.number + "</span>" +
      "</span>"
    );
  }

  flashGrid.innerHTML = flashes
    .map(
      (f, i) =>
        '<button class="flash-card reveal" type="button" data-flash="' + i + '" style="--d:' + i * 0.08 + 's" aria-haspopup="dialog">' +
        flashCover(f) +
        '<span class="flash-meta">' + esc(f.date) + (i === 0 ? '<span class="flash-new">Latest</span>' : "") + "</span>" +
        '<span class="flash-title">Flash #' + f.number + ": " + esc(f.title) + "</span>" +
        '<span class="flash-summary">' + esc(f.summary) + "</span>" +
        '<span class="text-link flash-open">Watch the Flash ' + U.icon("arrow") + "</span>" +
        "</button>"
    )
    .join("");

  function flashBody(f) {
    const ytId = f.youtube && window.ACADEMY_YT ? window.ACADEMY_YT.parseId(f.youtube) : null;
    const video = ytId
      ? '<div class="media-frame flash-video">' + window.ACADEMY_YT.markup({ src: f.youtube, title: "Flash #" + f.number }, ytId) + "</div>"
      : '<div class="flash-video flash-video-soon">' + flashCover(f, true) + '<span class="flash-soon-note">Video coming soon</span></div>';
    const chapters =
      '<div class="flash-chapters"><p class="flash-label">In this video</p><ol>' +
      f.chapters
        .map(
          (c) =>
            '<li><button type="button" class="flash-chapter" data-t="' + toSec(c.t) + '"' + (ytId ? "" : " disabled") + ">" +
            '<span class="flash-time">' + esc(c.t) + "</span><span>" + esc(c.label) + "</span></button></li>"
        )
        .join("") +
      "</ol></div>";
    const sections = f.sections
      .map((sct) => "<h3>" + esc(sct.title) + "</h3>" + sct.paras.map((p) => "<p>" + esc(p) + "</p>").join(""))
      .join("");
    const plus =
      "<h3>Plus, all this</h3><ul class=\"flash-plus\">" +
      f.plus.map((x) => "<li><strong>" + esc(x.lead) + "</strong> " + esc(x.text) + "</li>").join("") +
      "</ul>";
    return (
      '<h2 class="flash-modal-title" id="flash-modal-title">Flash #' + f.number + ": " + esc(f.title) + "</h2>" +
      video +
      chapters +
      '<div class="flash-content">' +
      f.intro.map((p) => "<p>" + esc(p) + "</p>").join("") +
      sections +
      plus +
      '<p class="flash-outro">' + esc(f.outro) + "</p>" +
      "</div>"
    );
  }

  let flashModal = null;
  let flashReturnFocus = null;
  function openFlash(i) {
    const f = flashes[i];
    if (!f) return;
    flashReturnFocus = document.activeElement;
    flashModal = document.createElement("div");
    flashModal.className = "flash-overlay";
    flashModal.innerHTML =
      '<div class="flash-modal" role="dialog" aria-modal="true" aria-labelledby="flash-modal-title">' +
      '<header class="flash-modal-head">' +
      '<span class="flash-modal-date">' + esc(f.date) + "</span>" +
      '<a class="flash-modal-blog" href="' + esc(f.blog) + '" target="_blank" rel="noopener">Read on the blog <span aria-hidden="true">&#8599;</span></a>' +
      '<button class="flash-modal-close" type="button" aria-label="Close">' + U.icon("close") + "</button>" +
      "</header>" +
      '<div class="flash-modal-body">' + flashBody(f) + "</div>" +
      "</div>";
    document.body.appendChild(flashModal);
    document.body.classList.add("no-scroll");
    const body = flashModal.querySelector(".flash-modal-body");
    if (window.ACADEMY_YT) window.ACADEMY_YT.init(body);
    body.addEventListener("click", (e) => {
      const ch = e.target.closest(".flash-chapter");
      if (!ch || ch.disabled) return;
      const player = body.querySelector(".yt-player");
      if (player) {
        window.ACADEMY_YT.seek(player, Number(ch.dataset.t));
        body.querySelectorAll(".flash-chapter").forEach((b) => b.classList.toggle("on", b === ch));
        player.closest(".flash-video").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      }
    });
    flashModal.addEventListener("click", (e) => {
      if (e.target === flashModal || e.target.closest(".flash-modal-close")) closeFlash();
    });
    requestAnimationFrame(() => flashModal && flashModal.classList.add("open"));
    flashModal.querySelector(".flash-modal-close").focus({ preventScroll: true });
  }
  function closeFlash() {
    if (!flashModal) return;
    const m = flashModal;
    flashModal = null;
    m.classList.remove("open");
    document.body.classList.remove("no-scroll");
    // Removing the window also stops the video.
    setTimeout(() => m.remove(), reduceMotion ? 0 : 250);
    if (flashReturnFocus) flashReturnFocus.focus({ preventScroll: true });
  }
  flashGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".flash-card");
    if (card) openFlash(Number(card.dataset.flash));
  });
  document.addEventListener("keydown", (e) => {
    if (!flashModal) return;
    if (e.key === "Escape") {
      closeFlash();
    } else if (e.key === "Tab") {
      // Keep keyboard focus inside the window.
      const items = Array.from(flashModal.querySelectorAll("a, button:not([disabled]), [tabindex]:not([tabindex='-1'])"));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- FAQ: keep one answer open at a time ---------- */
  document.querySelectorAll(".faq details").forEach((d, i, all) => {
    d.addEventListener("toggle", () => {
      if (d.open) all.forEach((o) => o !== d && (o.open = false));
    });
  });

  /* ---------- Guided tour ---------- */
  const steps = [
    { target: "[data-tour='hero']", title: "Welcome to Light Academy", body: "Short, role-based courses that teach only the parts of Light you use. This quick tour shows you around." },
    { target: "[data-tour='progress']", title: "Pick up where you left off", body: "Your current path and the next lesson live here. Click the card to jump straight back in." },
    { target: "[data-tour='start']", title: "Everyone starts here", body: "Three short courses on navigating Light, how the ledger works and your first login." },
    { target: "[data-tour='role-grid']", title: "Choose your role", body: "Each card is a learning path. Admins and Controllers should start first. Click a card to open its lessons right there." },
    {
      target: ".role-card[data-role='admin']",
      title: "Your path, lesson by lesson",
      body: "Every row opens that lesson. A lesson is ticked once you click Next lesson on it, and the next one is flagged for you. Click outside the card to close it.",
      before: () => openRole("admin", { scroll: false })
    },
    { target: "[data-tour='certs']", title: "Get certified", body: "Finish a path, pass a hands-on sandbox assessment and earn a credential for your LinkedIn." },
    { target: "[data-tour='help']", title: "Need a hand?", body: "Ask Light in the app, search the Help Center or email the support team. Every link opens in a new tab." },
    { target: "[data-tour='flash']", title: "What's new", body: "Every Flash update in one place. Open one to watch the video, jump to a chapter and read what shipped." },
    { target: "[data-tour='search']", title: "Find anything fast", body: "Search every course from any page. Press / or Ctrl+K to open it." }
  ];

  const tourBtn = document.createElement("button");
  tourBtn.className = "tour-launch";
  tourBtn.type = "button";
  tourBtn.innerHTML = U.icon("compass") + "<span>Take the tour</span>";
  document.body.appendChild(tourBtn);

  function startTour() {
    hideNudge();
    new U.Tour(steps).start();
  }
  tourBtn.addEventListener("click", startTour);

  // First visit: a small nudge offering the tour.
  let nudge;
  function hideNudge() {
    if (nudge) {
      nudge.classList.remove("open");
      try {
        localStorage.setItem("la-tour-done", "1");
      } catch (e) {}
    }
  }
  let seen = false;
  try {
    seen = localStorage.getItem("la-tour-done") === "1";
  } catch (e) {}
  if (!seen) {
    nudge = document.createElement("div");
    nudge.className = "tour-nudge glass";
    nudge.innerHTML =
      "<p><strong>New here?</strong> Take a 30 second tour of Light Academy.</p>" +
      '<div><button class="btn btn-dark btn-sm" type="button">Show me around</button>' +
      '<button class="tour-skip" type="button">Not now</button></div>';
    document.body.appendChild(nudge);
    nudge.querySelector(".btn").addEventListener("click", startTour);
    nudge.querySelector(".tour-skip").addEventListener("click", hideNudge);
    setTimeout(() => nudge.classList.add("open"), 1800);
  }
})();
