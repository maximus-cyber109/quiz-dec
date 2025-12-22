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
        console.log('🔧 Initializing Supabase...');
        
        // Initialize Supabase client
        try {
            this.client = window.supabase.createClient(
                CONFIG.supabase.url,
                CONFIG.supabase.key
            );
            console.log('✅ Supabase client created');
        } catch (error) {
            console.error('❌ Failed to create Supabase client:', error);
            return;
        }

        // Try to get email from URL parameter (from Magento)
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');

        console.log('📧 URL email parameter:', emailParam);

        if (emailParam && this.isValidEmail(emailParam)) {
            console.log('✅ Valid email from URL');
            this.userEmail = emailParam;
            await this.validateEmail();
        } else {
            console.log('⚠️ No valid email in URL, showing modal');
            this.showEmailModal();
        }
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showEmailModal() {
        console.log('📧 Showing email modal');
        
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
            console.log('📧 Email submitted:', email);

            if (!this.isValidEmail(email)) {
                console.error('❌ Invalid email format');
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
        console.log('🔍 Validating email:', this.userEmail);
        
        try {
            // Try to get existing user
            const { data, error } = await this.client
                .from('quiz_users')
                .select('*')
                .eq('email', this.userEmail)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('❌ Error loading user:', error);
                return;
            }

            if (data) {
                // User exists
                console.log('✅ Existing user found:', data);
                this.userId = data.id;
                this.userName = data.name || this.userEmail.split('@')[0];
                this.attemptsUsed = data.attempts_used || 0;
            } else {
                // Create new user
                console.log('📝 Creating new user');
                await this.createUser();
            }

            this.isValidated = true;
            console.log('✅ Email validated successfully');

            // Update UI
            this.updateAttemptsDisplay();
            this.updateHistoryButton();

            // Load rewards preview
            this.loadRewardsPreview();

        } catch (err) {
            console.error('❌ Validation error:', err);
            this.showToast('❌ Something went wrong. Please try again.', 3000);
        }
    }

    async createUser() {
        try {
            const userName = this.userEmail.split('@')[0];
            console.log('👤 Creating user:', userName);
            
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
                console.error('❌ Error creating user:', error);
                return;
            }

            this.userId = data.id;
            this.userName = data.name;
            this.attemptsUsed = 0;

            console.log('✅ New user created:', data);

        } catch (err) {
            console.error('❌ Error creating user:', err);
        }
    }

    async loadRewardsPreview() {
        console.log('🎁 Loading rewards preview...');
        
        try {
            const { data, error } = await this.client
                .from('reward_config')
                .select('*')
                .eq('active', true)
                .order('priority', { ascending: true });

            console.log('✅ Rewards data loaded:', data);

            if (error) {
                console.error('❌ Supabase error loading rewards:', error);
                throw error;
            }

            const carousel = document.getElementById('rewardsCarousel');
            if (!carousel) {
                console.error('❌ Rewards carousel element not found!');
                return;
            }

            carousel.innerHTML = '';

            const rewards = data || CONFIG.rewards;
            console.log(`📦 Processing ${rewards.length} rewards`);

            rewards.forEach((reward, index) => {
                console.log(`  → Reward ${index + 1}:`, {
                    title: reward.reward_title || reward.title,
                    image: reward.image_url,
                    score: `${reward.min_score}-${reward.max_score}`
                });

                const card = document.createElement('div');
                card.className = 'reward-card-compact';
                
                // Get title (handle both DB and config format)
                const title = reward.reward_title || reward.title;
                
                // ONLY show product image and name (no score, no description)
                const imageHTML = reward.image_url 
                    ? `<img src="${reward.image_url}" alt="${title}" class="reward-image-compact" onerror="this.style.display='none'; console.error('Image failed:', '${reward.image_url}')">` 
                    : `<div class="reward-image-compact" style="display:flex;align-items:center;justify-content:center;font-size:2.5rem;">${reward.trophy_emoji || reward.trophy}</div>`;
                
                card.innerHTML = `
                    ${imageHTML}
                    <div class="reward-name-compact">${title}</div>
                `;

                carousel.appendChild(card);

                // Animation
                gsap.fromTo(card,
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.4, delay: index * 0.08, ease: 'back.out(1.7)' }
                );
            });

            console.log('✅ Rewards preview loaded successfully!');

        } catch (err) {
            console.error('❌ Fatal error loading rewards:', err);
            console.error('Error details:', {
                message: err.message,
                stack: err.stack
            });
            
            // Fallback to config rewards
            console.log('⚠️ Using fallback rewards from config');
            this.loadRewardsFromConfig();
        }
    }

    loadRewardsFromConfig() {
        console.log('📦 Loading fallback rewards from CONFIG...');
        
        const carousel = document.getElementById('rewardsCarousel');
        if (!carousel) {
            console.error('❌ Carousel element not found!');
            return;
        }
        
        carousel.innerHTML = '';

        CONFIG.rewards.forEach((reward, index) => {
            console.log(`  → Config Reward ${index + 1}:`, reward.title);
            
            const card = document.createElement('div');
            card.className = 'reward-card-compact';
            card.innerHTML = `
                <div class="reward-image-compact" style="display:flex;align-items:center;justify-content:center;font-size:2.5rem;">${reward.trophy}</div>
                <div class="reward-name-compact">${reward.title}</div>
            `;
            carousel.appendChild(card);
        });
        
        console.log('✅ Fallback rewards loaded');
    }

    async saveQuizResult(score, timeTaken, reward, answers) {
        if (!this.isValidated) {
            console.error('❌ User not validated, cannot save result');
            return;
        }

        console.log('💾 Saving quiz result:', { score, timeTaken, reward });

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
                console.error('❌ Error saving attempt:', attemptError);
            } else {
                console.log('✅ Quiz attempt saved');
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
                console.error('❌ Error updating user:', updateError);
            } else {
                console.log('✅ User attempts updated');
            }

            // Update UI
            this.updateAttemptsDisplay();
            this.updateHistoryButton();

            console.log('✅ Quiz result saved successfully');

        } catch (err) {
            console.error('❌ Error saving quiz result:', err);
        }
    }

    async getUserHistory() {
        if (!this.isValidated) {
            console.log('⚠️ User not validated, cannot load history');
            return [];
        }

        console.log('📜 Loading user history for:', this.userEmail);

        try {
            const { data, error } = await this.client
                .rpc('get_user_history', { user_email: this.userEmail });

            if (error) throw error;

            console.log('✅ History loaded:', data?.length || 0, 'entries');
            return data || [];

        } catch (err) {
            console.error('❌ Error loading history:', err);
            
            // Fallback: direct query
            try {
                console.log('⚠️ Trying fallback history query...');
                const { data } = await this.client
                    .from('quiz_attempts')
                    .select('*')
                    .eq('email', this.userEmail)
                    .order('created_at', { ascending: false })
                    .limit(10);

                console.log('✅ Fallback history loaded:', data?.length || 0, 'entries');
                return data || [];
            } catch (fallbackErr) {
                console.error('❌ Fallback history query failed:', fallbackErr);
                return [];
            }
        }
    }

    async getLeaderboard(limit = 50) {
        console.log('🏆 Loading leaderboard...');
        
        try {
            const { data, error } = await this.client
                .from('leaderboard_view')
                .select('*')
                .limit(limit);

            if (error) throw error;

            console.log('✅ Leaderboard loaded:', data?.length || 0, 'entries');
            return data || [];

        } catch (err) {
            console.error('❌ Error loading leaderboard:', err);
            return [];
        }
    }

    async getRewardConfig() {
        console.log('🎁 Loading reward config...');
        
        try {
            const { data, error } = await this.client
                .from('reward_config')
                .select('*')
                .eq('active', true)
                .order('priority', { ascending: true });

            if (error) throw error;

            console.log('✅ Reward config loaded:', data?.length || 0, 'rewards');
            return data || CONFIG.rewards;

        } catch (err) {
            console.error('❌ Error loading rewards:', err);
            return CONFIG.rewards;
        }
    }

    updateAttemptsDisplay() {
        const remaining = Math.max(0, CONFIG.quiz.maxRewardAttempts - this.attemptsUsed);
        const attemptsEl = document.getElementById('attemptsLeft');
        if (attemptsEl) {
            attemptsEl.textContent = remaining;
            
            console.log('🎯 Attempts remaining:', remaining);
            
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
            
            console.log('📜 Showing history button');
            
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
    console.log('🚀 DOM Content Loaded - Initializing Supabase Handler');
    supabaseHandler = new SupabaseHandler();
});
