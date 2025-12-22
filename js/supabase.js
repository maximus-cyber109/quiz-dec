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

        // Public display rewards (no codes)
        this.allRewards = [];
        // Private map score-band -> reward_code
        this.rewardCodeMap = {};

        this.init();
    }

    async init() {
        try {
            this.client = window.supabase.createClient(
                CONFIG.supabase.url,
                CONFIG.supabase.key
            );
        } catch {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');

        if (emailParam && this.isValidEmail(emailParam)) {
            this.userEmail = emailParam;
            await this.validateEmailWithMagento();
        } else {
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
        setTimeout(() => input.focus(), 300);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitBtn.click();
        });

        submitBtn.addEventListener('click', async () => {
            const email = input.value.trim();

            if (!this.isValidEmail(email)) {
                this.showToast('Please enter a valid email address', 3000);
                input.classList.add('error');
                return;
            }

            input.classList.remove('error');
            this.userEmail = email;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text">Validating...</span>';

            await this.validateEmailWithMagento();

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

    async validateEmailWithMagento() {
        try {
            const response = await fetch(CONFIG.urls.magentoApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'getCustomer',
                    email: this.userEmail
                })
            });

            const result = await response.json();

            if (result.success && result.customer) {
                this.userName = `${result.customer.firstname} ${result.customer.lastname}`;
            } else {
                this.userName = this.userEmail.split('@')[0];
            }

            await this.validateInSupabase();
        } catch {
            this.userName = this.userEmail.split('@')[0];
            await this.validateInSupabase();
        }
    }

    async validateInSupabase() {
        try {
            const { data, error } = await this.client
                .from('quiz_users')
                .select('*')
                .eq('email', this.userEmail)
                .single();

            if (error && error.code !== 'PGRST116') return;

            if (data) {
                this.userId = data.id;
                this.attemptsUsed = data.attempts_used || 0;
            } else {
                await this.createUser();
            }

            this.isValidated = true;
            this.updateAttemptsDisplay();
            this.updateHistoryButton();
            await this.loadRewardsPreview(); // also preloads images and hides loader
        } catch {
            this.showToast('Something went wrong. Please try again.', 3000);
        }
    }

    async createUser() {
        try {
            const { data, error } = await this.client
                .from('quiz_users')
                .insert([{
                    email: this.userEmail,
                    name: this.userName,
                    attempts_used: 0
                }])
                .select()
                .single();

            if (error) return;

            this.userId = data.id;
            this.attemptsUsed = 0;
        } catch {
            // ignore
        }
    }

    // ============================
    // REWARDS – SAFE LOADING
    // ============================

    async loadRewardsPreview() {
        try {
            const { data, error } = await this.client
                .from('reward_config')
                .select('*')
                .eq('active', true)
                .order('min_score', { ascending: false });

            if (error) throw error;

            const rawRewards = data || [];

            // Build secure maps
            this.allRewards = rawRewards.map(r => ({
                min_score: r.min_score,
                max_score: r.max_score,
                title: r.reward_title,
                description: r.reward_description,
                image_url: r.image_url,
                trophy_emoji: r.trophy_emoji,
                priority: r.priority
                // NO reward_code here
            }));

            this.rewardCodeMap = {};
            rawRewards.forEach(r => {
                const key = `${r.min_score}-${r.max_score}`;
                this.rewardCodeMap[key] = r.reward_code; // reward_code column
            });

            this.renderRewardsCarousel();
            await this.preloadRewardImages();
            this.hideLoadingOverlay();
        } catch {
            this.loadRewardsFromConfig();
            this.hideLoadingOverlay();
        }
    }

    renderRewardsCarousel() {
        const carousel = document.getElementById('rewardsCarousel');
        if (!carousel) return;

        carousel.innerHTML = '';

        // priority > 0 shows in carousel; -1 “Better Luck” stays hidden
        const displayRewards = this.allRewards.filter(r => (r.priority || 1) > 0);

        displayRewards.forEach((reward, index) => {
            const card = document.createElement('div');
            card.className = 'reward-card-compact';

            const title = reward.title;
            const imageHTML = reward.image_url
                ? `<img src="${reward.image_url}" alt="${title}" class="reward-image-compact" onerror="this.style.display='none';">`
                : `<div class="reward-image-compact" style="display:flex;align-items:center;justify-content:center;font-size:2.5rem;">${reward.trophy_emoji || '🎁'}</div>`;

            card.innerHTML = `
                ${imageHTML}
                <div class="reward-name-compact">${title}</div>
            `;

            carousel.appendChild(card);

            gsap.fromTo(card,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.4, delay: index * 0.08, ease: 'back.out(1.7)' }
            );
        });
    }

    loadRewardsFromConfig() {
        const carousel = document.getElementById('rewardsCarousel');
        if (!carousel) return;

        carousel.innerHTML = '';

        // fall back
        this.allRewards = CONFIG.rewards.map(r => ({
            min_score: r.minScore,
            max_score: r.maxScore,
            title: r.title,
            description: r.description,
            image_url: null,
            trophy_emoji: r.trophy,
            priority: r.priority
        }));

        CONFIG.rewards.forEach((reward) => {
            const card = document.createElement('div');
            card.className = 'reward-card-compact';
            card.innerHTML = `
                <div class="reward-image-compact" style="display:flex;align-items:center;justify-content:center;font-size:2.5rem;">${reward.trophy}</div>
                <div class="reward-name-compact">${reward.title}</div>
            `;
            carousel.appendChild(card);
        });
    }

    async preloadRewardImages() {
        if (!this.allRewards || !this.allRewards.length) return;

        const urls = this.allRewards
            .map(r => r.image_url)
            .filter(Boolean);

        const tasks = urls.map(src => new Promise(resolve => {
            const img = new Image();
            img.onload = img.onerror = resolve;
            img.src = src;
        }));

        await Promise.all(tasks);
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('hidden');
    }

    // For display (no code)
    getRewardForScore(score) {
        const awardable = this.allRewards.filter(r => (r.priority || 1) > 0);
        const reward = awardable.find(r => score >= r.min_score && score <= r.max_score);
        return reward || awardable[awardable.length - 1] || null;
    }

    // Internal: get reward_code from map
    getRewardCodeForScore(score) {
        const key = Object.keys(this.rewardCodeMap).find(k => {
            const [min, max] = k.split('-').map(Number);
            return score >= min && score <= max;
        });
        return key ? this.rewardCodeMap[key] : null;
    }

    // ============================
    // RESULTS / HISTORY
    // ============================

    async saveQuizResult(score, timeTaken, rewardCode, answers) {
        if (!this.isValidated) return;

        try {
            const { error: attemptError } = await this.client
                .from('quiz_attempts')
                .insert([{
                    user_id: this.userId,
                    email: this.userEmail,
                    score,
                    time_taken: timeTaken,
                    reward: rewardCode,     // reward_code string
                    attempt_number: this.attemptsUsed + 1,
                    answers
                }]);

            if (!attemptError) {
                this.attemptsUsed++;

                await this.client
                    .from('quiz_users')
                    .update({
                        attempts_used: this.attemptsUsed,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', this.userId);

                this.updateAttemptsDisplay();
                this.updateHistoryButton();
            }
        } catch {
            // ignore
        }
    }

    async getUserHistory() {
        if (!this.isValidated) return [];

        try {
            const { data, error } = await this.client
                .from('quiz_attempts')
                .select('*')
                .eq('email', this.userEmail)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            return data || [];
        } catch {
            return [];
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
        } catch {
            return [];
        }
    }

    updateAttemptsDisplay() {
        const remaining = Math.max(0, CONFIG.quiz.maxRewardAttempts - this.attemptsUsed);
        const attemptsEl = document.getElementById('attemptsLeft');
        if (!attemptsEl) return;

        attemptsEl.textContent = remaining;

        gsap.fromTo(attemptsEl,
            { scale: 1.5, color: '#00F2FE' },
            { scale: 1, color: '#FFFFFF', duration: 0.5, ease: 'back.out(1.7)' }
        );
    }

    updateHistoryButton() {
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn && this.attemptsUsed > 0) {
            historyBtn.style.display = 'flex';
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
            return;
        }
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');

        toastIcon.textContent = '✓';
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => toast.classList.remove('show'), duration);
    }
}

let supabaseHandler;
document.addEventListener('DOMContentLoaded', () => {
    supabaseHandler = new SupabaseHandler();
});
