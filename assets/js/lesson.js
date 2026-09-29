/*
 * Path / lesson page. One template serves every path: the page's
 * <body data-role="..."> picks the path from data.js.
 *
 * Each lesson renders its `content` blocks (video, interactive demo, text).
 * A lesson is only marked complete when the learner clicks "Next lesson"
 * (or "Finish path") on it. Opening, scrolling or watching does not tick it.
 *
 * ADDING A NEW BLOCK TYPE: add a function to `BLOCKS` below that takes the
 * block object and returns HTML, then use { type: "<name>", ... } in data.js.
 */
(function () {
  const A = window.ACADEMY;
  const U = window.ACADEMY_UTIL;
  const P = window.ACADEMY_PROGRESS;
  const reduceMotion = U.reduceMotion;
  const slug = document.body.dataset.role;
  const r = U.findRole(slug);
  const root = document.getElementById("lesson-root");
  const esc = U.escape;

  if (!r) {
    root.innerHTML = '<section class="container lesson-hero"><h1 class="section-title">path not found</h1><p><a href="../index.html#roles">Back to all roles</a></p></section>';
    return;
  }
  document.title = r.name + " path · Light Academy";

  const isRole = A.roles.some((x) => x.slug === slug);
  const backHref = isRole ? "../index.html#role-" + slug : "../index.html#roles";

  // Suggest another path once this one is finished.
  const order = [A.getStarted.slug].concat(A.roles.map((x) => x.slug));
  const pos = order.indexOf(slug);
  const nextPath = pos >= 0 && pos < order.length - 1 ? U.findRole(order[pos + 1]) : null;

  /* ---------- Content blocks ---------- */

  // Relative media paths in data.js are written from the site root.
  function mediaUrl(src) {
    return /^(https?:)?\/\//.test(src) || src.startsWith("/") ? src : U.base() + src;
  }

  function embedUrl(src) {
    let m;
    if ((m = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/))) return "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0";
    if ((m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return "https://player.vimeo.com/video/" + m[1];
    if ((m = src.match(/loom\.com\/(?:share|embed)\/([\w-]+)/))) return "https://www.loom.com/embed/" + m[1];
    return null;
  }

  function blockHead(kind, icon, title) {
    return '<p class="block-label"><span class="block-kind">' + U.icon(icon) + kind + "</span>" + (title ? '<span class="block-title">' + esc(title) + "</span>" : "") + "</p>";
  }

  const BLOCKS = {
    video(b) {
      // YouTube links get the in-page player (assets/js/yt-player.js), so
      // learners stay on the site instead of being sent to youtube.com.
      const ytId = window.ACADEMY_YT && window.ACADEMY_YT.parseId(b.src);
      if (ytId) {
        const yb = Object.assign({}, b, b.poster ? { poster: mediaUrl(b.poster) } : {});
        return (
          '<div class="block block-video">' + blockHead("Video", "play", b.title) +
          '<div class="media-frame">' + window.ACADEMY_YT.markup(yb, ytId) + "</div>" +
          (b.caption ? '<p class="block-caption">' + esc(b.caption) + "</p>" : "") +
          "</div>"
        );
      }
      const embed = embedUrl(b.src);
      const player = embed
        ? '<iframe src="' + esc(embed) + '" title="' + esc(b.title || "Lesson video") + '" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
        : '<video controls preload="metadata" playsinline' + (b.poster ? ' poster="' + esc(mediaUrl(b.poster)) + '"' : "") + '><source src="' + esc(mediaUrl(b.src)) + '" />Your browser cannot play this video.</video>';
      return (
        '<div class="block block-video">' + blockHead("Video", "play", b.title) +
        '<div class="media-frame">' + player + "</div>" +
        (b.caption ? '<p class="block-caption">' + esc(b.caption) + "</p>" : "") +
        "</div>"
      );
    },
    demo(b) {
      // The demo loads only when the learner launches it, so pages stay fast.
      return (
        '<div class="block block-demo">' + blockHead("Interactive demo", "cursor", b.title) +
        '<div class="media-frame demo-frame" style="--h:' + (Number(b.height) || 600) + 'px" data-demo-src="' + esc(mediaUrl(b.src)) + '" data-demo-title="' + esc(b.title || "Interactive demo") + '">' +
        '<button class="demo-launch" type="button"><span class="slot-play">' + U.icon("cursor") + "</span>" +
        "<strong>" + esc(b.title || "Try it yourself") + "</strong><span class=\"muted small\">Click to start the interactive demo</span></button>" +
        "</div>" +
        '<div class="demo-tools"><button class="btn btn-ghost btn-sm demo-full" type="button" hidden>' + U.icon("expand") + " Full screen</button></div>" +
        (b.caption ? '<p class="block-caption">' + esc(b.caption) + "</p>" : "") +
        "</div>"
      );
    },
    text(b) {
      // Trusted HTML written by the Academy team in data.js.
      return '<div class="block block-text">' + (b.title ? "<h3>" + esc(b.title) + "</h3>" : "") + (b.html || "") + "</div>";
    },
    placeholder(b) {
      return (
        '<div class="block lesson-slot" data-lesson-slot="' + esc(b.slot) + '">' +
        '<span class="slot-play">' + U.icon(b.kind === "demo" ? "cursor" : "play") + "</span>" +
        "<p>" + (b.kind === "demo" ? "Interactive demo coming soon" : "Lesson video coming soon") + "</p>" +
        '<p class="muted small">Add a <code>' + b.kind + "</code> block for <code>" + esc(b.slot) + "</code> in data.js.</p>" +
        "</div>"
      );
    }
  };

  function lessonBody(c) {
    const blocks =
      c.content && c.content.length
        ? c.content
        : [
            { type: "placeholder", kind: "video", slot: slug + "/" + c.id },
            { type: "placeholder", kind: "demo", slot: slug + "/" + c.id }
          ];
    return blocks
      .map((b) => {
        const fn = BLOCKS[b.type];
        return fn ? fn(b) : "";
      })
      .join("");
  }

  /* ---------- Page ---------- */

  function nextButton(i) {
    const last = i === r.courses.length - 1;
    return (
      '<button class="btn btn-dark btn-sm lesson-next" type="button" data-index="' + i + '">' +
      (last ? "Finish path" : "Next lesson") + ' <span class="btn-icon">' + U.icon(last ? "check" : "arrow") + "</span></button>"
    );
  }

  const st0 = U.pathState(slug);
  root.innerHTML =
    '<section class="container lesson-hero">' +
    '<nav class="crumbs reveal" aria-label="Breadcrumb"><a href="../index.html#home">Home</a><span>/</span><a href="../index.html#roles">Roles</a><span>/</span><span aria-current="page">' + esc(r.name) + "</span></nav>" +
    '<div class="lesson-hero-row">' +
    '<div class="lesson-hero-text">' +
    '<span class="path-icon lg reveal">' + U.pixel(r.icon) + "</span>" +
    '<p class="eyebrow reveal" style="--d:.05s">' + esc(r.eyebrow || r.subtitle || "Learning path") + "</p>" +
    '<h1 class="lesson-title reveal" style="--d:.1s">' + esc(r.name.toLowerCase()) + " path</h1>" +
    '<p class="section-sub reveal" style="--d:.15s">' + esc(r.description) + "</p>" +
    '<div class="lesson-actions reveal" style="--d:.2s">' +
    '<span class="hero-cta"></span>' +
    '<a class="btn btn-ghost" href="' + backHref + '"><span class="btn-icon">' + U.icon("back") + "</span> All roles</a>" +
    "</div></div>" +
    '<div class="lesson-stat glass reveal" style="--d:.2s">' +
    '<p class="stat-num"><span class="count">0</span>%</p>' +
    '<p class="muted stat-label"></p>' +
    '<div class="path-meter"><span class="stat-meter"></span></div>' +
    '<button class="stat-reset" type="button">Reset progress</button>' +
    "</div>" +
    "</div>" +
    "</section>" +
    '<section class="container lesson-layout">' +
    '<aside class="lesson-toc glass" aria-label="Lessons in this path"><p class="toc-head">In this path</p><ol>' +
    r.courses
      .map(
        (c, i) =>
          '<li><a href="#lesson-' + c.id + '" data-id="' + c.id + '">' +
          '<span class="course-num" data-n="' + (i + 1) + '">' + (i + 1) + "</span>" + esc(c.title) + "</a></li>"
      )
      .join("") +
    "</ol></aside>" +
    '<div class="lesson-list">' +
    r.courses
      .map((c, i) => {
        const prev = i > 0 ? '<a class="btn btn-ghost btn-sm" href="#lesson-' + r.courses[i - 1].id + '"><span class="btn-icon">' + U.icon("back") + "</span> Previous</a>" : "<span></span>";
        return (
          '<article class="lesson-card glass reveal" id="lesson-' + c.id + '" data-id="' + c.id + '">' +
          '<header class="lesson-card-head">' +
          '<span class="course-num" data-n="' + (i + 1) + '">' + (i + 1) + "</span>" +
          '<div><p class="muted small">Lesson ' + (i + 1) + " of " + r.courses.length + (c.time ? " · " + esc(c.time) : "") + "</p><h2>" + esc(c.title) + "</h2></div>" +
          '<span class="lesson-status"></span>' +
          "</header>" +
          '<div class="lesson-body">' + lessonBody(c) + "</div>" +
          '<footer class="lesson-card-foot">' + prev + nextButton(i) + "</footer>" +
          "</article>"
        );
      })
      .join("") +
    '<div class="path-complete glass" hidden></div>' +
    "</div></section>";

  U.fillIcons(root);
  if (window.ACADEMY_YT) window.ACADEMY_YT.init(root);
  const cards = Array.from(root.querySelectorAll(".lesson-card"));
  const tocLinks = Array.from(root.querySelectorAll(".lesson-toc a"));

  /* ---------- Progress UI ---------- */

  let shownPct = 0;
  function animateCount(to) {
    const el = root.querySelector(".count");
    const from = shownPct;
    shownPct = to;
    if (reduceMotion || from === to) {
      el.textContent = to;
      return;
    }
    const t0 = performance.now();
    (function tick(now) {
      const t = Math.min((now - t0) / 900, 1);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function setNum(el, done) {
    if (el.classList.contains("done") === done) return;
    el.classList.toggle("done", done);
    el.innerHTML = done ? U.icon("check") : el.dataset.n;
  }

  // Re-draw every progress indicator from saved state. `justDone` gets a pop.
  function refresh(justDone) {
    const st = U.pathState(slug);
    tocLinks.forEach((a) => {
      const d = st.doneIds.has(a.dataset.id);
      a.classList.toggle("is-done", d);
      setNum(a.querySelector(".course-num"), d);
    });
    cards.forEach((card, i) => {
      const d = st.doneIds.has(card.dataset.id);
      card.classList.toggle("is-done", d);
      setNum(card.querySelector(".lesson-card-head .course-num"), d);
      card.querySelector(".lesson-status").innerHTML = d
        ? '<span class="pill pill-done-soft">' + U.icon("check") + "Completed</span>"
        : i === st.nextIndex && st.started
          ? '<span class="pill pill-next">Up next</span>'
          : "";
    });
    if (justDone) {
      root.querySelectorAll('[data-id="' + justDone + '"] .course-num').forEach((n) => {
        n.classList.remove("pop");
        void n.offsetWidth;
        n.classList.add("pop");
      });
    }

    const cta = root.querySelector(".hero-cta");
    cta.innerHTML = st.complete
      ? '<span class="pill pill-done">' + U.icon("check") + "Path completed</span>"
      : '<a class="btn btn-primary" href="#lesson-' + r.courses[st.nextIndex].id + '">' +
        (st.started ? "Resume lesson " + (st.nextIndex + 1) : "Start lesson 1") + ' <span class="btn-icon">' + U.icon("arrow") + "</span></a>";

    root.querySelector(".stat-label").textContent = st.done + " of " + st.total + " lessons complete";
    root.querySelector(".stat-meter").style.width = st.pct + "%";
    root.querySelector(".stat-reset").hidden = !st.started;
    animateCount(st.pct);
    renderComplete(st);
    return st;
  }

  function renderComplete(st) {
    const box = root.querySelector(".path-complete");
    box.hidden = !st.complete;
    if (!st.complete) return;
    const next = nextPath
      ? '<a class="btn btn-primary" href="' + U.lessonUrl(nextPath.slug) + '">Next: ' + esc(nextPath.name) + ' path <span class="btn-icon">' + U.icon("arrow") + "</span></a>"
      : "";
    box.innerHTML =
      '<span class="path-complete-badge">' + U.icon("check") + "</span>" +
      "<div><h2>" + esc(r.name) + " path complete</h2>" +
      '<p class="muted">You finished all ' + st.total + " lessons. Nice work.</p></div>" +
      '<div class="path-complete-actions">' + next +
      '<a class="btn btn-ghost" href="../index.html#certifications">See certifications</a></div>';
  }

  function scrollToCard(card) {
    window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 100, behavior: reduceMotion ? "auto" : "smooth" });
  }

  // "Next lesson" / "Finish path" is the only thing that marks a lesson done.
  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".lesson-next");
    if (!btn) return;
    const i = Number(btn.dataset.index);
    const c = r.courses[i];
    P.complete(slug, c.id);
    refresh(c.id);
    const nextCard = cards[i + 1];
    if (nextCard) {
      history.replaceState(null, "", "#lesson-" + nextCard.dataset.id);
      setTimeout(() => {
        scrollToCard(nextCard);
        pulse(nextCard);
      }, reduceMotion ? 0 : 450);
    } else {
      const box = root.querySelector(".path-complete");
      setTimeout(() => {
        scrollToCard(box);
        pulse(box);
      }, reduceMotion ? 0 : 450);
    }
  });

  root.querySelector(".stat-reset").addEventListener("click", () => {
    if (!window.confirm("Clear your progress for the " + r.name + " path?")) return;
    P.reset(slug);
    refresh();
  });

  /* ---------- Interactive demos ---------- */
  root.addEventListener("click", (e) => {
    const launch = e.target.closest(".demo-launch");
    if (launch) {
      const frame = launch.parentElement;
      frame.innerHTML = '<iframe src="' + esc(frame.dataset.demoSrc) + '" title="' + esc(frame.dataset.demoTitle) + '" allow="clipboard-write; fullscreen" allowfullscreen></iframe>';
      frame.classList.add("is-live");
      const full = frame.parentElement.querySelector(".demo-full");
      if (full) full.hidden = false;
      return;
    }
    const full = e.target.closest(".demo-full");
    if (full) {
      const iframe = full.closest(".block-demo").querySelector("iframe");
      if (iframe && iframe.requestFullscreen) iframe.requestFullscreen();
    }
  });

  /* ---------- Navigation ---------- */

  // Table of contents follows the lesson you are reading.
  function spy() {
    let active = cards[0];
    cards.forEach((c) => {
      if (c.getBoundingClientRect().top < window.innerHeight * 0.4) active = c;
    });
    tocLinks.forEach((a) => a.classList.toggle("active", a.dataset.id === active.dataset.id));
  }
  window.addEventListener("scroll", spy, { passive: true });

  function pulse(el) {
    el.classList.remove("pulse");
    void el.offsetWidth;
    el.classList.add("pulse");
  }

  // Supports #lesson-<id> and the older #lesson-<number>.
  function cardFromHash() {
    const m = location.hash.match(/^#lesson-(.+)$/);
    if (!m) return null;
    return document.getElementById("lesson-" + m[1]) || (/^\d+$/.test(m[1]) ? cards[Number(m[1]) - 1] : null);
  }
  function focusLesson() {
    const card = cardFromHash();
    if (!card) return;
    card.classList.add("is-visible");
    setTimeout(() => {
      scrollToCard(card);
      pulse(card);
    }, 120);
  }
  window.addEventListener("hashchange", focusLesson);

  P.touch(slug);
  refresh();
  spy();
  focusLesson();
})();
