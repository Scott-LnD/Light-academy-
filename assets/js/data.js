/*
 * Light Academy content model.
 * Every page reads from here, so paths and lessons live in one place.
 *
 * ADDING A LESSON: add an object to a path's `courses` list, in the order it
 * should appear. Homepage counts, search, the lesson page and progress all
 * pick it up automatically.
 *
 * LESSON FIELDS
 *   title    (required) Shown everywhere.
 *   time     Duration label, e.g. "15–30 min".
 *   id       Optional stable key used for progress and links. Defaults to a
 *            slug of the title. Set it before renaming a lesson so learners
 *            keep their check mark.
 *   url      Optional. Send this lesson to a separate page instead.
 *   content  Optional list of blocks, shown top to bottom. Without it the
 *            lesson shows "video" and "interactive demo" placeholders.
 *
 * CONTENT BLOCKS (see assets/js/lesson.js to add new types)
 *   { type: "video", src: "media/videos/admin/approvals.mp4", poster: "...", title: "...", caption: "..." }
 *       src can also be a YouTube, Vimeo or Loom link. YouTube links play
 *       inside the lesson with Light Academy's own controls (no youtube.com).
 *   { type: "demo", src: "https://app.arcade.software/share/...", title: "...", height: 640 }
 *       Any embeddable interactive demo (Arcade, Storylane, Navattic, Supademo)
 *       or a local page such as "media/demos/admin/approvals/index.html".
 *   { type: "text", html: "<p>Key points...</p>" }
 *
 * Example:
 *   { title: "Approval workflows & guardrails", time: "15–30 min", content: [
 *       { type: "video", src: "media/videos/admin/approvals.mp4" },
 *       { type: "demo", src: "https://app.arcade.software/share/XXXX", title: "Build an approval rule" }
 *   ] }
 *
 * Progress is saved in the learner's browser. A lesson is marked complete
 * only when the learner clicks "Next lesson" (or "Finish path") on it.
 */
