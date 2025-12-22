// =================================
// SUPABASE DATABASE HANDLER
// PinkBlue Quizmas 2025
// =================================

class SupabaseHandler {
    constructor() {
        this.client = null;
        this.userEmail = null;
        this.userName = null;
        this.userId = null;
        this.attemptsUsed = 0;
        this.isValidated = false;
        
        this.init();
    }

    async init() {
        // Initialize Supabase client
        this.client = window.supabase.createClient(
            CONFIG.supabase.url,
            CONFIG.supabase.key
        );

        // Try to get email from URL parameter (from Magento)
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');

        if (emailParam && this.isValidEmail(emailParam)) {
            // Email from Magento - validate it
            this.userEmail = emailParam;
            await this.validateEmail();
        } else {
            // No email - show modal
            this.showEmailModal();
        }
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showEmailModal() {
        const modal = document.getElementById('emailModal');
        const input = document.getElementById('emailInput');
        const submitBtn = document.getElementById('emailSubmitBtn');

        modal.classList.add('active');

        // Auto-focus input
        setTimeout(() => input.focus(), 300);

        // Handle enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        // Handle submit
        submitBtn.addEventListener('click', async () => {
            const email = input.value.trim();

            if (!this.isValidEmail(email)) {
                this.showToast('❌ Please enter a valid email address', 3000);
                input.classList.add('error');
                
                gsap.to(input, {
                    x: [-10, 10, -10, 10, 0],
                    duration: 0.5
                });
                
                return;
            }

            // Valid email
            input.classList.remove('error');
            this.userEmail = email;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text">Loading...</span>';

            await this.validateEmail();

            // Hide modal
            gsap.to(modal, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                    modal.classList.remove('active');
                    modal.style.opacity = '';
                    modal.style.scale = '';
                }
            });
        });
    }

    async validateEmail() {
        try {
            // Try to get existing user
            const { data, error } = await this.client
                .from('quiz_users')
                .select('*')
                .eq('email', this.userEmail)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading user:', error);
                return;
            }

            if (data) {
                // User exists
                this.userId = data.id;
                this.userName = data.name || this.userEmail.split('@')[0];
                this.attemptsUsed = data.attempts_used || 0;
            } else {
                // Create new user
                await this.createUser();
            }

            this.isValidated = true;

            // Update UI
            this.updateAttemptsDisplay();
            this.updateHistoryButton();

            // Load rewards preview
            this.loadRewardsPreview();

        } catch (err) {
            console.error('Validation error:', err);
            this.showToast('❌ Something went wrong. Please try again.', 3000);
        }
    }

    async createUser() {
        try {
            const userName = this.userEmail.split('@')[0];
            
            const { data, error } = await this.client
                .from('quiz_users')
                .insert([{
                    email: this.userEmail,
                    name: userName,
                    attempts_used: 0
                }])
                .select()
                .single();

            if (error) {
                console.error('Error creating user:', error);
                return;
            }

            this.userId = data.id;
            this.userName = data.name;
            this.attemptsUsed = 0;

            console.log('✅ New user created:', this.userEmail);

        } catch (err) {
            console.error('Error creating user:', err);
        }
    }

    async loadRewardsPreview() {
        try {
            const { data, error } = await this.client
                .from('reward_config')
                .select('*')
                .eq('active', true)
                .order('priority', { ascending: true });

            if (error) throw error;

            const carousel = document.getElementById('rewardsCarousel');
            carousel.innerHTML = '';

            const rewards = data || CONFIG.rewards;

            rewards.forEach((reward, index) => {
                const card = document.createElement('div');
                card.className = 'reward-preview-card';
                
                const imageHTML = reward.image_url 
                    ? `<img src="${reward.image_url}" alt="${reward.reward_title}" class="reward-preview-image" onerror="this.style.display='none'">` 
                    : `<div class="reward-preview-trophy">${reward.trophy_emoji}</div>`;
                
                card.innerHTML = `
                    ${imageHTML}
                    <div class="reward-preview-title">${reward.reward_title}</div>
                    <div class="reward-preview-score">Score ${reward.min_score}-${reward.max_score} out of 10</div>
                    <div class="reward-preview-desc">${reward.reward_description}</div>
                `;

                carousel.appendChild(card);

                // Stagger animation
                gsap.fromTo(card,
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, duration: 0.5, delay: index * 0.1, ease: 'back.out(1.7)' }
                );
            });

        } catch (err) {
            console.error('Error loading rewards preview:', err);
            // Fallback to config rewards
            this.loadRewardsFromConfig();
        }
    }

    loadRewardsFromConfig() {
        const carousel = document.getElementById('rewardsCarousel');
        carousel.innerHTML = '';

        CONFIG.rewards.forEach((reward, index) => {
            const card = document.createElement('div');
            card.className = 'reward-preview-card';
            card.innerHTML = `
                <div class="reward-preview-trophy">${reward.trophy}</div>
                <div class="reward-preview-title">${reward.title}</div>
                <div class="reward-preview-score">Score ${reward.minScore}-${reward.maxScore} out of 10</div>
                <div class="reward-preview-desc">${reward.description}</div>
            `;
            carousel.appendChild(card);
        });
    }

    async saveQuizResult(score, timeTaken, reward, answers) {
        if (!this.isValidated) {
            console.error('User not validated');
            return;
        }

        try {
            // Save quiz attempt
            const { error: attemptError } = await this.client
                .from('quiz_attempts')
                .insert([{
                    user_id: this.userId,
                    email: this.userEmail,
                    score: score,
                    time_taken: timeTaken,
                    reward: reward,
                    attempt_number: this.attemptsUsed + 1,
                    answers: answers
                }]);

            if (attemptError) {
                console.error('Error saving attempt:', attemptError);
            }

            // Increment attempts count
            this.attemptsUsed++;

            // Update user record
            const { error: updateError } = await this.client
                .from('quiz_users')
                .update({ 
                    attempts_used: this.attemptsUsed,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.userId);

            if (updateError) {
                console.error('Error updating user:', updateError);
            }

            // Update UI
            this.updateAttemptsDisplay();
            this.updateHistoryButton();

            console.log('✅ Quiz result saved');

        } catch (err) {
            console.error('Error saving quiz result:', err);
        }
    }

    async getUserHistory() {
        if (!this.isValidated) return [];

        try {
            const { data, error } = await this.client
                .rpc('get_user_history', { user_email: this.userEmail });

            if (error) throw error;

            return data || [];

        } catch (err) {
            console.error('Error loading history:', err);
            
            // Fallback: direct query
            try {
                const { data } = await this.client
                    .from('quiz_attempts')
                    .select('*')
                    .eq('email', this.userEmail)
                    .order('created_at', { ascending: false })
                    .limit(10);

                return data || [];
            } catch (fallbackErr) {
                console.error('Fallback history query failed:', fallbackErr);
                return [];
            }
        }
    }

    async getLeaderboard(limit = 50) {
        try {
            const { data, error } = await this.client
                .from('leaderboard_view')
                .select('*')
                .limit(limit);

            if (error) throw error;

            return data || [];

        } catch (err) {
            console.error('Error loading leaderboard:', err);
            return [];
        }
    }

    async getRewardConfig() {
        try {
            const { data, error } = await this.client
                .from('reward_config')
                .select('*')
                .eq('active', true)
                .order('priority', { ascending: true });

            if (error) throw error;

            return data || CONFIG.rewards;

        } catch (err) {
            console.error('Error loading rewards:', err);
            return CONFIG.rewards;
        }
    }

    updateAttemptsDisplay() {
        const remaining = Math.max(0, CONFIG.quiz.maxRewardAttempts - this.attemptsUsed);
        const attemptsEl = document.getElementById('attemptsLeft');
        if (attemptsEl) {
            attemptsEl.textContent = remaining;
            
            // Animate change
            gsap.fromTo(attemptsEl, 
                { scale: 1.5, color: '#00F2FE' },
                { scale: 1, color: '#FFFFFF', duration: 0.5, ease: 'back.out(1.7)' }
            );
        }
    }

    updateHistoryButton() {
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn && this.attemptsUsed > 0) {
            historyBtn.style.display = 'flex';
            
            // Animate appearance
            gsap.fromTo(historyBtn,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
            );
        }
    }

    hasRewardAttemptsLeft() {
        return this.attemptsUsed < CONFIG.quiz.maxRewardAttempts;
    }

    getUserInfo() {
        return {
            email: this.userEmail,
            name: this.userName,
            attemptsUsed: this.attemptsUsed,
            hasRewards: this.hasRewardAttemptsLeft(),
            isValidated: this.isValidated
        };
    }

    showToast(message, duration = 3000) {
        if (typeof quiz !== 'undefined' && quiz.showToast) {
            quiz.showToast(message, duration);
        } else {
            // Fallback
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            const toastIcon = document.getElementById('toastIcon');
            
            if (message.includes('✅')) toastIcon.textContent = '✅';
            else if (message.includes('❌')) toastIcon.textContent = '❌';
            else toastIcon.textContent = 'ℹ️';
            
            toastMessage.textContent = message.replace(/[✅❌]/g, '').trim();
            toast.classList.add('show');
            
            setTimeout(() => toast.classList.remove('show'), duration);
        }
    }
}

// Initialize Supabase handler
let supabaseHandler;
document.addEventListener('DOMContentLoaded', async () => {
    supabaseHandler = new SupabaseHandler();
});
