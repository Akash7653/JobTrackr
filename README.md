# JobTrackr — Premium Job Application Tracker 💼🚀

A portfolio-grade, commercial-quality SaaS frontend application for organizing, managing, and accelerating your tech career search. Inspired by Linear and Vercel dashboards, JobTrackr provides a keyboard-first, distraction-free environment to track job applications, interviews, compensation offers, and career analytics.

![JobTrackr Dark Theme](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Key Features

### 1. 📊 Executive Dashboard Overview
- **Real-Time Key Metrics**:
  - Total Applications Tracked
  - Applications in Progress (Applied, Assessment, Interview)
  - Scheduled Interview Rounds
  - Offers Received
  - Rejected / Archived Applications
  - Funnel Success Rate (%) & Interview Rate (%)
- **Interactive Visualizations**:
  - **Application Velocity Chart**: Interactive chronological Area Chart with Recharts visualizing application volume and interview milestones.
  - **Pipeline Status Donut Chart**: Hover-interactive breakdown of application distribution across all pipeline stages with dynamic center metric.
- **Upcoming Interviews Widget**: Quick-glance countdown for rounds scheduled in the next 7 days with direct prep links.
- **Recent Activity Feed**: Quick status adjustments and direct drawer deep-dives.

### 2. 🗂️ Application Management
- **Full CRUD Operations**:
  - Add, edit, delete, and inspect complete job application records.
  - 4-step wizard modal (`1. Role & Status`, `2. Salary & Links`, `3. Recruiter & Dates`, `4. Description & Notes`).
  - Validation for required fields, URL schemas, email formats, and salary ranges.
- **Dual Display Modes**:
  - **Table View**: Compact, sortable data grid with checkboxes, inline status changers, and bulk actions.
  - **Grid Card View**: Responsive cards displaying company logos/initials, salary ranges, location badges, and bookmark toggles.
- **Advanced Filtering & Sorting**:
  - Full-text search across company, role, location, recruiter, and notes.
  - Filter by status (`Wishlist`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`).
  - Filter by work mode (`Remote`, `Hybrid`, `Onsite`) and employment type (`Full-time`, `Contract`, `Part-time`, `Internship`).
  - Sort by application date (newest/oldest), company name (A-Z/Z-A), and compensation (highest).
  - Filter by bookmarked / favorites.
  - Batch select and delete with confirmation dialog.

### 3. 📋 Drag-and-Drop Workflow Kanban
- **6 Column Pipeline**:
  1. `Wishlist`
  2. `Applied`
  3. `Assessment`
  4. `Interview`
  5. `Offer` (Triggers celebration confetti on drop!)
  6. `Rejected`
- Powered by `@hello-pangea/dnd` for smooth transitions, accessible keyboard navigation, and drop placeholder styling.
- Quick `+ Add` button directly on each column header pre-filling that column's status.
- Real-time search filter directly above the board.

### 4. 📅 Interview & Milestone Calendar
- Full month grid navigation with `Previous`, `Next`, and `Today` quick jumps.
- Colored milestone badges:
  - 🟣 **Scheduled Interviews** (with exact time & countdown)
  - 🟡 **Take-home / Assessment Deadlines**
  - 🔵 **Follow-up Reminders**
- Category filter pills (`All Milestones`, `Interviews Only`, `Deadlines`, `Follow-ups`).
- Interactive Day Agenda side-pane displaying all events scheduled on the clicked day.

### 5. 📈 Career & Funnel Analytics
- **Recruitment Funnel**: Visual progression tracking conversion rates from Wishlist ➔ Applied ➔ Assessment ➔ Interviews ➔ Offers.
- **Work Mode Intelligence**: Percentage breakdown of Remote vs Hybrid vs Onsite roles.
- **Monthly Velocity**: Historical submission trends and offer timestamps over time.
- **Role Specializations**: Automated extraction of top job categories and target seniorities.
- **Salary Intelligence**: Computes minimum, maximum, median, and average pipeline compensation compared against your target salary goal.

### 6. ⚙️ Settings & Data Portability
- **Candidate Profile**: Configurable name, title, target role, annual target salary, currency preference, and bio.
- **Theme Switcher**: Elegant Dark Theme (Linear-inspired slate `#0A0D14`) and high-contrast Light Theme.
- **Full Data Backup & Restore**:
  - Export entire dataset as formatted JSON.
  - Export applications table as CSV.
  - Import JSON backup with schema verification and error handling.
  - Reset to 12 pre-loaded realistic tech sample applications (Stripe, Linear, Figma, Vercel, Supabase, Datadog, GitHub, Airbnb, Notion, Ramp, Cloudflare, OpenAI).
  - Clear all data with safety confirmation dialog.

### 7. ⌨️ Global Command Palette (`⌘K` / `Ctrl+K`)
- Press `⌘K` or `Ctrl+K` anywhere in the app to open the floating command search.
- Instant search across all applications, companies, roles, and contacts.
- Quick navigation shortcuts to any page and theme switching with arrow key navigation.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Lucide React Icons
- **Routing**: React Router DOM (v6)
- **State Management**: React Context (`JobContext`, `ThemeContext`, `ToastContext`)
- **Animation**: Framer Motion
- **Drag & Drop**: `@hello-pangea/dnd`
- **Charts**: Recharts (Custom SVG tooltips & responsive containers)
- **Micro-interactions**: Canvas Confetti
- **Persistence**: Browser `LocalStorage`

### Project Directory Layout

```
src/
├── components/
│   ├── applications/      # Form modal, detail drawer, filters, card, avatar
│   ├── common/            # Button, Input, Select, Modal, ConfirmDialog, Badge, EmptyState
│   ├── dashboard/         # Metric cards, velocity chart, status chart, widgets
│   ├── kanban/            # Kanban board, columns, draggable cards
│   ├── calendar/          # Monthly calendar grid, agenda drawer
│   └── layout/            # Sidebar, top navbar, command palette, notifications
├── context/               # JobContext, ThemeContext, ToastContext
├── data/                  # 12 Realistic sample tech applications & initial profile
├── pages/                 # Dashboard, Applications, Kanban, Calendar, Analytics, Settings
├── types/                 # Strict TypeScript schemas (job, analytics, user)
├── utils/                 # Currency formatters, date math, CSV/JSON export-import, validators
├── App.tsx                # Application routes and context providers
├── main.tsx               # DOM root mount
└── index.css              # Custom Tailwind directives & theme overrides
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20 LTS)
- npm 9+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# Accessible at http://localhost:5173
```

### Production Build

```bash
# Build optimized production bundle with manual code-chunking
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 Security & Data Privacy
- 100% Client-side: No external backend or API keys required.
- All application records and profile configurations remain private in your browser's `LocalStorage`.
- Robust schema validation on JSON imports prevents corrupted payloads or malformed objects from breaking the application.

---

## 📄 License
MIT License. Built for software engineering portfolio and commercial SaaS design demonstrations.
