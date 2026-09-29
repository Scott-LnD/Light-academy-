/* Homepage: hero progress, role picker, path panel, certifications, partners, tour. */
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

  /* ---------- Role grid ---------- */
  const grid = document.getElementById("role-grid");
  const panel = document.getElementById("path-panel");

  grid.innerHTML = A.roles
    .map(
      (r, i) =>
        '<button class="role-card reveal" type="button" role="tab" id="tab-' + r.slug + '" aria-controls="path-panel" data-role="' + r.slug + '" style="--d:' + i * 0.07 + 's">' +
        (r.startHere ? '<span class="tag">Start here</span>' : "") +
        '<span class="role-icon">' + U.pixel(r.icon) + "</span>" +
        '<span class="role-name">' + U.escape(r.name) + "</span>" +
        '<span class="role-sub">' + U.escape(r.subtitle) + "</span>" +
        '<span class="role-foot"><span>' + r.courses.length + " courses</span>" +
        '<span class="role-view text-link">View path ' + U.icon("arrow") + "</span></span>" +
        "</button>"
    )
    .join("");

  function panelHtml(r) {
    const st = U.pathState(r.slug);
    const done = st.done;
    const firstOpen = st.nextIndex;
    const pct = st.pct;
    return (
      '<div class="path-head">' +
      '<span class="path-icon">' + U.pixel(r.icon) + "</span>" +
      '<div class="path-head-text"><h3>' + U.escape(r.name) + " path</h3><p>" + U.escape(r.description) + "</p></div>" +
      '<a class="btn btn-dark" href="' + U.lessonUrl(r.slug, done && firstOpen >= 0 ? firstOpen : null) + '">' + (st.complete ? "Review path" : done ? "Resume path" : "Start path") + ' <span class="btn-icon">' + U.icon("arrow") + "</span></a>" +
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

  let selected = null;
  let swapTimer;
  function selectRole(slug, opts) {
    const r = U.findRole(slug);
    if (!r || slug === selected) return;
    selected = slug;
    grid.querySelectorAll(".role-card").forEach((c) => {
      const on = c.dataset.role === slug;
      c.classList.toggle("selected", on);
      c.setAttribute("aria-selected", String(on));
      c.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", "tab-" + slug);

    const swap = () => {
      panel.innerHTML = panelHtml(r);
      panel.classList.remove("swapping");
      panel.classList.add("entering");
      void panel.offsetWidth;
      panel.classList.remove("entering");
    };
    clearTimeout(swapTimer);
    if (opts && opts.instant) swap();
    else {
      panel.classList.add("swapping");
      swapTimer = setTimeout(swap, reduceMotion ? 0 : 220);
    }

    if (opts && opts.updateHash) history.replaceState(null, "", "#role-" + slug);
    if (opts && opts.scroll) {
      setTimeout(() => {
        const rect = panel.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.75 || rect.top < 70) {
          window.scrollTo({ top: rect.top + window.scrollY - 90, behavior: reduceMotion ? "auto" : "smooth" });
        }
      }, 240);
    }
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".role-card");
    if (btn) selectRole(btn.dataset.role, { updateHash: true, scroll: true });
  });
  // Arrow keys move between role tabs.
  grid.addEventListener("keydown", (e) => {
    const cards = Array.from(grid.querySelectorAll(".role-card"));
    const i = cards.indexOf(document.activeElement);
    if (i < 0) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = cards[(i + step + cards.length) % cards.length];
    next.focus();
    selectRole(next.dataset.role, { updateHash: true });
  });

  // Deep link: index.html#role-controller opens that path.
  const hashRole = (location.hash.match(/^#role-(.+)$/) || [])[1];
  selectRole(U.findRole(hashRole) && hashRole !== gs.slug ? hashRole : A.roles[0].slug, { instant: true });
  if (hashRole) {
    setTimeout(() => document.getElementById("roles").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 150);
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

  /* ---------- Partners ---------- */
  document.getElementById("partner-grid").innerHTML = A.partners
    .map(
      (p, i) =>
        '<a class="partner-card reveal" href="' + U.lessonUrl("partners") + '" style="--d:' + i * 0.1 + 's">' +
        '<span class="partner-mark">' + U.pixel(["check", "connect", "report"][i % 3]) + "</span>" +
        "<h3>" + U.escape(p.title) + "</h3><p>" + U.escape(p.description) + "</p>" +
        '<span class="text-link">Explore the track ' + U.icon("arrow") + "</span></a>"
    )
    .join("");

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
    { target: "[data-tour='role-grid']", title: "Choose your role", body: "Each card is a learning path. Admins and Controllers should start first. Click a card to see its courses." },
    {
      target: "[data-tour='path']",
      title: "Your path, lesson by lesson",
      body: "Every row opens that lesson. A lesson is ticked once you click Next lesson on it, and the next one is flagged for you.",
      before: () => selectRole(A.roles[0].slug, { instant: true })
    },
    { target: "[data-tour='certs']", title: "Get certified", body: "Finish a path, pass a hands-on sandbox assessment and earn a credential for your LinkedIn." },
    { target: "[data-tour='partners']", title: "Working with clients?", body: "Accounting firms and implementation partners get a dedicated track and the Certified Advisor credential." },
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
