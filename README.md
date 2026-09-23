# SkillSwap – Community Skill Exchange & Learning Network

> **"Share what you know. Learn what you love."**

SkillSwap is a complete, production-quality, responsive web application designed for students and professionals to showcase their skills, find peer learning partners, exchange expertise, set structured learning goals, track daily progress, build learning streaks, unlock achievement badges, and analyze personal development.

---

## 🌟 Key Features

1. **Client-Side LocalStorage Architecture**: Complete offline-first persistent storage without external server dependencies. Data is automatically synchronized and restored across sessions.
2. **Deterministic Skill Matching Engine**: Calculates mutual skill-swap compatibility scores (e.g. 94% Match) with explainable breakdowns (e.g., *"You can teach React while Sarah can teach UI/UX Design"*).
3. **Skill Management System**: Showcase skills offered with proficiency levels and experience, and manage learning wishlist skills with priority tags.
4. **Learning Goals & Milestones Checklist**: Create goals with target completion dates, sub-milestone checklists, and auto-calculated percentage progress (0–100%).
5. **Activity Tracking & Daily Streaks**: Log self-study, practice, and teaching sessions with ratings and notes. Includes daily streak counters (🔥) and active days consistency tracking.
6. **Gamification & Achievements**: Unlock 10+ badges (*First Step, Goal Getter, Consistent Learner, Knowledge Sharer, Skill Explorer, Community Builder, Learning Champion, Skill Master, Dedicated Learner*) accompanied by confetti celebration modals.
7. **Interactive Recharts Analytics**: Interactive line charts for learning hours over time, bar charts for skill progress, pie charts for goal completion, and printable PDF Skill Development Reports.
8. **Connections & Community Network**: Send, accept, reject, or remove connection requests with peer mentors.
9. **Rule-Based Recommendation System**: Receive personalized suggestions for new skills to learn, partners to connect with, goal reminders, and consistency alerts.
10. **Data Export, Import & Backup**: Export state to JSON or printable PDF reports, import JSON backups with validation, and reset data safely.

---

## 🧮 Skill Matching Algorithm

The client-side matching algorithm (`src/services/matchingService.js`) generates deterministic compatibility scores:

1. **Mutual Skill Exchange (Highest Weight - +55%)**: User A teaches $X$ and wants $Y$, while User B teaches $Y$ and wants $X$.
2. **Direct Match (+35% to +40%)**: One user teaches a skill on the other user's wishlist.
3. **Interest Compatibility (+6% per shared tag)**: Shared interest domains (e.g. Programming, Design, Data Science).
4. **Location Bonus (+5%)**: Same geographic region or institution.
5. **Score Range**: Normalized between **35% and 98%** with transparent visual explanations.

---

## 🚀 Technology Stack

- **Frontend Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS animations + Glassmorphism design system
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Gamification FX**: Canvas Confetti
- **Storage**: Browser LocalStorage Abstraction (`storageService.js`)

---

## 📂 Project Structure

```
SkillBridge/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   └── demoData.js             # 20 pre-seeded community profiles
│   ├── services/
│   │   ├── storageService.js       # LocalStorage CRUD & backup abstraction
│   │   ├── matchingService.js      # Mutual skill matching engine
│   │   ├── analyticsService.js     # Streaks & Recharts data calculator
│   │   ├── achievementService.js   # Gamification & confetti trigger
│   │   └── recommendationService.js# Rule-based recommendation engine
│   ├── context/
│   │   ├── AuthContext.jsx         # Authentication & demo session switcher
│   │   └── DataContext.jsx         # Synchronized application state
│   ├── components/
│   │   ├── layout/ (Navbar, Sidebar, MobileNav, Footer)
│   │   ├── ui/ (Modal, Toast, ProgressBar, StatCard, EmptyState, AchievementModal)
│   │   └── cards/ (SkillCard, UserCard, GoalCard, ActivityCard, MatchCard)
│   └── pages/
│       ├── LandingPage.jsx
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       ├── DashboardPage.jsx
│       ├── ProfilePage.jsx
│       ├── PublicProfilePage.jsx
│       ├── SkillManagementPage.jsx
│       ├── ExploreSkillsPage.jsx
│       ├── UserDiscoveryPage.jsx
│       ├── LearningOpportunitiesPage.jsx
│       ├── ConnectionsPage.jsx
│       ├── GoalsPage.jsx
│       ├── GoalDetailPage.jsx
│       ├── ActivityLogPage.jsx
│       ├── HistoryPage.jsx
│       ├── ProgressAnalyticsPage.jsx
│       ├── AchievementsPage.jsx
│       ├── NotificationsPage.jsx
│       └── SettingsPage.jsx
```

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

The application will launch at `http://localhost:5173`.

---

## 🔑 Demo Credentials

SkillSwap is pre-seeded with 20 rich community learner profiles. Instant demo login buttons are provided on the Login page and top Navbar:

- **Demo Learner (Alex Rivera)**:
  - **Email**: `alex@example.com`
  - **Password**: `password123`
- **Demo Professional (Sarah Chen - UI/UX Designer)**:
  - **Email**: `sarah@example.com`
  - **Password**: `password123`

---

## 🔒 Privacy & Data Storage

All data remains 100% private inside your browser's LocalStorage (`skillswap_*` keys). You can export backups at any time from the **Settings & Data** page.
