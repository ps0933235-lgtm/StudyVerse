/* ===================================================================
   StudyVerse — Rewards, XP System, Levels, Streaks & Badges
   =================================================================== */

const Levels = [
  { level: 1, title: 'Novice Scholar', minXP: 0, maxXP: 200 },
  { level: 2, title: 'Knowledge Seeker', minXP: 200, maxXP: 450 },
  { level: 3, title: 'Code Apprentice', minXP: 450, maxXP: 750 },
  { level: 4, title: 'Algorithm Ace', minXP: 750, maxXP: 1200 },
  { level: 5, title: 'Data Sage', minXP: 1200, maxXP: 1800 },
  { level: 6, title: 'AI Mastermind', minXP: 1800, maxXP: 2500 },
  { level: 7, title: 'Studyverse Legend', minXP: 2500, maxXP: 99999 }
];

const BadgesMaster = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first study task on StudyVerse',
    icon: '🎯',
    category: 'tasks'
  },
  {
    id: 'task_master',
    name: 'Task Master',
    description: 'Complete 5 study tasks successfully',
    icon: '⚡',
    category: 'tasks'
  },
  {
    id: 'task_titan',
    name: 'Task Titan',
    description: 'Complete 10 total study tasks',
    icon: '🏆',
    category: 'tasks'
  },
  {
    id: 'quiz_novice',
    name: 'Quiz Novice',
    description: 'Complete your first practice quiz in the Arena',
    icon: '📝',
    category: 'quiz'
  },
  {
    id: 'quiz_prodigy',
    name: 'Quiz Prodigy',
    description: 'Score a perfect 100% on any practice quiz',
    icon: '🌟',
    category: 'quiz'
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Attempt quizzes across 3 different academic subjects',
    icon: '🧠',
    category: 'quiz'
  },
  {
    id: 'streak_flame',
    name: 'Streak Flame',
    description: 'Maintain an active study streak for 3 consecutive days',
    icon: '🔥',
    category: 'streak'
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain an unbroken 7-day study streak',
    icon: '🚀',
    category: 'streak'
  },
  {
    id: 'focus_pioneer',
    name: 'Focus Pioneer',
    description: 'Complete your first full 25-minute Pomodoro focus block',
    icon: '⏱️',
    category: 'focus'
  },
  {
    id: 'deep_work',
    name: 'Deep Work Champion',
    description: 'Complete 3 focused Pomodoro sessions',
    icon: '💎',
    category: 'focus'
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Earn 500 total XP points across all activities',
    icon: '🎖️',
    category: 'xp'
  },
  {
    id: 'study_legend',
    name: 'Study Legend',
    description: 'Reach Level 5: Data Sage (1,200+ XP)',
    icon: '👑',
    category: 'xp'
  }
];

