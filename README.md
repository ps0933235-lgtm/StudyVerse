# StudyVerse — Your Smart Student Universe 🎓✨
> **"Plan Smart. Learn Better. Achieve More."**

An all-in-one, modern, interactive student productivity and gamified learning platform built as an academic portfolio project for BCA (Artificial Intelligence & Data Science / Machine Learning) students.

Designed to deliver a SaaS-grade educational experience combining the best elements of Notion, Duolingo, Forest, and Khan Academy.

---

## 🌟 Key Features

### 1. 🏠 Home Dashboard
- **Dynamic Welcome Banner**: Greets the student with personalized name, academic stream (`BCA AI & ML`), date, and rotating inspirational quote.
- **Academic Metrics**: Real-time counters for Tasks Completed vs Total, Active Study Streak, Lifetime XP Points, and Weekly Focus Hours.
- **Live Exam Countdown Widget**: Real-time ticking countdown (Days, Hours, Minutes, Seconds) for upcoming semester exams.
- **Today's Priority Task Checklist**: Interactive study tasks with quick-complete checkboxes and immediate XP rewards.
- **AI Study Copilot Recommendations**: Dynamic rule-based recommendations analyzing upcoming exams and recent quiz scores.

### 2. 📅 Smart Study Planner
- **Full Task Lifecycle (CRUD)**: Add, edit, delete, mark complete/pending.
- **Metadata Fields**: Subject tags, Priority levels (High, Medium, Low), Deadlines, Target times, and Sub-topic notes.
- **Advanced Filtering**: Filter by Status (*All, Pending, Completed*), Subject, and Priority; full-text search.
- **Dual View Modes**:
  - **Cards / List View**: Modern responsive cards with deadline urgency badges (*Due Today*, *Overdue*).
  - **Weekly Timetable View**: 7-day Monday–Sunday visual grid mapping scheduled study slots.
- **Data Persistence**: Automatically synchronized with browser `localStorage`.

