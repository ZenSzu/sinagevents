# Sinag Events — Website

Official website for **Sinag Events**, a creative studio in Doha, Qatar for video production, studio rentals, creative direction, podcasting, photography, and live event production.

## 🗂 Project structure

```
sinag-events/
├── index.html          # Single-page site: hero, overview, services, events, contact
├── css/
│   └── style.css        # All styling — colors, type, layout, animation
├── js/
│   └── script.js         # Mobile menu, scroll reveals, WhatsApp/map interactions
├── assets/
│   └── logo.png           # Sinag Events logo (gold on transparent/white)
└── README.md
```

## 🎨 Design system

| Token | Value | Use |
|---|---|---|
| `--black` | `#0a0908` | Page background |
| `--black-panel` | `#17140f` | Section panels (events banner) |
| `--gold` / `--gold-bright` / `--gold-light` | `#c9973f` / `#e7bd63` / `#f3d788` | Accents, links, headings |
| `--cream` | `#f4ecd8` | Primary text on black |
| `--cream-dim` | `#cfc4a6` | Secondary/body text |

**Type**
- **Space Mono** — body copy, labels, nav, buttons (matches the studio's own brand collateral/typewriter aesthetic).
- **Cormorant Garamond (italic)** — headings and the one "script" accent, echoing the logo's cursive swoosh.

## ✨ Features

- Fully responsive (mobile burger menu, fluid type/grid)
- Animated gold "shooting star" trail in the hero (echoes the logo mark)
- Scroll-reveal transitions on section content
- Embedded interactive Google Map pinned to the studio's location
- One-tap **WhatsApp** click-to-chat (phone number `+974 3304 3148`), including a floating action button
- Facebook & Instagram links with inline icons
- Respects `prefers-reduced-motion`
- No build step — plain HTML/CSS/JS, works from any static host

## 🚀 Running locally

No build tools required. Just open `index.html` in a browser, or serve it locally:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## 🌐 Deploying with GitHub

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Set **Source** to the `main` branch, root folder (`/`).
4. Your site will publish at `https://<your-username>.github.io/<repo-name>/`.

Alternatively deploy for free on **Netlify** or **Vercel** by connecting the same GitHub repo — no configuration needed since this is a static site.

## ✏️ Editing content

- **Text**: edit directly in `index.html` (overview, services list, events copy, contact details).
- **Colors/fonts**: edit the `:root` variables at the top of `css/style.css`.
- **Map location**: update the `src` on the `<iframe>` inside the `#contact` section, or the `map-directions` link, if the studio address changes.
- **Phone/WhatsApp**: the number is used in `https://wa.me/974XXXXXXXX` links in three places — nav CTA, contact block, and the floating button.

## 📄 License

© Sinag Events. All rights reserved.
