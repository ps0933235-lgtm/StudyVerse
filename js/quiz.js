/* ===================================================================
   StudyVerse — Quiz Arena Engine
   Interactive Quizzes, Immediate Feedback, Anti-Exploit XP, Explanations
   =================================================================== */

const QuizBank = {
  python: {
    title: 'Python Programming',
    icon: '🐍',
    description: 'Data structures, list comprehensions, decorators, and OOP fundamentals.',
    questions: [
      {
        id: 'py-1',
        question: 'What is the output of the following list comprehension in Python?',
        code: 'nums = [x**2 for x in range(5) if x % 2 == 1]\nprint(nums)',
        options: [
          '[0, 1, 4, 9, 16]',
          '[1, 9]',
          '[1, 4, 9]',
          '[0, 4, 16]'
        ],
        correct: 1,
        explanation: 'range(5) produces [0, 1, 2, 3, 4]. The condition "x % 2 == 1" filters for odd numbers (1 and 3). Squaring them gives 1**2 = 1 and 3**2 = 9. So [1, 9].'
      },
      {
        id: 'py-2',
        question: 'In Python, what happens when a mutable default argument (such as a list) is used in a function definition?',
        code: 'def add_item(val, arr=[]):\n    arr.append(val)\n    return arr',
        options: [
          'A new list is created every time the function is called.',
          'The default list is evaluated once at definition time and shared across subsequent calls.',
          'Python raises a SyntaxError at runtime.',
          'The list is automatically converted into an immutable tuple.'
        ],
        correct: 1,
        explanation: 'Default argument expressions in Python are evaluated once when the function is defined, not each time it is invoked. Therefore, mutable defaults persist modifications across calls.'
      },
      {
        id: 'py-3',
        question: 'Which built-in Python function returns an iterator that yields pairs of (index, item)?',
        code: null,
        options: [
          'zip()',
          'range()',
          'enumerate()',
          'map()'
        ],
        correct: 2,
        explanation: 'enumerate() takes an iterable and returns an enumerate object that yields tuples containing count/index and the value.'
      },
      {
        id: 'py-4',
        question: 'What is the time complexity of searching for a key in a standard Python dictionary on average?',
        code: null,
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n log n)'
        ],
        correct: 0,
        explanation: 'Python dictionaries are implemented as hash tables, providing O(1) average-time complexity for key lookups, insertions, and deletions.'
      },
      {
        id: 'py-5',
        question: 'What does the "yield" keyword do inside a Python function?',
        code: null,
        options: [
          'Terminates the program immediately.',
          'Pauses function execution and produces a generator object value.',
          'Imports a generator from the standard library.',
          'Forces asynchronous execution via threads.'
        ],
        correct: 1,
        explanation: 'When a function contains the "yield" keyword, it becomes a generator function. Calling it returns a generator iterator that yields values one at a time.'
      }
    ]
  },

  cs_ai: {
    title: 'Computer Science & AI/ML',
    icon: '🤖',
    description: 'Algorithms, data structures, neural network architectures, and ML theory.',
    questions: [
      {
        id: 'ai-1',
        question: 'Which regularization technique randomly drops units during neural network training to combat overfitting?',
        code: null,
        options: [
          'Batch Normalization',
          'Dropout',
          'Gradient Clipping',
          'Softmax Temperature'
        ],
        correct: 1,
        explanation: 'Dropout randomly deactivates a subset of neurons during each training step with probability p, preventing co-adaptation of feature detectors.'
      },
      {
        id: 'ai-2',
        question: 'What is the worst-case time complexity of standard QuickSort on an array of size n?',
        code: null,
        options: [
          'O(n log n)',
          'O(log n)',
          'O(n²)',
          'O(n)'
        ],
        correct: 2,
        explanation: 'When an unbalanced partition occurs (e.g., when the pivot chosen is always the smallest or largest element on already sorted data), QuickSort degrades to O(n²).'
      },
      {
        id: 'ai-3',
        question: 'In deep learning, which activation function helps prevent the vanishing gradient problem in deep networks compared to Sigmoid?',
        code: null,
        options: [
          'ReLU (Rectified Linear Unit)',
          'Hyperbolic Tangent (Tanh)',
          'Linear Step Function',
          'Sigmoid Logistic Function'
        ],
        correct: 0,
        explanation: 'ReLU has a constant derivative of 1 for all positive inputs (x > 0), which prevents gradients from decaying exponentially in deep architectures.'
      },
      {
        id: 'ai-4',
        question: 'Which algorithm traversal uses a Queue (FIFO) data structure?',
        code: null,
        options: [
          'Depth-First Search (DFS)',
          'Breadth-First Search (BFS)',
          'Pre-order Tree Traversal',
          'Post-order Tree Traversal'
        ],
        correct: 1,
        explanation: 'Breadth-First Search (BFS) explores nodes level-by-level using a Queue (FIFO). DFS typically uses a Stack (LIFO) or recursion.'
      },
      {
        id: 'ai-5',
        question: 'What does the "Self-Attention" mechanism in Transformer architectures compute?',
        code: null,
        options: [
          'The Euclidean distance between image pixels.',
          'The compatibility and relational weighting between every pair of tokens in a sequence.',
          'The learning rate decay schedule.',
          'The GPU memory caching limit.'
        ],
        correct: 1,
        explanation: 'Self-Attention relates different positions of a single sequence to compute a contextual representation of the sequence using Query, Key, and Value projections.'
      }
    ]
  },

  math: {
    title: 'Mathematics for CS',
    icon: '📐',
    description: 'Discrete mathematics, linear algebra, probability, and graph theory.',
    questions: [
      {
        id: 'math-1',
        question: 'If two fair 6-sided dice are rolled, what is the probability that the sum of their faces equals 7?',
        code: null,
        options: [
          '1/12',
          '1/6',
          '7/36',
          '5/36'
        ],
        correct: 1,
        explanation: 'There are 36 total outcomes. Pairs summing to 7 are: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) — exactly 6 outcomes. Probability = 6/36 = 1/6.'
      },
      {
        id: 'math-2',
        question: 'What is the rank of an identity matrix of size 4 × 4?',
        code: null,
        options: [
          '1',
          '2',
          '4',
          '16'
        ],
        correct: 2,
        explanation: 'An n × n identity matrix has n linearly independent rows (and columns), so its rank is always n. For a 4 × 4 identity matrix, the rank is 4.'
      },
      {
        id: 'math-3',
        question: 'In graph theory, what is the sum of degrees of all vertices in any undirected graph G = (V, E)?',
        code: null,
        options: [
          '|V|',
          '2 × |E| (Handshaking Lemma)',
          '|E|²',
          '|V| × |E|'
        ],
        correct: 1,
        explanation: 'By the Handshaking Lemma, each edge contributes exactly 1 degree to two endpoint vertices, so the sum of all vertex degrees is exactly twice the number of edges: 2|E|.'
      },
      {
        id: 'math-4',
        question: 'Bayes Theorem allows us to calculate which probability?',
        code: null,
        options: [
          'Joint probability P(A ∩ B) directly without priors.',
          'Posterior probability P(A|B) using the likelihood P(B|A), prior P(A), and marginal P(B).',
          'Cumulative density function of a uniform distribution.',
          'The determinant of a non-square matrix.'
        ],
        correct: 1,
        explanation: 'Bayes Theorem states: P(A|B) = [P(B|A) × P(A)] / P(B), allowing computation of posterior probability given observed evidence.'
      },
      {
        id: 'math-5',
        question: 'What is 2¹⁰ in binary representation?',
        code: null,
        options: [
          '10000000000 (1 followed by 10 zeros)',
          '1111111111',
          '1010101010',
          '1000000000'
        ],
        correct: 0,
        explanation: 'In binary, 2^k is represented by 1 followed by k zeros. Thus, 2^10 = 1024 decimal = 1 followed by 10 zeros in binary.'
      }
    ]
  },

  english: {
    title: 'English & Verbal Reasoning',
    icon: '📚',
    description: 'Grammar mastery, academic vocabulary, analogies, and reading comprehension.',
    questions: [
      {
        id: 'eng-1',
        question: 'Choose the word that is most nearly OPPOSITE in meaning to "Ephemeral":',
        code: null,
        options: [
          'Fleeting',
          'Permanent',
          'Transitory',
          'Superficial'
        ],
        correct: 1,
        explanation: '"Ephemeral" means lasting for a very short time. Its opposite (antonym) is "Permanent" or "Enduring".'
      },
      {
        id: 'eng-2',
        question: 'Identify the grammatically correct sentence:',
        code: null,
        options: [
          'Neither the professor nor the students was present.',
          'Neither the professor nor the students were present.',
          'Neither the professor or the students was present.',
          'Neither the professor nor the students is present.'
        ],
        correct: 1,
        explanation: 'In correlative conjunctions ("neither... nor"), the verb agrees with the closer subject ("students", plural), so "were present" is grammatically correct.'
      },
      {
        id: 'eng-3',
        question: 'Complete the analogy: ALGORITHM : CODE :: ARCHITECT : ?',
        code: null,
        options: [
          'BRICK',
          'BLUEPRINT',
          'COMPUTER',
          'EQUATION'
        ],
        correct: 1,
        explanation: 'An algorithm provides the blueprint for code, just as an architect creates the blueprint for a building.'
      },
      {
        id: 'eng-4',
        question: 'What is the meaning of the idiom "to burn the midnight oil"?',
        code: null,
        options: [
          'To waste electricity.',
          'To study or work diligently late into the night.',
          'To cause unnecessary friction in a team.',
          'To give up on a difficult project.'
        ],
        correct: 1,
        explanation: '"Burning the midnight oil" refers to working or studying hard late at night, originating from historical oil lamps.'
      },
      {
        id: 'eng-5',
        question: 'Choose the word with the correct spelling:',
        code: null,
        options: [
          'Accomodation',
          'Accommodation',
          'Acommodation',
          'Accomadation'
        ],
        correct: 1,
        explanation: 'The word "Accommodation" is spelled with double "c" and double "m".'
      }
    ]
  },

  gk: {
    title: 'General Knowledge & Tech Trivia',
    icon: '🌍',
    description: 'Computing history, technological breakthroughs, innovations, and science.',
    questions: [
      {
        id: 'gk-1',
        question: 'Who is recognized as the author of the first computer algorithm, making them the world\'s first computer programmer?',
        code: null,
        options: [
          'Alan Turing',
          'Ada Lovelace',
          'Grace Hopper',
          'Charles Babbage'
        ],
        correct: 1,
        explanation: 'Ada Lovelace wrote an algorithm intended to be processed by Charles Babbage\'s Analytical Engine, and is celebrated as the world\'s first computer programmer.'
      },
      {
        id: 'gk-2',
        question: 'Which creator developed the Python programming language in 1991?',
        code: null,
        options: [
          'Guido van Rossum',
          'James Gosling',
          'Dennis Ritchie',
          'Bjarne Stroustrup'
        ],
        correct: 0,
        explanation: 'Guido van Rossum developed Python at CWI in the Netherlands and released it in 1991, naming it after Monty Python\'s Flying Circus.'
      },
      {
        id: 'gk-3',
        question: 'What does the term "Moore\'s Law" traditionally predict?',
        code: null,
        options: [
          'Internet speeds double every 6 months.',
          'The number of transistors on a microchip doubles roughly every two years.',
          'Software defects increase exponentially with lines of code.',
          'Battery energy density doubles every year.'
        ],
        correct: 1,
        explanation: 'Formulated by Intel co-founder Gordon Moore in 1965, it states that the number of transistors in an integrated circuit doubles approximately every two years.'
      },
      {
        id: 'gk-4',
        question: 'In what year was the World Wide Web made publicly available by Tim Berners-Lee at CERN?',
        code: null,
        options: [
          '1983',
          '1991',
          '1998',
          '2001'
        ],
        correct: 1,
        explanation: 'Tim Berners-Lee released the World Wide Web software to the public in August 1991 from CERN.'
      },
      {
        id: 'gk-5',
        question: 'What was the famous benchmark test proposed in 1950 to evaluate if a machine exhibits human-equivalent intelligence?',
        code: null,
        options: [
          'The Lovelace Metric',
          'The Turing Test',
          'The Von Neumann Simulation',
          'The Shannon Entropy Check'
        ],
        correct: 1,
        explanation: 'Alan Turing proposed the Imitation Game (now known as the Turing Test) in 1950 to test if an observer can distinguish human from machine text responses.'
      }
    ]
  }
};