### 3. 🎯 Quiz Arena
- **Subject Coverage**:
  - 🐍 **Python Programming** (Data structures, list comprehensions, generators, decorators, OOP)
  - 🤖 **Computer Science & AI/ML** (Algorithms, complexity, neural networks, activation functions)
  - 📐 **Mathematics for CS** (Discrete math, probability, Bayes Theorem, matrices)
  - 📚 **English & Verbal Reasoning** (Grammar, vocabulary, analogies, comprehension)
  - 🌍 **General Knowledge & Tech Trivia** (Computing history, Turing test, Moore's law)
- **Interactive Player**: Single-question focus, 4 options with keyboard/click support, countdown timer pill.
- **Instant Visual Feedback**: Correct answer turns emerald green, incorrect turns crimson red, with smooth slide-down concept breakdown.
- **Anti-Exploit Gamification**: Prevents infinite XP farming via repeated identical attempts while awarding practice XP.
- **Scorecard & Detailed Review**: Final percentage, XP breakdown, and question-by-question explanations.

### 4. ⏱️ Focus Timer (Pomodoro Engine)
- **Real-Time Countdown**: Genuine countdown timer (not fake static countdowns).
- **Session Modes**: Focus (25m), Short Break (5m), and Long Break (15m).
- **Circular SVG Progress**: Smoothly depleting animated SVG progress ring with gradient strokes.
- **Link to Study Tasks**: Associate any focus interval with a specific task from your Study Planner.
- **Synthesized Ambient Noise (Web Audio API)**:
  - 🌧️ Synthesized Gentle Rain
  - 💨 Pink/White Noise
  - 🧠 Binaural 10Hz Alpha Focus Beats
  - *100% self-contained using browser audio nodes; zero external MP3s required.*
- **Automatic Reward Sync**: Awards +25 XP upon completion, logs focus minutes, and increments weekly study hours.

### 5. 🏆 Rewards & Gamification
- **XP & Level Progression Ladder**:
  - Level 1: Novice Scholar (0–199 XP)
  - Level 2: Knowledge Seeker (200–449 XP)
  - Level 3: Code Apprentice (450–749 XP)
  - Level 4: Algorithm Ace (750–1199 XP)
  - Level 5: Data Sage (1200–1799 XP)
  - Level 6: AI Mastermind (1800–2499 XP)
  - Level 7: Studyverse Legend (2500+ XP)
- **Daily Study Streak Tracker**: Tracks consecutive days of activity with 7-day flame history dots.
- **Badges Gallery**: 12 unlockable achievement badges with interactive detail modals and celebration confetti.

### 6. 📊 My Progress & Analytics
- **Visualizations powered by Chart.js**:
  1. **Weekly Study Hours (Bar Chart)**: Hours logged Mon–Sun with indigo-purple gradient bars.
  2. **Quiz Accuracy Trend (Line Chart)**: Smooth spline curve showing performance over time.
  3. **Task Distribution by Subject (Doughnut Chart)**: Visual workload breakdown.
  4. **Subject Mastery & Accuracy (Horizontal Bar Chart)**: Average scores across courses.
- **Automated Performance Insights**: Identifies top-performing subjects, weak areas, and peak productivity days.

### 7. ✨ AI Study Copilot (Future-Ready Architecture)
- **Smart Notes Summarizer**: Extractive heuristic NLP engine that condenses lengthy study text into core bullet takeaways and key terminology.
- **AI Note-to-Quiz & Flashcards**: Automatically extracts conceptual statements and generates interactive multiple-choice questions.
- **Personalized Exam Roadmap**: Analyzes target exam countdown and pending tasks to synthesize a balanced study schedule.
- **API-Ready**: Designed with clean hooks ready for seamless Gemini 2.0 or OpenAI API integration.

### 8. ⚙️ Settings & Customization
- **Student Profile**: Customize full name, degree course, target exam title, exam date, and choose from 6 avatars.
- **Theme Switcher**: Instant toggle between **Lavender Light** and **Cyber Dark** mode.
- **Audio Preferences**: Toggle Web Audio sound effects and chimes.
- **Data Portability**:
  - `Export Data (JSON)`: Download full backup file.
  - `Import Backup (JSON)`: Restore any existing backup.
  - `Reload Demo Data`: Repopulate realistic sample data for academic presentations.
  - `Reset All Data`: Clean slate with confirmation prompt.

---

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5 with accessibility considerations (`role`, `aria-label`).
- **Styling**: Vanilla CSS3 with CSS Custom Properties, flexbox, CSS grid, and glassmorphism.
- **Interactivity**: Clean, modular Vanilla JavaScript (ES6+).
- **Visualizations**: Chart.js (`vendor/chart.umd.min.js`).
- **Icons**: Lucide icons & Unicode iconography.
- **Celebrations**: Canvas Confetti (`vendor/confetti.browser.min.js`).
- **Audio**: Web Audio API (real-time synthesized chimes, alarms, and white noise).
- **Offline First**: All vendor libraries are bundled locally in `vendor/` — the app works **100% offline without internet**.

---

## 🚀 How to Run Locally

You do not need Node.js, Python, or npm installed to run StudyVerse.

### Option 1: Direct Browser Launch (Simplest)
1. Navigate to the project folder:
   ```
   StudyVerse/
   ```
2. Double-click on `index.html` to open it in Google Chrome, Microsoft Edge, Brave, or Firefox.

### Option 2: Local Web Server (PowerShell)
If you prefer running through `http://localhost:8080/`:
1. Open PowerShell in the project directory.
2. Run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\start-server.ps1
   ```
3. The server will start and automatically open your default browser at `http://localhost:8080/`.

---

## 📂 Project Architecture

```
StudyVerse/
├── index.html              # Main single-page application structure
├── start-server.ps1        # Optional local PowerShell HTTP server launcher
├── README.md               # Complete project documentation
├── css/
│   ├── main.css            # Design tokens, variables, typography, reset, themes
│   ├── components.css      # Cards, buttons, badges, modals, toasts, inputs
│   ├── layout.css          # Collapsible sidebar, header, mobile bottom nav
│   └── pages.css           # Page styling (Dashboard, Planner, Quiz, Pomodoro, etc.)
├── js/
│   ├── app.js              # Master controller, routing, modals, toasts, exam timer
│   ├── storage.js          # LocalStorage sync, migrations, export/import, demo data
│   ├── audio.js            # Web Audio API chimes, fanfares, and ambient sound
│   ├── tasks.js            # Study planner: CRUD, filters, search, timetable view
│   ├── quiz.js             # Quiz Arena: question bank, timer, feedback, scoring
│   ├── timer.js            # Pomodoro countdown, circular SVG ring, task linking
│   ├── rewards.js          # XP system, levels, streaks, badges, confetti
│   ├── analytics.js        # Chart.js rendering, dynamic updates, smart insights
│   └── ai-assistant.js     # Notes summarizer, note-to-quiz, exam roadmap
└── vendor/
    ├── chart.umd.min.js    # Chart.js library (bundled locally for offline access)
    ├── confetti.browser.min.js # Confetti animation script
    └── lucide.min.js       # Lucide icons library
```

---

## 🎓 Academic Presentation Tips
- **For demonstrating functionality**: Click on `Settings` -> `Reload Demo Data` anytime to populate realistic sample study tasks, quiz records, streak history, and charts.
- **For demonstrating responsive design**: Open Chrome DevTools (`F12`), toggle device mode (`Ctrl+Shift+M`), and test the app on mobile (iPhone/Pixel) to showcase the bottom navigation dock and drawer menu.
- **For demonstrating theme support**: Click the moon/sun icon in the top header or visit `Settings` to switch between Light and Dark themes.

---

*Built with passion for BCA AI & ML academic excellence.* 🚀
