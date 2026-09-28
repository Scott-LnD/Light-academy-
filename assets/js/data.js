/*
 * Light Academy content model.
 * Every page reads from here, so roles, courses and progress live in one place.
 * When the real lesson pages are ready, point `lessonUrl` (per role) or
 * `url` (per course) at them and the homepage links follow automatically.
 */
window.ACADEMY = {
  learner: { initials: "KL", name: "Kim Lee" },

  // Shown in the hero progress card.
  inProgress: { role: "admin", percent: 40, label: "Foundation complete" },

  getStarted: {
    slug: "get-started",
    eyebrow: "Everyone starts here",
    title: "get started with light",
    summary: "Navigate Light, how the ledger works, your first login",
    status: "completed",
    courses: [
      { title: "Navigating Light", time: "10 min", status: "completed" },
      { title: "How the ledger works", time: "15 min", status: "completed" },
      { title: "Your first login", time: "5 min", status: "completed" }
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
        { title: "Entities & chart of accounts", time: "15–30 min", status: "completed" },
        { title: "Users, roles & groups", time: "15–30 min", status: "completed" },
        { title: "Approval workflows & guardrails", time: "15–30 min", status: "next" },
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
      status: "in-progress",
      role: "admin"
    },
    {
      name: "Light Certified Controller",
      description: "Run the books in Light: ledger, reconciliation, consolidation, close.",
      status: "locked",
      role: "controller"
    },
    {
      name: "Light Certified User",
      description: "Everyday Light fluency: expenses, cards, invoices and approvals.",
      status: "locked",
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
    const hash = courseIndex != null ? "#lesson-" + (courseIndex + 1) : "";
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
      compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'
    }[name] || "";
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  },
  logoMark() {
    return '<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#111"/><path fill="#fff" d="M7 7h7v11h11v7H7z"/><path fill="#fff" d="M18 7h7v7h-7z"/></svg>';
  },
  escape(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
};