window.ACADEMY = {
  // Path featured in the hero card until the learner starts one.
  defaultPath: "admin",

  getStarted: {
    slug: "get-started",
    eyebrow: "Everyone starts here",
    title: "get started with light",
    summary: "Navigate Light, how the ledger works, your first login",
    courses: [
      { title: "Navigating Light", time: "10 min", content: [
          { type: "video", src: "https://youtu.be/2bvYsL-w0lk", title: "Navigating Light" }
      ] },
      { title: "How the ledger works", time: "15 min" },
      { title: "Your first login", time: "5 min" }
    ]
  },

  roles: [
    {
      slug: "admin",
      name: "Admin",
      subtitle: "Admin role",
      icon: "sliders",
      startHere: true,
      description: "Set up and govern Light end to end: entities, users, controls, integrations.",
      courses: [
        { title: "Entities & chart of accounts", time: "15–30 min" },
        { title: "Users, roles & groups", time: "15–30 min" },
        { title: "Approval workflows & guardrails", time: "15–30 min" },
        { title: "Integrations & bank connections", time: "15–30 min" },
        { title: "Security & SSO", time: "15–30 min" },
        { title: "Accounting periods & close calendar", time: "15–30 min" }
      ]
    },
    {
      slug: "controller",
      name: "Controller / Accountant",
      subtitle: "Controller role",
      icon: "book",
      startHere: true,
      description: "Own the books: ledger, reconciliation, reporting, consolidation and the month-end close.",
      courses: [
        { title: "The general ledger", time: "15–30 min" },
        { title: "Bank reconciliation", time: "15–30 min" },
        { title: "The month-end close checklist", time: "15–30 min" },
        { title: "Reporting essentials", time: "15–30 min" },
        { title: "Multi-entity consolidation", time: "15–30 min" }
      ]
    },
    {
      slug: "payables",
      name: "Payables team",
      subtitle: "AP Clerk · Invoice Approver · Vendor Mgmt · Purchase Requester",
      icon: "receipt",
      description: "Everything payables: bills, approvals, payments, vendors.",
      courses: [
        { title: "Capturing & coding bills", time: "15–30 min" },
        { title: "Approval workflows", time: "15–30 min" },
        { title: "Payment runs", time: "15–30 min" },
        { title: "Vendors & purchase orders", time: "15–30 min" }
      ]
    },
    {
      slug: "receivables",
      name: "Receivables team",
      subtitle: "AR Clerk",
      icon: "coins",
      description: "Invoice-to-cash and collections.",
      courses: [
        { title: "Creating & sending invoices", time: "15–30 min" },
        { title: "Cash application", time: "15–30 min" },
        { title: "Credits, ageing & dunning", time: "15–30 min" }
      ]
    },
    {
      slug: "employee",
      name: "Everyday employee",
      subtitle: "Cardholder · Reimbursement",
      icon: "card",
      description: "Just the essentials: file an expense, use your card. About 15 minutes.",
      courses: [
        { title: "Submitting an expense", time: "15–30 min" },
        { title: "Using your corporate card", time: "15–30 min" }
      ]
    },
    {
      slug: "finance-leader",
      name: "Finance leader",
      subtitle: "Report Viewer · Auditor",
      icon: "chart",
      description: "Read the numbers: reports, dashboards, board packs, audit-ready records.",
      courses: [
        { title: "Reading reports & dashboards", time: "15–30 min" },
        { title: "Board packs & audit-ready records", time: "15–30 min" }
      ]
    }
  ],

  certifications: [
    {
      name: "Light Certified Administrator",
      description: "Configure, govern and secure a Light instance for a whole company.",
      role: "admin"
    },
    {
      name: "Light Certified Controller",
      description: "Run the books in Light: ledger, reconciliation, consolidation, close.",
      role: "controller"
    },
    {
      name: "Light Certified User",
      description: "Everyday Light fluency: expenses, cards, invoices and approvals.",
      role: "employee"
    }
  ],

  // Non-role tracks that also get their own lesson page.
  extraPaths: [
    {
      slug: "go-live",
      name: "Go-live",
      icon: "compass",
      eyebrow: "New customer",
      description: "Everything a new customer needs to get from signed contract to a live Light instance.",
      courses: [
        { title: "Kick-off & data checklist", time: "15 min" },
        { title: "Entities & chart of accounts", time: "15–30 min" },
        { title: "Users, roles & approvals", time: "15–30 min" },
        { title: "Banks, cards & integrations", time: "15–30 min" },
        { title: "Opening balances & your first close", time: "15–30 min" }
      ]
    },
    {
      slug: "partners",
      name: "Partner",
      icon: "sparkles",
      eyebrow: "For partners",
      description: "Learn Light once, deploy it across every client. Ends with the Light Certified Advisor credential.",
      courses: [
        { title: "Partner onboarding", time: "15 min" },
        { title: "Multi-client workspace", time: "15–30 min" },
        { title: "Implementation playbooks", time: "15–30 min" },
        { title: "Light Certified Advisor assessment", time: "45 min" }
      ]
    }
  ],

  partners: [
    {
      title: "Light Certified Advisor",
      description: "The credential for partners: configuration, close and reporting across multiple client instances."
    },
    {
      title: "Multi-client workspace",
      description: "Learn how to switch entities, manage client access and standardise your setup playbook."
    },
    {
      title: "Implementation playbooks",
      description: "Step-by-step go-live templates you can reuse on every client engagement."
    }
  ]
};

