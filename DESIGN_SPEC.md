# Lia Landing Page Design Spec

## Color Palette
- **Primary** `#6B7B61` → CSS token: `--primary`
- **Accent** `#D65353` → CSS token: `--accent`
- **Sand** `#EFE7DD` → CSS token: `--sand`
- **Ink** `#2F2A26` → CSS token: `--ink`
- Supporting colors:
  - Base white for cards/backgrounds: `#FFFFFF`
  - Section tint: `var(--primary)/5`
  - Soft overlay: `bg-white/70`
  - Accent usage: metric numbers, CTA buttons, highlight dots.
  - Links hover state: keep text color, apply `hover:text-[--accent]` and optional underline.

## Background & Gradients
- Page background: `bg-[--sand]`
- Hero gradient stack:
  ```text
  radial-gradient(80% 60% at 50% 20%, var(--sand), transparent),
  radial-gradient(60% 40% at 80% 10%, var(--accent)15, transparent),
  radial-gradient(60% 40% at 20% 10%, var(--primary)20, transparent)
  ```

## Typography
- Base font: system sans-serif (Inter/UI sans stack)
- Color logic:
  - Body text: `text-[--ink]`
  - Secondary copy: `text-black/70`
  - Captions/hints: `text-black/50`
- Type scale (mobile → desktop):
  - **H1**: `text-4xl` → `text-5xl`, `font-semibold`, `leading-tight`
  - **H2**: `text-3xl` → `text-4xl`, `font-semibold`
  - **H3**: `text-2xl` → `text-3xl`
  - **Body**: `text-[17px]`, `leading-7`
  - **List/secondary**: `text-sm`, `leading-6`
  - **Caption**: `text-xs`
  - Highlight phrases: `font-medium` or `text-[--accent]`

## Layout Structure
1. **Announcement Bar** – fixed top, countdown strip.
2. **Navbar** – brand, section links, ENG/KOR toggle, CTA.
3. **Hero** – left copy/CTAs, right mini dashboard card (2-column grid).
4. **Features** – three cards (Hormone prep → Empathy chatbot → CBT quests). `md:grid-cols-3`.
5. **Metrics** – four metrics, `grid-cols-2` → `md:grid-cols-4`, section background `bg-[--primary]/5`.
6. **Explainer** – two cards (HRT, CBT) `md:grid-cols-2`.
7. **Founder** – text + profile card `md:grid-cols-3` (2:1 split).
8. **Community** – YouTube blurb + CTA `md:grid-cols-3` (2:1).
9. **Pricing** – four inactive cards `md:grid-cols-4`.
10. **Stories** – two testimonial cards `md:grid-cols-2`.
11. **Waitlist** – text + form `md:grid-cols-2`, background `bg-[--sand]`.
12. **Contact** – single column info block.
13. **Footer** – accent top bar + three column grid (`md:grid-cols-3`).

## Button Styles
- **Primary CTA** (e.g., waitlist submit):
  - `bg-[--accent]`, `hover:bg-[--accent]/90`
  - `text-white font-semibold`
  - Size: `h-12 px-7`, `rounded-2xl`, `shadow-md`
- **Secondary CTA** (outline):
  - `bg-white border border-[--accent]`
  - `text-[--accent] hover:bg-[--accent]/10`
- **Language toggle**: capsule container `bg-black/5 p-0.5`; active button `bg-white shadow font-semibold`; inactive `text-black/70`.

## Card Styles
- Shared: `rounded-3xl`, `border border-black/5`, base `bg-white` (or `bg-white/70`).
- Feature/explainer icons: capsule `h-10 w-10 rounded-2xl bg-[--sand]`, icon color `text-[--primary]`.
- Metric tiles: `ring-1 ring-[--accent]/20`, numbers `text-[--accent]`, `hover:shadow-md`.
- Founder profile card: image `aspect-[4/3] rounded-xl overflow-hidden bg-[--sand]`.
- Stories cards: italic quote, author caption `text-xs text-black/50`.

## Shadows & Corners
- Cards: `shadow-sm`, hover `shadow-md`.
- Buttons: `shadow-md` for emphasized CTAs.
- Radii: cards `rounded-3xl`, buttons/inputs `rounded-2xl`, chips `rounded-full`/`rounded-xl`.

## Form Pattern (Waitlist)
- Inputs stacked vertically (name + email).
- Inputs `rounded-2xl`.
- Consent row: `Checkbox` + `Label` with `text-sm text-black/70`.
- Submit button: accent solid, fallback inline style `style={{ backgroundColor: 'var(--accent)' }}`.
- Current submission is prevented (`e.preventDefault()`); integrate provider later.

## Icons & Imagery
- Icons via `lucide-react`.
  - Hero chips: `Shield`, `Clock`
  - Features: `Pill`, `HeartHandshake`, `Brain`, `LineChart`, `Sparkles`
  - Waitlist button: custom paper-plane SVG
- Founder photo placeholder: `https://placehold.co/800x600?text=Founder+Photo` (replace with actual 1200×900, 4:3).

## Motion / Interactions
- Section entry: `framer-motion` `fadeUp` (opacity + translateY).
- Smooth scroll to waitlist: `scrollIntoView({ behavior: 'smooth' })`.
- Countdown hook (`useCountdown`) updates every second.

## Additional Assets Needed
- Brand logo (light/dark variants).
- Founder profile image.
- Privacy Policy / Terms pages for footer links.
- Waitlist integration endpoint (Mailchimp/Brevo/Sheets etc.) with success/error messaging (ENG/KOR).
- Optional: YouTube thumbnail, app screenshots/wireframes.