const RewardsManager = {
  // Get Current Level Info based on XP
  getCurrentLevel(xp) {
    const curXP = xp !== undefined ? xp : StorageManager.getStats().xp || 0;
    for (let i = Levels.length - 1; i >= 0; i--) {
      if (curXP >= Levels[i].minXP) {
        const lvl = Levels[i];
        const nextLvl = Levels[i + 1] || null;
        const progressInLevel = nextLvl ? curXP - lvl.minXP : lvl.maxXP - lvl.minXP;
        const totalLevelSpan = nextLvl ? nextLvl.minXP - lvl.minXP : 1;
        const percentage = nextLvl ? Math.min(100, Math.round((progressInLevel / totalLevelSpan) * 100)) : 100;
        return {
          ...lvl,
          nextLevelXP: nextLvl ? nextLvl.minXP : lvl.maxXP,
          progressInLevel,
          percentage
        };
      }
    }
    return Levels[0];
  },

  // Award XP with notification & level-up check
  awardXP(amount, reason = 'Activity completed') {
    if (amount <= 0) return;

    const stats = StorageManager.getStats();
    const oldXP = stats.xp || 0;
    const oldLevel = this.getCurrentLevel(oldXP);

    stats.xp = oldXP + amount;
    StorageManager.saveStats(stats);
    StorageManager.recordActivityToday();

    const newLevel = this.getCurrentLevel(stats.xp);

    // Toast notification for XP
    if (window.App) {
      window.App.showToast(`+${amount} XP Earned!`, reason, 'success', '✨');
      window.App.updateHeaderStats();
    }

    // Check Century Club and Level 5 badges
    if (stats.xp >= 500) {
      this.unlockBadge('century_club');
    }
    if (stats.xp >= 1200) {
      this.unlockBadge('study_legend');
    }

    // Level up check!
    if (newLevel.level > oldLevel.level) {
      this.triggerLevelUpCelebration(newLevel);
    }
  },

  // Level Up Modal & Celebration
  triggerLevelUpCelebration(levelInfo) {
    AudioEngine.playCelebration();
    this.launchConfetti();

    if (window.App) {
      window.App.showModal(
        '🎉 Level Up!',
        `
        <div style="text-align: center; padding: 1.5rem 0;">
          <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 1s infinite;">🎓</div>
          <h2 style="font-size: 1.75rem; color: var(--color-primary); font-weight: 800; margin-bottom: 0.5rem;">
            Level ${levelInfo.level}: ${levelInfo.title}
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 380px; margin: 0 auto 1.5rem auto;">
            Incredible dedication! You have elevated your scholarship rank. Keep conquering your academic milestones!
          </p>
          <div style="background: var(--bg-hover); padding: 1rem; border-radius: var(--radius-md); font-weight: 700; color: var(--color-purple);">
            Next Rank: Level ${levelInfo.level + 1} at ${levelInfo.nextLevelXP} XP
          </div>
        </div>
        `,
        [
          {
            text: 'Claim Victory & Continue',
            class: 'btn-primary',
            onClick: () => window.App.closeModal()
          }
        ]
      );
    }
  },

  // Unlock Badge by ID
  unlockBadge(badgeId) {
    const badges = StorageManager.getBadges();
    const existing = badges.find(b => b.id === badgeId);
    const master = BadgesMaster.find(b => b.id === badgeId);

    if (!master) return;

    if (existing && existing.unlocked) {
      return; // Already unlocked
    }

    const today = new Date().toISOString().split('T')[0];
    if (existing) {
      existing.unlocked = true;
      existing.unlockedAt = today;
    } else {
      badges.push({ id: badgeId, unlocked: true, unlockedAt: today });
    }

    StorageManager.saveBadges(badges);

    // Audio & Toast
    AudioEngine.playCelebration();
    this.launchConfetti();

    if (window.App) {
      window.App.showToast(`Badge Unlocked: ${master.name}!`, master.description, 'success', master.icon);
      this.renderBadgesSection();
    }
  },

  // Check badges for streak
  checkStreakBadges(streak) {
    if (streak >= 3) this.unlockBadge('streak_flame');
    if (streak >= 7) this.unlockBadge('unstoppable');
  },

  // Check badges for tasks
  checkTaskBadges() {
    const tasks = StorageManager.getTasks();
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    if (completedCount >= 1) this.unlockBadge('first_step');
    if (completedCount >= 5) this.unlockBadge('task_master');
    if (completedCount >= 10) this.unlockBadge('task_titan');
  },

  // Check badges for quizzes
  checkQuizBadges(score, total, subject) {
    this.unlockBadge('quiz_novice');
    if (score === total && total > 0) {
      this.unlockBadge('quiz_prodigy');
    }

    const history = StorageManager.getQuizHistory();
    const uniqueSubjects = new Set(history.map(h => h.subject));
    uniqueSubjects.add(subject);
    if (uniqueSubjects.size >= 3) {
      this.unlockBadge('polymath');
    }
  },

  // Check badges for focus sessions
  checkFocusBadges() {
    const history = StorageManager.getFocusHistory();
    if (history.length >= 1) this.unlockBadge('focus_pioneer');
    if (history.length >= 3) this.unlockBadge('deep_work');
  },

  // Trigger confetti burst
  launchConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  },

  // Render Badges page section
  renderBadgesSection() {
    const container = document.getElementById('badges-grid-container');
    if (!container) return;

    const savedBadges = StorageManager.getBadges();
    const stats = StorageManager.getStats();
    const levelInfo = this.getCurrentLevel(stats.xp);

    // Update level banner in rewards page
    const levelTitleElem = document.getElementById('rewards-level-title');
    const levelSubtitleElem = document.getElementById('rewards-level-subtitle');
    const levelProgressElem = document.getElementById('rewards-level-progress');
    const xpTextElem = document.getElementById('rewards-xp-text');

    if (levelTitleElem) levelTitleElem.textContent = `Level ${levelInfo.level}: ${levelInfo.title}`;
    if (levelSubtitleElem) levelSubtitleElem.textContent = `${stats.xp} Total Lifetime XP Earned`;
    if (levelProgressElem) levelProgressElem.style.width = `${levelInfo.percentage}%`;
    if (xpTextElem) xpTextElem.textContent = `${levelInfo.progressInLevel} / ${levelInfo.nextLevelXP - levelInfo.minXP} XP to Level ${levelInfo.level + 1}`;

    // Render Streak Days in Rewards
    this.renderStreakCalendar();

    // Render Badges Grid
    container.innerHTML = BadgesMaster.map(badge => {
      const saved = savedBadges.find(b => b.id === badge.id);
      const isUnlocked = saved && saved.unlocked;
      const unlockDate = saved && saved.unlockedAt ? new Date(saved.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null;

      return `
        <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}" onclick="RewardsManager.showBadgeDetails('${badge.id}')">
          <div class="badge-card-icon">
            ${badge.icon}
          </div>
          <div class="badge-card-name">${badge.name}</div>
          <div class="badge-card-desc">${badge.description}</div>
          <div class="badge-card-status">
            ${isUnlocked 
              ? `<span style="color: var(--color-success);">✓ Unlocked ${unlockDate || ''}</span>` 
              : `<span style="color: var(--text-muted);">🔒 In Progress</span>`}
          </div>
        </div>
      `;
    }).join('');
  },

  // Render 7-day streak visual pills
  renderStreakCalendar() {
    const container = document.getElementById('rewards-streak-pills');
    if (!container) return;

    const stats = StorageManager.getStats();
    const activeDays = stats.activeDays || [];
    const today = new Date();
    
    // Get past 7 days dates
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - 86400000 * i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = i === 0;
      const isActive = activeDays.includes(dateStr);
      days.push({
        name: dayNames[d.getDay()],
        dayNum: d.getDate(),
        isActive,
        isToday
      });
    }

    container.innerHTML = days.map(d => `
      <div class="streak-day-dot">
        <div class="day-circle ${d.isActive ? 'active' : ''}">
          ${d.isActive ? '🔥' : d.dayNum}
        </div>
        <span style="color: ${d.isToday ? 'var(--color-primary)' : 'var(--text-muted)'}; font-weight: ${d.isToday ? '800' : '600'};">
          ${d.name}
        </span>
      </div>
    `).join('');

    const streakCountElem = document.getElementById('rewards-streak-count');
    if (streakCountElem) streakCountElem.textContent = `${stats.streak || 1} Days Active Streak`;
  },

  showBadgeDetails(badgeId) {
    const master = BadgesMaster.find(b => b.id === badgeId);
    if (!master) return;

    const saved = StorageManager.getBadges().find(b => b.id === badgeId);
    const isUnlocked = saved && saved.unlocked;

    window.App.showModal(
      `${master.icon} ${master.name}`,
      `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">${master.icon}</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">${master.name}</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.25rem;">${master.description}</p>
        <div style="display: inline-block; padding: 0.5rem 1.25rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.85rem; background: ${isUnlocked ? 'var(--color-success-bg)' : 'var(--bg-hover)'}; color: ${isUnlocked ? 'var(--color-success)' : 'var(--text-muted)'};">
          ${isUnlocked ? `✓ Unlocked on ${saved.unlockedAt || 'Recently'}` : '🔒 Criteria not yet completed'}
        </div>
      </div>
      `,
      [
        {
          text: 'Got it',
          class: 'btn-secondary',
          onClick: () => window.App.closeModal()
        }
      ]
    );
  }
};
