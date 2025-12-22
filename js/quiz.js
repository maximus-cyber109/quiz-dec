// =================================
// QUIZ GAME ENGINE
// PinkBlue Quizmas 2025
// =================================

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
            redeem: document.getElementById('redeemBtn'),
            copy: document.getElementById('copyBtn'),
            leaderboard: document.getElementById('leaderboardBtn'),
            back: document.getElementById('backBtn')
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
            couponCode: document.getElementById('couponCode'),
            leaderboardContainer: document.getElementById('leaderboardContainer')
        };
    }

    bindEvents() {
        this.buttons.start.addEventListener('click', () => this.checkEmailAndShowRules());
        this.buttons.next.addEventListener('click', () => this.nextQuestion());
        this.buttons.tryAgain.addEventListener('click', () => this.restart());
        this.buttons.share.addEventListener('click', () => this.shareOnWhatsApp());
        this.buttons.redeem.addEventListener('click', () => this.redeemReward());
        this.buttons.copy.addEventListener('click', () => this.copyCoupon());
        this.buttons.leaderboard.addEventListener('click', () => this.showLeaderboard());
        this.buttons.back.addEventListener('click', () => this.showScreen('start'));

        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) historyBtn.addEventListener('click', () => this.showHistory());

        const backFromHistory = document.getElementById('backFromHistory');
        if (backFromHistory) backFromHistory.addEventListener('click', () => this.showScreen('start'));

        const rulesOkayBtn = document.getElementById('rulesOkayBtn');
        if (rulesOkayBtn) rulesOkayBtn.addEventListener('click', () => this.closeRulesAndStart());
    }

    setupProgressPills() {
        for (let i = 0; i < CONFIG.quiz.totalQuestions; i++) {
            const pill = document.createElement('div');
            pill.className = 'progress-pill';
            pill.dataset.index = i;
            this.elements.progressPills.appendChild(pill);
        }
    }

    // =========================
    // SCREEN MANAGEMENT
    // =========================

    showScreen(name) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[name].classList.add('active');

        gsap.fromTo(this.screens[name],
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        );
    }

    // =========================
    // RULES / EMAIL
    // =========================

    checkEmailAndShowRules() {
        if (!supabaseHandler || !supabaseHandler.isValidated) {
            this.showToast('Validating your email, please wait…', 2000);
            setTimeout(() => {
                if (supabaseHandler && supabaseHandler.isValidated) {
                    this.showRulesModal();
                } else {
                    this.showToast('Please enter your email to continue', 3000);
                }
            }, 800);
        } else {
            this.showRulesModal();
        }
    }

    showRulesModal() {
        const modal = document.getElementById('rulesModal');
        modal.classList.add('active');
    }

    closeRulesAndStart() {
        const modal = document.getElementById('rulesModal');
        gsap.to(modal, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            onComplete: () => {
                modal.classList.remove('active');
                modal.style.opacity = '';
                modal.style.scale = '';
                this.startCountdown();
            }
        });
    }

    // =========================
    // COUNTDOWN
    // =========================

    startCountdown() {
        const overlay = document.getElementById('countdownOverlay');
        const numberEl = document.getElementById('countdownNumber');
        overlay.classList.add('active');

        let count = 3;

        const interval = setInterval(() => {
            if (count === 0) {
                numberEl.textContent = 'GO!';
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
                clearInterval(interval);
            } else {
                numberEl.textContent = count;
                gsap.fromTo(numberEl,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
                );
                count--;
            }
        }, 1000);
    }

    // =========================
    // START QUIZ
    // =========================

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = CONFIG.quiz.timeLimit;
        this.selectedAnswer = null;
        this.startTime = Date.now();
        this.answers = [];
        this.isAnswerLocked = false;

        // Dynamic difficulty selection from CONFIG.questions
        const easyQuestions = CONFIG.questions.filter(q => q.difficulty === 'easy');
        const mediumQuestions = CONFIG.questions.filter(q => q.difficulty === 'medium');
        const hardQuestions = CONFIG.questions.filter(q => q.difficulty === 'hard');

        const selectedEasy = this.shuffleArray(easyQuestions).slice(0, CONFIG.quiz.easyQuestions);
        const selectedMedium = this.shuffleArray(mediumQuestions).slice(0, CONFIG.quiz.mediumQuestions);
        const selectedHard = this.shuffleArray(hardQuestions).slice(0, CONFIG.quiz.hardQuestions);

        this.questions = [...selectedEasy, ...selectedMedium, ...selectedHard];

        this.showScreen('quiz');
        this.loadQuestion();
        this.startTimer();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestion];

        this.elements.qNumber.textContent = String(this.currentQuestion + 1).padStart(2, '0');
        this.elements.questionText.textContent = question.question;

        this.updateProgress();
        this.loadOptions(question.options);

        this.buttons.next.disabled = true;
        this.buttons.next.classList.add('btn-disabled');
        this.selectedAnswer = null;
        this.isAnswerLocked = false;
    }

    loadOptions(options) {
        this.elements.optionsList.innerHTML = '';

        options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option-item';
            optionEl.dataset.index = index;
            optionEl.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;

            optionEl.addEventListener('click', () => this.selectAnswer(index));

            gsap.fromTo(optionEl,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    delay: index * 0.06,
                    ease: 'back.out(1.7)'
                }
            );

            this.elements.optionsList.appendChild(optionEl);
        });
    }

    // =========================
    // ANSWERS
    // =========================

    selectAnswer(index) {
        if (this.isAnswerLocked) return;

        const options = this.elements.optionsList.querySelectorAll('.option-item');
        options.forEach(o => o.classList.remove('selected'));
        options[index].classList.add('selected');

        if (navigator.vibrate) navigator.vibrate(10);

        this.selectedAnswer = index;
        this.buttons.next.disabled = false;
        this.buttons.next.classList.remove('btn-disabled');
    }

    nextQuestion() {
        if (this.selectedAnswer === null || this.isAnswerLocked) return;

        this.isAnswerLocked = true;

        const question = this.questions[this.currentQuestion];
        const options = this.elements.optionsList.querySelectorAll('.option-item');
        const isCorrect = this.selectedAnswer === question.correct;

        options.forEach((opt, idx) => {
            if (idx === question.correct) {
                opt.classList.add('correct');
            } else if (idx === this.selectedAnswer) {
                opt.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            this.score++;
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

    // =========================
    // PROGRESS / TIMER
    // =========================

    updateProgress() {
        this.elements.progressText.textContent =
            `Question ${this.currentQuestion + 1} of ${CONFIG.quiz.totalQuestions}`;
    }

    updateProgressPill(index, isCorrect) {
        const pill = this.elements.progressPills.querySelector(`[data-index="${index}"]`);
        if (!pill) return;

        pill.classList.add('completed');
        pill.style.background = isCorrect ? 'var(--success)' : 'var(--error)';
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
            this.elements.timer.textContent =
                `Time: ${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // =========================
    // END QUIZ / RESULTS
    // =========================

    endQuiz() {
        clearInterval(this.timer);
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        this.showResults(timeTaken);
    }

    async showResults(timeTaken) {
        this.showScreen('results');

        const rewardDisplay = supabaseHandler.getRewardForScore(this.score);
        const rewardCode = supabaseHandler.getRewardCodeForScore(this.score);
        const hasRewardsLeft = supabaseHandler.hasRewardAttemptsLeft();

        this.animateScore();

        const titles = {
            10: "Dental Genius! 🎯",
            9: "Almost Perfect! 💪",
            8: "Knowledge Champion! 🏆",
            7: "Pretty Sharp! ⭐",
            6: "Not Bad at All! 👍",
            5: "Decent Try! 📚",
            4: "Room to Grow! 🌱",
            3: "Keep Practicing! 💡",
            2: "Learning Mode! 📖",
            1: "Just Getting Started! 🚀",
            0: "Everyone Starts Somewhere! 💪"
        };

        const subtitles = {
            10: "You're a legend",
            9: "So close to perfection",
            8: "Impressive knowledge",
            7: "Solid performance",
            6: "Good effort",
            5: "You got this halfway",
            4: "Keep going",
            3: "Practice makes perfect",
            2: "Don't give up",
            1: "Try again, you'll improve",
            0: "Better luck next time"
        };

        this.elements.resultsTitle.textContent = titles[this.score] || "Nice work!";
        this.elements.resultsSubtitle.textContent = subtitles[this.score] || "Keep learning";

        const rewardCard = document.getElementById('rewardCard');
        const noRewardsMessage = document.getElementById('noRewardsMessageResults');

        if (!hasRewardsLeft || !rewardCode) {
            if (rewardCard) rewardCard.style.display = 'none';
            if (noRewardsMessage) noRewardsMessage.style.display = 'block';
        } else {
            if (rewardCard) rewardCard.style.display = 'block';
            if (noRewardsMessage) noRewardsMessage.style.display = 'none';

            this.elements.rewardTitle.textContent = rewardDisplay?.title || 'Your reward';
            this.elements.rewardDesc.textContent = rewardDisplay?.description || '';
            this.elements.couponCode.textContent = rewardCode;
        }

        await supabaseHandler.saveQuizResult(
            this.score,
            timeTaken,
            rewardCode,
            this.answers
        );
    }

    animateScore() {
        const target = this.score;
        const obj = { value: 0 };

        gsap.to(obj, {
            value: target,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
                this.elements.scoreValue.textContent = Math.floor(obj.value);
            }
        });
    }

    // =========================
    // HISTORY / LEADERBOARD
    // =========================

    async showHistory() {
        this.showScreen('history');

        const container = document.getElementById('historyContainer');
        container.innerHTML = `
          <div class="loader">
            <div class="loader-spinner"></div>
          </div>
        `;

        const data = await supabaseHandler.getUserHistory();
        container.innerHTML = '';

        if (!data.length) {
            container.innerHTML = `
              <div class="history-empty">
                <div class="history-empty-icon" style="font-size:3rem;margin-bottom:0.5rem;">📜</div>
                <div>No attempts yet.</div>
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
                  ${formatted}<br>
                  <small style="opacity:0.7;">Attempt #${entry.attempt_number}</small>
                </div>
                <div class="history-score">
                  ${entry.score}<span style="opacity:0.5;font-size:1rem;">/10</span>
                </div>
              </div>
              <div class="history-body">
                <div class="history-reward">
                  Time: ${mins}:${secs.toString().padStart(2, '0')}
                </div>
                ${entry.reward ? `
                  <div class="history-coupon">
                    <div class="history-coupon-code">${entry.reward}</div>
                    <button class="history-copy-btn" onclick="quiz.copyCouponFromHistory('${entry.reward}')">
                      Copy
                    </button>
                  </div>` : ''}
              </div>
            `;
            container.appendChild(item);

            gsap.fromTo(item,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.4, delay: index * 0.05, ease: 'power2.out' }
            );
        });
    }

    async showLeaderboard() {
        this.showScreen('leaderboard');

        const container = this.elements.leaderboardContainer;
        container.innerHTML = `
          <div class="loader">
            <div class="loader-spinner"></div>
          </div>
        `;

        const data = await supabaseHandler.getLeaderboard();
        container.innerHTML = '';

        if (!data.length) {
            container.innerHTML = `
              <div style="text-align:center;padding:40px;opacity:0.7;">
                No entries yet. Be the first!
              </div>`;
            return;
        }

        data.forEach((entry, index) => {
            const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1);
            const name = entry.name || entry.email.split('@')[0];
            const mins = Math.floor(entry.time_taken / 60);
            const secs = entry.time_taken % 60;

            const item = document.createElement('div');
            item.className = 'leader-item';
            item.innerHTML = `
              <div class="leader-rank ${rankClass}">${medal}</div>
              <div class="leader-info">
                <div class="leader-name">${name}</div>
                <div class="leader-time">Time: ${mins}:${secs.toString().padStart(2, '0')}</div>
              </div>
              <div class="leader-score">
                ${entry.score}<span style="opacity:0.5;font-size:1rem;">/10</span>
              </div>
            `;
            container.appendChild(item);

            gsap.fromTo(item,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.4, delay: index * 0.05, ease: 'power2.out' }
            );
        });
    }

    // =========================
    // ACTIONS
    // =========================

    shareOnWhatsApp() {
        const message = CONFIG.shareMessage(
            this.score,
            CONFIG.quiz.totalQuestions,
            (supabaseHandler && supabaseHandler.userName) || 'I'
        );
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        this.showToast('Opening WhatsApp…', 2000);
    }

    redeemReward() {
        window.open(CONFIG.urls.redeem, '_blank');
    }

    copyCoupon() {
        const code = this.elements.couponCode.textContent.trim();
        if (!code) return;

        navigator.clipboard.writeText(code).then(() => {
            this.showToast('Coupon code copied', 2000);
            if (navigator.vibrate) navigator.vibrate([10, 40, 10]);
        }).catch(() => {
            this.showToast('Failed to copy code', 2000);
        });
    }

    copyCouponFromHistory(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showToast('Coupon code copied', 2000);
        }).catch(() => {
            this.showToast('Failed to copy code', 2000);
        });
    }

    restart() {
        this.showScreen('start');

        const pills = this.elements.progressPills.querySelectorAll('.progress-pill');
        pills.forEach(pill => {
            pill.style.background = 'rgba(255,255,255,0.2)';
            pill.style.width = '24px';
            pill.classList.remove('completed');
        });
    }

    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');

        toastIcon.textContent = '✓';
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => toast.classList.remove('show'), duration);
    }

    shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}

let quiz;
document.addEventListener('DOMContentLoaded', () => {
    quiz = new QuizGame();
});
