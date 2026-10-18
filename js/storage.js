/* ===================================================================
   StudyVerse — Storage & State Management
   LocalStorage synchronization, Schema migrations, Demo Data Seeding
   =================================================================== */

const StorageKeys = {
  USER: 'studyverse_user',
  TASKS: 'studyverse_tasks',
  STATS: 'studyverse_stats',
  QUIZ_HISTORY: 'studyverse_quiz_history',
  BADGES: 'studyverse_badges',
  FOCUS_HISTORY: 'studyverse_focus_history',
  SETTINGS: 'studyverse_settings'
};

const StorageManager = {
  // Check if initial run or missing data
  init() {
    if (!localStorage.getItem(StorageKeys.USER)) {
      this.seedDemoData();
    } else {
      // Check streak validity based on real date
      this.verifyDailyStreak();
    }
  },

  // Seed realistic sample data
  seedDemoData() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const threeDaysLater = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

    const demoUser = {
      name: 'Alex Sharma',
      avatar: '🎓',
      course: 'BCA (Artificial Intelligence & Data Science)',
      targetExam: 'AI & Data Structures University Finals',
      examDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0], // 6 days from now
      dailyGoalHours: 3.5,
      theme: 'light',
      soundEnabled: true
    };

    const demoTasks = [
      {
        id: 'task-1',
        title: 'Master Graph Algorithms & Dijkstra Traversal',
        subject: 'Data Structures',
        deadline: today,
        time: '18:00',
        priority: 'high',
        status: 'pending',
        notes: 'Implement adjacency matrix and shortest path algorithm in Python.'
      },
      {
        id: 'task-2',
        title: 'Train Convolutional Neural Network on CIFAR-10',
        subject: 'Machine Learning',
        deadline: tomorrow,
        time: '16:00',
        priority: 'high',
        status: 'pending',
        notes: 'Experiment with dropout layers and Adam optimizer learning rate.'
      },
      {
        id: 'task-3',
        title: 'Solve Discrete Mathematics Recurrence Relations',
        subject: 'Mathematics',
        deadline: today,
        time: '20:30',
        priority: 'medium',
        status: 'completed',
        notes: 'Chapter 4 problems 12 to 25. Master theorem applications.'
      },
      {
        id: 'task-4',
        title: 'Python List Comprehensions & Generator Expressions',
        subject: 'Python',
        deadline: yesterday,
        time: '14:00',
        priority: 'low',
        status: 'completed',
        notes: 'Reviewed memory efficiency of generators vs lists.'
      },
      {
        id: 'task-5',
        title: 'Prepare Technical Presentation on LLMs & Attention',
        subject: 'AI & ML',
        deadline: threeDaysLater,
        time: '11:00',
        priority: 'medium',
        status: 'pending',
        notes: 'Draft 10 slides explaining Multi-Head Attention mechanisms.'
      }
    ];

    const demoStats = {
      xp: 680,
      streak: 5,
      lastActiveDate: today,
      activeDays: [twoDaysAgo, yesterday, today],
      weeklyHours: [2.5, 3.0, 4.0, 2.5, 3.5, 1.5, 0.0] // Mon - Sun
    };

    const demoQuizHistory = [
      {
        id: 'qh-1',
        subject: 'Python',
        score: 5,
        total: 5,
        percentage: 100,
        date: yesterday,
        xpAwarded: 95
      },
      {
        id: 'qh-2',
        subject: 'Computer Science',
        score: 4,
        total: 5,
        percentage: 80,
        date: twoDaysAgo,
        xpAwarded: 70
      }
    ];

    const demoBadges = [
      { id: 'first_step', unlocked: true, unlockedAt: twoDaysAgo },
      { id: 'quiz_novice', unlocked: true, unlockedAt: twoDaysAgo },
      { id: 'quiz_prodigy', unlocked: true, unlockedAt: yesterday },
      { id: 'streak_flame', unlocked: true, unlockedAt: today },
      { id: 'focus_pioneer', unlocked: true, unlockedAt: yesterday },
      { id: 'task_master', unlocked: false, unlockedAt: null },
      { id: 'century_club', unlocked: true, unlockedAt: today },
      { id: 'polymath', unlocked: false, unlockedAt: null },
      { id: 'deep_work', unlocked: false, unlockedAt: null },
      { id: 'study_legend', unlocked: false, unlockedAt: null }
    ];

    const demoFocusHistory = [
      { id: 'foc-1', date: yesterday, minutes: 50, subject: 'Python', taskId: 'task-4' },
      { id: 'foc-2', date: today, minutes: 25, subject: 'Data Structures', taskId: 'task-1' }
    ];

    localStorage.setItem(StorageKeys.USER, JSON.stringify(demoUser));
    localStorage.setItem(StorageKeys.TASKS, JSON.stringify(demoTasks));
    localStorage.setItem(StorageKeys.STATS, JSON.stringify(demoStats));
    localStorage.setItem(StorageKeys.QUIZ_HISTORY, JSON.stringify(demoQuizHistory));
    localStorage.setItem(StorageKeys.BADGES, JSON.stringify(demoBadges));
    localStorage.setItem(StorageKeys.FOCUS_HISTORY, JSON.stringify(demoFocusHistory));
  },

  // Check and calculate streak
  verifyDailyStreak() {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (!stats.lastActiveDate) {
      stats.lastActiveDate = today;
      stats.streak = 1;
      stats.activeDays = [today];
      this.saveStats(stats);
      return;
    }

    if (stats.lastActiveDate === today) {
      // Already active today
      return;
    }

    if (stats.lastActiveDate === yesterday) {
      // Streak continues!
      // When user performs action today, increment streak
    } else {
      // Streak broken if gap is > 1 day
      const last = new Date(stats.lastActiveDate).getTime();
      const diffDays = Math.round((new Date(today).getTime() - last) / (86400000));
      if (diffDays > 1) {
        stats.streak = 1; // Reset to 1
        this.saveStats(stats);
      }
    }
  },

  // Register today's activity for streak
  recordActivityToday() {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (!stats.activeDays) stats.activeDays = [];

    if (!stats.activeDays.includes(today)) {
      stats.activeDays.push(today);
      if (stats.lastActiveDate === yesterday) {
        stats.streak = (stats.streak || 0) + 1;
      } else if (stats.lastActiveDate !== today) {
        stats.streak = 1;
      }
      stats.lastActiveDate = today;
      this.saveStats(stats);
      
      // Check for streak badges
      if (window.RewardsManager) {
        window.RewardsManager.checkStreakBadges(stats.streak);
      }
    }
  },

  // User Get/Set
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(StorageKeys.USER)) || {};
    } catch {
      return {};
    }
  },

  saveUser(user) {
    localStorage.setItem(StorageKeys.USER, JSON.stringify(user));
  },

  // Tasks Get/Set
  getTasks() {
    try {
      return JSON.parse(localStorage.getItem(StorageKeys.TASKS)) || [];
    } catch {
      return [];
    }
  },

  saveTasks(tasks) {
    localStorage.setItem(StorageKeys.TASKS, JSON.stringify(tasks));
  },

  // Stats Get/Set
  getStats() {
    try {
      return JSON.parse(localStorage.getItem(StorageKeys.STATS)) || { xp: 0, streak: 1, weeklyHours: [0,0,0,0,0,0,0] };
    } catch {
      return { xp: 0, streak: 1, weeklyHours: [0,0,0,0,0,0,0] };
    }
  },

  saveStats(stats) {
    localStorage.setItem(StorageKeys.STATS, JSON.stringify(stats));
  },

  // Quiz History
  getQuizHistory() {
    try {
      return JSON.parse(localStorage.getItem(StorageKeys.QUIZ_HISTORY)) || [];
    } catch {
      return [];
    }
  },

  saveQuizHistory(history) {
    localStorage.setItem(StorageKeys.QUIZ_HISTORY, JSON.stringify(history));
  },

  // Badges
  getBadges() {
    try {
      return JSON.parse(localStorage.getItem(StorageKeys.BADGES)) || [];
    } catch {
      return [];
    }
  },

  saveBadges(badges) {
    localStorage.setItem(StorageKeys.BADGES, JSON.stringify(badges));
  },

  // Focus History
  getFocusHistory() {
    try {
      return JSON.parse(localStorage.getItem(StorageKeys.FOCUS_HISTORY)) || [];
    } catch {
      return [];
    }
  },

  saveFocusHistory(history) {
    localStorage.setItem(StorageKeys.FOCUS_HISTORY, JSON.stringify(history));
  },

  // Export all application data as JSON
  exportData() {
    const exportBundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      tasks: this.getTasks(),
      stats: this.getStats(),
      quizHistory: this.getQuizHistory(),
      badges: this.getBadges(),
      focusHistory: this.getFocusHistory()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `studyverse_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Import JSON backup
  importData(jsonContent) {
    try {
      const data = JSON.parse(jsonContent);
      if (data.user) this.saveUser(data.user);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.stats) this.saveStats(data.stats);
      if (data.quizHistory) this.saveQuizHistory(data.quizHistory);
      if (data.badges) this.saveBadges(data.badges);
      if (data.focusHistory) this.saveFocusHistory(data.focusHistory);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Complete Clear All Data
  clearAllData() {
    localStorage.removeItem(StorageKeys.USER);
    localStorage.removeItem(StorageKeys.TASKS);
    localStorage.removeItem(StorageKeys.STATS);
    localStorage.removeItem(StorageKeys.QUIZ_HISTORY);
    localStorage.removeItem(StorageKeys.BADGES);
    localStorage.removeItem(StorageKeys.FOCUS_HISTORY);
    localStorage.removeItem(StorageKeys.SETTINGS);
  }
};
