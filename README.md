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
index.html            Homepage: hero, get started, role picker, certifications, partners
paths/<slug>.html     One lesson page per path (placeholders, to be integrated later)
assets/js/data.js     All content: roles, courses, progress, certifications, partners
assets/js/common.js   Header, footer, course search, scroll progress, reveal motion, tour engine
assets/js/home.js     Homepage behaviour
assets/js/lesson.js   Lesson page template shared by every path
assets/css/styles.css All styles
```

Path slugs: `get-started`, `admin`, `controller`, `payables`, `receivables`,
`employee`, `finance-leader`, `go-live`, `partners`.

## Click path

- **Choose your role** scrolls to the role grid.
- **Role card** selects that role and shows its path panel (deep link: `index.html#role-payables`).
- **Start / Resume path** and every **course row** open `paths/<slug>.html#lesson-<lesson-id>`.
- **Progress card** and the avatar menu open the next unfinished lesson of the path you were last on.
- **Get started banner** opens `paths/get-started.html`.
- **New customer? See the go-live path** opens `paths/go-live.html`.
- **Certification cards** open the matching role path. **Partner cards** and **Become a Light partner** open `paths/partners.html`.
- **Search courses** (or press `/` or `Ctrl+K`) finds any course and jumps to it.
- **Take the tour** walks through the homepage step by step. It is offered automatically on a first visit.

## Progress and check marks

A lesson is marked complete **only when the learner clicks "Next lesson"** (or
"Finish path" on the last lesson). Opening a lesson, jumping to it from the
sidebar or watching the video does not tick it. The check mark then shows in the
"In this path" sidebar, on the lesson card, in the homepage path panel, the hero
progress card, the avatar menu and the certification badges.

Progress is saved in the learner's browser (`localStorage`). Each path page has a
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
  - `{ type: "demo", src, title, height }`: an Arcade, Storylane, Navattic or Supademo link, or a local page in `media/demos/`. It loads when the learner clicks it and can go full screen.
  - `{ type: "text", html, title }`: notes, key points, steps.
  Lessons without `content` show a video and a demo placeholder.
- **New block types** (quiz, checklist, download): add a renderer to `BLOCKS` in `assets/js/lesson.js`.
- **Separate lesson pages:** set `url` on a lesson, or `lessonUrl` on a path, to link somewhere else instead.

See `media/README.md` for file layout and size limits.

## Motion

Staggered hero headline, animated progress ring, scroll-reveal sections, sliding nav indicator
with scroll spy, scroll progress bar, role-to-path panel transitions, cursor glows, magnetic
buttons, tilting certification cards, and a spotlight walkthrough tour. All motion is turned off
for visitors who prefer reduced motion.
