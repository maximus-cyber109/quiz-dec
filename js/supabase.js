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
        this.allRewards = []; // Store all rewards including priority 0
        
        this.init();
    }

    async init() {
        console.log('🔧 Initializing Supabase...');
        
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

        // Try to get email from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');

        console.log('📧 URL email parameter:', emailParam);

        if (emailParam && this.isValidEmail(emailParam)) {
            console.log('✅ Valid email from URL');
            this.userEmail = emailParam;
            await this.validateEmailWithMagento();
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

        setTimeout(() => input.focus(), 300);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        submitBtn.addEventListener('click', async () => {
            const email = input.value.trim();
            console.log('📧 Email submitted:', email);

            if (!this.isValidEmail(email)) {
                console.error('❌ Invalid email format');
                this.showToast('Please enter a valid email address', 3000);
                input.classList.add('error');
                
                gsap.to(input, {
                    x: [-10, 10, -10, 10, 0],
                    duration: 0.5
                });
                
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
        console.log('🔍 Validating email with Magento:', this.userEmail);
        
        try {
            // Call Netlify function to validate with Magento
            const response = await fetch(CONFIG.urls.magentoApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'getCustomer',
                    email: this.userEmail
                })
            });

            const result = await response.json();
            console.log('📦 Magento API response:', result);

            if (result.success && result.customer) {
                // Customer exists in Magento
                console.log('✅ Customer found in Magento:', result.customer);
                this.userName = `${result.customer.firstname} ${result.customer.lastname}`;
            } else {
                // Customer not found, use email
                console.log('⚠️ Customer not found in Magento, using email');
                this.userName = this.userEmail.split('@')[0];
            }

            // Now validate in Supabase
            await this.validateInSupabase();

        } catch (err) {
            console.error('❌ Magento validation error:', err);
            // Fallback to email-based name
            this.userName = this.userEmail.split('@')[0];
            await this.validateInSupabase();
        }
    }

    async validateInSupabase() {
        console.log('🔍 Validating in Supabase:', this.userEmail);
        
        try {
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
                console.log('✅ Existing user found:', data);
                this.userId = data.id;
                this.attemptsUsed = data.attempts_used || 0;
            } else {
                console.log('📝 Creating new user');
                await this.createUser();
            }

            this.isValidated = true;
            console.log('✅ Email validated successfully');

            this.updateAttemptsDisplay();
            this.updateHistoryButton();
            this.loadRewardsPreview();

        } catch (err) {
            console.error('❌ Validation error:', err);
            this.showToast('Something went wrong. Please try again.', 3000);
        }
    }

    async createUser() {
        try {
            console.log('👤 Creating user:', this.userName);
            
            const { data, error } = await this.client
                .from('quiz_users')
                .insert([{
                    email: this.userEmail,
                    name: this.userName,
                    attempts_used: 0
                }])
                .select()
                .single();

            if (error) {
                console.error('❌ Error creating user:', error);
                return;
            }

            this.userId = data.id;
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
                .order('min_score', { ascending: false }); // Order by score desc

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

            // Store all rewards (including priority 0)
            this.allRewards = data || CONFIG.rewards;
            
            // Filter only rewards to DISPLAY (priority >= 0, including 0)
            const displayRewards = this.allRewards.filter(r => r.priority >= 0);
            console.log(`📦 Displaying ${displayRewards.length} rewards (including priority 0)`);

            displayRewards.forEach((reward, index) => {
                console.log(`  → Reward ${index + 1}:`, {
                    title: reward.reward_title || reward.title,
                    image: reward.image_url,
                    priority: reward.priority,
                    score: `${reward.min_score}-${reward.max_score}`
                });

                const card = document.createElement('div');
                card.className = 'reward-card-compact';
                
                const title = reward.reward_title || reward.title;
                
                const imageHTML = reward.image_url 
                    ? `<img src="${reward.image_url}" alt="${title}" class="reward-image-compact" onerror="this.style.display='none'; console.error('Image failed:', '${reward.image_url}')">` 
                    : `<div class="reward-image-compact" style="display:flex;align-items:center;justify-content:center;font-size:2.5rem;">${reward.trophy_emoji || reward.trophy}</div>`;
                
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

            console.log('✅ Rewards preview loaded successfully!');

        } catch (err) {
            console.error('❌ Fatal error loading rewards:', err);
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
        this.allRewards = CONFIG.rewards;

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

    getRewardForScore(score) {
        console.log('🎁 Getting reward for score:', score);
        
        // Filter rewards with priority > 0 (awardable)
        const awardableRewards = this.allRewards.filter(r => (r.priority || 1) > 0);
        
        console.log('📦 Awardable rewards (priority > 0):', awardableRewards.length);
        
        // Find matching reward
        const reward = awardableRewards.find(r => 
            score >= r.min_score && score <= r.max_score
        );

        console.log('✅ Reward found:', reward);
        return reward || CONFIG.rewards[CONFIG.rewards.length - 1];
    }

    async saveQuizResult(score, timeTaken, reward, answers) {
        if (!this.isValidated) {
            console.error('❌ User not validated, cannot save result');
            return;
        }

        console.log('💾 Saving quiz result:', { score, timeTaken, reward });

        try {
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

            this.attemptsUsed++;

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
                .from('quiz_attempts')
                .select('*')
                .eq('email', this.userEmail)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            console.log('✅ History loaded:', data?.length || 0, 'entries');
            return data || [];

        } catch (err) {
            console.error('❌ Error loading history:', err);
            return [];
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

    updateAttemptsDisplay() {
        const remaining = Math.max(0, CONFIG.quiz.maxRewardAttempts - this.attemptsUsed);
        const attemptsEl = document.getElementById('attemptsLeft');
        if (attemptsEl) {
            attemptsEl.textContent = remaining;
            console.log('🎯 Attempts remaining:', remaining);
            
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
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            const toastIcon = document.getElementById('toastIcon');
            
            toastIcon.textContent = '✓';
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => toast.classList.remove('show'), duration);
        }
    }
}

let supabaseHandler;
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM Content Loaded - Initializing Supabase Handler');
    supabaseHandler = new SupabaseHandler();
});
