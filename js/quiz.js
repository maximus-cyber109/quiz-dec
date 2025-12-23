// ========================================
// PINKBLUE QUIZMAS 2025 - QUIZ GAME ENGINE
// Flow: Start Challenge → Check email → Email modal OR Rules → Countdown → Quiz
// ========================================

class QuizGame {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.timeLeft = CONFIG.quiz.timeLimit;
    this.timer = null;
    this.questions = [];
    this.selectedAnswer = null;
    this.startTime = null;
    this.answers = [];
    this.isAnswerLocked = false;

    this.elements = {};
    this.screens = {};
    this.buttons = {};

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.setupProgressPills();
  }

  cacheElements() {
    this.screens = {
      start: document.getElementById('startScreen'),
      quiz: document.getElementById('quizScreen'),
      results: document.getElementById('resultsScreen'),
      leaderboard: document.getElementById('leaderboardScreen'),
      history: document.getElementById('historyScreen')
    };

    this.buttons = {
      start: document.getElementById('startBtn'),
      next: document.getElementById('nextBtn'),
      tryAgain: document.getElementById('tryAgainBtn'),
      share: document.getElementById('shareBtn'),
      copy: document.getElementById('copyBtn'),
      leaderboard: document.getElementById('leaderboardBtn'),
      history: document.getElementById('historyBtn'),
      back: document.getElementById('backBtn'),
      backFromHistory: document.getElementById('backFromHistory')
    };

    this.elements = {
      timer: document.getElementById('inlineTimer'),
      progressText: document.getElementById('progressText'),
      progressPills: document.getElementById('progressPills'),
      qNumber: document.getElementById('qNumber'),
      questionText: document.getElementById('questionText'),
      optionsList: document.getElementById('optionsList'),
      scoreValue: document.getElementById('scoreValue'),
      resultsTitle: document.getElementById('resultsTitle'),
      resultsSubtitle: document.getElementById('resultsSubtitle'),
      rewardTitle: document.getElementById('rewardTitle'),
      rewardDesc: document.getElementById('rewardDesc'),
      couponCode: document.getElementById('couponCode')
    };
  }

  bindEvents() {
    if (this.buttons.start) {
      this.buttons.start.addEventListener('click', () => this.handleStartClick());
    }

    if (this.buttons.next) {
      this.buttons.next.addEventListener('click', () => this.nextQuestion());
    }

    if (this.buttons.tryAgain) {
      this.buttons.tryAgain.addEventListener('click', () => this.restart());
    }

    if (this.buttons.share) {
      this.buttons.share.addEventListener('click', () => this.shareOnWhatsApp());
    }

    if (this.buttons.copy) {
      this.buttons.copy.addEventListener('click', () => this.copyCoupon());
    }

    if (this.buttons.leaderboard) {
      this.buttons.leaderboard.addEventListener('click', () => this.showLeaderboard());
    }

    if (this.buttons.history) {
      this.buttons.history.addEventListener('click', () => this.showHistory());
    }

    if (this.buttons.back) {
      this.buttons.back.addEventListener('click', () => this.showScreen('start'));
    }

    if (this.buttons.backFromHistory) {
      this.buttons.backFromHistory.addEventListener('click', () => this.showScreen('start'));
    }

    const rulesOkayBtn = document.getElementById('rulesOkayBtn');
    if (rulesOkayBtn) {
      rulesOkayBtn.addEventListener('click', () => this.closeRulesAndStart());
    }
  }

  setupProgressPills() {
    const container = this.elements.progressPills;
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < CONFIG.quiz.totalQuestions; i++) {
      const pill = document.createElement('div');
      pill.className = 'progress-pill';
      pill.dataset.index = i;
      container.appendChild(pill);
    }
  }

  handleStartClick() {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');

    if (emailParam && window.supabaseHandler?.isValidEmail(emailParam)) {
      this.showRulesModal();
    } else if (window.supabaseHandler?.userEmail) {
      this.showRulesModal();
    } else {
      window.supabaseHandler?.showEmailModal();
    }
  }

  showRulesModal() {
    const modal = document.getElementById('rulesModal');
    if (modal) {
      modal.classList.add('active');
      
      if (window.gsap) {
        gsap.fromTo(modal, 
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      }
    }
  }

  closeRulesAndStart() {
    const modal = document.getElementById('rulesModal');
    
    if (window.gsap) {
      gsap.to(modal, {
        opacity: 0,
        scale: 0.9,
        duration: 0.2,
        onComplete: () => {
          if (modal) modal.classList.remove('active');
          this.startCountdown();
        }
      });
    } else {
      if (modal) modal.classList.remove('active');
      this.startCountdown();
    }
  }

  startCountdown() {
    const overlay = document.getElementById('countdownOverlay');
    const numberEl = document.getElementById('countdownNumber');

    if (!overlay || !numberEl) {
      this.startQuiz();
      return;
    }

    overlay.classList.add('active');
    let count = 3;

    const interval = setInterval(() => {
      if (count === 0) {
        numberEl.textContent = 'GO!';
        
        if (window.gsap) {
          gsap.to(numberEl, {
            scale: 1.5,
            duration: 0.3,
            ease: 'back.out(1.7)',
            onComplete: () => {
              setTimeout(() => {
                overlay.classList.remove('active');
                this.startQuiz();
              }, 400);
            }
          });
        } else {
          setTimeout(() => {
            overlay.classList.remove('active');
            this.startQuiz();
          }, 400);
        }

        clearInterval(interval);
      } else {
        numberEl.textContent = count;
        
        if (window.gsap) {
          gsap.fromTo(numberEl,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
          );
        }
        
        count--;
      }
    }, 1000);
  }

  startQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.timeLeft = CONFIG.quiz.timeLimit;
    this.selectedAnswer = null;
    this.startTime = Date.now();
    this.answers = [];
    this.isAnswerLocked = false;

    const easy = CONFIG.questions.filter(q => q.difficulty === 'easy');
    const medium = CONFIG.questions.filter(q => q.difficulty === 'medium');
    const hard = CONFIG.questions.filter(q => q.difficulty === 'hard');

    const selectedEasy = this.shuffleArray(easy).slice(0, CONFIG.quiz.easyQuestions);
    const selectedMedium = this.shuffleArray(medium).slice(0, CONFIG.quiz.mediumQuestions);
    const selectedHard = this.shuffleArray(hard).slice(0, CONFIG.quiz.hardQuestions);

    this.questions = this.shuffleArray([...selectedEasy, ...selectedMedium, ...selectedHard]);

    const hasRewards = window.supabaseHandler?.hasRewardAttemptsLeft();
    const noRewardsMsg = document.getElementById('noRewardsMessage');
    if (noRewardsMsg) {
      noRewardsMsg.style.display = hasRewards ? 'none' : 'block';
    }

    this.showScreen('quiz');
    this.loadQuestion();
    this.startTimer();
  }

  loadQuestion() {
    const question = this.questions[this.currentQuestion];
    if (!question) return;

    if (this.elements.qNumber) {
      this.elements.qNumber.textContent = String(this.currentQuestion + 1).padStart(2, '0');
    }

    if (this.elements.questionText) {
      this.elements.questionText.textContent = question.question;
    }

    this.updateProgress();
    this.loadOptions(question.options);

    if (this.buttons.next) {
      this.buttons.next.disabled = true;
      this.buttons.next.classList.add('btn-disabled');
    }

    this.selectedAnswer = null;
    this.isAnswerLocked = false;
  }

  loadOptions(options) {
    const container = this.elements.optionsList;
    if (!container) return;

    container.innerHTML = '';

    options.forEach((option, index) => {
      const optionEl = document.createElement('div');
      optionEl.className = 'option-item';
      optionEl.dataset.index = index;
      optionEl.innerHTML = `
        <div class="option-letter">${String.fromCharCode(65 + index)}</div>
        <div class="option-text">${option}</div>
      `;

      optionEl.addEventListener('click', () => this.selectAnswer(index));

      if (window.gsap) {
        gsap.fromTo(optionEl,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.3, delay: index * 0.06, ease: 'back.out(1.7)' }
        );
      }

      container.appendChild(optionEl);
    });
  }

  selectAnswer(index) {
    if (this.isAnswerLocked) return;

    const options = this.elements.optionsList?.querySelectorAll('.option-item');
    if (options) {
      options.forEach(o => o.classList.remove('selected'));
      options[index].classList.add('selected');
    }

    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    this.selectedAnswer = index;

    if (this.buttons.next) {
      this.buttons.next.disabled = false;
      this.buttons.next.classList.remove('btn-disabled');
    }
  }

  nextQuestion() {
    if (this.selectedAnswer === null || this.isAnswerLocked) return;

    this.isAnswerLocked = true;

    const question = this.questions[this.currentQuestion];
    const options = this.elements.optionsList?.querySelectorAll('.option-item');
    const isCorrect = this.selectedAnswer === question.correct;

    if (options) {
      options.forEach((opt, idx) => {
        if (idx === question.correct) {
          opt.classList.add('correct');
        } else if (idx === this.selectedAnswer) {
          opt.classList.add('incorrect');
        }
      });
    }

    if (isCorrect) {
      this.score++;
      if (window.confetti) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }

    this.answers.push({
      question: question.question,
      selected: this.selectedAnswer,
      correct: question.correct,
      isCorrect,
      category: question.category,
      difficulty: question.difficulty
    });

    this.updateProgressPill(this.currentQuestion, isCorrect);

    setTimeout(() => {
      this.currentQuestion++;

      if (this.currentQuestion < this.questions.length) {
        this.loadQuestion();
      } else {
        this.endQuiz();
      }
    }, 1200);
  }

  updateProgress() {
    if (this.elements.progressText) {
      this.elements.progressText.textContent = `Question ${this.currentQuestion + 1} of ${CONFIG.quiz.totalQuestions}`;
    }
  }

  updateProgressPill(index, isCorrect) {
    const pill = this.elements.progressPills?.querySelector(`[data-index="${index}"]`);
    if (pill) {
      pill.classList.add('completed');
      pill.style.background = isCorrect ? 'var(--success)' : 'var(--error)';
    }
  }

  startTimer() {
    this.updateTimerDisplay();

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        this.endQuiz();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;

    if (this.elements.timer) {
      this.elements.timer.textContent = `Time: ${mins}:${secs.toString().padStart(2, '0')}`;

      if (this.timeLeft <= 30) {
        this.elements.timer.style.color = '#FF6B6B';
      }
    }
  }

  endQuiz() {
    clearInterval(this.timer);
    const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
    this.showResults(timeTaken);
  }

  async showResults(timeTaken) {
    this.showScreen('results');

    const hasRewardsLeft = window.supabaseHandler?.hasRewardAttemptsLeft();
    const rewardDisplay = window.supabaseHandler?.getRewardForScore(this.score);
    const rewardCode = window.supabaseHandler?.getRewardCodeForScore(this.score);

    this.animateScore();

    const titles = {
      10: 'Perfect Score! 🎉',
      9: 'Outstanding! ⭐',
      8: 'Excellent Work! 💎',
      7: 'Great Job! 🌟',
      6: 'Well Done! 👏',
      5: 'Good Effort! 💪',
      4: 'Keep Practicing! 📚',
      3: 'Learning! 🎯',
      2: 'Keep Going! 🚀',
      1: 'Nice Try! 💡',
      0: 'Better Luck Next Time! 🍀'
    };

    // Practice Mode ONLY when no attempts left
    if (!hasRewardsLeft || rewardCode === 'PRACTICE') {
      document.getElementById('noRewardsMessageResults').style.display = 'block';
      document.getElementById('rewardCard').style.display = 'none';
      document.getElementById('resultsTitle').textContent = 'Practice Complete!';
    } else {
      document.getElementById('noRewardsMessageResults').style.display = 'none';
      document.getElementById('rewardCard').style.display = 'block';
      document.getElementById('rewardTitle').textContent = rewardDisplay?.title || 'Your Reward';
      document.getElementById('rewardDesc').textContent = rewardDisplay?.description || '';
      document.getElementById('couponCode').textContent = rewardCode;
      document.getElementById('resultsTitle').textContent = titles[this.score] || 'Quiz Complete!';
    }

    if (window.confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    document.getElementById('resultsSubtitle').textContent = 
      `You scored ${this.score}/${CONFIG.quiz.totalQuestions} in ${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`;

    await window.supabaseHandler?.saveQuizResult(this.score, timeTaken, rewardCode, this.answers);
  }

  animateScore() {
    const target = this.score;
    const obj = { value: 0 };

    if (window.gsap) {
      gsap.to(obj, {
        value: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (this.elements.scoreValue) {
            this.elements.scoreValue.textContent = Math.floor(obj.value);
          }
        }
      });
    } else {
      if (this.elements.scoreValue) {
        this.elements.scoreValue.textContent = target;
      }
    }
  }

  async showLeaderboard() {
    this.showScreen('leaderboard');
    
    const container = document.getElementById('leaderboardContainer');
    if (!container) return;

    container.innerHTML = `<div class="loader"><div class="loader-spinner"></div></div>`;

    try {
      const data = await window.supabaseHandler?.getLeaderboard();
      container.innerHTML = '';

      if (!data || !data.length) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-secondary)">No entries yet. Be the first!</div>`;
        return;
      }

      data.forEach((entry, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1;
        
        // Use the actual name from quiz_users, fallback to email prefix
        const name = entry.name || entry.email?.split('@')[0] || 'Anonymous';
        
        // Use best_time from quiz_users
        const mins = Math.floor(entry.best_time / 60);
        const secs = entry.best_time % 60;

        const item = document.createElement('div');
        item.className = `leader-item ${rankClass}`;
        item.innerHTML = `
          <div class="leader-rank ${rankClass}">${medal}</div>
          <div class="leader-info">
            <div class="leader-name">${name}</div>
            <div class="leader-time">Time: ${mins}:${secs.toString().padStart(2, '0')}</div>
          </div>
          <div class="leader-score">${entry.best_score}<span style="opacity:0.5;font-size:1rem">/10</span></div>
        `;
        container.appendChild(item);
      });
    } catch (err) {
      console.error('Leaderboard error:', err);
      container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-secondary)">Failed to load leaderboard</div>`;
    }
  }

  async showHistory() {
    this.showScreen('history');
    
    const container = document.getElementById('historyContainer');
    if (!container) return;

    container.innerHTML = `<div class="loader"><div class="loader-spinner"></div></div>`;

    try {
      const data = await window.supabaseHandler?.getUserHistory();
      container.innerHTML = '';

      if (!data || !data.length) {
        container.innerHTML = `
          <div style="text-align:center;padding:40px">
            <div style="font-size:3rem;margin-bottom:16px">📝</div>
            <div style="color:var(--text-secondary)">No attempts yet</div>
          </div>
        `;
        return;
      }

      data.forEach((entry, index) => {
        const date = new Date(entry.created_at);
        const formatted = date.toLocaleString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const mins = Math.floor(entry.time_taken / 60);
        const secs = entry.time_taken % 60;

        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
          <div class="history-header">
            <div class="history-date">
              ${formatted}
              <br><small style="opacity:0.7">Attempt ${entry.attempt_number || index + 1}</small>
            </div>
            <div class="history-score">${entry.score}/10</div>
          </div>
          <div class="history-body">
            <div class="history-reward">Time: ${mins}:${secs.toString().padStart(2, '0')}</div>
            ${entry.reward && entry.reward !== 'PRACTICE' ? `
              <div class="history-coupon">
                <div class="history-coupon-code">${entry.reward}</div>
                <button class="history-copy-btn" onclick="quiz.copyCouponFromHistory('${entry.reward}')">Copy</button>
              </div>
            ` : ''}
          </div>
        `;
        container.appendChild(item);
      });
    } catch (err) {
      console.error('History error:', err);
      container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-secondary)">Failed to load history</div>`;
    }
  }

  shareOnWhatsApp() {
    const name = window.supabaseHandler?.userName || 'I';
    const message = CONFIG.shareMessage(this.score, CONFIG.quiz.totalQuestions, name);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    this.showToast('Opening WhatsApp...', 2000);
  }

  copyCoupon() {
    const code = this.elements.couponCode?.textContent?.trim();
    if (!code) return;

    navigator.clipboard.writeText(code).then(() => {
      this.showToast(`Coupon ${code} copied!`, 2000);
      if (navigator.vibrate) {
        navigator.vibrate([10, 40, 10]);
      }
    }).catch(() => {
      this.showToast('Failed to copy', 2000);
    });
  }

  copyCouponFromHistory(code) {
    navigator.clipboard.writeText(code).then(() => {
      this.showToast(`Coupon ${code} copied!`, 2000);
    });
  }

  updateAttemptsUI(attemptsUsed, isValidated) {
    const attemptsValue =
      document.querySelector('.attempts-value') ||
      document.getElementById('attemptsLeft');

    if (!attemptsValue) return;

    const remaining = Math.max(0, 2 - attemptsUsed);
    attemptsValue.textContent = remaining;

    if (remaining === 0) {
      attemptsValue.style.color = '#FF6B6B';
    } else if (remaining === 1) {
      attemptsValue.style.color = '#FFA400';
    } else {
      attemptsValue.style.color = '#00D68F';
    }
  }

  updateHistoryState(email, isValidated) {
    const historyBtn =
      this.buttons?.history || document.getElementById('historyBtn');

    if (!historyBtn) return;

    historyBtn.style.display =
      isValidated && email ? 'inline-flex' : 'none';
  }

  restart() {
    this.showScreen('start');

    if (this.elements.progressPills) {
      const pills =
        this.elements.progressPills.querySelectorAll('.progress-pill');
      pills.forEach((pill) => {
        pill.style.background = 'rgba(255,255,255,0.2)';
        pill.classList.remove('completed');
      });
    }
  }

  showScreen(name) {
    Object.values(this.screens).forEach((screen) => {
      if (screen) screen.style.display = 'none';
    });

    if (this.screens[name]) {
      this.screens[name].style.display = 'block';
      this.screens[name].classList.add('active');

      if (window.gsap) {
        gsap.fromTo(
          this.screens[name],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        );
      }
    }
  }

  showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (toast && toastMessage && toastIcon) {
      toastIcon.textContent = '✓';
      toastMessage.textContent = message;
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }
  }

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

let quiz;
document.addEventListener('DOMContentLoaded', () => {
  quiz = new QuizGame();

  setTimeout(() => {
    if (window.supabaseHandler) {
      window.supabaseHandler.updateAttemptsDisplay();
      window.supabaseHandler.updateHistoryButton();
    }
  }, 500);
});

window.quiz = quiz;
