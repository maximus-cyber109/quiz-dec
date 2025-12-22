// =================================
// QUIZ GAME ENGINE
// Modern, Smooth, Addictive
// =================================

class QuizGame {
    constructor() {
        console.log('🎮 Initializing Quiz Game...');
        
        // Game state
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = CONFIG.quiz.timeLimit;
        this.timer = null;
        this.questions = [];
        this.selectedAnswer = null;
        this.startTime = null;
        this.answers = [];
        this.isAnswerLocked = false;
        
        // DOM elements
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
        
        // Screens
        this.screens = {
            start: document.getElementById('startScreen'),
            quiz: document.getElementById('quizScreen'),
            results: document.getElementById('resultsScreen'),
            leaderboard: document.getElementById('leaderboardScreen'),
            history: document.getElementById('historyScreen')
        };

        // Buttons
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

        // Quiz elements
        this.elements = {
            timer: document.getElementById('timerDisplay'),
            timerProgress: document.getElementById('timerProgress'),
            progressText: document.getElementById('progressText'),
            progressPills: document.getElementById('progressPills'),
            qNumber: document.getElementById('qNumber'),
            questionText: document.getElementById('questionText'),
            optionsList: document.getElementById('optionsList'),
            scoreValue: document.getElementById('scoreValue'),
            scoreCircle: document.getElementById('scoreCircle'),
            trophyEmoji: document.getElementById('trophyEmoji'),
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
        
        this.buttons.start.addEventListener('click', () => this.checkEmailAndStart());
        this.buttons.next.addEventListener('click', () => this.nextQuestion());
        this.buttons.tryAgain.addEventListener('click', () => this.restart());
        this.buttons.share.addEventListener('click', () => this.shareOnWhatsApp());
        this.buttons.redeem.addEventListener('click', () => this.redeemReward());
        this.buttons.copy.addEventListener('click', () => this.copyCoupon());
        this.buttons.leaderboard.addEventListener('click', () => this.showLeaderboard());
        this.buttons.back.addEventListener('click', () => this.showScreen('start'));

        // History button
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.showHistory());
        }

