# Drop of Hope – Website Redesign Prompt (look and feel only)

> **How to use:** Open the project that already has `frontend/`, `backend/` and `database/`. Attach this file to your VS Code AI agent and say:
> *"Read DropOfHope_Redesign_Prompt.md fully. Do Phase A (audit) and show me the report. Do not change any file until I say 'next'."*
> Keep the backend running so you can test every page while the agent works.

---

## ROLE

You are a senior UI designer and frontend engineer. **Redesign the look and feel of the existing Drop of Hope frontend** so it is colourful, modern, eye-catching and very easy to use, while **everything that works today keeps working exactly as it does now**.

### Hard rules (do not break these)
1. **Look only.** Do not change behaviour, API calls, endpoints, request/response handling, route names, page file names, enum values, validation logic, role guards or i18n keys. Do not touch `backend/` or `database/`.
2. **Do not break the JavaScript.** Before renaming or removing any CSS class, element `id`, `name`, `data-*` attribute or ARIA attribute, search all of `frontend/js/` for it. Keep every hook the scripts use. If a rename is truly needed, change the HTML and the JS together and list it in the report.
3. **No new frameworks or build tools.** Keep HTML, CSS, Bootstrap 5.3.3 and vanilla JavaScript. Allowed additions: Google Fonts, inline SVG, and small vanilla JS for presentation only (theme switch, scroll reveal, count-up).
4. **Keep what already works:** English and Kannada text, text-size controls, responsive layouts, keyboard access, the printable donor certificate and `frontend/dev/api-check.html` (it must stay all green).
5. **No hard-coded colours, fonts, radii or shadows outside `css/theme.css`.** Everything else uses CSS variables.
6. **Accessibility stays:** WCAG AA contrast in light and dark modes, visible focus rings, `prefers-reduced-motion` respected, and colour is never the only signal (badges keep icon and text).
7. **Update the existing README in place** (section D). Do not create a second README.
8. Medical wording stays unchanged: "potential donors", "reported stock", and the disclaimer.

---

## PHASE A – AUDIT (read-only)

Run the site and open every page at **360 px, 768 px and 1280 px**, in light mode. Produce a report with:
1. A list of all pages and shared components, and which CSS files style them.
2. The current design tokens (colours, fonts, radii, shadows, spacing).
3. The **top 10 visual problems** (for example weak hierarchy, flat colour, cramped spacing, inconsistent buttons, dull empty states, plain tables).
4. A list of CSS classes, ids and data attributes that JavaScript depends on (these are the "do not break" list).
5. Pages that need structural HTML changes (not just CSS) and why.
6. Any hard-coded colours or inline styles to clean up.
**Stop and wait for "next".**

---

## 1. DESIGN DIRECTION

**Mood:** hopeful, energetic, trustworthy and human. Bold colour and friendly shapes on clean surfaces. Urgent where it matters (emergency actions), calm everywhere else.

### Theme presets (switchable by one attribute)
Implement design tokens as CSS variables with two presets and a dark mode, selected by `data-preset` and `data-mode` on `<html>`. Default: `sunrise`, light.

| Token | **Sunrise** (default, colourful) | **Calm Care** (clean medical) |
|---|---|---|
| Primary | `#E11D48` crimson-rose | `#0F766E` deep teal |
| Primary dark | `#BE123C` | `#115E59` |
| Accent 1 | `#F97316` orange | `#6366F1` indigo |
| Accent 2 | `#FBBF24` amber | `#E11D48` (reserved for blood and urgent only) |
| Hero gradient | `135deg, #E11D48 → #F97316 → #FBBF24` | `135deg, #0F766E → #6366F1` |
| Page background | `#FFF8F6` | `#F5FAFA` |
| Surface | `#FFFFFF` | `#FFFFFF` |
| Ink | `#1F1417` | `#0F1B1F` |
| Success / Current | `#15803D` on `#DCFCE7` | same |
| Needs confirmation | `#B45309` on `#FFF1D6` | same |
| Urgent | `#C2410C` on `#FFEDD5`; Critical `#B91C1C` | same |

