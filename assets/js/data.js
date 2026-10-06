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

  // "What's new": Light's Flash product updates (source: Marketing / Flash in
  // Notion and light.inc/blog). Newest first. To add a video, paste its YouTube
  // link into "youtube". Chapters are "m:ss" start times shown under the video.
  flashes: [
    {
      "number": 13,
      "date": "30 Sep 2026",
      "title": "Introducing auto top-up",
      "blog": "https://light.inc/blog/flash-13",
      "youtube": "",
      "summary": "Bring your existing company cards over without replacing them, cards that top themselves up, and vendor screening that runs continuously.",
      "chapters": [
        {
          "t": "0:00",
          "label": "Intro"
        },
        {
          "t": "0:15",
          "label": "Add your cards to Light"
        },
        {
          "t": "0:50",
          "label": "Auto top-up"
        },
        {
          "t": "1:10",
          "label": "Vendor screening"
        },
        {
          "t": "1:30",
          "label": "LCI updates"
        },
        {
          "t": "2:55",
          "label": "Plus, all this"
        }
      ],
      "intro": [
        "Here's what's new in Light over the last two weeks.",
        "You can now watch these Flash updates inside Light, too. Just open notifications in the bottom left of the desktop app."
      ],
      "sections": [
        {
          "title": "LCI updates",
          "paras": [
            "We're constantly improving the Light Command Interface, the LCI, which you probably know best as our chat assistant.",
            "You can now post draft journal entries from the chat, including retrying ones that failed.",
            "The assistant can also answer accounting questions using our help centre and IFRS standards, or find invoices missing a revenue release schedule and apply the right template in bulk. It'll report anything it skips.",
            "We've also added confirmation steps. Before posting or deleting an entry, archiving an invoice or sending a message, it shows you what it's about to do and waits for your approval. That applies in Slack and Teams, too.",
            "Autonomous, but not unsupervised. That distinction matters more the more the assistant is trusted with."
          ]
        },
        {
          "title": "Auto top-up",
          "paras": [
            "Cards running dry mid-month is a solved problem now.",
            "Ask the assistant to create a top-up agent and it'll watch your wallet balance. Set your threshold, and when the balance drops below it, the agent tops it up.",
            "You decide how much rope it gets: alert you, or ask for confirmation in Slack or Teams."
          ]
        },
        {
          "title": "Vendor screening",
          "paras": [
            "Every company pays vendors. Almost nobody checks all of them.",
            "Light now checks vendor VAT numbers against official registries and confirms that the legal name matches the company you're doing business with. It also screens companies and their beneficial owners against global sanctions and PEP lists.",
            "Those checks run at onboarding, whenever details change and on renewal. Sanctions lists move and ownership changes, so a check that only happens once stops being a check."
          ]
        },
        {
          "title": "Add your cards to Light",
          "paras": [
            "Moving finance platforms is hard enough without being told to reissue every company card first.",
            "We've started rolling out support for cards from other providers, including Amex and your bank. So you can bring your existing company cards into Light without replacing them.",
            "Create an external card account, add your cards in the app or by CSV, then import transactions by CSV or through the API.",
            "From there, Light requests receipts, matches and codes the transactions, and posts them to the ledger. They behave the same way cards issued through Light do.",
            "If you're interested, reach out to your Light account or implementation manager."
          ]
        }
      ],
      "plus": [
        {
          "lead": "Sort line items on invoices, credits and contracts.",
          "text": "Click any column header to sort by product, quantity, price and more. Your sort order is remembered and doesn't change the saved order or the PDF."
        },
        {
          "lead": "Declined and voided card transactions now visible.",
          "text": "Filter by status, see the reason, and bulk edit correctly leaves these rows alone."
        },
        {
          "lead": "Email alerts for payment failures.",
          "text": "Available alongside Slack, Teams, mobile and web push in your notification settings."
        },
        {
          "lead": "Map your Stripe tax rates to Light tax codes.",
          "text": "Set the mapping in integration settings and both invoice imports and AP use it rather than inferring from Stripe's own signals."
        },
        {
          "lead": "Faster bills list for high volumes.",
          "text": "Noticeably quicker for companies carrying a lot of bills."
        },
        {
          "lead": "Advanced activity logs.",
          "text": "Every high-level action now writes to a single log, across AP, AR, payments, cards, agents and workflows. So you can see everything one person did, every update in a period, or everything a single agent run touched from start to finish."
        },
        {
          "lead": "NemHandel e-invoicing for Denmark, KID payment references for Norway.",
          "text": "Danish entities can register for NemHandel during entity setup and send OIOUBL invoices and credit notes. Norwegian entities can configure KID payment references in entity settings, and Light calculates the check digits and includes them on sales invoices."
        }
      ],
      "outro": "That's Flash #13. If you have questions, reach out to your Customer Success contact or use the LCI assistant."
    },
    {
      "number": 12,
      "date": "16 Sep 2026",
      "title": "A whole new look",
      "blog": "https://light.inc/blog/flash-12",
      "youtube": "",
      "summary": "A new front door for Light, charts you can hold a conversation with, and self-billing that works in both directions.",
      "chapters": [
        {
          "t": "0:00",
          "label": "Intro"
        },
        {
          "t": "0:15",
          "label": "The new homepage"
        },
        {
          "t": "0:50",
          "label": "Charts in the assistant"
        },
        {
          "t": "1:05",
          "label": "Self-billing, both ways"
        },
        {
          "t": "1:17",
          "label": "Purchase request approvals in Slack and Teams"
        },
        {
          "t": "1:27",
          "label": "Plus, all this"
        }
      ],
      "intro": [
        "Welcome to Flash #12. Here is what our team shipped over the last two weeks.",
        "Before we dive in: last month we presented custom agents. Two weeks later, our customers have built over one hundred custom agents between them, all running on schedules, removing repeated admin tasks. The uptake has been astonishing. Keep building!"
      ],
      "sections": [
        {
          "title": "The new homepage",
          "paras": [
            "We have given the Light product a makeover. Open the desktop app today and the first thing you see is the Light Command Interface, our chat functionality, not a wall of widgets. Everything is permission-filtered, so you only see what you can act on.",
            "Underneath, you'll find digest cards for the things that need your attention. Pending approvals, your agents' latest runs, your recent conversations.",
            "Miss the dashboard overview? Don't worry, it hasn't gone anywhere. There is a toggle in the header and it remembers where you left it. You can always toggle back if that is more your thing.",
            "There is also a new skills page listing everything the assistant can do, so \"what can I ask it?\" finally has a proper answer."
          ]
        },
        {
          "title": "Charts in the assistant",
          "paras": [
            "Ask a question with a shape to it in the LCI, something like spend by vendor this year, and a chart opens alongside the answer. Line, bar, area, pie or a combination.",
            "Ask follow ups in plain language and the same chart updates in place rather than starting over. Narrow it to one entity, switch it to quarters, flip it to a bar.",
            "Each chart is saved, so you can close the thread and pick it up later on any machine. Web only for now."
          ]
        },
        {
          "title": "Self-billing, both ways",
          "paras": [
            "Self-billing is when the buyer writes the invoice instead of the seller. It comes up whenever only the buyer can work out what is owed: a grid operator paying for balancing services, or a battery lease fee calculated on revenue the owner never sees.",
            "Until now a self-billed invoice had to be typed into Light by hand, and there was no way to issue one at all. Both sides now work.",
            "Receiving them. Email a self-billed invoice to your company's sales invoice address, or upload the PDF directly. Light reads it and fills in the customer, dates, terms, reference and line items, matched to your product catalogue. The draft shows the customer's actual PDF rather than our re-render, with a banner flagging anything the scan could not resolve.",
            "Issuing them. A new Create bill button on Bills. Pick the entity and vendor, add your line items, and render it on the new self-billed template, which shows the vendor as issuer and your entity as recipient. That is what makes it valid as the vendor's own invoice. Once approved, Send bill emails it out and tells the vendor they do not need to send one back."
          ]
        },
        {
          "title": "Purchase request approvals in Slack and Teams",
          "paras": [
            "Approvers no longer need to open Light. The request lands carrying everything needed to decide: vendor, description, requester, amount and line items. Approve and Reject buttons sit right there.",
            "Reject asks for a reason. The message then updates in place showing who decided and when, so the thread stays accurate for anyone reading it later."
          ]
        }
      ],
      "plus": [
        {
          "lead": "Self-serve e-invoicing setup.",
          "text": "Adding a network to an entity no longer needs us to do it for you."
        },
        {
          "lead": "Excel exports alongside CSV.",
          "text": "For customers, invoices, contracts and credits."
        },
        {
          "lead": "The activity trail now covers cards.",
          "text": "Creation, limit changes and card requests all join the timeline, and it is exposed on the public API."
        },
        {
          "lead": "Create bills and match bank transactions with the LCI.",
          "text": "Two new tools, live for every company."
        },
        {
          "lead": "Receipt-found notifications for every cardholder.",
          "text": "If the email fetcher matches a receipt to your transaction, you'll be notified."
        }
      ],
      "outro": "That is it for Flash #12. Any questions? Reach out to your Customer Success contact, use the LCI, or head to light.inc/help."
    },
    {
      "number": 11,
      "date": "1 Sep 2026",
      "title": "The App Store is live",
      "blog": "https://light.inc/blog/flash-11",
      "youtube": "",
      "summary": "Hundreds of apps, installed in a click, that keep themselves current. Plus purchase requests open to every employee, reverse and reissue on sent invoices, and contract linking.",
      "chapters": [
        {
          "t": "0:00",
          "label": "Intro"
        },
        {
          "t": "0:10",
          "label": "The Light App Store"
        },
        {
          "t": "0:45",
          "label": "Purchase requests, now open to everyone"
        },
        {
          "t": "1:00",
          "label": "Reverse and reissue a sent invoice"
        },
        {
          "t": "1:12",
          "label": "Link invoices to contracts"
        },
        {
          "t": "1:25",
          "label": "Plus, all this"
        }
      ],
      "intro": [
        "The Light App Store is live for all customers, with hundreds of apps available from launch.",
        "Mileage and per diem across Europe and the US. Payroll for Salary.dk, Zenegy, HiBob, Rippling and hundreds more. Banking connections, audit exports for German and Swedish compliance, FP&A and reporting tools.",
        "An admin installs one in a click. No IT ticket, no deploy request, no waiting on a release cycle. Apps open inside Light with your session and theme carried over, so there is no second login and no new tab. Removing one is just as quick.",
        "Your core Light stays exactly as it is. Apps sit around it and adapt to how your business actually runs. Add what you need, drop what you do not."
      ],
      "sections": [
        {
          "title": "The part we are most pleased with",
          "paras": [
            "Installing an app is the easy bit. Keeping it correct is the work, and that is the part we have taken off your desk.",
            "Mileage rates move. VAT moves. Governments change their minds mid-year. Light watches the official sources for every app, and when a source updates, the app updates with it.",
            "The same applies when something goes wrong. The system detects it, agents fix it, agents verify the fix. Routine repairs ship on their own. Anything critical keeps a human in the loop, reviewed and signed off before it reaches you. When it matters, your app tells you in plain language what happened and what it means for you.",
            "Light monitors the apps, not your data. It records that something failed and where. Never a name, never an amount, never a keystroke. All of it on Light's own European infrastructure."
          ]
        },
        {
          "title": "On security",
          "paras": [
            "An app can only reach Light through our public API, and it carries the token of whoever is using it. An app can never see or do more than the person using it.",
            "Every app declares up front exactly which parts of the API it needs. Anything it did not declare is refused. That declaration is the entire surface area of the app.",
            "Every call an app makes is logged against the app that made it. Apps that store data get their own isolated space, with rules preventing one company's data from being visible to another."
          ]
        },
        {
          "title": "What comes next",
          "paras": [
            "Very soon you will be able to build your own apps and share them with other finance builders.",
            "Which means the value of Light is not only what exists in it today. It is what the platform makes possible next."
          ]
        },
        {
          "title": "Purchase requests, now open to everyone",
          "paras": [
            "Procurement only works when the whole company can use it. Any employee can now raise a purchase request, rather than just admins and designated requesters.",
            "Creators can edit their own requests, and editing a rejected request resubmits it automatically. Approvers and AP staff can view the requests they are involved in without needing a broader viewing role. You can cancel a request together with its linked purchase order, and archive both from the actions menu."
          ]
        },
        {
          "title": "Reverse and reissue a sent invoice",
          "paras": [
            "A sent invoice is no longer stuck once it is issued. Reverse it and Light automatically posts and sends the correcting credit note, then reissues a new editable draft in its place. The dialog shows a preview and lets you edit line details before you confirm.",
            "This also covers the German requirement that an invoice cannot be amended once it has gone to a customer. A new number, a clean audit trail, no manual workaround."
          ]
        },
        {
          "title": "Link invoices directly to contracts",
          "paras": [
            "You can now manually link an existing invoice to a contract, or create a new invoice directly from one, and unlink it later. Contract totals and billing schedules update automatically.",
            "Useful for anything sitting outside the recurrence rules, like a one-off setup fee. And if something needed correcting partway through a contract, the billing schedule no longer suffers for the rest of the term."
          ]
        }
      ],
      "plus": [
        {
          "lead": "Cards auto-freeze when a user is deactivated.",
          "text": "No more remembering to freeze the card of someone who has left."
        },
        {
          "lead": "Drag-fill values across line items.",
          "text": "Spreadsheet-style fill on contracts, invoices, customer credits and journal entries."
        },
        {
          "lead": "Invoice emails now show payments, credits applied and balance due.",
          "text": "Customers see their true outstanding balance without logging in."
        },
        {
          "lead": "Approve vendor card requests from Microsoft Teams.",
          "text": "Including the full decline-reason flow that was previously Slack only."
        },
        {
          "lead": "Contract termination reason tracking.",
          "text": "Categorise why a contract ended, visible on the contract, in CSV exports and via the API."
        },
        {
          "lead": "Singapore payments now route via local GIRO.",
          "text": "Faster and more reliable than international SWIFT."
        }
      ],
      "outro": "That is Flash #11. Reach out to your Light contact, use the LCI, or head to light.inc/help."
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
      chart: ["....#", "..#.#", "..#.#", "#.#.#", "#.#.#"],
      chat: ["#######", "#.....#", "#.#.#.#", "#.....#", "#######", ".##....", ".#....."],
      search: [".###...", "#...#..", "#...#..", "#...#..", ".###...", "....##.", ".....##"],
      mail: ["#######", "##...##", "#.#.#.#", "#..#..#", "#######"]
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