/* Helpers shared by every page. */
window.ACADEMY_UTIL = {
  // Relative prefix so links work from the site root and from /roles/.
  base() {
    return document.body.dataset.base || "";
  },
  lessonUrl(slug, courseIndex) {
    // A real page set in data.js wins over the built-in placeholder page.
    const role = this.findRole(slug);
    const course = role && courseIndex != null ? role.courses[courseIndex] : null;
    if (course && course.url) return course.url;
    if (role && role.lessonUrl && courseIndex == null) return role.lessonUrl;
    const hash = course ? "#lesson-" + course.id : "";
    return this.base() + "paths/" + slug + ".html" + hash;
  },
  findRole(slug) {
    const A = window.ACADEMY;
    if (slug === A.getStarted.slug) {
      return Object.assign({ name: "Get started", icon: "spark", eyebrow: "Everyone starts here", description: A.getStarted.summary + "." }, A.getStarted);
    }
    return A.roles.find((r) => r.slug === slug) || A.extraPaths.find((r) => r.slug === slug);
  },
  // Minimal line icons (Lucide, ISC licence), 24px grid.
  icon(name) {
    const speaker = '<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6a1.4 1.4 0 0 1-1 .4H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/>';
    const p = {
      sliders: '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
      book: '<path d="M12 21V7"/><path d="m16 12 2 2 4-4"/><path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"/>',
      receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
      coins: '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>',
      card: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
      chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
      spark: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
      sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4M22 5h-4"/>',
      award: '<path d="m15.48 12.89 1.51 8.53a.5.5 0 0 1-.81.47l-3.58-2.69a1 1 0 0 0-1.2 0l-3.59 2.69a.5.5 0 0 1-.81-.47l1.51-8.53"/><circle cx="12" cy="8" r="6"/>',
      lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      check: '<path d="M20 6 9 17l-5-5"/>',
      arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
      search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      play: '<path d="M6 3.9a1 1 0 0 1 1.5-.86l12 7.24a1 1 0 0 1 0 1.72l-12 7.24A1 1 0 0 1 6 18.1z"/>',
      close: '<path d="M18 6 6 18M6 6l12 12"/>',
      compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
      cursor: '<path d="M14 4.1 12 6M5.1 8l-2.9-.8M6 12l-1.9 2M7.2 2.2 8 5.1"/><path d="M9.04 9.69a.5.5 0 0 1 .65-.65l11 4.5a.5.5 0 0 1-.07.95l-4.35 1.04a1 1 0 0 0-.74.74l-1.04 4.35a.5.5 0 0 1-.95.07z"/>',
      expand: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
      pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
      volume: speaker + '<path d="M16 9a5 5 0 0 1 0 6M19.36 18.36a9 9 0 0 0 0-12.72"/>',
      mute: speaker + '<path d="m22 9-6 6M16 9l6 6"/>',
      replay: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
      rewind: '<path d="m11 19-9-7 9-7z"/><path d="m22 19-9-7 9-7z"/>',
      forward: '<path d="m13 19 9-7-9-7z"/><path d="m2 19 9-7-9-7z"/>'
    }[name] || "";
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  },
  // Pixel icons in the style of light.inc ("#" = filled pixel). Used on cards and headers;
  // interface controls keep the line icons above. Unknown names fall back to icon().
  pixel(name) {
    const P = {
      movein: ["....#..#", ".....#.#", "######.#", ".....#.#", "....#..#"],
      connect: ["###....", "#.#....", "#####..", "..#.#..", "..###.."],
      agents: ["#.#...#", "...#...", ".#...#.", "#..#...", "...#.#."],
      report: ["#####", "#....", "####.", "#....", "#####"],
      check: ["......#", ".....#.", "#...#..", ".#.#...", "..#...."],
      frame: ["#######", "#.....#", "#.###.#", "#.###.#", "#.###.#", "#.....#", "#######"],
      lock: ["..###..", ".#...#.", ".#...#.", "#######", "###.###", "###.###", "#######"],
      sliders: ["##.####", ".......", "####.##", ".......", "#.#####"],
      book: ["#######", "#..#..#", "#######", "#..#..#", "#######"],
      receipt: ["######", "#....#", "#.##.#", "#....#", "#.##.#", "#....#", "#.#.#."],
      coins: [".####.", "......", "######", "......", ".####."],
      card: ["#######", "#######", "#.....#", "#.##..#", "#######"],
      chart: ["....#", "..#.#", "..#.#", "#.#.#", "#.#.#"]
    };
    const alias = { spark: "movein", compass: "movein", sparkles: "agents", award: "check" };
    const rows = P[name] || P[alias[name]];
    if (!rows) return this.icon(name);
    const w = Math.max(...rows.map((r) => r.length));
    const h = rows.length;
    let rects = "";
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) if (r[x] === "#") rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    });
    return '<svg class="pixel-icon" viewBox="-0.5 -0.5 ' + (w + 1) + " " + (h + 1) + '" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">' + rects + "</svg>";
  },
  // The Light mark: three blocks on a 3 x 3 grid, drawn in the current text colour.
  logoMark() {
    return '<svg class="logo-mark" viewBox="0 0 3 3" aria-hidden="true" shape-rendering="crispEdges"><rect x="0" y="0" width="1" height="2"/><rect x="2" y="0" width="1" height="1"/><rect x="1" y="2" width="2" height="1"/></svg>';
  },
  slugify(s) {
    return String(s).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  },
  allPaths() {
    const A = window.ACADEMY;
    return [this.findRole(A.getStarted.slug)].concat(A.roles, A.extraPaths);
  },
  // Progress summary for one path: which lessons are done and what is next.
  pathState(slug) {
    const r = this.findRole(slug);
    const doneIds = window.ACADEMY_PROGRESS.done(slug);
    const done = r.courses.filter((c) => doneIds.has(c.id)).length;
    const nextIndex = r.courses.findIndex((c) => !doneIds.has(c.id));
    return {
      role: r,
      doneIds: doneIds,
      done: done,
      total: r.courses.length,
      pct: r.courses.length ? Math.round((done / r.courses.length) * 100) : 0,
      nextIndex: nextIndex,
      started: done > 0,
      complete: r.courses.length > 0 && done === r.courses.length
    };
  },
  // The path to feature in the hero card and the progress button.
  featuredPath() {
    const A = window.ACADEMY;
    const last = window.ACADEMY_PROGRESS.last();
    if (last && this.findRole(last) && !this.pathState(last).complete) return this.pathState(last);
    const order = [A.defaultPath].concat(A.roles.map((r) => r.slug));
    for (const slug of order) {
      const st = this.pathState(slug);
      if (!st.complete) return st;
    }
    return this.pathState(A.defaultPath);
  },
  escape(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
};

