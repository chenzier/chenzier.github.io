# Blog Style Lock

## Direction

- Quiet editorial layout for long-form technical writing.
- Keep the existing blue accent and light/dark theme behavior.
- Prioritize readable line length, clear heading hierarchy, and restrained navigation.

## Layout

- General pages use a maximum width of `56rem`.
- Long posts use a `15rem` table-of-contents rail and a `48rem` reading column on desktop.
- Below `1024px`, the side rail becomes a collapsed in-flow table of contents.
- Wide tables scroll inside the article on small screens and must not widen the document.

## Typography

- UI and prose use the native sans-serif stack with Chinese system fallbacks.
- Code keeps the configured Google Sans Code font.
- Article `h2` headings use a slim accent rule; lower levels remain unboxed.
- Index pages use strong page titles, muted plain-language descriptions, and
  border-separated article rows with date → title → summary hierarchy.

## Home Feed (added 2026-10-09, revised 2026-10-13)

The home page is a split-cover personal journal, followed by the existing
note grid. It is a scoped exception to the reading-page palette. The grid's
surface tokens still come from the Xiaohongshu clone project's theme
(`--primary-color: #ff2442`, page `#f7f7f7`, card `#fff`, border `#ebebeb`)
and live in `src/styles/theme.css` as `--home-*`; see `docs/research/`.

- Surface: page `--home-page` (`#f7f7f7`, dark `#121212`), cards `--home-card`
  (`#fff`, dark `#1e1e1e`), radius `10px`, no shadow, no border on the card.
- `--home-brand` (`#ff2442`) is used sparingly on the home page: name punctuation,
  accent rules and active-tab border. Reading pages keep the blue accent.
- Small accent text uses `--home-brand-text` (`#b71936` light, `#ff6379` dark)
  for readable contrast; muted text is `#6b6b6b` on the light feed surface.
- The first viewport is a single dark ink panel (`#20211f`): oversized author
  name and serif statement on the left, the latest real article cover and
  title on the right. No fake hero image, decorative gradient or extra cards.
- RSS, GitHub and content-derived counts remain in the intro; the featured
  article is removed from the grid below so it appears only once.
- The note grid has an editorial index heading and three destination tabs
  (notes, long-form, trips), avoiding duplicate utility links.
- Grid: 2 columns, 3 from `40rem`, covers `3:4` with `object-fit: cover`.
- Card anatomy: cover → 2-line title → 12px metadata row. Hover uses a small
  lift and image scale, without shadow. Nothing else. No
  likes, followers, or reading time — there is no backend, so none are invented.
- The trip SVG illustrations are used full-bleed here and only here: they are
  gradient art with baked-in captions and only hold up at card size.
- A note with no image falls back to a flat, brand-tinted text cover.

## Trip Notes (added 2026-10-09)

Trip journals use the same note language as the home feed; the WeChat-Moments
timeline (avatar bubbles, nine-grid thumbnails, localStorage likes, "全文"
collapse) is gone.

- `/trips/` lists trip notes with the shared `NoteFeed` grid.
- `/trips/<id>/` is a note page: white card on the feed surface, scroll-snap
  image strip at the journal's natural 1:1 ratio, title, a metadata line
  (series / station / place / photo count), prose, and `#topic` chips.
- Images are not cropped on a note page — the illustration is the content.
- No like button: it wrote to `localStorage`, which is not a metric.

Everything else in this file still governs the reading pages (posts, trips,
about, tags, archives, search).

## Color Contract

- Reuse the tokens in `src/styles/theme.css`.
- Accent is reserved for links, active navigation, heading rules, and progress state.
- Muted foreground is for metadata and inactive table-of-contents items.
- Avoid adding decorative gradients, floating cards, or extra palette families.

## Assets

- Reuse article-owned images from `src/content/posts/images/`.
- No new decorative imagery is required for navigation or utility pages.