Dark mode (both presets): background `#150C0F` (Sunrise) or `#0B1416` (Calm Care), surface one step lighter, ink `#FBEFF0`, with all badge and text colours re-tuned for contrast.

Add a small **appearance menu** in the navbar (palette icon) with Preset (Sunrise / Calm Care) and Mode (Light / Dark / Auto). Save the choice in `localStorage` and apply it before first paint to avoid a flash. Respect the OS dark-mode setting when Mode is Auto.

### Typography
- Headings: **Poppins** (or Plus Jakarta Sans) 600/700. Body: **Inter** 400/500/600. Kannada: **Noto Sans Kannada** through `:lang(kn)`.
- Fluid scale with `clamp()`: hero title 40–64 px, section titles 28–40 px, body 16–17 px. Generous line height (1.6 body, 1.15 headings).

### Shape, depth and motion
- Radius: 16 px cards, 24 px hero panels, pill buttons and chips. Layered soft shadows (two layers, low opacity), never harsh black.
- Surfaces: subtle gradient borders on featured cards, glass-effect navbar (backdrop blur, fallback to solid).
- Motion (CSS only, `transform` and `opacity`): scroll-reveal on home sections (IntersectionObserver), card lift on hover, button press effect, count-up on dashboard numbers, gently floating hero drop, pulsing Critical badge, skeleton shimmer. **All motion off under `prefers-reduced-motion`.**
- Icons: Bootstrap Icons everywhere, shown inside coloured rounded **icon tiles** (gradient background, white glyph).

---

## 2. COMPONENT RESTYLE (apply everywhere)

- **Buttons:** primary = gradient fill with a soft glow shadow and press effect; secondary = outline; ghost; destructive. A distinct **Emergency** button style (I NEED BLOOD) that is larger and slightly pulsing.
- **Forms:** floating or clearly spaced labels, 48 px tall inputs, 12–14 px radius, thick focus ring in the primary colour, friendly inline error text with an icon, password show/hide, input icons.
- **Blood-group selector:** large tappable drop-shaped chips in a responsive grid; selected state is a filled gradient with a check.
- **Badges:** Available (green, check), Contact me first (amber, chat), Unavailable (grey, slash), Current (green dot), Needs confirmation (amber warning, softened card), Verified (blue-green tick), Urgency Normal / Urgent / Critical, request status colours. Same shapes and icons across the site.
- **Cards:** consistent padding, optional coloured top accent, hover lift. Donor and blood-bank result cards get a large blood-group badge, clear hierarchy (name, location, badges, freshness line) and a prominent but tidy action row.
- **Timeline stepper:** coloured connected nodes with icons, animated progress fill, a red end state for Cancelled, vertical layout on mobile.
- **Tables:** zebra rows and sticky header on desktop; **stacked cards on mobile**.
- **Modals, toasts, tabs, accordions, pagination, dropdowns:** restyled to match, with smooth open/close and clear focus handling.
- **Empty, loading and error states:** friendly inline SVG illustrations, one clear action, and skeleton shimmer instead of spinners where possible.
- **Navbar and sidebar:** glass navbar with the new logo lockup; dashboards get an icon sidebar (off-canvas on mobile) with an active-item highlight, plus a top bar with the notification bell and avatar-initials circle.
- **Footer:** rich, tidy footer with brand, quick links, language switcher, disclaimer and a gradient top edge.
- **Charts (Chart.js):** use the theme palette, rounded bars, soft grid lines, readable legends and dark-mode aware colours.

---

## 3. PAGE-BY-PAGE LOOK