        // Back button from history screen
        const backFromHistory = document.getElementById('backFromHistory');
        if (backFromHistory) {
            backFromHistory.addEventListener('click', () => this.showScreen('start'));
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
        
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Show requested screen
        this.screens[screenName].classList.add('active');

        // Animate entrance
        gsap.fromTo(this.screens[screenName], 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }

    // =====================================
    // START QUIZ
    // =====================================

    checkEmailAndStart() {
        console.log('🚀 Start button clicked');
        console.log('📧 User validation status:', supabaseHandler.isValidated);
        console.log('📧 User email:', supabaseHandler.userEmail);
        
        if (!supabaseHandler.isValidated) {
            console.warn('⚠️ User not validated yet, waiting...');
            this.showToast('⏳ Please wait, validating your email...', 2000);
            
            setTimeout(() => {
                console.log('🔄 Rechecking validation...');
                if (supabaseHandler.isValidated) {
                    console.log('✅ Validation successful, starting countdown');
                    this.startCountdown();
                } else {
                    console.error('❌ Validation failed');
                    this.showToast('❌ Please enter your email to continue', 3000);
                }
            }, 1000);
        } else {
            console.log('✅ User already validated, starting quiz');
            this.startCountdown();
        }
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

    startQuiz() {
        console.log('🎮 Starting quiz...');
        console.log('📊 Quiz config:', {
            totalQuestions: CONFIG.quiz.totalQuestions,
            timeLimit: CONFIG.quiz.timeLimit,
            questionsAvailable: CONFIG.questions.length
        });
        
        try {
            // Reset state
            this.currentQuestion = 0;
            this.score = 0;
            this.timeLeft = CONFIG.quiz.timeLimit;
            this.selectedAnswer = null;
            this.startTime = Date.now();
            this.answers = [];
            this.isAnswerLocked = false;

            // Select random questions
            console.log('🎲 Shuffling questions...');
            this.questions = this.shuffleArray([...CONFIG.questions])
                .slice(0, CONFIG.quiz.totalQuestions);
            
            console.log(`✅ Selected ${this.questions.length} questions`);

            // Show quiz screen
            console.log('🖥️ Switching to quiz screen');
            this.showScreen('quiz');

            // Load first question
            console.log('📝 Loading first question');
            this.loadQuestion();

            // Start timer
            console.log('⏱️ Starting timer');
            this.startTimer();

            console.log('✅ Quiz started successfully!');
            
        } catch (error) {
            console.error('❌ FATAL ERROR starting quiz:', error);
            console.error('Error stack:', error.stack);
            this.showToast('❌ Something went wrong. Check console for details.', 5000);
        }
    }

    // =====================================
    // QUESTION LOADING
    // =====================================

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        
        console.log(`📝 Loading question ${this.currentQuestion + 1}/${this.questions.length}`);
        console.log('Question:', question.question);
        
        // Update question number
        this.elements.qNumber.textContent = String(this.currentQuestion + 1).padStart(2, '0');
        
        // Animate question text
        gsap.fromTo(this.elements.questionText, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
        this.elements.questionText.textContent = question.question;

        // Update progress
        this.updateProgress();

        // Load options
        this.loadOptions(question.options);

        // Reset next button
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
            
            // Stagger animation
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
        
        // Remove previous selection
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add new selection
        options[index].classList.add('selected');
        
        // Animate selection
        gsap.to(options[index], {
            scale: 0.98,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Haptic feedback (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        this.selectedAnswer = index;
        
        // Enable next button
        this.buttons.next.disabled = false;
        this.buttons.next.classList.remove('btn-disabled');

        // Play sound
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

        // Show correct/incorrect
        options.forEach((opt, index) => {
            if (index === question.correct) {
                opt.classList.add('correct');
                gsap.to(opt, {
                    scale: 1.03,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            } else if (index === this.selectedAnswer) {
                opt.classList.add('incorrect');
                gsap.to(opt, {
                    x: [-10, 10, -10, 10, 0],
                    duration: 0.5,
                    ease: 'power2.inOut'
                });
            }
        });

        // Update score
        if (isCorrect) {
            this.score++;
            this.playSound('correct');
            
            // Confetti burst for correct answer
            if (CONFIG.animations.enabled) {
                this.miniConfetti();
            }
        } else {
            this.playSound('wrong');
        }

        // Store answer
        this.answers.push({
            question: question.question,
            selected: this.selectedAnswer,
            correct: question.correct,
            isCorrect: isCorrect,
            category: question.category
        });

        // Update progress pill
        this.updateProgressPill(this.currentQuestion, isCorrect);

        // Move to next question after delay
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
    // PROGRESS TRACKING
    // =====================================

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / CONFIG.quiz.totalQuestions) * 100;
        
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
            
            // Warning at 30 seconds
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
            
            // Time's up
            if (this.timeLeft <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.elements.timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        // Update progress bar
        const percentage = (this.timeLeft / CONFIG.quiz.timeLimit) * 100;
        gsap.to(this.elements.timerProgress, {
            width: percentage + '%',
            duration: 1,
            ease: 'linear'
        });

        // Change color when time running out
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
        const reward = this.getReward(this.score);
        console.log('🎁 Reward earned:', reward);
        
        // Animate trophy
        this.elements.trophyEmoji.textContent = reward.trophy;
        gsap.fromTo(this.elements.trophyEmoji, 
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)' }
        );

        // Animate score circle
        this.animateScoreCircle();

        // Update results
        this.elements.resultsTitle.textContent = reward.title;
        this.elements.resultsSubtitle.textContent = reward.subtitle;
        this.elements.rewardTitle.textContent = 'Your Reward 🎁';
        this.elements.rewardDesc.textContent = reward.description;
        this.elements.couponCode.textContent = reward.coupon;

        // Hide reward card if no attempts left
        const rewardCard = document.getElementById('rewardCard');
        if (!supabaseHandler.hasRewardAttemptsLeft()) {
            rewardCard.style.display = 'none';
            this.showToast('🎯 Practice mode - No reward attempts left', 3000);
        } else {
            rewardCard.style.display = 'block';
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

        // Play sound
        this.playSound('finish');
    }

    animateScoreCircle() {
        // Animate score number
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

        // Animate score circle
        const circumference = 2 * Math.PI * 90;
        const scorePercent = (this.score / CONFIG.quiz.totalQuestions) * 100;
        const offset = circumference - (scorePercent / 100) * circumference;
        
        gsap.to(this.elements.scoreCircle, {
            strokeDashoffset: offset,
            duration: 2,
            ease: 'power2.out'
        });
    }

    getReward(score) {
        return CONFIG.rewards.find(reward => 
            score >= reward.minScore && score <= reward.maxScore
        );
    }

    // =====================================
    // QUIZ HISTORY
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
                    <div class="history-empty-icon">📜</div>
                    <div class="history-empty-text">No quiz history yet!</div>
                    <div class="history-empty-hint">Take the quiz to see your results here.</div>
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
                        ⏱️ Time: ${mins}:${secs.toString().padStart(2, '0')}
                    </div>
                    <div class="history-reward">
                        🎁 ${entry.reward_description || 'Reward earned!'}
                    </div>
                    ${entry.reward !== 'TRYAGAIN' ? `
                        <div class="history-coupon">
                            <div class="history-coupon-code">${entry.reward}</div>
                            <button class="history-copy-btn" onclick="quiz.copyCouponFromHistory('${entry.reward}')">
                                📋 Copy
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
            
            this.elements.historyContainer.appendChild(item);
            
            // Stagger animation
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
            this.showToast('✅ Coupon code copied!', 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('❌ Failed to copy code', 2000);
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
            const isTopThree = index < 3;
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
            
            // Stagger animation
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
    // SHARING & ACTIONS
    // =====================================

    shareOnWhatsApp() {
        const message = CONFIG.shareMessage(
            this.score, 
            CONFIG.quiz.totalQuestions,
            supabaseHandler.userName
        );
        
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        this.showToast('✅ Opening WhatsApp...', 2000);
    }

    redeemReward() {
        window.open(CONFIG.urls.redeem, '_blank');
    }

    copyCoupon() {
        const code = this.elements.couponCode.textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            this.showToast('✅ Coupon code copied!', 2000);
            
            gsap.to(this.elements.couponCode, {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([10, 50, 10]);
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('❌ Failed to copy code', 2000);
        });
    }

    // =====================================
    // RESTART
    // =====================================

    restart() {
        console.log('🔄 Restarting quiz');
        
        this.showScreen('start');
        
        // Reset progress pills
        const pills = this.elements.progressPills.querySelectorAll('.progress-pill');
        pills.forEach(pill => {
            pill.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            pill.style.width = '24px';
            pill.classList.remove('completed', 'active');
        });
    }

    // =====================================
    // ANIMATIONS & EFFECTS
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
        
        // Set icon based on message
        if (message.includes('✅')) {
            toastIcon.textContent = '✅';
        } else if (message.includes('❌')) {
            toastIcon.textContent = '❌';
        } else if (message.includes('🎯')) {
            toastIcon.textContent = '🎯';
        } else {
            toastIcon.textContent = 'ℹ️';
        }
        
        toastMessage.textContent = message.replace(/[✅❌🎯]/g, '').trim();
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    playSound(type) {
        // Optional: Add sound effects
        // You can use Web Audio API or HTML5 Audio
        // For now, just haptic feedback
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

    // =====================================
    // UTILITIES
    // =====================================

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize quiz when DOM is ready
let quiz;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DOM Content Loaded - Initializing Quiz');
    quiz = new QuizGame();
});
