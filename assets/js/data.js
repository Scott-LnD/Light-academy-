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
  learner: { initials: "KL", name: "Kim Lee" },

  // Path featured in the hero card until the learner starts one.
  defaultPath: "admin",

  getStarted: {
    slug: "get-started",
    eyebrow: "Everyone starts here",
    title: "get started with light",
    summary: "Navigate Light, how the ledger works, your first login",
    courses: [
      { title: "Navigating Light", time: "10 min" },
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
  icon(name) {
    const p = {
      sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
      book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/><path d="m14.5 11 1.5 1.5 3-3"/>',
      receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
      coins: '<path d="M4 15c2 0 3-1 5-1h3a2 2 0 0 1 0 4H9"/><path d="M4 20h9l6-4a2 2 0 0 0-2-3l-4 2"/><circle cx="15" cy="7" r="3"/><path d="M7 5.5 9 4l2 1.5"/>',
      card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
      chart: '<path d="M4 4v16h16"/><path d="m7 15 4-4 3 3 5-6"/>',
      spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
      sparkles: '<path d="M10 3 11.8 8.2 17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8z"/><path d="M18 14v6M15 17h6"/>',
      lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
      check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      play: '<path d="M8 5v14l11-7z"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
      cursor: '<path d="M5 3l14 7-6 2-2 6z"/><path d="m13 12 5 5"/>',
      expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
      pause: '<path d="M8 5v14M16 5v14"/>',
      volume: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
      mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 5 6M22 9l-5 6"/>',
      replay: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v5h5"/>'
    }[name] || "";
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  },
  logoMark() {
    return '<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#111"/><path fill="#fff" d="M7 7h7v11h11v7H7z"/><path fill="#fff" d="M18 7h7v7h-7z"/></svg>';
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
  // The path to feature in the hero card and avatar menu.
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
 * Learner progress, saved in this browser (localStorage).
 * Shape: { paths: { <slug>: [lessonId, ...] }, last: <slug> }
 * Swap these functions for API calls when progress moves to a backend.
 */
window.ACADEMY_PROGRESS = (function () {
  const KEY = "la-progress-v1";
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && typeof d === "object" && d.paths) return d;
    } catch (e) {}
    return { paths: {}, last: null };
  }
  function save(d) {
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
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
      save(d);
    },
    touch(slug) {
      const d = load();
      d.last = slug;
      save(d);
    },
    last() {
      return load().last;
    },
    reset(slug) {
      const d = load();
      if (slug) delete d.paths[slug];
      else d.paths = {};
      save(d);
    }
  };
})();