**Home (make it the showpiece)**
1. **Hero:** full-width gradient with a soft mesh or blob background, large headline, supporting line, two big CTAs (I NEED BLOOD in white or solid with pulse, I WANT TO DONATE as glass outline), the floating blood-drop illustration with a ripple, and trust chips. The **Quick Emergency Search card** overlaps the hero's bottom edge with the blood-group chips and city/PIN field.
2. **Emergency strip** in a calm warning tone.
3. **How it works:** two-tab section with numbered, colour-coded steps connected by a line.
4. **Why Drop of Hope:** a **bento grid** of cards (Current, Verified, Private plus a sample "Example result" card showing the badges), each with a coloured icon tile.
5. **Built for everyone:** three tall role cards with illustrations and buttons.
6. **Blood donation basics:** icon cards and a colour-coded compatibility table.
7. **FAQ:** clean accordion.
8. **CTA band** with gradient background, then the footer.

**Search:** sticky filter bar with a coloured top edge; two result panels with count pills; "Best match" ribbon on the top donor; clear "Needs confirmation" softening; disclaimer as a friendly info banner.

**Login and register:** split screen (colourful illustration side and clean form side). Registration role tabs with icons and a stepper-style progress for longer forms.

**Dashboards (donor, patient, blood bank, admin):** stat cards with gradient icon tiles and count-up, a large availability card with three big toggle buttons for donors, colour-coded stock tiles for blood banks (zero, low, healthy), request cards with the new timeline, and admin charts in cards.

**Notifications:** coloured type icons, unread dot and highlight, tidy grouping by day.

**Certificate:** elegant printable design (border, seal, serif accent), unchanged print behaviour.

---

## 4. IMPLEMENTATION RULES

- Organise CSS into `theme.css` (tokens and presets), `base.css` (reset and typography), `components.css`, `pages.css`, `utilities.css`. Remove dead CSS.
- New shared JavaScript is presentation only, in `js/ui-effects.js` (theme switch, scroll reveal, count-up). Existing page scripts keep their logic.
- Illustrations are hand-made inline SVG (drop, hands, heart, empty-state scenes) kept in `assets/` or reused inline; no raster images over 100 KB, and lazy-load anything below the fold.
- Keep each page's layout stable while loading (no content jumping), and keep total page weight small.
- Use the same spacing scale and component classes everywhere; no one-off inline styles.

---

## PHASE B–F (after "next", stop after each phase and wait)

- **Phase B – Foundation:** tokens and presets, typography, base styles, appearance menu, buttons, forms, badges, cards, modals, toasts, skeletons, empty states, logo lockup.
- **Phase C – Public pages:** home, search, login, register, 404.
- **Phase D – Donor and patient pages.**
- **Phase E – Blood bank, admin and notifications, charts, certificate.**
- **Phase F – Polish and QA:** contrast check in both presets and both modes, 360/768/1280 px review of every page, keyboard pass, reduced-motion pass, Kannada pass, print check, Lighthouse accessibility score of 90 or higher on key pages.

---

## D. README UPDATE (existing file, in place)

Update the **Frontend** section of the existing `README.md`; do not create a new README or delete other sections. Add:
1. **Design system:** the tokens table for both presets, fonts, radii, shadows and motion rules.
2. **How to switch theme:** the appearance menu and the `data-preset` / `data-mode` attributes, and how to add a new preset.
3. **CSS file map** and the "do not break" rule about classes and ids used by JavaScript.
4. **Accessibility notes** (contrast, reduced motion, focus, text size).
5. Update the project-structure tree with the new CSS and JS files.
6. Keep all earlier run and troubleshooting steps, and confirm they still work.

---

## DEFINITION OF DONE

- Every page uses the new design in both presets and in light and dark mode, at 360, 768 and 1280 px.
- No API call, route, enum, validation rule or i18n key changed, and `dev/api-check.html` is still all green.
- No console errors, no broken buttons or forms, and every JS-dependent class and id still works.
- No hard-coded colours outside `theme.css`.
- Contrast meets WCAG AA, focus rings are visible, and reduced-motion is respected.
- The home page is a polished showpiece with a hero, quick search, bento features, how-it-works, FAQ and footer.
- The existing README is updated in place and its commands still work.
- The final report lists every HTML or JS file touched and why.
