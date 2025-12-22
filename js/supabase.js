// =================================
// SUPABASE DATABASE HANDLER
// =================================

class SupabaseHandler {
    constructor() {
        this.client = null;
        this.userEmail = null;
        this.userName = null;
        this.userId = null;
        this.attemptsUsed = 0;
        
        this.init();
    }

    async init() {
        // Initialize Supabase client
        this.client = window.supabase.createClient(
            CONFIG.supabase.url,
            CONFIG.supabase.key
        );

        // Get email from URL parameter (from Magento)
        const urlParams = new URLSearchParams(window.location.search);
        this.userEmail = urlParams.get('email') || `guest_${Date.now()}@test.com`;

        // Load user data
        await this.loadUserData();
    }

    async loadUserData() {
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
                this.userName = data.name || '';
                this.attemptsUsed = data.attempts_used || 0;
            } else {
                // Create new user
                await this.createUser();
            }

            // Update UI
            this.updateAttemptsDisplay();

        } catch (err) {
            console.error('Supabase error:', err);
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

        } catch (err) {
            console.error('Error creating user:', err);
        }
    }

    async saveQuizResult(score, timeTaken, reward, answers) {
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

        } catch (err) {
            console.error('Error saving quiz result:', err);
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

    hasRewardAttemptsLeft() {
        return this.attemptsUsed < CONFIG.quiz.maxRewardAttempts;
    }

    getUserInfo() {
        return {
            email: this.userEmail,
            name: this.userName,
            attemptsUsed: this.attemptsUsed,
            hasRewards: this.hasRewardAttemptsLeft()
        };
    }
}

// Initialize Supabase handler
let supabaseHandler;
document.addEventListener('DOMContentLoaded', async () => {
    supabaseHandler = new SupabaseHandler();
});