/* Give every lesson a stable id (used for progress and #lesson-<id> links). */
(function () {
  const A = window.ACADEMY;
  const U = window.ACADEMY_UTIL;
  [A.getStarted].concat(A.roles, A.extraPaths).forEach((path) => {
    const seen = {};
    path.courses.forEach((c) => {
      let id = c.id || U.slugify(c.title);
      while (seen[id]) id += "-2";
      seen[id] = true;
      c.id = id;
    });
  });
})();

/*
 * Learner progress, saved in this browser (localStorage), so a returning
 * learner sees their check marks and can carry on where they stopped.
 * Shape: { paths: { <slug>: [lessonId, ...] }, lessons: { <slug>: lessonId },
 *          last: <slug>, lastAt: <timestamp> }
 *   paths    lessons marked complete (only by clicking "Next lesson")
 *   lessons  the lesson last opened in each path
 *   last     the path last visited
 * Swap these functions for API calls when progress moves to a backend.
 */
window.ACADEMY_PROGRESS = (function () {
  const KEY = "la-progress-v1";
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && typeof d === "object" && d.paths) {
        d.lessons = d.lessons || {};
        return d;
      }
    } catch (e) {}
    return { paths: {}, lessons: {}, last: null, lastAt: null };
  }
  function save(d) {
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch (e) {}
  }

  // Ask the browser to keep this site's data instead of clearing it when the
  // device runs low on space. Chrome and Edge decide silently based on how much
  // the site is used; Firefox may show a one-time prompt, so this only runs once
  // the learner has actually started learning. Safari ignores it harmlessly.
  let persistAsked = false;
  function keepData() {
    if (persistAsked) return;
    persistAsked = true;
    try {
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persisted().then((already) => {
          if (!already) navigator.storage.persist().catch(() => {});
        });
      }
    } catch (e) {}
  }

  return {
    done(slug) {
      return new Set(load().paths[slug] || []);
    },
    isDone(slug, id) {
      return this.done(slug).has(id);
    },
    complete(slug, id) {
      const d = load();
      const list = d.paths[slug] || [];
      if (list.indexOf(id) < 0) list.push(id);
      d.paths[slug] = list;
      d.last = slug;
      d.lastAt = Date.now();
      save(d);
      keepData();
    },
    // Remember the lesson the learner is on, for "Welcome back".
    setLesson(slug, id) {
      const d = load();
      if (d.lessons[slug] === id && d.last === slug) return;
      d.lessons[slug] = id;
      d.last = slug;
      d.lastAt = Date.now();
      save(d);
    },
    lastLesson(slug) {
      return load().lessons[slug] || null;
    },
    touch(slug) {
      const d = load();
      d.last = slug;
      save(d);
    },
    last() {
      return load().last;
    },
    lastAt() {
      return load().lastAt;
    },
    keepData: keepData,
    reset(slug) {
      const d = load();
      if (slug) {
        delete d.paths[slug];
        delete d.lessons[slug];
      } else {
        d.paths = {};
        d.lessons = {};
      }
      save(d);
    }
  };
})();
