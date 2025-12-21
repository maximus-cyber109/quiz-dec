// =================================
// QUIZ GAME LOGIC
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
        
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        // Screens
        this.screens = {
            start: document.getElementById('startScreen'),
            quiz: document.getElementById('quizScreen'),
            results: document.getElementById('resultsScreen'),
            leaderboard: document.getElementById('leaderboardScreen')
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
            timer: document.getElementById('timerValue'),
            progress: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            questionNumber: document.getElementById('questionNumber'),
            questionText: document.getElementById('questionText'),
            optionsContainer: document.getElementById('optionsContainer'),
            scoreValue: document.getElementById('scoreValue'),
            scoreRing: document.getElementById('scoreRing'),
            trophyIcon: document.getElementById('trophyIcon'),
            resultsTitle: document.getElementById('resultsTitle'),
            rewardTitle: document.getElementById('rewardTitle'),
            rewardDesc: document.getElementById('rewardDesc'),
            couponCode: document.getElementById('couponCode')
        };
    }

    bindEvents() {
        this.buttons.start.addEventListener('click', () => this.startCountdown());
        this.buttons.next.addEventListener('click', () => this.nextQuestion());
        this.buttons.tryAgain.addEventListener('click', () => this.restart());
        this.buttons.share.addEventListener('click', () => this.shareOnWhatsApp());
        this.buttons.redeem.addEventListener('click', () => this.redeemReward());
        this.buttons.copy.addEventListener('click', () => this.copyCoupon());
        this.buttons.leaderboard.addEventListener('click', () => this.showLeaderboard());
        this.buttons.back.addEventListener('click', () => this.showScreen('start'));
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');

        // Animate with GSAP
        gsap.from(this.screens[screenName], {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });
    }

    startCountdown() {
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
        // Select random questions
        this.questions = this.shuffleArray([...CONFIG.questions])
            .slice(0, CONFIG.quiz.totalQuestions);
        
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = CONFIG.quiz.timeLimit;
        this.selectedAnswer = null;
        this.startTime = Date.now();
        this.answers = [];

        // Minimize header
        const header = document.getElementById('mainHeader');
        gsap.to(header, {
            scale: 0.9,
            opacity: 0.8,
            duration: 0.5
        });

        this.showScreen('quiz');
        this.loadQuestion();
        this.startTimer();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        
        // Update question number
        this.elements.questionNumber.textContent = 
            String(this.currentQuestion + 1).padStart(2, '0');
        
        // Update question text with animation
        gsap.from(this.elements.questionText, {
            opacity: 0,
            y: 20,
            duration: 0.5
        });
        this.elements.questionText.textContent = question.question;

        // Update progress
        const progress = ((this.currentQuestion + 1) / CONFIG.quiz.totalQuestions) * 100;
        gsap.to(this.elements.progress, {
            width: progress + '%',
            duration: 0.6,
            ease: 'power2.out'
        });
        this.elements.progressText.textContent = 
            `Question ${this.currentQuestion + 1} of ${CONFIG.quiz.totalQuestions}`;

        // Load options
        this.loadOptions(question.options);

        // Reset next button
        this.buttons.next.disabled = true;
        this.buttons.next.classList.add('btn-disabled');
        this.selectedAnswer = null;
    }

    loadOptions(options) {
        this.elements.optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option';
            optionEl.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;
            
            optionEl.addEventListener('click', () => this.selectAnswer(index));
            
            // Animate option appearance
            gsap.from(optionEl, {
                opacity: 0,
                x: -30,
                duration: 0.4,
                delay: index * 0.1,
                ease: 'back.out(1.7)'
            });
            
            this.elements.optionsContainer.appendChild(optionEl);
        });
    }

    selectAnswer(index) {
        const options = this.elements.optionsContainer.querySelectorAll('.option');
        
        // Remove previous selection
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selection
        options[index].classList.add('selected');
        
        // Animate selection
        gsap.to(options[index], {
            x: 5,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
        
        this.selectedAnswer = index;
        
        // Enable next button
        this.buttons.next.disabled = false;
        this.buttons.next.classList.remove('btn-disabled');
    }

    nextQuestion() {
        if (this.selectedAnswer === null) return;

        const question = this.questions[this.currentQuestion];
        const options = this.elements.optionsContainer.querySelectorAll('.option');
        
        // Show correct/incorrect
        options.forEach((opt, index) => {
            if (index === question.correct) {
                opt.classList.add('correct');
            } else if (index === this.selectedAnswer) {
                opt.classList.add('incorrect');
            }
        });

        // Check answer
        const isCorrect = this.selectedAnswer === question.correct;
        if (isCorrect) {
            this.score++;
        }

        // Store answer
        this.answers.push({
            question: question.question,
            selected: this.selectedAnswer,
            correct: question.correct,
            isCorrect: isCorrect
        });

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

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            // Warning animation at 30 seconds
            if (this.timeLeft === 30) {
                gsap.to(this.elements.timer.parentElement, {
                    scale: 1.1,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 5
                });
            }
            
            if (this.timeLeft <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.elements.timer.textContent = 
            `${mins}:${secs.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (this.timeLeft <= 30) {
            this.elements.timer.parentElement.style.background = 
                'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)';
        }
    }

    endQuiz() {
        clearInterval(this.timer);
        
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        
        this.showResults(timeTaken);
    }

    async showResults(timeTaken) {
        this.showScreen('results');
        
        // Animate trophy
        gsap.from(this.elements.trophyIcon, {
            scale: 0,
            rotation: -180,
            duration: 1,
            ease: 'back.out(1.7)'
        });

        // Animate score
        gsap.to({}, {
            duration: 2,
            onUpdate: function() {
                const progress = this.progress();
                const currentScore = Math.floor(progress * quiz.score);
                quiz.elements.scoreValue.textContent = currentScore;
            }
        });

        // Animate score ring
        const circumference = 2 * Math.PI * 90;
        const scorePercent = (this.score / CONFIG.quiz.totalQuestions) * 100;
        const offset = circumference - (scorePercent / 100) * circumference;
        
        gsap.to(this.elements.scoreRing, {
            strokeDashoffset: offset,
            duration: 2,
            ease: 'power2.out'
        });

        // Get reward
        const reward = this.getReward(this.score);
        
        // Update reward display
        this.elements.trophyIcon.textContent = reward.trophy;
        this.elements.resultsTitle.textContent = reward.title;
        this.elements.rewardTitle.textContent = '🎁 ' + reward.message;
        this.elements.rewardDesc.textContent = reward.description;
        this.elements.couponCode.textContent = reward.coupon;

        // Hide reward card if no attempts left
        if (!supabaseHandler.hasRewardAttemptsLeft()) {
            document.getElementById('rewardCard').style.display = 'none';
            this.showToast('🎯 Practice mode - No more reward attempts!', 'info');
        }

        // Save to database
        await supabaseHandler.saveQuizResult(this.score, timeTaken, reward.coupon);

        // Show confetti for high scores
        if (this.score >= 7) {
            this.showConfetti();
        }
    }

    getReward(score) {
        return CONFIG.rewards.find(reward => 
            score >= reward.minScore && score <= reward.maxScore
        );
    }

    showConfetti() {
        const confetti = document.getElementById('confetti');
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${['#FFD700', '#FF6B35', '#00FF7F'][Math.floor(Math.random() * 3)]};
                top: 50%;
                left: 50%;
                border-radius: 50%;
            `;
            confetti.appendChild(particle);
            
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: 0,
                duration: 2,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }
    }

    async showLeaderboard() {
        this.showScreen('leaderboard');
        
        const container = document.getElementById('leaderboardContainer');
        container.innerHTML = '<div class="spinner"></div>';
        
        const data = await supabaseHandler.getLeaderboard();
        
        container.innerHTML = '';
        
        data.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1);
            const name = entry.email.split('@')[0];
            const mins = Math.floor(entry.time_taken / 60);
            const secs = entry.time_taken % 60;
            
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <div class="rank-medal">${medal}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${name}</div>
                    <div class="leaderboard-time">Time: ${mins}:${secs.toString().padStart(2, '0')}</div>
                </div>
                <div class="leaderboard-score">${entry.score}/10</div>
            `;
            
            container.appendChild(item);
            
            gsap.from(item, {
                opacity: 0,
                x: -30,
                duration: 0.5,
                delay: index * 0.05
            });
        });
    }

    shareOnWhatsApp() {
        const message = CONFIG.shareMessage(this.score, CONFIG.quiz.totalQuestions);
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    redeemReward() {
        window.open(CONFIG.urls.redeem, '_blank');
    }

    copyCoupon() {
        const code = this.elements.couponCode.textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            this.showToast('✅ Coupon code copied!', 'success');
            
            gsap.to(this.elements.couponCode, {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        });
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const icon = document.getElementById('toastIcon');
        const msg = document.getElementById('toastMessage');
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        icon.textContent = icons[type] || icons.info;
        msg.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    restart() {
        // Reset header
        const header = document.getElementById('mainHeader');
        gsap.to(header, {
            scale: 1,
            opacity: 1,
            duration: 0.5
        });
        
        this.showScreen('start');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Initialize quiz
let quiz;
document.addEventListener('DOMContentLoaded', () => {
    quiz = new QuizGame();
});
