/* ===================================================================
   StudyVerse — Focus Timer (Pomodoro) Engine
   Real-Time Countdown, Circular Progress SVG, Ambient Sound & XP Sync
   =================================================================== */

const TimerManager = {
  modes: {
    focus: { name: 'Focus Session', duration: 25 * 60 },
    shortBreak: { name: 'Short Break', duration: 5 * 60 },
    longBreak: { name: 'Long Break', duration: 15 * 60 }
  },

  currentMode: 'focus',
  totalDuration: 25 * 60,
  timeLeft: 25 * 60,
  timerInterval: null,
  isRunning: false,
  selectedTaskId: null,
  completedSessionsToday: 0,
  circumference: 2 * Math.PI * 130, // r=130 -> ~816.81

  init() {
    this.bindEvents();
    this.populateTaskDropdown();
    this.resetTimer();
  },

  bindEvents() {
    // Mode switcher buttons
    const modeButtons = document.querySelectorAll('.timer-mode-btn');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isRunning) {
          if (!confirm('A timer is currently active. Switch session anyway?')) return;
        }
        modeButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.getAttribute('data-mode') || 'focus';
        this.switchMode(mode);
      });
    });

    // Start/Pause button
    const toggleBtn = document.getElementById('timer-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.isRunning) {
          this.pauseTimer();
        } else {
          this.startTimer();
        }
      });
    }

    // Reset button
    const resetBtn = document.getElementById('timer-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetTimer());
    }

    // Skip button
    const skipBtn = document.getElementById('timer-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.skipSession());
    }

    // Task selector change
    const taskSelect = document.getElementById('timer-task-select');
    if (taskSelect) {
      taskSelect.addEventListener('change', (e) => {
        this.selectedTaskId = e.target.value || null;
        this.updateSessionLabel();
      });
    }

    // Ambient sound buttons
    const ambientBtns = document.querySelectorAll('.ambient-btn');
    ambientBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const soundType = e.currentTarget.getAttribute('data-sound');
        const isAlreadyActive = e.currentTarget.classList.contains('active');

        ambientBtns.forEach(b => b.classList.remove('active'));

        if (isAlreadyActive || soundType === 'none') {
          AudioEngine.stopAmbientSound();
        } else {
          e.currentTarget.classList.add('active');
          AudioEngine.startAmbientSound(soundType);
        }
      });
    });
  },

  populateTaskDropdown() {
    const select = document.getElementById('timer-task-select');
    if (!select) return;

    const tasks = StorageManager.getTasks().filter(t => t.status !== 'completed');
    select.innerHTML = '<option value="">None (Free Study)</option>' + tasks.map(t => `
      <option value="${t.id}" ${this.selectedTaskId === t.id ? 'selected' : ''}>
        ${this.escapeHtml(t.title)} [${this.escapeHtml(t.subject)}]
      </option>
    `).join('');
  },

  selectLinkedTask(taskId) {
    this.selectedTaskId = taskId;
    this.populateTaskDropdown();
    this.updateSessionLabel();
  },

  switchMode(mode) {
    this.pauseTimer();
    this.currentMode = mode;
    this.totalDuration = this.modes[mode].duration;
    this.timeLeft = this.totalDuration;
    this.updateDisplay();
    this.updateSessionLabel();
  },

  startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;

    AudioEngine.playChime();

    const toggleBtn = document.getElementById('timer-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<span>⏸️</span> <span>Pause</span>';
      toggleBtn.classList.remove('btn-primary');
      toggleBtn.classList.add('btn-secondary');
    }

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateDisplay();
      } else {
        this.completeSession();
      }
    }, 1000);
  },

  pauseTimer() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerInterval);

    const toggleBtn = document.getElementById('timer-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<span>▶️</span> <span>Resume</span>';
      toggleBtn.classList.remove('btn-secondary');
      toggleBtn.classList.add('btn-primary');
    }
  },

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.totalDuration;
    this.updateDisplay();

    const toggleBtn = document.getElementById('timer-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<span>▶️</span> <span>Start Focus</span>';
      toggleBtn.classList.remove('btn-secondary');
      toggleBtn.classList.add('btn-primary');
    }
  },

  skipSession() {
    if (confirm('Skip to the next interval?')) {
      this.pauseTimer();
      if (this.currentMode === 'focus') {
        this.switchMode('shortBreak');
      } else {
        this.switchMode('focus');
      }
    }
  },

  completeSession() {
    this.pauseTimer();
    AudioEngine.playCelebration();
    RewardsManager.launchConfetti();

    const wasFocus = this.currentMode === 'focus';

    if (wasFocus) {
      this.completedSessionsToday++;
      const minutesFocused = Math.round(this.totalDuration / 60);

      // Record focus history
      const history = StorageManager.getFocusHistory();
      const today = new Date().toISOString().split('T')[0];
      
      let subjectName = 'General Study';
      if (this.selectedTaskId) {
        const task = StorageManager.getTasks().find(t => t.id === this.selectedTaskId);
        if (task) subjectName = task.subject;
      }

      history.push({
        id: 'foc-' + Date.now(),
        date: today,
        minutes: minutesFocused,
        subject: subjectName,
        taskId: this.selectedTaskId
      });
      StorageManager.saveFocusHistory(history);

      // Update weekly study hours (add 0.42 hrs for 25m)
      const stats = StorageManager.getStats();
      const dayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
      const mappedIdx = dayIndex === 0 ? 6 : dayIndex - 1; // map Mon=0 ... Sun=6
      if (!stats.weeklyHours) stats.weeklyHours = [0,0,0,0,0,0,0];
      stats.weeklyHours[mappedIdx] = parseFloat(((stats.weeklyHours[mappedIdx] || 0) + (minutesFocused / 60)).toFixed(1));
      StorageManager.saveStats(stats);

      // Award XP
      RewardsManager.awardXP(25, `Completed ${minutesFocused}m Pomodoro session!`);
      RewardsManager.checkFocusBadges();

      // Show completion modal
      window.App.showModal(
        '🏆 Focus Session Completed!',
        `
        <div style="text-align: center; padding: 1.5rem 0;">
          <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">🌟</div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
            Phenomenal Concentration!
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 380px; margin: 0 auto 1.25rem auto;">
            You completed <strong>${minutesFocused} minutes</strong> of deep study on <em>${this.escapeHtml(subjectName)}</em>. Take a well-earned break!
          </p>
          <div style="background: var(--color-success-bg); color: var(--color-success); padding: 0.75rem; border-radius: var(--radius-md); font-weight: 700; margin-bottom: 1.5rem;">
            +25 XP Awarded • Focus Minutes Logged
          </div>
        </div>
        `,
        [
          {
            text: 'Start 5m Break',
            class: 'btn-primary',
            onClick: () => {
              window.App.closeModal();
              this.switchMode('shortBreak');
              this.startTimer();
            }
          },
          {
            text: 'Stay on Focus',
            class: 'btn-secondary',
            onClick: () => {
              window.App.closeModal();
              this.resetTimer();
            }
          }
        ]
      );
    } else {
      // Break completed
      window.App.showToast('Break Finished! 🔔', 'Ready to begin your next focus sprint?', 'info', '⏱️');
      this.switchMode('focus');
    }

    this.updateCounterDisplay();
    if (window.AnalyticsManager) window.AnalyticsManager.refreshAllCharts();
  },

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const timeDisplay = document.getElementById('timer-time-display');
    if (timeDisplay) timeDisplay.textContent = timeFormatted;

    // Update document title for background tracking
    document.title = this.isRunning ? `(${timeFormatted}) StudyVerse Focus` : 'StudyVerse — Your Smart Student Universe';

    // Update circular SVG progress
    const circle = document.getElementById('timer-circle-progress');
    if (circle) {
      const progressFraction = (this.totalDuration - this.timeLeft) / this.totalDuration;
      const offset = this.circumference * (1 - progressFraction);
      circle.style.strokeDashoffset = offset;
    }
  },

  updateSessionLabel() {
    const labelElem = document.getElementById('timer-session-label');
    if (!labelElem) return;

    if (this.currentMode === 'focus') {
      if (this.selectedTaskId) {
        const task = StorageManager.getTasks().find(t => t.id === this.selectedTaskId);
        labelElem.textContent = task ? `Focusing: ${task.title}` : 'Focusing on Study Task';
      } else {
        labelElem.textContent = 'Deep Focus Session';
      }
    } else if (this.currentMode === 'shortBreak') {
      labelElem.textContent = 'Short Refresh Break (5m)';
    } else {
      labelElem.textContent = 'Extended Rest (15m)';
    }
  },

  updateCounterDisplay() {
    const countElem = document.getElementById('timer-sessions-count');
    if (countElem) {
      countElem.textContent = `${this.completedSessionsToday} Intervals Completed Today`;
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
