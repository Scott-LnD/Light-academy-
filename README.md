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
- **Start / Resume path** and every **course row** open `paths/<slug>.html#lesson-<n>`.
- **Progress card** and the avatar menu resume the next lesson in progress.
- **Get started banner** opens `paths/get-started.html`.
- **New customer? See the go-live path** opens `paths/go-live.html`.
- **Certification cards** open the matching role path. **Partner cards** and **Become a Light partner** open `paths/partners.html`.
- **Search courses** (or press `/` or `Ctrl+K`) finds any course and jumps to it.
- **Take the tour** walks through the homepage step by step. It is offered automatically on a first visit.

## Integrating the real lesson pages

Pick whichever fits:

1. **Replace the file.** Overwrite `paths/<slug>.html` with the real page. Homepage links keep working.
2. **Point elsewhere.** In `assets/js/data.js`, set `lessonUrl` on a role, or `url` on a course,
   and every link to it follows.
3. **Fill the slots.** Each lesson on a path page renders
   `<div class="lesson-slot" data-lesson-slot="<slug>/<n>">`. Put lesson content in there.

## Motion

Staggered hero headline, animated progress ring, scroll-reveal sections, sliding nav indicator
with scroll spy, scroll progress bar, role-to-path panel transitions, cursor glows, magnetic
buttons, tilting certification cards, and a spotlight walkthrough tour. All motion is turned off
for visitors who prefer reduced motion.
