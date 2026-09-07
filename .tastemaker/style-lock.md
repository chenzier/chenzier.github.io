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

## Color Contract

- Reuse the tokens in `src/styles/theme.css`.
- Accent is reserved for links, active navigation, heading rules, and progress state.
- Muted foreground is for metadata and inactive table-of-contents items.
- Avoid adding decorative gradients, floating cards, or extra palette families.

## Assets

- Reuse article-owned images from `src/content/posts/images/`.
- No new decorative imagery is required for navigation or utility pages.