const QuizManager = {
  currentSubjectKey: null,
  currentQuestions: [],
  currentIndex: 0,
  score: 0,
  userAnswers: [],
  timerInterval: null,
  timeLeft: 30,
  timerEnabled: true,
  isAnswered: false,

  init() {
    this.renderSubjectCards();
  },

  // Render subject cards in arena
  renderSubjectCards() {
    const container = document.getElementById('quiz-subjects-container');
    if (!container) return;

    container.innerHTML = Object.keys(QuizBank).map(key => {
      const subject = QuizBank[key];
      return `
        <div class="quiz-subject-card">
          <div class="quiz-subject-icon" style="background: rgba(99, 102, 241, 0.1); color: var(--color-primary);">
            ${subject.icon}
          </div>
          <h3 class="quiz-subject-title">${subject.title}</h3>
          <p class="quiz-subject-desc">${subject.description}</p>
          <div class="quiz-subject-meta">
            <span class="badge badge-primary">${subject.questions.length} Questions</span>
            <button class="btn btn-primary btn-sm" onclick="QuizManager.startQuiz('${key}')">
              <span>Start Quiz</span>
              <span>→</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  // Start a quiz
  startQuiz(subjectKey) {
    const subject = QuizBank[subjectKey];
    if (!subject) return;

    this.currentSubjectKey = subjectKey;
    // Clone questions
    this.currentQuestions = JSON.parse(JSON.stringify(subject.questions));
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.isAnswered = false;

    // Show Quiz View, Hide Subject Selection
    const arenaView = document.getElementById('quiz-arena-view');
    const playerView = document.getElementById('quiz-player-view');
    const scorecardView = document.getElementById('quiz-scorecard-view');

    if (arenaView) arenaView.style.display = 'none';
    if (scorecardView) scorecardView.style.display = 'none';
    if (playerView) {
      playerView.style.display = 'block';
      this.renderCurrentQuestion();
    }
  },

  // Render current question
  renderCurrentQuestion() {
    const q = this.currentQuestions[this.currentIndex];
    if (!q) {
      this.finishQuiz();
      return;
    }

    this.isAnswered = false;
    clearInterval(this.timerInterval);

    // Update Header Progress
    const progressPct = ((this.currentIndex + 1) / this.currentQuestions.length) * 100;
    const progressBar = document.getElementById('quiz-progress-bar');
    const questionCounter = document.getElementById('quiz-question-counter');
    const subjectBadge = document.getElementById('quiz-player-subject-badge');

    if (progressBar) progressBar.style.width = `${progressPct}%`;
    if (questionCounter) questionCounter.textContent = `Question ${this.currentIndex + 1} of ${this.currentQuestions.length}`;
    if (subjectBadge) subjectBadge.textContent = QuizBank[this.currentSubjectKey].title;

    // Reset and start timer if enabled
    this.timeLeft = 30;
    this.updateTimerDisplay();
    if (this.timerEnabled) {
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        this.updateTimerDisplay();
        if (this.timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.handleTimeout();
        }
      }, 1000);
    }

    // Question content
    const questionText = document.getElementById('quiz-question-text');
    const codeBlock = document.getElementById('quiz-code-block');
    const optionsContainer = document.getElementById('quiz-options-container');
    const explanationBox = document.getElementById('quiz-explanation-box');
    const nextBtn = document.getElementById('quiz-next-btn');

    if (questionText) questionText.textContent = q.question;

    if (codeBlock) {
      if (q.code) {
        codeBlock.textContent = q.code;
        codeBlock.style.display = 'block';
      } else {
        codeBlock.style.display = 'none';
      }
    }

    if (explanationBox) {
      explanationBox.classList.remove('show');
    }

    if (nextBtn) {
      nextBtn.style.display = 'none';
    }

    // Render 4 options
    const letters = ['A', 'B', 'C', 'D'];
    if (optionsContainer) {
      optionsContainer.innerHTML = q.options.map((opt, idx) => `
        <button class="quiz-option-btn" id="quiz-opt-${idx}" onclick="QuizManager.selectAnswer(${idx})">
          <div class="option-badge">${letters[idx]}</div>
          <div style="flex: 1;">${this.escapeHtml(opt)}</div>
        </button>
      `).join('');
    }
  },

  updateTimerDisplay() {
    const timerElem = document.getElementById('quiz-timer-text');
    const pill = document.getElementById('quiz-timer-pill');
    if (timerElem) {
      timerElem.textContent = `${this.timeLeft}s`;
    }
    if (pill) {
      if (this.timeLeft <= 5) {
        pill.classList.add('urgent');
      } else {
        pill.classList.remove('urgent');
      }
    }
  },

  handleTimeout() {
    if (this.isAnswered) return;
    this.selectAnswer(-1); // -1 signifies timed out
  },

  // User clicked an answer option
  selectAnswer(selectedIndex) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    clearInterval(this.timerInterval);

    const q = this.currentQuestions[this.currentIndex];
    const isCorrect = selectedIndex === q.correct;

    if (isCorrect) {
      this.score++;
      AudioEngine.playCorrect();
    } else {
      AudioEngine.playIncorrect();
    }

    this.userAnswers.push({
      questionId: q.id,
      question: q.question,
      options: q.options,
      selectedIndex,
      correctIndex: q.correct,
      isCorrect,
      explanation: q.explanation
    });

    // Style option buttons
    const allButtons = document.querySelectorAll('.quiz-option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex >= 0) {
      const selectedBtn = document.getElementById(`quiz-opt-${selectedIndex}`);
      if (selectedBtn) {
        selectedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');
      }
    }

    // Highlight correct button
    const correctBtn = document.getElementById(`quiz-opt-${q.correct}`);
    if (correctBtn) {
      correctBtn.classList.add('correct');
    }

    // Display Explanation Box
    const explanationBox = document.getElementById('quiz-explanation-box');
    const explanationText = document.getElementById('quiz-explanation-content');
    if (explanationBox && explanationText) {
      explanationText.textContent = q.explanation;
      explanationBox.classList.add('show');
    }

    // Show Next Button
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      const isLast = this.currentIndex === this.currentQuestions.length - 1;
      nextBtn.innerHTML = isLast ? '<span>View Scorecard</span> <span>🏆</span>' : '<span>Next Question</span> <span>→</span>';
      nextBtn.style.display = 'inline-flex';
    }
  },

  // Move to next question or finish
  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.currentQuestions.length) {
      this.renderCurrentQuestion();
    } else {
      this.finishQuiz();
    }
  },

  // Calculate score, award XP, prevent infinite farming
  finishQuiz() {
    clearInterval(this.timerInterval);

    const playerView = document.getElementById('quiz-player-view');
    const scorecardView = document.getElementById('quiz-scorecard-view');

    if (playerView) playerView.style.display = 'none';
    if (scorecardView) scorecardView.style.display = 'block';

    const total = this.currentQuestions.length;
    const percentage = total > 0 ? Math.round((this.score / total) * 100) : 0;
    const today = new Date().toISOString().split('T')[0];

    // Anti-Exploit XP calculation:
    // Check if user already completed this exact subject today with 100%
    const history = StorageManager.getQuizHistory();
    const attemptsToday = history.filter(h => h.subject === QuizBank[this.currentSubjectKey].title && h.date === today);

    let xpToAward = 0;
    let xpNote = '';

    if (attemptsToday.length >= 3) {
      // Practice mode XP after 3 attempts today to prevent bot/unlimited script farming
      xpToAward = Math.min(15, this.score * 3);
      xpNote = 'Daily Subject Cap Reached (Practice XP awarded)';
    } else {
      // Standard XP: +15 XP per correct answer + 20 XP bonus for >= 80%
      xpToAward = this.score * 15;
      if (percentage >= 80) xpToAward += 20;
      xpNote = `Earned for ${percentage}% accuracy on ${QuizBank[this.currentSubjectKey].title}`;
    }

    if (xpToAward > 0) {
      RewardsManager.awardXP(xpToAward, xpNote);
    }

    // Record quiz attempt
    history.unshift({
      id: 'quiz-' + Date.now(),
      subject: QuizBank[this.currentSubjectKey].title,
      score: this.score,
      total,
      percentage,
      date: today,
      xpAwarded: xpToAward
    });
    StorageManager.saveQuizHistory(history);

    // Badges check
    RewardsManager.checkQuizBadges(this.score, total, QuizBank[this.currentSubjectKey].title);

    // Audio celebration if passed
    if (percentage >= 70) {
      AudioEngine.playCelebration();
      RewardsManager.launchConfetti();
    }

    // Render scorecard
    this.renderScorecard(percentage, xpToAward, xpNote);

    // Refresh charts
    if (window.AnalyticsManager) window.AnalyticsManager.refreshAllCharts();
  },

  renderScorecard(percentage, xpEarned, xpNote) {
    const scoreNum = document.getElementById('scorecard-num');
    const scorePercent = document.getElementById('scorecard-percent');
    const feedbackTitle = document.getElementById('scorecard-title');
    const feedbackDesc = document.getElementById('scorecard-desc');
    const xpBadge = document.getElementById('scorecard-xp');
    const reviewList = document.getElementById('scorecard-review-list');

    if (scoreNum) scoreNum.textContent = `${this.score} / ${this.currentQuestions.length}`;
    if (scorePercent) scorePercent.textContent = `${percentage}% Accuracy`;

    if (feedbackTitle) {
      if (percentage === 100) feedbackTitle.textContent = '🌟 Masterful Performance!';
      else if (percentage >= 80) feedbackTitle.textContent = '🎉 Excellent Mastery!';
      else if (percentage >= 60) feedbackTitle.textContent = '👍 Good Effort!';
      else feedbackTitle.textContent = '📖 Review & Practice Recommended';
    }

    if (feedbackDesc) {
      if (percentage >= 80) {
        feedbackDesc.textContent = `You demonstrated solid command of ${QuizBank[this.currentSubjectKey].title}. Outstanding work!`;
      } else {
        feedbackDesc.textContent = `You scored ${this.score} out of ${this.currentQuestions.length}. Review the explanations below and try another attempt to lock in the concepts.`;
      }
    }

    if (xpBadge) {
      xpBadge.textContent = `+${xpEarned} XP • ${xpNote}`;
    }

    // Question Review
    if (reviewList) {
      reviewList.innerHTML = this.userAnswers.map((ua, idx) => `
        <div style="background: var(--bg-hover); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem; text-align: left; border-left: 4px solid ${ua.isCorrect ? 'var(--color-success)' : 'var(--color-danger)'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Q${idx + 1}. ${this.escapeHtml(ua.question)}</span>
            <span class="badge ${ua.isCorrect ? 'badge-success' : 'badge-danger'}">
              ${ua.isCorrect ? '✓ Correct' : '✗ Incorrect'}
            </span>
          </div>
          <div style="font-size: 0.82rem; margin-bottom: 0.35rem;">
            <strong>Your Answer:</strong> ${ua.selectedIndex >= 0 ? this.escapeHtml(ua.options[ua.selectedIndex]) : '<span style="color: var(--color-danger);">Timed Out</span>'}
          </div>
          ${!ua.isCorrect ? `
            <div style="font-size: 0.82rem; color: var(--color-success); margin-bottom: 0.5rem;">
              <strong>Correct Answer:</strong> ${this.escapeHtml(ua.options[ua.correctIndex])}
            </div>
          ` : ''}
          <div style="font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-card); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            💡 <strong>Explanation:</strong> ${this.escapeHtml(ua.explanation)}
          </div>
        </div>
      `).join('');
    }
  },

  // Back to arena subjects view
  backToArena() {
    clearInterval(this.timerInterval);
    const arenaView = document.getElementById('quiz-arena-view');
    const playerView = document.getElementById('quiz-player-view');
    const scorecardView = document.getElementById('quiz-scorecard-view');

    if (arenaView) arenaView.style.display = 'block';
    if (playerView) playerView.style.display = 'none';
    if (scorecardView) scorecardView.style.display = 'none';
  },

  // Retry currently selected quiz
  retryCurrentQuiz() {
    if (this.currentSubjectKey) {
      this.startQuiz(this.currentSubjectKey);
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
