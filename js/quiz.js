// =================================
// QUIZ GAME ENGINE
// PinkBlue Quizmas 2025
// =================================

class QuizGame {
    constructor() {
        console.log('🎮 Initializing Quiz Game...');
        
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
        console.log('⚙️ Setting up quiz game...');
        this.cacheElements();
        this.bindEvents();
        this.setupProgressPills();
        console.log('✅ Quiz game initialized');
    }

    cacheElements() {
        console.log('📦 Caching DOM elements...');
        
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
            timer: document.getElementById('timerDisplay'),
            timerProgress: document.getElementById('timerProgress'),
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
        
        console.log('✅ DOM elements cached');
    }

    bindEvents() {
        console.log('🔗 Binding event listeners...');
        
        this.buttons.start.addEventListener('click', () => this.checkEmailAndShowRules());
        this.buttons.next.addEventListener('click', () => this.nextQuestion());
        this.buttons.tryAgain.addEventListener('click', () => this.restart());
        this.buttons.share.addEventListener('click', () => this.shareOnWhatsApp());
        this.buttons.redeem.addEventListener('click', () => this.redeemReward());
        this.buttons.copy.addEventListener('click', () => this.copyCoupon());
        this.buttons.leaderboard.addEventListener('click', () => this.showLeaderboard());
        this.buttons.back.addEventListener('click', () => this.showScreen('start'));

        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.showHistory());
        }

        const backFromHistory = document.getElementById('backFromHistory');
        if (backFromHistory) {
            backFromHistory.addEventListener('click', () => this.showScreen('start'));
        }

        const rulesOkayBtn = document.getElementById('rulesOkayBtn');
        if (rulesOkayBtn) {
            rulesOkayBtn.addEventListener('click', () => this.closeRulesAndStart());
        }
        
        console.log('✅ Event listeners bound');
    }

    setupProgressPills() {
        for (let i = 0; i < CONFIG.quiz.totalQuestions; i++) {
            const pill = document.createElement('div');
            pill.className = 'progress-pill';
            pill.dataset.index = i;
            this.elements.progressPills.appendChild(pill);
        }
    }

    // =====================================
    // SCREEN MANAGEMENT
    // =====================================

    showScreen(screenName) {
        console.log('🖥️ Switching to screen:', screenName);
        
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        this.screens[screenName].classList.add('active');

        gsap.fromTo(this.screens[screenName], 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }

    // =====================================
    // RULES MODAL
    // =====================================

    checkEmailAndShowRules() {
        console.log('🚀 Start button clicked');
        console.log('📧 User validation status:', supabaseHandler.isValidated);
        console.log('🎯 Attempts used:', supabaseHandler.attemptsUsed);
        
        if (!supabaseHandler.isValidated) {
            console.warn('⚠️ User not validated yet');
            this.showToast('Please wait, validating your email...', 2000);
            
            setTimeout(() => {
                if (supabaseHandler.isValidated) {
                    this.showRulesModal();
                } else {
                    this.showToast('Please enter your email to continue', 3000);
                }
            }, 1000);
        } else {
            console.log('✅ User validated, showing rules');
            this.showRulesModal();
        }
    }

    showRulesModal() {
        console.log('📋 Showing rules modal');
        const modal = document.getElementById('rulesModal');
        modal.classList.add('active');
    }

    closeRulesAndStart() {
        console.log('✅ Rules accepted, starting countdown');
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

    // =====================================
    // COUNTDOWN
    // =====================================

    startCountdown() {
        console.log('⏳ Starting countdown...');
        
        const overlay = document.getElementById('countdownOverlay');
        const numberEl = document.getElementById('countdownNumber');
        
        overlay.classList.add('active');
        
        let count = 3;
        
        const countInterval = setInterval(() => {
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
                        }, 500);
                    }
                });
                
                clearInterval(countInterval);
            } else {
                numberEl.textContent = count;
                
                gsap.fromTo(numberEl, 
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
                );
                
                count--;
            }
        }, 1000);
    }

    // =====================================
    // START QUIZ - DYNAMIC DIFFICULTY
    // =====================================

    startQuiz() {
        console.log('🎮 Starting quiz with dynamic difficulty...');
        
        try {
            this.currentQuestion = 0;
            this.score = 0;
            this.timeLeft = CONFIG.quiz.timeLimit;
            this.selectedAnswer = null;
            this.startTime = Date.now();
            this.answers = [];
            this.isAnswerLocked = false;

            // Select questions by difficulty
            console.log('🎲 Selecting questions by difficulty...');
            
            const easyQuestions = CONFIG.questions.filter(q => q.difficulty === 'easy');
            const mediumQuestions = CONFIG.questions.filter(q => q.difficulty === 'medium');
            const hardQuestions = CONFIG.questions.filter(q => q.difficulty === 'hard');

            console.log('📊 Available questions:', {
                easy: easyQuestions.length,
                medium: mediumQuestions.length,
                hard: hardQuestions.length
            });

            // Questions 1-3: Easy
            const selectedEasy = this.shuffleArray(easyQuestions).slice(0, CONFIG.quiz.easyQuestions);
            
            // Questions 4-7: Medium
            const selectedMedium = this.shuffleArray(mediumQuestions).slice(0, CONFIG.quiz.mediumQuestions);
            
            // Questions 8-10: Hard
            const selectedHard = this.shuffleArray(hardQuestions).slice(0, CONFIG.quiz.hardQuestions);

            // Combine in order
            this.questions = [
                ...selectedEasy,
                ...selectedMedium,
                ...selectedHard
            ];

            console.log('✅ Questions selected:', {
                total: this.questions.length,
                easy: selectedEasy.length,
                medium: selectedMedium.length,
                hard: selectedHard.length
            });

            this.showScreen('quiz');
            this.loadQuestion();
            this.startTimer();

            console.log('✅ Quiz started successfully!');
            
        } catch (error) {
            console.error('❌ FATAL ERROR starting quiz:', error);
            this.showToast('Something went wrong. Check console for details.', 5000);
        }
    }

    // =====================================
    // QUESTION LOADING
    // =====================================

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        
        console.log(`📝 Loading question ${this.currentQuestion + 1}/${this.questions.length}`);
        console.log(`Difficulty: ${question.difficulty}`);
        
        this.elements.qNumber.textContent = String(this.currentQuestion + 1).padStart(2, '0');
        
        gsap.fromTo(this.elements.questionText, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
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
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: 'back.out(1.7)'
                }
            );
            
            this.elements.optionsList.appendChild(optionEl);
        });
    }

    // =====================================
    // ANSWER SELECTION
    // =====================================

    selectAnswer(index) {
        if (this.isAnswerLocked) return;

        console.log('✓ Answer selected:', index);

        const options = this.elements.optionsList.querySelectorAll('.option-item');
        
        options.forEach(opt => opt.classList.remove('selected'));
        options[index].classList.add('selected');
        
        gsap.to(options[index], {
            scale: 0.98,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        this.selectedAnswer = index;
        
        this.buttons.next.disabled = false;
        this.buttons.next.classList.remove('btn-disabled');

        this.playSound('select');
    }

    // =====================================
    // NEXT QUESTION
    // =====================================

    nextQuestion() {
        if (this.selectedAnswer === null || this.isAnswerLocked) return;

        console.log('➡️ Moving to next question');

        this.isAnswerLocked = true;

        const question = this.questions[this.currentQuestion];
        const options = this.elements.optionsList.querySelectorAll('.option-item');
        const isCorrect = this.selectedAnswer === question.correct;

        console.log('Answer correct:', isCorrect);

        options.forEach((opt, index) => {
            if (index === question.correct) {
                opt.classList.add('correct');
            } else if (index === this.selectedAnswer) {
                opt.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            this.score++;
            this.playSound('correct');
            
            if (CONFIG.animations.enabled) {
                this.miniConfetti();
            }
        } else {
            this.playSound('wrong');
        }

        this.answers.push({
            question: question.question,
            selected: this.selectedAnswer,
            correct: question.correct,
            isCorrect: isCorrect,
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
        }, 1500);
    }

    // =====================================
    // PROGRESS
    // =====================================

    updateProgress() {
        gsap.to(this.elements.progressPills.querySelector(`[data-index="${this.currentQuestion}"]`), {
            backgroundColor: '#4FACFE',
            width: '32px',
            duration: 0.5,
            ease: 'power2.out'
        });

        this.elements.progressText.textContent = 
            `Question ${this.currentQuestion + 1} of ${CONFIG.quiz.totalQuestions}`;
    }

    updateProgressPill(index, isCorrect) {
        const pill = this.elements.progressPills.querySelector(`[data-index="${index}"]`);
        
        gsap.to(pill, {
            backgroundColor: isCorrect ? '#00D68F' : '#FF6B6B',
            duration: 0.3,
            ease: 'power2.out'
        });

        pill.classList.add('completed');
    }

    // =====================================
    // TIMER
    // =====================================

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft === 30) {
                gsap.to(this.elements.timer.parentElement, {
                    scale: 1.1,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 5,
                    ease: 'power2.inOut'
                });
                this.playSound('warning');
            }
            
            if (this.timeLeft <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.elements.timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        const percentage = (this.timeLeft / CONFIG.quiz.timeLimit) * 100;
        gsap.to(this.elements.timerProgress, {
            width: percentage + '%',
            duration: 1,
            ease: 'linear'
        });

        if (this.timeLeft <= 30) {
            this.elements.timer.style.color = '#FF6B6B';
        }
    }

    // =====================================
    // QUIZ END
    // =====================================

    endQuiz() {
        console.log('🏁 Quiz ended');
        console.log('Final score:', this.score);
        
        clearInterval(this.timer);
        
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        console.log('Time taken:', timeTaken, 'seconds');
        
        this.showResults(timeTaken);
    }

    async showResults(timeTaken) {
        console.log('📊 Showing results...');
        
        this.showScreen('results');
        
        // Get reward
        const reward = supabaseHandler.getRewardForScore(this.score);
        console.log('🎁 Reward earned:', reward);
        
        // Animate score
        this.animateScore();

        // Quirky titles based on score
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

        this.elements.resultsTitle.textContent = titles[this.score] || "Nice Try!";
        this.elements.resultsSubtitle.textContent = subtitles[this.score] || "Keep learning";

        // Check if user has reward attempts left
        const hasRewardsLeft = supabaseHandler.hasRewardAttemptsLeft();
        console.log('🎯 Has reward attempts left:', hasRewardsLeft);

        const rewardCard = document.getElementById('rewardCard');
        const noRewardsMessage = document.getElementById('noRewardsMessage');

        if (!hasRewardsLeft) {
            // Hide reward card, show practice mode message
            rewardCard.style.display = 'none';
            noRewardsMessage.style.display = 'block';
            console.log('⚠️ No rewards left - Practice mode');
        } else {
            // Show reward card
            rewardCard.style.display = 'block';
            noRewardsMessage.style.display = 'none';
            
            this.elements.rewardTitle.textContent = 'Your Reward';
            this.elements.rewardDesc.textContent = reward.reward_description || reward.description;
            this.elements.couponCode.textContent = reward.coupon;
        }

        // Save to database
        await supabaseHandler.saveQuizResult(
            this.score, 
            timeTaken, 
            reward.coupon,
            this.answers
        );

        // Confetti for high scores
        if (this.score >= 7 && CONFIG.animations.enabled) {
            this.showConfetti();
        }

        this.playSound('finish');
    }

    animateScore() {
        const targetScore = this.score;
        const scoreObj = { value: 0 };
        
        gsap.to(scoreObj, {
            value: targetScore,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                this.elements.scoreValue.textContent = Math.floor(scoreObj.value);
            }
        });
    }

    // =====================================
    // HISTORY
    // =====================================

    async showHistory() {
        console.log('📜 Showing quiz history');
        
        this.showScreen('history');
        
        this.elements.historyContainer = document.getElementById('historyContainer');
        
        this.elements.historyContainer.innerHTML = `
            <div class="loader">
                <div class="loader-spinner"></div>
            </div>
        `;
        
        const data = await supabaseHandler.getUserHistory();
        
        this.elements.historyContainer.innerHTML = '';
        
        if (data.length === 0) {
            this.elements.historyContainer.innerHTML = `
                <div class="history-empty">
                    <div class="history-empty-icon" style="font-size:4rem;margin-bottom:1rem;opacity:0.5;">📜</div>
                    <div style="font-size:1.1rem;margin-bottom:0.5rem;">No history yet</div>
                    <div style="font-size:0.9rem;opacity:0.7;">Take the quiz to see your results</div>
                </div>
            `;
            return;
        }
        
        data.forEach((entry, index) => {
            const date = new Date(entry.created_at);
            const formattedDate = date.toLocaleDateString('en-US', { 
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
                        ${formattedDate}
                        <br>
                        <small style="opacity: 0.7;">Attempt #${entry.attempt_number}</small>
                    </div>
                    <div class="history-score">${entry.score}<span style="opacity:0.5; font-size:1rem;">/10</span></div>
                </div>
                <div class="history-body">
                    <div class="history-reward">
                        Time: ${mins}:${secs.toString().padStart(2, '0')}
                    </div>
                    ${entry.reward !== 'TRYAGAIN' ? `
                        <div class="history-coupon">
                            <div class="history-coupon-code">${entry.reward}</div>
                            <button class="history-copy-btn" onclick="quiz.copyCouponFromHistory('${entry.reward}')">
                                Copy
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
            
            this.elements.historyContainer.appendChild(item);
            
            gsap.fromTo(item, 
                { opacity: 0, x: -30 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: 'power2.out'
                }
            );
        });
    }

    copyCouponFromHistory(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showToast('Coupon code copied', 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy code', 2000);
        });
    }

    // =====================================
    // LEADERBOARD
    // =====================================

    async showLeaderboard() {
        console.log('🏆 Showing leaderboard');
        
        this.showScreen('leaderboard');
        
        this.elements.leaderboardContainer.innerHTML = `
            <div class="loader">
                <div class="loader-spinner"></div>
            </div>
        `;
        
        const data = await supabaseHandler.getLeaderboard();
        
        this.elements.leaderboardContainer.innerHTML = '';
        
        if (data.length === 0) {
            this.elements.leaderboardContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
                    No leaderboard data yet. Be the first!
                </div>
            `;
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
                <div class="leader-score">${entry.score}<span style="opacity:0.5; font-size:1rem;">/10</span></div>
            `;
            
            this.elements.leaderboardContainer.appendChild(item);
            
            gsap.fromTo(item, 
                { opacity: 0, x: -30 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: 'power2.out'
                }
            );
        });
    }

    // =====================================
    // ACTIONS
    // =====================================

    shareOnWhatsApp() {
        const message = CONFIG.shareMessage(
            this.score, 
            CONFIG.quiz.totalQuestions,
            supabaseHandler.userName
        );
        
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        this.showToast('Opening WhatsApp...', 2000);
    }

    redeemReward() {
        window.open(CONFIG.urls.redeem, '_blank');
    }

    copyCoupon() {
        const code = this.elements.couponCode.textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            this.showToast('Coupon code copied', 2000);
            
            gsap.to(this.elements.couponCode, {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });

            if (navigator.vibrate) {
                navigator.vibrate([10, 50, 10]);
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy code', 2000);
        });
    }

    restart() {
        console.log('🔄 Restarting quiz');
        
        this.showScreen('start');
        
        const pills = this.elements.progressPills.querySelectorAll('.progress-pill');
        pills.forEach(pill => {
            pill.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            pill.style.width = '24px';
            pill.classList.remove('completed', 'active');
        });
    }

    // =====================================
    // EFFECTS
    // =====================================

    showConfetti() {
        const duration = CONFIG.animations.confettiDuration;
        const end = Date.now() + duration;

        const colors = ['#6C5CE7', '#A29BFE', '#00F2FE', '#4FACFE', '#00D68F'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    miniConfetti() {
        confetti({
            particleCount: 20,
            spread: 40,
            origin: { y: 0.6 },
            colors: ['#00D68F', '#4FACFE', '#A29BFE']
        });
    }

    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        toastIcon.textContent = '✓';
        toastMessage.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    playSound(type) {
        if (navigator.vibrate) {
            const patterns = {
                'select': [10],
                'correct': [10, 50, 10],
                'wrong': [50],
                'warning': [50, 50, 50],
                'start': [10, 30, 10],
                'finish': [50, 100, 50]
            };
            
            if (patterns[type]) {
                navigator.vibrate(patterns[type]);
            }
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

let quiz;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DOM Content Loaded - Initializing Quiz');
    quiz = new QuizGame();
});
