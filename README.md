# Light Academy

Homepage and learning-path pages for Light Academy, the customer learning academy for Light.
Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run it

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly, or deploy the folder to any static host.

## Structure

```
index.html            Homepage: hero, how it works, get started, role picker, certifications, get help, FAQ
paths/<slug>.html     One lesson page per path (placeholders, to be integrated later)
assets/js/data.js     All content: roles, courses, progress, certifications
assets/js/common.js   Header, footer, course search, scroll progress, reveal motion, tour engine
assets/js/home.js     Homepage behaviour
assets/js/lesson.js   Lesson page template shared by every path
assets/css/styles.css All styles
```

Path slugs: `get-started`, `admin`, `controller`, `payables`, `receivables`,
`employee`, `finance-leader`, `go-live`.

## Click path

- **Choose your role** scrolls to the role grid.
- **Role card** expands in place to show that role's lessons; the other roles slide below it. Click outside the card (or press Esc) to close it. Deep link: `index.html#role-payables`.
- **Start / Resume path** and every **course row** open `paths/<slug>.html#lesson-<lesson-id>`.
- **Progress card** and the **progress button** (the small ring at the top right) open the lesson you were last on, or the next unfinished one. The button also links to your certifications.
- **Get started banner** opens `paths/get-started.html`.
- **New customer? See the go-live path** opens `paths/go-live.html`.
- **Certification cards** open the matching role path.
- **Get help** links to in-app help at app.light.inc, the Help Center (light.inc/help) and help@light.inc. External links open in a new tab.
- **Search courses** (or press `/` or `Ctrl+K`) finds any course and jumps to it.
- **Take the tour** walks through the homepage step by step. It is offered automatically on a first visit.

## Progress and check marks

A lesson is marked complete **only when the learner clicks "Next lesson"** (or
"Finish path" on the last lesson). Opening a lesson, jumping to it from the
sidebar or watching the video does not tick it. The check mark then shows in the
"In this path" sidebar, on the lesson card, in the homepage path panel, the hero
progress card, the progress button at the top right and the certification badges.

Progress is saved in the learner's browser (`localStorage`), so returning learners keep their check marks.
A **Continue where you left off** bar at the top of every page links to the lesson they were last on, and after their first completed
lesson the site asks the browser to keep this data (`navigator.storage.persist()`) rather than clearing it
when the device runs low on space. Each path page has a
"Reset progress" link. To move progress to a backend later, replace the functions
in `window.ACADEMY_PROGRESS` at the bottom of `assets/js/data.js`.

## Adding lessons, videos and interactive demos

Everything lives in `assets/js/data.js`; the comment at the top documents every field.

- **Add a lesson:** add `{ title, time }` to a path's `courses` list. Counts,
  search, links and progress update automatically. Saved progress is keyed by
  lesson id (a slug of the title), so inserting or reordering lessons never moves
  anyone's check marks. Set an explicit `id` before renaming a lesson.
- **Add media:** give the lesson a `content` list of blocks, shown top to bottom:
  - `{ type: "video", src, poster, title, caption }`: an MP4 in `media/videos/`, or a YouTube, Vimeo or Loom link.
    YouTube links play inside the lesson box in Light Academy's own player (`assets/js/yt-player.js`):
    YouTube's title, logo, "Watch on YouTube" link and suggested videos are hidden or covered, so learners
    stay on the site. The YouTube video must be **Public or Unlisted** with **Allow embedding** turned on.
    A `?t=90` on the link starts the video at 90 seconds.
  - **Keyboard, for every lesson video (YouTube and MP4):** Left / Right skip back / forward 5 seconds,
    Up / Down change the volume by 10%, J / L skip 10 seconds, M mutes, F goes full screen, and Space or K
    plays / pauses when the video has focus. The keys control the video you last played while it is on
    screen; elsewhere the arrow keys scroll the page as normal.
  - `{ type: "demo", src, title, height }`: an Arcade, Storylane, Navattic or Supademo link, or a local page in `media/demos/`. It loads when the learner clicks it and can go full screen.
  - `{ type: "text", html, title }`: notes, key points, steps.
  Lessons without `content` show a video and a demo placeholder.
- **New block types** (quiz, checklist, download): add a renderer to `BLOCKS` in `assets/js/lesson.js`.
- **Separate lesson pages:** set `url` on a lesson, or `lessonUrl` on a path, to link somewhere else instead.

See `media/README.md` for file layout and size limits.

## Look and feel

Styled after light.inc on a dark `#212121` background: centered sections with a small orange uppercase
label, a serif heading, a larger subheading and an orange text link; columns sit under a thin top line;
the certifications section is a full-width black band. Lucide line icons in orange, the Light block logo
(`logoMark()` in `assets/js/data.js`), no hover glows, and buttons that grow very slightly on hover.

**Moving diagrams** (`assets/js/iso.js`): add `<div class="iso" data-iso="blocks"></div>` for the rising
orange blocks, or `data-iso="ledger"` for the grid whose cells light up. They animate only while on
screen and stay still for visitors who prefer reduced motion.

**Fonts** are set in one place, at the top of `assets/css/styles.css`:

```css
--font-display: "Newsreader", ...;  /* headings and the wordmark (serif) */
--font-body: "DM Sans", ...;        /* text, labels, buttons */
```

To use Light's exact brand fonts, change those two lines and the Google Fonts `<link>` in `index.html`
and `paths/*.html` (or add `@font-face` rules for self-hosted font files).
