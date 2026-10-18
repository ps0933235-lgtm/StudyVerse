/* ===================================================================
   StudyVerse — Master Application Controller
   Navigation, Routing, Modals, Toasts, Theme Engine, and Live Timers
   =================================================================== */

const App = {
  currentPage: 'dashboard',
  examTimerInterval: null,
  quotes: [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Consistency is what transforms average into excellence.", author: "Anonymous" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" }
  ],

  init() {
    // 1. Initialize Storage
    StorageManager.init();

    // 2. Set Theme
    this.applyTheme(StorageManager.getUser().theme || 'light');

    // 3. Bind Global Navigation & UI
    this.bindNavigation();
    this.bindSidebar();
    this.bindSettings();

    // 4. Update Header & User Profile
    this.updateHeaderProfile();
    this.updateHeaderStats();

    // 5. Start Live Exam Countdown
    this.startExamCountdown();

    // 6. Set Daily Quote
    this.setDailyQuote();

    // 7. Initialize Sub-Managers
    if (window.TasksManager) TasksManager.init();
    if (window.QuizManager) QuizManager.init();
    if (window.TimerManager) TimerManager.init();
    if (window.RewardsManager) RewardsManager.renderBadgesSection();
    if (window.AnalyticsManager) AnalyticsManager.init();
    if (window.AIAssistant) AIAssistant.init();

    // Initialize Lucide icons if loaded
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    // Default route
    this.navigateTo('dashboard');
  },

  // Page Routing & Navigation
  navigateTo(pageId) {
    const validPages = ['dashboard', 'planner', 'quiz', 'rewards', 'analytics', 'pomodoro', 'ai-copilot', 'settings'];
    if (!validPages.includes(pageId)) pageId = 'dashboard';

    this.currentPage = pageId;

    // Switch section display
    document.querySelectorAll('.page-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`section-${pageId}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    // Update Sidebar Navigation state
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Mobile Bottom Nav state
    document.querySelectorAll('.mobile-nav-link').forEach(item => {
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Header Title & Breadcrumb
    const pageTitles = {
      dashboard: { title: 'Home Dashboard', subtitle: 'Overview of your academic universe' },
      planner: { title: 'Smart Study Planner', subtitle: 'Organize, schedule, and track assignments' },
      quiz: { title: 'Quiz Arena', subtitle: 'Practice multiple-choice questions & earn XP' },
      rewards: { title: 'Rewards & Achievements', subtitle: 'Level progression, study streaks, and badges' },
      analytics: { title: 'My Progress & Analytics', subtitle: 'Visualize study hours, quiz scores, and subject mastery' },
      pomodoro: { title: 'Focus Timer', subtitle: 'Deep work sessions with custom Pomodoro intervals' },
      'ai-copilot': { title: 'StudyVerse AI Copilot', subtitle: 'Smart notes summarizer, auto quiz generator, and study planner' },
      settings: { title: 'Settings & Profile', subtitle: 'Personalize your profile, theme, and data preferences' }
    };

    const headerTitleElem = document.getElementById('header-page-title');
    const headerSubtitleElem = document.getElementById('header-page-subtitle');
    if (headerTitleElem && pageTitles[pageId]) {
      headerTitleElem.textContent = pageTitles[pageId].title;
    }
    if (headerSubtitleElem && pageTitles[pageId]) {
      headerSubtitleElem.textContent = pageTitles[pageId].subtitle;
    }

    // Trigger page-specific refreshes
    if (pageId === 'dashboard') {
      if (window.TasksManager) TasksManager.syncDashboard();
      if (window.AIAssistant) AIAssistant.renderDashboardRecommendations();
    } else if (pageId === 'planner') {
      if (window.TasksManager) TasksManager.renderTasks();
    } else if (pageId === 'rewards') {
      if (window.RewardsManager) RewardsManager.renderBadgesSection();
    } else if (pageId === 'analytics') {
      if (window.AnalyticsManager) AnalyticsManager.refreshAllCharts();
    } else if (pageId === 'pomodoro') {
      if (window.TimerManager) TimerManager.populateTaskDropdown();
    } else if (pageId === 'settings') {
      this.populateSettingsFields();
    }

    // Close mobile drawer if open
    this.closeMobileSidebar();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  bindNavigation() {
    // Desktop sidebar links
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page) this.navigateTo(page);
      });
    });

    // Mobile bottom nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page) this.navigateTo(page);
      });
    });

    // Brand link
    const brandLink = document.getElementById('brand-home-link');
    if (brandLink) {
      brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('dashboard');
      });
    }
  },

  bindSidebar() {
    // Desktop collapse toggle
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const appRoot = document.getElementById('app-root');
    if (toggleBtn && appRoot) {
      toggleBtn.addEventListener('click', () => {
        appRoot.classList.toggle('sidebar-collapsed');
      });
    }

    // Mobile hamburger toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (mobileMenuBtn && sidebar && overlay) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
      });

      overlay.addEventListener('click', () => {
        this.closeMobileSidebar();
      });
    }
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
  },

  // Update Header & User Profile Data
  updateHeaderProfile() {
    const user = StorageManager.getUser();
    const name = user.name || 'Alex Sharma';
    const avatar = user.avatar || '🎓';
    const course = user.course || 'BCA (AI & ML)';

    // Sidebar
    const userAvatarElem = document.getElementById('sidebar-user-avatar');
    const userNameElem = document.getElementById('sidebar-user-name');
    const userRoleElem = document.getElementById('sidebar-user-role');

    if (userAvatarElem) userAvatarElem.textContent = avatar;
    if (userNameElem) userNameElem.textContent = name;
    if (userRoleElem) userRoleElem.textContent = course;

    // Header avatar
    const headerAvatarElem = document.getElementById('header-user-avatar');
    if (headerAvatarElem) headerAvatarElem.textContent = avatar;

    // Dashboard Welcome
    const dashWelcomeTitle = document.getElementById('dash-welcome-title');
    if (dashWelcomeTitle) {
      dashWelcomeTitle.textContent = `Welcome back, ${name.split(' ')[0]}!`;
    }
  },

  updateHeaderStats() {
    const stats = StorageManager.getStats();
    const streakElem = document.getElementById('header-stat-streak');
    const xpElem = document.getElementById('header-stat-xp');

    if (streakElem) streakElem.textContent = `${stats.streak || 1} 🔥`;
    if (xpElem) xpElem.textContent = `${stats.xp || 0} XP`;

    // Dashboard stats cards
    const dashStreak = document.getElementById('dash-stat-streak');
    const dashXP = document.getElementById('dash-stat-xp');
    const dashHours = document.getElementById('dash-stat-hours');

    if (dashStreak) dashStreak.textContent = `${stats.streak || 1} Days`;
    if (dashXP) dashXP.textContent = `${stats.xp || 0} XP`;
    if (dashHours) {
      const totalHours = (stats.weeklyHours || []).reduce((a, b) => a + b, 0).toFixed(1);
      dashHours.textContent = `${totalHours} hrs`;
    }
  },

  // Live Exam Countdown Timer
  startExamCountdown() {
    if (this.examTimerInterval) clearInterval(this.examTimerInterval);

    const updateCountdown = () => {
      const user = StorageManager.getUser();
      const examName = user.targetExam || 'End-Term AI & DS Exams';
      const examDateStr = user.examDate || new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0];

      const examTitleElem = document.getElementById('dash-exam-title');
      const examDateDisplayElem = document.getElementById('dash-exam-date-display');
      if (examTitleElem) examTitleElem.textContent = examName;
      if (examDateDisplayElem) {
        examDateDisplayElem.textContent = new Date(examDateStr + 'T09:00:00').toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }

      // Calculate diff
      const targetTime = new Date(examDateStr + 'T09:00:00').getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysElem = document.getElementById('dash-cd-days');
      const hoursElem = document.getElementById('dash-cd-hours');
      const minsElem = document.getElementById('dash-cd-mins');
      const secsElem = document.getElementById('dash-cd-secs');

      if (daysElem) daysElem.textContent = String(days).padStart(2, '0');
      if (hoursElem) hoursElem.textContent = String(hours).padStart(2, '0');
      if (minsElem) minsElem.textContent = String(minutes).padStart(2, '0');
      if (secsElem) secsElem.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    this.examTimerInterval = setInterval(updateCountdown, 1000);
  },

  // Daily Quote
  setDailyQuote() {
    const quoteElem = document.getElementById('dash-welcome-quote');
    if (!quoteElem) return;

    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const selected = this.quotes[dayOfYear % this.quotes.length];
    quoteElem.textContent = `"${selected.text}" — ${selected.author}`;
  },

  // Theme Management (Light vs Dark)
  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const user = StorageManager.getUser();
    user.theme = theme;
    StorageManager.saveUser(user);

    // Update settings theme radio/cards
    const themeCards = document.querySelectorAll('.theme-card-option');
    themeCards.forEach(c => {
      if (c.getAttribute('data-theme-value') === theme) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });

    // Update header theme toggle button icon
    const themeBtn = document.getElementById('header-theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '<span>☀️</span>' : '<span>🌙</span>';
      themeBtn.title = theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme';
    }

    // Refresh charts colors
    if (window.AnalyticsManager && window.AnalyticsManager.charts.weeklyHours) {
      setTimeout(() => AnalyticsManager.refreshAllCharts(), 50);
    }
  },

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.showToast('Theme Changed', `Switched to ${newTheme === 'dark' ? 'Cyber Dark' : 'Lavender Light'} theme.`, 'info', newTheme === 'dark' ? '🌙' : '☀️');
  },

  // Settings Management
  bindSettings() {
    // Header theme toggle button
    const themeToggleBtn = document.getElementById('header-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Settings Profile Form
    const profileForm = document.getElementById('settings-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProfileSettings();
      });
    }

    // Avatar Selection
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        avatarOptions.forEach(o => o.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
      });
    });

    // Theme card options in settings
    const themeCardOptions = document.querySelectorAll('.theme-card-option');
    themeCardOptions.forEach(card => {
      card.addEventListener('click', (e) => {
        const theme = e.currentTarget.getAttribute('data-theme-value');
        this.applyTheme(theme);
      });
    });

    // Sound effects switch
    const soundSwitch = document.getElementById('settings-sound-toggle');
    if (soundSwitch) {
      soundSwitch.addEventListener('change', (e) => {
        const user = StorageManager.getUser();
        user.soundEnabled = e.target.checked;
        StorageManager.saveUser(user);
        this.showToast('Audio Preference', `Sound effects ${user.soundEnabled ? 'enabled' : 'disabled'}.`, 'info', '🔊');
      });
    }

    // Export Data Button
    const exportBtn = document.getElementById('settings-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        StorageManager.exportData();
        this.showToast('Export Complete', 'Downloaded studyverse_backup.json to your computer.', 'success', '💾');
      });
    }

    // Import Data Button & File Input
    const importFileInput = document.getElementById('settings-import-file');
    const importBtn = document.getElementById('settings-import-btn');

    if (importBtn && importFileInput) {
      importBtn.addEventListener('click', () => importFileInput.click());

      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          const res = StorageManager.importData(evt.target.result);
          if (res.success) {
            this.showToast('Data Restored', 'All tasks, quiz records, and settings have been restored.', 'success', '📥');
            setTimeout(() => window.location.reload(), 800);
          } else {
            this.showToast('Import Error', 'The selected file is not a valid StudyVerse backup.', 'error', '❌');
          }
        };
        reader.readAsText(file);
      });
    }

    // Load Demo Data Button
    const demoDataBtn = document.getElementById('settings-demo-data-btn');
    if (demoDataBtn) {
      demoDataBtn.addEventListener('click', () => {
        this.showModal(
          'Load Demo Portfolio Data?',
          '<p style="color: var(--text-secondary);">This will reset current data and populate realistic sample study tasks, quiz scores, streak, and charts for portfolio presentation.</p>',
          [
            {
              text: 'Cancel',
              class: 'btn-secondary',
              onClick: () => this.closeModal()
            },
            {
              text: 'Load Demo Data',
              class: 'btn-primary',
              onClick: () => {
                StorageManager.seedDemoData();
                this.closeModal();
                this.showToast('Demo Data Loaded', 'Portfolio sample state populated.', 'success', '✨');
                setTimeout(() => window.location.reload(), 600);
              }
            }
          ]
        );
      });
    }

    // Clear All Data Button
    const clearDataBtn = document.getElementById('settings-clear-btn');
    if (clearDataBtn) {
      clearDataBtn.addEventListener('click', () => {
        this.showModal(
          '⚠️ Reset All Data?',
          '<p style="color: var(--color-danger); font-weight: 600; margin-bottom: 0.5rem;">Warning: This will permanently delete all your study tasks, quiz history, streak, and badges from this browser.</p><p style="color: var(--text-secondary); font-size: 0.9rem;">Are you absolutely sure you want a fresh start?</p>',
          [
            {
              text: 'Cancel',
              class: 'btn-secondary',
              onClick: () => this.closeModal()
            },
            {
              text: 'Clear Everything',
              class: 'btn-danger',
              onClick: () => {
                StorageManager.clearAllData();
                this.closeModal();
                this.showToast('Data Cleared', 'Workspace reset to default state.', 'info', '🧹');
                setTimeout(() => window.location.reload(), 600);
              }
            }
          ]
        );
      });
    }
  },

  populateSettingsFields() {
    const user = StorageManager.getUser();

    const nameInput = document.getElementById('settings-input-name');
    const courseInput = document.getElementById('settings-input-course');
    const examNameInput = document.getElementById('settings-input-exam');
    const examDateInput = document.getElementById('settings-input-exam-date');
    const goalInput = document.getElementById('settings-input-goal');
    const soundSwitch = document.getElementById('settings-sound-toggle');

    if (nameInput) nameInput.value = user.name || 'Alex Sharma';
    if (courseInput) courseInput.value = user.course || 'BCA (Artificial Intelligence & Data Science)';
    if (examNameInput) examNameInput.value = user.targetExam || 'AI & Data Structures University Finals';
    if (examDateInput) examDateInput.value = user.examDate || new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0];
    if (goalInput) goalInput.value = user.dailyGoalHours || 3.5;
    if (soundSwitch) soundSwitch.checked = user.soundEnabled !== false;

    // Highlight selected avatar
    const avatar = user.avatar || '🎓';
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(opt => {
      if (opt.textContent.trim() === avatar) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
  },

  saveProfileSettings() {
    const user = StorageManager.getUser();

    const nameInput = document.getElementById('settings-input-name');
    const courseInput = document.getElementById('settings-input-course');
    const examNameInput = document.getElementById('settings-input-exam');
    const examDateInput = document.getElementById('settings-input-exam-date');
    const goalInput = document.getElementById('settings-input-goal');
    const selectedAvatar = document.querySelector('.avatar-option.selected');

    if (nameInput && nameInput.value.trim()) user.name = nameInput.value.trim();
    if (courseInput) user.course = courseInput.value.trim();
    if (examNameInput) user.targetExam = examNameInput.value.trim();
    if (examDateInput && examDateInput.value) user.examDate = examDateInput.value;
    if (goalInput) user.dailyGoalHours = parseFloat(goalInput.value) || 3.5;
    if (selectedAvatar) user.avatar = selectedAvatar.textContent.trim();

    StorageManager.saveUser(user);
    this.updateHeaderProfile();
    this.startExamCountdown();

    AudioEngine.playChime();
    this.showToast('Settings Saved', 'Your student profile and preferences have been updated.', 'success', '💾');
  },

  // Modal Dialog Controller
  showModal(title, bodyHtml, buttons = []) {
    const backdrop = document.getElementById('modal-backdrop');
    const titleElem = document.getElementById('modal-title');
    const bodyElem = document.getElementById('modal-body-content');
    const footerElem = document.getElementById('modal-footer-actions');

    if (!backdrop || !titleElem || !bodyElem || !footerElem) return;

    titleElem.textContent = title;
    bodyElem.innerHTML = bodyHtml;

    footerElem.innerHTML = '';
    buttons.forEach(btn => {
      const buttonElem = document.createElement('button');
      buttonElem.className = `btn ${btn.class || 'btn-secondary'}`;
      buttonElem.innerHTML = btn.text;
      buttonElem.onclick = btn.onClick || (() => this.closeModal());
      footerElem.appendChild(buttonElem);
    });

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  // Toast Notification System
  showToast(title, message, type = 'info', icon = '🔔') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Trigger enter animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }
};

// Global Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
