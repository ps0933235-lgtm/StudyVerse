/* ===================================================================
   StudyVerse — Smart Study Planner & Task Management
   CRUD operations, filtering, weekly timetable view, and dashboard sync
   =================================================================== */

const TasksManager = {
  currentFilterStatus: 'all',
  currentFilterSubject: 'all',
  currentFilterPriority: 'all',
  searchQuery: '',
  currentViewMode: 'cards', // 'cards' | 'timetable'
  editingTaskId: null,

  init() {
    this.bindEvents();
    this.renderTasks();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('tasks-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTasks();
      });
    }

    // Filter status buttons
    const statusFilters = document.querySelectorAll('.task-status-filter');
    statusFilters.forEach(btn => {
      btn.addEventListener('click', (e) => {
        statusFilters.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilterStatus = e.currentTarget.getAttribute('data-status') || 'all';
        this.renderTasks();
      });
    });

    // Subject & Priority Dropdowns
    const subjectSelect = document.getElementById('tasks-subject-filter');
    if (subjectSelect) {
      subjectSelect.addEventListener('change', (e) => {
        this.currentFilterSubject = e.target.value;
        this.renderTasks();
      });
    }

    const prioritySelect = document.getElementById('tasks-priority-filter');
    if (prioritySelect) {
      prioritySelect.addEventListener('change', (e) => {
        this.currentFilterPriority = e.target.value;
        this.renderTasks();
      });
    }

    // View Mode Toggle (Cards vs Timetable)
    const viewButtons = document.querySelectorAll('.view-mode-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        viewButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentViewMode = e.currentTarget.getAttribute('data-view') || 'cards';
        this.renderTasks();
      });
    });
  },

  // Open Task Modal for Create or Edit
  openTaskModal(taskId = null) {
    this.editingTaskId = taskId;
    const isEdit = !!taskId;
    const task = isEdit ? StorageManager.getTasks().find(t => t.id === taskId) : null;

    const today = new Date().toISOString().split('T')[0];
    const defaultTime = '18:00';

    const modalTitle = isEdit ? 'Edit Study Task' : 'Create New Study Task';
    const content = `
      <form id="task-form" onsubmit="event.preventDefault(); TasksManager.saveTaskFromModal();">
        <div class="form-group">
          <label class="form-label" for="modal-task-title">Task Title *</label>
          <input type="text" id="modal-task-title" class="form-control" placeholder="e.g. Master Binary Search Trees" required value="${task ? this.escapeHtml(task.title) : ''}">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="modal-task-subject">Subject *</label>
            <select id="modal-task-subject" class="form-control" required>
              <option value="Data Structures" ${task && task.subject === 'Data Structures' ? 'selected' : ''}>Data Structures</option>
              <option value="Machine Learning" ${task && task.subject === 'Machine Learning' ? 'selected' : ''}>Machine Learning</option>
              <option value="Python" ${task && task.subject === 'Python' ? 'selected' : ''}>Python Programming</option>
              <option value="Mathematics" ${task && task.subject === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
              <option value="AI & ML" ${task && task.subject === 'AI & ML' ? 'selected' : ''}>AI & ML Concepts</option>
              <option value="Computer Science" ${task && task.subject === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
              <option value="Web Development" ${task && task.subject === 'Web Development' ? 'selected' : ''}>Web Development</option>
              <option value="General" ${task && task.subject === 'General' ? 'selected' : ''}>General Revision</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="modal-task-priority">Priority</label>
            <select id="modal-task-priority" class="form-control">
              <option value="high" ${task && task.priority === 'high' ? 'selected' : ''}>High Priority (Urgent)</option>
              <option value="medium" ${!task || task.priority === 'medium' ? 'selected' : ''}>Medium Priority</option>
              <option value="low" ${task && task.priority === 'low' ? 'selected' : ''}>Low Priority</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="modal-task-date">Deadline Date *</label>
            <input type="date" id="modal-task-date" class="form-control" required value="${task ? task.deadline : today}">
          </div>

          <div class="form-group">
            <label class="form-label" for="modal-task-time">Target Time</label>
            <input type="time" id="modal-task-time" class="form-control" value="${task ? (task.time || defaultTime) : defaultTime}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="modal-task-notes">Notes & Study Goals</label>
          <textarea id="modal-task-notes" class="form-control" placeholder="Outline specific topics, textbook pages, or problem numbers to solve...">${task && task.notes ? this.escapeHtml(task.notes) : ''}</textarea>
        </div>

        <div id="modal-task-error" style="color: var(--color-danger); font-size: 0.85rem; margin-bottom: 0.75rem; display: none;"></div>
      </form>
    `;

    window.App.showModal(
      modalTitle,
      content,
      [
        {
          text: 'Cancel',
          class: 'btn-secondary',
          onClick: () => window.App.closeModal()
        },
        {
          text: isEdit ? 'Save Changes' : 'Create Task',
          class: 'btn-primary',
          onClick: () => this.saveTaskFromModal()
        }
      ]
    );

    setTimeout(() => {
      const input = document.getElementById('modal-task-title');
      if (input) input.focus();
    }, 100);
  },

  // Validate and Save Task
  saveTaskFromModal() {
    const titleInput = document.getElementById('modal-task-title');
    const subjectInput = document.getElementById('modal-task-subject');
    const priorityInput = document.getElementById('modal-task-priority');
    const dateInput = document.getElementById('modal-task-date');
    const timeInput = document.getElementById('modal-task-time');
    const notesInput = document.getElementById('modal-task-notes');
    const errorBox = document.getElementById('modal-task-error');

    const title = titleInput.value.trim();
    if (!title) {
      if (errorBox) {
        errorBox.textContent = 'Please enter a task title.';
        errorBox.style.display = 'block';
      }
      titleInput.focus();
      return;
    }

    if (!dateInput.value) {
      if (errorBox) {
        errorBox.textContent = 'Please select a valid deadline date.';
        errorBox.style.display = 'block';
      }
      dateInput.focus();
      return;
    }

    const tasks = StorageManager.getTasks();

    if (this.editingTaskId) {
      // Edit existing
      const idx = tasks.findIndex(t => t.id === this.editingTaskId);
      if (idx !== -1) {
        tasks[idx] = {
          ...tasks[idx],
          title,
          subject: subjectInput.value,
          priority: priorityInput.value,
          deadline: dateInput.value,
          time: timeInput.value || '18:00',
          notes: notesInput.value.trim()
        };
        window.App.showToast('Task Updated', `"${title}" has been modified.`, 'info', '✏️');
      }
    } else {
      // Create new
      const newTask = {
        id: 'task-' + Date.now(),
        title,
        subject: subjectInput.value,
        priority: priorityInput.value,
        deadline: dateInput.value,
        time: timeInput.value || '18:00',
        status: 'pending',
        notes: notesInput.value.trim(),
        createdAt: new Date().toISOString()
      };
      tasks.unshift(newTask);
      window.App.showToast('Task Created', `"${title}" added to your study schedule!`, 'success', '🎯');
    }

    StorageManager.saveTasks(tasks);
    StorageManager.recordActivityToday();
    window.App.closeModal();

    this.renderTasks();
    this.syncDashboard();
    if (window.AnalyticsManager) window.AnalyticsManager.refreshAllCharts();
  },

  // Toggle Task Completion
  toggleTaskComplete(taskId) {
    const tasks = StorageManager.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isNowCompleted = task.status !== 'completed';
    task.status = isNowCompleted ? 'completed' : 'pending';
    task.completedAt = isNowCompleted ? new Date().toISOString() : null;

    StorageManager.saveTasks(tasks);

    if (isNowCompleted) {
      AudioEngine.playChime();
      RewardsManager.awardXP(20, `Completed task: ${task.title}`);
      RewardsManager.checkTaskBadges();
      window.App.showToast('Task Accomplished! +20 XP', `"${task.title}" is marked complete!`, 'success', '✅');
    } else {
      window.App.showToast('Task Reopened', `"${task.title}" moved to pending.`, 'info', '🔄');
    }

    this.renderTasks();
    this.syncDashboard();
    if (window.AnalyticsManager) window.AnalyticsManager.refreshAllCharts();
  },

  // Delete Task with confirmation
  deleteTask(taskId) {
    const tasks = StorageManager.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    window.App.showModal(
      'Delete Study Task?',
      `<p style="color: var(--text-secondary); margin-bottom: 0.5rem;">Are you sure you want to remove <strong>"${this.escapeHtml(task.title)}"</strong> from your study schedule?</p>`,
      [
        {
          text: 'Cancel',
          class: 'btn-secondary',
          onClick: () => window.App.closeModal()
        },
        {
          text: 'Delete Task',
          class: 'btn-danger',
          onClick: () => {
            const updated = tasks.filter(t => t.id !== taskId);
            StorageManager.saveTasks(updated);
            window.App.closeModal();
            window.App.showToast('Task Removed', 'Task deleted from your planner.', 'info', '🗑️');
            this.renderTasks();
            this.syncDashboard();
            if (window.AnalyticsManager) window.AnalyticsManager.refreshAllCharts();
          }
        }
      ]
    );
  },

  // Get filtered tasks list
  getFilteredTasks() {
    let tasks = StorageManager.getTasks();

    // Filter status
    if (this.currentFilterStatus === 'pending') {
      tasks = tasks.filter(t => t.status !== 'completed');
    } else if (this.currentFilterStatus === 'completed') {
      tasks = tasks.filter(t => t.status === 'completed');
    }

    // Filter subject
    if (this.currentFilterSubject !== 'all') {
      tasks = tasks.filter(t => t.subject.toLowerCase() === this.currentFilterSubject.toLowerCase());
    }

    // Filter priority
    if (this.currentFilterPriority !== 'all') {
      tasks = tasks.filter(t => t.priority === this.currentFilterPriority);
    }

    // Search query
    if (this.searchQuery) {
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(this.searchQuery) ||
        (t.subject && t.subject.toLowerCase().includes(this.searchQuery)) ||
        (t.notes && t.notes.toLowerCase().includes(this.searchQuery))
      );
    }

    return tasks;
  },

  // Render Planner Page (Cards or Timetable)
  renderTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    if (!tasksContainer) return;

    const filtered = this.getFilteredTasks();

    // Update Counter Badges in Planner Header
    const allTasks = StorageManager.getTasks();
    const pendingTasks = allTasks.filter(t => t.status !== 'completed');
    const completedTasks = allTasks.filter(t => t.status === 'completed');

    const totalCountElem = document.getElementById('planner-total-count');
    const pendingCountElem = document.getElementById('planner-pending-count');
    const completedCountElem = document.getElementById('planner-completed-count');

    if (totalCountElem) totalCountElem.textContent = allTasks.length;
    if (pendingCountElem) pendingCountElem.textContent = pendingTasks.length;
    if (completedCountElem) completedCountElem.textContent = completedTasks.length;

    if (this.currentViewMode === 'timetable') {
      this.renderWeeklyTimetable(tasksContainer, allTasks);
      return;
    }

    // Render Cards View
    if (filtered.length === 0) {
      tasksContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon-box">📋</div>
          <div class="empty-title">No Study Tasks Found</div>
          <div class="empty-description">
            ${this.searchQuery || this.currentFilterStatus !== 'all' || this.currentFilterSubject !== 'all'
              ? 'No tasks match your selected filter criteria. Try resetting filters or searching for something else.'
              : 'Your study queue is currently clear! Start by adding a task to organize your study schedule.'}
          </div>
          <button class="btn btn-primary" onclick="TasksManager.openTaskModal()">
            <span>+ Create New Task</span>
          </button>
        </div>
      `;
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    tasksContainer.innerHTML = `
      <div class="tasks-grid">
        ${filtered.map(task => {
          const isCompleted = task.status === 'completed';
          const isDueToday = task.deadline === todayStr;
          const isOverdue = task.deadline < todayStr && !isCompleted;

          const dateDisplay = new Date(task.deadline + 'T00:00:00').toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          });

          return `
            <div class="task-card ${isCompleted ? 'completed' : ''}" id="task-card-${task.id}">
              <div class="task-card-header">
                <span class="badge ${this.getSubjectBadgeClass(task.subject)}">
                  ${this.escapeHtml(task.subject)}
                </span>
                <span class="badge priority-${task.priority}">
                  ${task.priority.toUpperCase()}
                </span>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem;">
                <label class="custom-checkbox" style="margin-top: 0.15rem;">
                  <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="TasksManager.toggleTaskComplete('${task.id}')">
                  <span class="checkbox-mark">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                </label>
                <div class="task-card-title">${this.escapeHtml(task.title)}</div>
              </div>

              ${task.notes ? `<div class="task-card-desc">${this.escapeHtml(task.notes)}</div>` : '<div style="flex: 1;"></div>'}

              <div class="task-card-footer">
                <div class="task-due-date ${isOverdue ? 'task-due-urgent' : ''}">
                  <span style="font-size: 0.9rem;">📅</span>
                  <span>${isOverdue ? '⚠️ Overdue: ' : isDueToday ? '🔥 Due Today: ' : 'Due '}${dateDisplay}</span>
                  ${task.time ? `<span>• ${task.time}</span>` : ''}
                </div>

                <div class="task-actions">
                  <button class="btn btn-sm btn-outline" title="Start Focus Session on this Task" onclick="App.navigateTo('pomodoro'); TimerManager.selectLinkedTask('${task.id}')">
                    <span>⏱️</span>
                  </button>
                  <button class="btn btn-sm btn-icon" title="Edit Task" onclick="TasksManager.openTaskModal('${task.id}')">
                    <span>✏️</span>
                  </button>
                  <button class="btn btn-sm btn-icon" title="Delete Task" onclick="TasksManager.deleteTask('${task.id}')">
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Render Timetable View
  renderWeeklyTimetable(container, tasks) {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday...
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    // Generate dates for current Mon -> Sun
    const weekDays = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() + mondayOffset);

    for (let i = 0; i < 7; i++) {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dateStr === today.toISOString().split('T')[0];

      weekDays.push({
        name: dayNames[i],
        dateStr,
        displayDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        isToday,
        tasks: tasks.filter(t => t.deadline === dateStr)
      });
    }

    container.innerHTML = `
      <div class="timetable-container">
        <div class="timetable-grid">
          ${weekDays.map(col => `
            <div class="timetable-col ${col.isToday ? 'today' : ''}">
              <div class="timetable-header">
                <div class="timetable-day">${col.name}</div>
                <div class="timetable-date">${col.displayDate} ${col.isToday ? '(Today)' : ''}</div>
              </div>

              <div class="timetable-tasks-list">
                ${col.tasks.length === 0 ? `
                  <div style="text-align: center; color: var(--text-muted); font-size: 0.72rem; padding: 1.5rem 0.25rem;">
                    No tasks scheduled
                  </div>
                ` : col.tasks.map(task => `
                  <div class="timetable-task-chip" onclick="TasksManager.openTaskModal('${task.id}')" title="${this.escapeHtml(task.title)}">
                    <div style="font-weight: 700; margin-bottom: 0.15rem; ${task.status === 'completed' ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                      ${task.status === 'completed' ? '✓ ' : ''}${this.escapeHtml(task.title)}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--text-muted);">
                      <span>${this.escapeHtml(task.subject)}</span>
                      <span>${task.time || ''}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // Helper for badge class
  getSubjectBadgeClass(subject) {
    const s = (subject || '').toLowerCase();
    if (s.includes('python')) return 'badge-primary';
    if (s.includes('machine') || s.includes('ai')) return 'badge-purple';
    if (s.includes('data')) return 'badge-primary';
    if (s.includes('math')) return 'badge-warning';
    return 'badge-neutral';
  },

  // Sync with Dashboard
  syncDashboard() {
    const tasks = StorageManager.getTasks();
    const todayStr = new Date().toISOString().split('T')[0];

    const todayTasks = tasks.filter(t => t.deadline === todayStr || t.status === 'pending').slice(0, 5);
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const totalCount = tasks.length;

    // Dashboard quick stats card
    const taskStatElem = document.getElementById('dash-stat-tasks');
    const taskStatMetaElem = document.getElementById('dash-stat-tasks-meta');
    if (taskStatElem) taskStatElem.textContent = `${completedCount} / ${totalCount}`;
    if (taskStatMetaElem) {
      const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      taskStatMetaElem.textContent = `${pct}% completed overall`;
    }

    // Dashboard today's priority list
    const dashTasksList = document.getElementById('dash-today-tasks-list');
    if (dashTasksList) {
      if (todayTasks.length === 0) {
        dashTasksList.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">✨</div>
            <div style="font-weight: 600; color: var(--text-primary);">All Clear for Today!</div>
            <div style="font-size: 0.82rem; margin-top: 0.25rem;">No pressing tasks due today. Add a new study goal anytime!</div>
          </div>
        `;
      } else {
        dashTasksList.innerHTML = todayTasks.map(t => {
          const isComp = t.status === 'completed';
          return `
            <div class="task-item-compact ${isComp ? 'completed' : ''}">
              <label class="custom-checkbox">
                <input type="checkbox" ${isComp ? 'checked' : ''} onchange="TasksManager.toggleTaskComplete('${t.id}')">
                <span class="checkbox-mark">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              </label>
              <div class="task-compact-info">
                <div class="task-compact-title">${this.escapeHtml(t.title)}</div>
                <div class="task-compact-meta">
                  <span class="badge ${this.getSubjectBadgeClass(t.subject)}" style="padding: 0.1rem 0.45rem; font-size: 0.68rem;">${this.escapeHtml(t.subject)}</span>
                  <span>Due ${t.deadline}</span>
                  <span class="priority-${t.priority}" style="font-weight: 700; font-size: 0.7rem;">${t.priority.toUpperCase()}</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
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
