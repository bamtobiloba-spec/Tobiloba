# Discover KW — Local Lifestyle Platform

<div align="center">

![Discover KW](https://img.shields.io/badge/Discover-KW-D4AF37?style=for-the-badge&logoColor=black)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Build](https://img.shields.io/github/actions/workflow/status/bamtobiloba-spec/Tobiloba/ci.yml?style=for-the-badge&label=CI)

**The all-in-one content operations platform for Kitchener-Waterloo's #1 local lifestyle brand.**

[Live Demo](https://bamtobiloba-spec.github.io/Tobiloba/) · [Report Bug](https://github.com/bamtobiloba-spec/Tobiloba/issues/new?template=bug_report.yml) · [Request Feature](https://github.com/bamtobiloba-spec/Tobiloba/issues/new?template=feature_request.yml)

</div>

---

## What is Discover KW?

Discover KW is a local lifestyle and community platform for Kitchener-Waterloo, Ontario. This dashboard is the **internal command centre** — built to manage every aspect of the brand's content, clients, analytics, and media presence from a single, beautifully designed interface.

> Grow the audience first. Monetize with local business packages. Dominate KW.

---

## Features

### 📅 Content Calendar
- **30-day drag-and-drop calendar** — reschedule posts by dragging between days
- Switch between **calendar grid** and **list view**
- Filter by platform (TikTok / Instagram / Facebook), content pillar, and status
- Full post **CRUD** — create, edit, duplicate, delete
- Color-coded by platform and content pillar
- Quick-add posts directly from any calendar cell

### 💼 Business CRM
- Pipeline tracking: **Lead → Pitched → Active Client**
- Live **MRR dashboard** and pipeline value metrics
- All 4 promotional packages tracked with active client counts
- Inline stage changes, search, follow-up dates
- Full client profiles (contact info, Instagram handle, package, notes)

### 📄 Media Kit Generator
- **Printable / PDF-ready** one-page media kit
- Editable platform stats, audience demographics, gender split
- Animated age breakdown bars, content pillar cards
- Complete package pricing table
- Print via browser → **Save as PDF** in one click

### 📊 Analytics Tracker
- Follower growth **area charts** (TikTok, Instagram, Facebook)
- Engagement rate **bar chart** over time
- Weekly data log table with delete per row
- MRR pulled live from CRM active clients

### # Caption & Hashtag Library
- Pre-seeded **hashtag sets** for all 4 content pillars
- **Caption templates** with `[PLACEHOLDER]` fill-in-the-blank format
- **One-click clipboard copy** with visual feedback
- Search and pillar filters across both tabs
- Full CRUD on all sets and templates

---

## Content Pillars

| Pillar | Focus |
|--------|-------|
| 💎 Hidden Gems | KW's best-kept secrets |
| 🆕 New in KW | First looks at new businesses & openings |
| 🌟 KW Life | Local lifestyle, events & community |
| 🏆 Business Spotlight | Featuring local entrepreneurs |

---

## Promotional Packages

| Package | Price | Description |
|---------|-------|-------------|
| Feature Post | $200 | Single dedicated post across all platforms |
| Event Promo | $150 | Event announcement + day-of coverage |
| Video Package | $450 | Short-form video — TikTok + Reels |
| Monthly Spotlight | $650/mo | 4 posts/mo + stories + analytics report |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Drag & Drop | @hello-pangea/dnd |
| Date Utils | date-fns |
| Icons | lucide-react |
| Persistence | localStorage |
| CI/CD | GitHub Actions + GitHub Pages |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/bamtobiloba-spec/Tobiloba.git
cd Tobiloba

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
├── components/
│   ├── Analytics/
│   │   └── AnalyticsTracker.jsx   # Follower growth + engagement charts
│   ├── Calendar/
│   │   └── ContentCalendar.jsx    # 30-day drag-and-drop calendar
│   ├── CRM/
│   │   └── BusinessCRM.jsx        # Lead pipeline + MRR dashboard
│   ├── Layout/
│   │   ├── Header.jsx             # Sticky top bar
│   │   └── Sidebar.jsx            # Nav + mobile drawer
│   ├── Library/
│   │   └── CaptionLibrary.jsx     # Hashtag sets + caption templates
│   ├── MediaKit/
│   │   └── MediaKitGenerator.jsx  # Printable PDF media kit
│   └── shared/
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       └── Select.jsx
├── utils/
│   ├── constants.js               # Platform, pillar, status configs
│   └── storage.js                 # localStorage abstraction + seed data
├── App.jsx
├── index.css
└── main.jsx
```

---

## Brand

| | Value |
|-|-------|
| **Platform** | Discover KW |
| **Handle** | @discoverkw |
| **Region** | Kitchener-Waterloo, Ontario, Canada |
| **Audience** | KW locals & newcomers, 20–45 |
| **Platforms** | TikTok, Instagram, Facebook |
| **Primary Colour** | Gold `#D4AF37` |

---

## Deployment

This app auto-deploys to **GitHub Pages** on every push to `main` via GitHub Actions.

To deploy manually:

```bash
npm run build
# Upload dist/ to your hosting of choice
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, branch naming, and PR guidelines.

---

## Security

See [SECURITY.md](SECURITY.md) for the vulnerability disclosure policy.

---

## License

MIT © [Discover KW](LICENSE)
