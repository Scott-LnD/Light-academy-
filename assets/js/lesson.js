/*
 * Path / lesson page. One template serves every role: the page's
 * <body data-role="..."> picks the path from data.js.
 *
 * INTEGRATION: each lesson renders an empty
 *   <div class="lesson-slot" data-lesson-slot="<role>/<n>">
 * Drop the real lesson content (video, steps, quiz) into that slot, or set
 * `url` on a course in data.js to send learners to a separate page instead.
 */
(function () {
  const A = window.ACADEMY;
  const U = window.ACADEMY_UTIL;
  const reduceMotion = U.reduceMotion;
  const slug = document.body.dataset.role;
  const r = U.findRole(slug);
  const root = document.getElementById("lesson-root");

  if (!r) {
    root.innerHTML = '<section class="container lesson-hero"><h1 class="section-title">path not found</h1><p><a href="../index.html#roles">Back to all roles</a></p></section>';
    return;
  }
  document.title = r.name + " path · Light Academy";

  const done = r.courses.filter((c) => c.status === "completed").length;
  const pct = Math.round((done / r.courses.length) * 100);
  const firstOpen = r.courses.findIndex((c) => c.status !== "completed");
  const isRole = A.roles.some((x) => x.slug === slug);
  const backHref = isRole ? "../index.html#role-" + slug : "../index.html#roles";

  // Suggest another path at the end of this one.
  const order = [A.getStarted.slug].concat(A.roles.map((x) => x.slug));
  const pos = order.indexOf(slug);
  const nextPath = pos >= 0 && pos < order.length - 1 ? U.findRole(order[pos + 1]) : null;

  root.innerHTML =
    '<section class="container lesson-hero">' +
    '<nav class="crumbs reveal" aria-label="Breadcrumb"><a href="../index.html#home">Home</a><span>/</span><a href="../index.html#roles">Roles</a><span>/</span><span aria-current="page">' + U.escape(r.name) + "</span></nav>" +
    '<div class="lesson-hero-row">' +
    '<div class="lesson-hero-text">' +
    '<span class="path-icon lg reveal">' + U.icon(r.icon) + "</span>" +
    '<p class="eyebrow reveal" style="--d:.05s">' + U.escape(r.eyebrow || r.subtitle || "Learning path") + "</p>" +
    '<h1 class="lesson-title reveal" style="--d:.1s">' + U.escape(r.name.toLowerCase()) + " path</h1>" +
    '<p class="section-sub reveal" style="--d:.15s">' + U.escape(r.description) + "</p>" +
    '<div class="lesson-actions reveal" style="--d:.2s">' +
    (firstOpen >= 0
      ? '<a class="btn btn-primary magnetic" href="#lesson-' + (firstOpen + 1) + '">' + (done ? "Resume lesson " + (firstOpen + 1) : "Start lesson 1") + ' <span class="btn-icon">' + U.icon("arrow") + "</span></a>"
      : '<span class="pill pill-done">' + U.icon("check") + "Path completed</span>") +
    '<a class="btn btn-ghost" href="' + backHref + '">' + '<span class="btn-icon">' + U.icon("back") + "</span> All roles</a>" +
    "</div></div>" +
    '<div class="lesson-stat glass reveal" style="--d:.2s">' +
    '<p class="stat-num"><span class="count" data-to="' + pct + '">0</span>%</p>' +
    '<p class="muted">' + done + " of " + r.courses.length + " lessons complete</p>" +
    '<div class="path-meter"><span style="--w:' + pct + '%"></span></div>' +
    "</div>" +
    "</div>" +
    '<p class="integration-note reveal"><span data-icon="spark"></span>Lesson content is a placeholder for now. Real lessons plug into each slot below.</p>' +
    "</section>" +
    '<section class="container lesson-layout">' +
    '<aside class="lesson-toc glass" aria-label="Lessons in this path"><p class="toc-head">In this path</p><ol>' +
    r.courses
      .map(
        (c, i) =>
          '<li><a href="#lesson-' + (i + 1) + '" data-lesson="' + (i + 1) + '" class="' + (c.status === "completed" ? "is-done" : "") + '">' +
          '<span class="course-num">' + (c.status === "completed" ? U.icon("check") : i + 1) + "</span>" + U.escape(c.title) + "</a></li>"
      )
      .join("") +
    "</ol></aside>" +
    '<div class="lesson-list">' +
    r.courses
      .map((c, i) => {
        const n = i + 1;
        const completed = c.status === "completed";
        const prev = i > 0 ? '<a class="btn btn-ghost btn-sm" href="#lesson-' + i + '"><span class="btn-icon">' + U.icon("back") + "</span> Previous</a>" : "<span></span>";
        const next =
          n < r.courses.length
            ? '<a class="btn btn-dark btn-sm" href="#lesson-' + (n + 1) + '">Next lesson <span class="btn-icon">' + U.icon("arrow") + "</span></a>"
            : nextPath
              ? '<a class="btn btn-dark btn-sm" href="' + U.lessonUrl(nextPath.slug) + '">Next: ' + U.escape(nextPath.name) + ' path <span class="btn-icon">' + U.icon("arrow") + "</span></a>"
              : '<a class="btn btn-dark btn-sm" href="../index.html#certifications">See certifications <span class="btn-icon">' + U.icon("arrow") + "</span></a>";
        return (
          '<article class="lesson-card glass reveal" id="lesson-' + n + '">' +
          '<header class="lesson-card-head">' +
          '<span class="course-num' + (completed ? " done" : "") + '">' + (completed ? U.icon("check") : n) + "</span>" +
          '<div><p class="muted small">Lesson ' + n + " · " + U.escape(c.time) + "</p><h2>" + U.escape(c.title) + "</h2></div>" +
          (completed ? '<span class="pill pill-done-soft">Completed</span>' : c.status === "next" ? '<span class="pill pill-next">Up next</span>' : "") +
          "</header>" +
          '<div class="lesson-slot" data-lesson-slot="' + slug + "/" + n + '">' +
          '<span class="slot-play">' + U.icon("play") + "</span>" +
          "<p>Lesson content coming soon</p><p class=\"muted small\">Slot <code>" + slug + "/" + n + "</code> is ready for integration.</p>" +
          "</div>" +
          '<footer class="lesson-card-foot">' + prev + next + "</footer>" +
          "</article>"
        );
      })
      .join("") +
    "</div></section>";

  U.fillIcons(root);

  // Count-up for the completion stat.
  root.querySelectorAll(".count").forEach((el) => {
    const to = Number(el.dataset.to);
    if (reduceMotion || !to) {
      el.textContent = to;
      return;
    }
    const t0 = performance.now() + 300;
    (function tick(now) {
      const t = Math.min(Math.max((now - t0) / 1100, 0), 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    })(t0);
  });

  // Table of contents follows the lesson you are reading.
  const tocLinks = Array.from(root.querySelectorAll(".lesson-toc a"));
  const cards = Array.from(root.querySelectorAll(".lesson-card"));
  function spy() {
    let active = cards[0];
    cards.forEach((c) => {
      if (c.getBoundingClientRect().top < window.innerHeight * 0.4) active = c;
    });
    tocLinks.forEach((a) => a.classList.toggle("active", "lesson-" + a.dataset.lesson === active.id));
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // Arriving at #lesson-n (from the homepage or search) highlights that lesson.
  function focusLesson() {
    const m = location.hash.match(/^#lesson-(\d+)$/);
    if (!m) return;
    const card = document.getElementById("lesson-" + m[1]);
    if (!card) return;
    card.classList.add("is-visible");
    setTimeout(() => {
      window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 100, behavior: reduceMotion ? "auto" : "smooth" });
      card.classList.remove("pulse");
      void card.offsetWidth;
      card.classList.add("pulse");
    }, 120);
  }
  window.addEventListener("hashchange", focusLesson);
  focusLesson();
})();
