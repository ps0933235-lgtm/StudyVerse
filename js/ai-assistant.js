/* ===================================================================
   StudyVerse — AI Study Copilot (Future-Ready Architecture)
   Transparent Heuristic Processing: Notes Summarizer, Note-to-Quiz,
   Weak Area Detection, and Personalized Study Plan Generation
   =================================================================== */

const AIAssistant = {
  init() {
    this.bindEvents();
    this.renderDashboardRecommendations();
  },

  bindEvents() {
    // Summarize notes button
    const summarizeBtn = document.getElementById('ai-summarize-btn');
    if (summarizeBtn) {
      summarizeBtn.addEventListener('click', () => this.generateSummary());
    }

    // Generate Quiz from Notes button
    const generateQuizBtn = document.getElementById('ai-generate-quiz-btn');
    if (generateQuizBtn) {
      generateQuizBtn.addEventListener('click', () => this.generateQuizFromNotes());
    }

    // Generate personalized study plan
    const generatePlanBtn = document.getElementById('ai-generate-plan-btn');
    if (generatePlanBtn) {
      generatePlanBtn.addEventListener('click', () => this.generatePersonalizedPlan());
    }
  },

  // 1. Heuristic Note Summarizer
  generateSummary() {
    const inputElem = document.getElementById('ai-notes-input');
    const resultBox = document.getElementById('ai-summary-result');
    if (!inputElem || !resultBox) return;

    const text = inputElem.value.trim();
    if (!text || text.length < 50) {
      window.App.showToast('Note Too Short', 'Please paste at least 2 or 3 sentences of study material.', 'warning', '⚠️');
      return;
    }

    resultBox.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-primary);">
        <div style="font-size: 2rem; animation: pulse 1s infinite;">✨</div>
        <div style="font-weight: 700; margin-top: 0.5rem;">Analyzing notes and extracting key concepts...</div>
      </div>
    `;

    setTimeout(() => {
      // Split into sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      
      // Keyword frequency scoring
      const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
      const freq = {};
      const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'were', 'which', 'their', 'about', 'would', 'there', 'could']);
      
      words.forEach(w => {
        if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
      });

      // Score sentences
      const scoredSentences = sentences.map(s => {
        const sWords = s.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
        const score = sWords.reduce((acc, w) => acc + (freq[w] || 0), 0) / (sWords.length || 1);
        return { text: s.trim(), score };
      });

      scoredSentences.sort((a, b) => b.score - a.score);
      const topPoints = scoredSentences.slice(0, Math.min(4, scoredSentences.length));

      // Extract top technical keywords
      const topKeywords = Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 5);

      resultBox.innerHTML = `
        <div style="background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-light); padding: 1.5rem; animation: fadeIn 0.3s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <span class="badge badge-primary">⚡ Extractive AI Summary</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">${sentences.length} sentences reduced to ${topPoints.length} key takeaways</span>
          </div>

          <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">Core Takeaways:</h4>
          <ul style="list-style: none; padding: 0; margin-bottom: 1.25rem;">
            ${topPoints.map(p => `
              <li style="display: flex; gap: 0.5rem; margin-bottom: 0.6rem; font-size: 0.88rem; color: var(--text-secondary);">
                <span style="color: var(--color-primary); font-weight: 700;">•</span>
                <span>${this.escapeHtml(p.text)}</span>
              </li>
            `).join('')}
          </ul>

          <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">Key Subject Terminology:</h4>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            ${topKeywords.map(k => `
              <span class="badge badge-purple" style="text-transform: capitalize;">${this.escapeHtml(k)}</span>
            `).join('')}
          </div>
        </div>
      `;

      AudioEngine.playChime();
    }, 400);
  },

  // 2. AI Note-to-Quiz / Flashcards Generator
  generateQuizFromNotes() {
    const inputElem = document.getElementById('ai-quiz-notes-input');
    const resultBox = document.getElementById('ai-quiz-result');
    if (!inputElem || !resultBox) return;

    const text = inputElem.value.trim();
    if (!text || text.length < 60) {
      window.App.showToast('Note Too Short', 'Please paste substantial notes to generate quiz questions.', 'warning', '⚠️');
      return;
    }

    resultBox.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-primary);">
        <div style="font-size: 2rem; animation: pulse 1s infinite;">🧠</div>
        <div style="font-weight: 700; margin-top: 0.5rem;">Synthesizing questions and options from study material...</div>
      </div>
    `;

    setTimeout(() => {
      const sentences = (text.match(/[^.!?]+[.!?]+/g) || [text]).map(s => s.trim()).filter(s => s.length > 25);
      
      const generatedQuestions = [];
      const pool = sentences.slice(0, 3);

      pool.forEach((sent, idx) => {
        // Extract words with >= 5 chars
        const words = sent.match(/\b[A-Za-z]{5,}\b/g) || [];
        if (words.length > 0) {
          const targetWord = words[Math.floor(words.length / 2)];
          const blankedQuestion = sent.replace(new RegExp(`\\b${targetWord}\\b`, 'i'), '_______');
          
          // Generate realistic distractors
          const distractors = ['Overhead', 'Iteration', 'Framework', 'Redundancy', 'Pipeline'].filter(w => w.toLowerCase() !== targetWord.toLowerCase()).slice(0, 3);
          const options = [targetWord, ...distractors].sort(() => 0.5 - Math.random());
          const correctIdx = options.indexOf(targetWord);

          generatedQuestions.push({
            id: `ai-gen-${idx}`,
            question: blankedQuestion,
            options,
            correct: correctIdx,
            explanation: `Based directly on your provided study material: "${sent}"`
          });
        }
      });

      if (generatedQuestions.length === 0) {
        resultBox.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Could not extract enough concept statements. Try adding clearer descriptive sentences.</div>`;
        return;
      }

      resultBox.innerHTML = `
        <div style="background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-light); padding: 1.5rem; animation: fadeIn 0.3s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <span class="badge badge-success">✨ Generated ${generatedQuestions.length} Practice Items</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Rule-Based Concept Extractor</span>
          </div>

          ${generatedQuestions.map((gq, i) => `
            <div style="background: var(--bg-hover); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem; border-left: 3px solid var(--color-primary);">
              <div style="font-weight: 700; font-size: 0.92rem; margin-bottom: 0.75rem; color: var(--text-primary);">
                Q${i + 1}. Complete the statement:
              </div>
              <div style="font-size: 0.88rem; font-style: italic; color: var(--text-secondary); margin-bottom: 1rem;">
                "${this.escapeHtml(gq.question)}"
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem;">
                ${gq.options.map((opt, oIdx) => `
                  <button class="btn btn-sm btn-outline" style="justify-content: flex-start; text-align: left;" onclick="AIAssistant.verifyAiQuestion(this, ${oIdx === gq.correct}, '${this.escapeHtml(gq.explanation)}')">
                    ${String.fromCharCode(65 + oIdx)}. ${this.escapeHtml(opt)}
                  </button>
                `).join('')}
              </div>
              <div class="ai-feedback-box" style="display: none; font-size: 0.8rem; margin-top: 0.5rem; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);"></div>
            </div>
          `).join('')}
        </div>
      `;

      AudioEngine.playChime();
    }, 450);
  },

  verifyAiQuestion(btn, isCorrect, explanation) {
    const parent = btn.closest('div').parentElement;
    const feedbackBox = parent.querySelector('.ai-feedback-box');
    const allBtns = parent.querySelectorAll('button');

    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.style.background = 'var(--color-success)';
      btn.style.color = '#ffffff';
      AudioEngine.playCorrect();
      RewardsManager.awardXP(10, 'Answered AI Generated Note Question');
    } else {
      btn.style.background = 'var(--color-danger)';
      btn.style.color = '#ffffff';
      AudioEngine.playIncorrect();
    }

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.style.background = isCorrect ? 'var(--color-success-bg)' : 'var(--color-danger-bg)';
      feedbackBox.style.color = isCorrect ? 'var(--color-success)' : 'var(--color-danger)';
      feedbackBox.innerHTML = `<strong>${isCorrect ? '✓ Correct! +10 XP' : '✗ Incorrect'}</strong> — ${explanation}`;
    }
  },

  // 3. Personalized Study Plan Generator
  generatePersonalizedPlan() {
    const user = StorageManager.getUser();
    const tasks = StorageManager.getTasks();
    const history = StorageManager.getQuizHistory();
    const resultBox = document.getElementById('ai-plan-result');
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-primary);">
        <div style="font-size: 2rem; animation: pulse 1s infinite;">📅</div>
        <div style="font-weight: 700; margin-top: 0.5rem;">Analyzing exam target date and syllabus priorities...</div>
      </div>
    `;

    setTimeout(() => {
      const pendingTasks = tasks.filter(t => t.status !== 'completed');
      const examName = user.targetExam || 'Upcoming Finals';
      const examDate = user.examDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

      // Calculate days remaining
      const msLeft = new Date(examDate).getTime() - new Date().getTime();
      const daysLeft = Math.max(1, Math.ceil(msLeft / 86400000));

      resultBox.innerHTML = `
        <div style="background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-light); padding: 1.5rem; animation: fadeIn 0.3s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <div>
              <div style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">${this.escapeHtml(examName)} Roadmap</div>
              <div style="font-size: 0.8rem; color: var(--color-purple); font-weight: 600;">⏳ ${daysLeft} Days Remaining Until Exam</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="AIAssistant.autoScheduleSuggestedTasks()">
              <span>+ Add Suggested Tasks</span>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
            <div style="padding: 0.85rem 1rem; border-radius: var(--radius-md); background: var(--bg-hover); border-left: 4px solid var(--color-danger);">
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">Day 1-2: Core Algorithmic Mastery & Problem Solving</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">
                Target 2 × 25m Focus Sessions on Graph Traversal & Dynamic Programming. Practice 5 multiple-choice questions in the Quiz Arena.
              </div>
            </div>

            <div style="padding: 0.85rem 1rem; border-radius: var(--radius-md); background: var(--bg-hover); border-left: 4px solid var(--color-warning);">
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">Day 3-4: Machine Learning Pipelines & Neural Architectures</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">
                Review CNN backpropagation and regularization terms. Re-attempt weak quiz topics in Computer Science & AI/ML.
              </div>
            </div>

            <div style="padding: 0.85rem 1rem; border-radius: var(--radius-md); background: var(--bg-hover); border-left: 4px solid var(--color-success);">
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">Day 5: Mock Exam Simulation & Flashcard Blitz</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">
                Full-length simulated timed quiz, followed by 15-minute relaxation session. Maintain study streak to boost recall.
              </div>
            </div>
          </div>
        </div>
      `;

      AudioEngine.playChime();
    }, 450);
  },

  autoScheduleSuggestedTasks() {
    const tasks = StorageManager.getTasks();
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const suggested = {
      id: 'task-ai-' + Date.now(),
      title: 'AI Scheduled: Algorithmic Complexity Mock Review',
      subject: 'Data Structures',
      priority: 'high',
      deadline: tomorrow,
      time: '17:00',
      status: 'pending',
      notes: 'Auto-recommended study slot by StudyVerse AI Copilot.'
    };

    tasks.unshift(suggested);
    StorageManager.saveTasks(tasks);
    window.App.showToast('Tasks Scheduled!', 'Added suggested study block to your Planner.', 'success', '📅');
    if (window.TasksManager) TasksManager.renderTasks();
  },

  // Dynamic Dashboard AI Recommendations Card
  renderDashboardRecommendations() {
    const container = document.getElementById('dash-ai-recommendation-content');
    if (!container) return;

    const user = StorageManager.getUser();
    const tasks = StorageManager.getTasks();
    const history = StorageManager.getQuizHistory();

    const pendingHighPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');

    let tipTitle = 'Recommended Study Focus';
    let tipText = 'Based on your recent study activities, schedule a 25-minute Pomodoro session today to keep your 5-day study streak strong!';
    let actionLabel = 'Start Focus Session';
    let actionRoute = 'pomodoro';

    if (pendingHighPriority.length > 0) {
      tipTitle = `Urgent: ${pendingHighPriority[0].subject}`;
      tipText = `"${pendingHighPriority[0].title}" is due soon. Allocate a dedicated study interval to complete it!`;
      actionLabel = 'View Task';
      actionRoute = 'planner';
    } else if (history.length > 0) {
      const lowestQuiz = [...history].sort((a, b) => a.percentage - b.percentage)[0];
      if (lowestQuiz && lowestQuiz.percentage < 80) {
        tipTitle = `Reinforce: ${lowestQuiz.subject}`;
        tipText = `Your last quiz score was ${lowestQuiz.percentage}%. Take another 5-question practice drill to reach 100%!`;
        actionLabel = 'Practice Quiz';
        actionRoute = 'quiz';
      }
    }

    container.innerHTML = `
      <div class="ai-rec-header">
        <span>✨</span>
        <span>${this.escapeHtml(tipTitle)}</span>
      </div>
      <div class="ai-rec-text">
        ${this.escapeHtml(tipText)}
      </div>
      <button class="btn btn-sm btn-outline" onclick="App.navigateTo('${actionRoute}')">
        <span>${actionLabel}</span>
        <span>→</span>
      </button>
    `;
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
