// =================================
// SUPABASE DATABASE HANDLER
// =================================

class SupabaseHandler {
    constructor() {
        this.client = null;
        this.userEmail = null;
        this.userName = null;
        this.attemptsUsed = 0;
        
        this.init();
    }

    init() {
        // Initialize Supabase client
        this.client = window.supabase.createClient(
            CONFIG.supabase.url,
            CONFIG.supabase.key
        );

        // Get email from URL parameter (passed from Magento)
        const urlParams = new URLSearchParams(window.location.search);
        this.userEmail = urlParams.get('email') || 'guest@test.com';

        // Load user data
        this.loadUserData();
    }

    async loadUserData() {
        try {
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
                this.userName = data.name || '';
                this.attemptsUsed = data.attempts_used || 0;
            }

            // Update UI
            this.updateAttemptsDisplay();
        } catch (err) {
            console.error('Supabase error:', err);
        }
    }

    async createUser() {
        try {
            const { error } = await this.client
                .from('quiz_users')
                .insert([{
                    email: this.userEmail,
                    name: this.userName || this.userEmail.split('@')[0],
                    attempts_used: 0
                }]);

            if (error) {
                console.error('Error creating user:', error);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    async saveQuizResult(score, timeTaken, reward) {
        try {
            // Check if user exists, create if not
            const { data: existingUser } = await this.client
                .from('quiz_users')
                .select('*')
                .eq('email', this.userEmail)
                .single();

            if (!existingUser) {
                await this.createUser();
            }

            // Save quiz attempt
            const { error: attemptError } = await this.client
                .from('quiz_attempts')
                .insert([{
                    email: this.userEmail,
                    score: score,
                    time_taken: timeTaken,
                    reward: reward,
                    attempt_number: this.attemptsUsed + 1
                }]);

            if (attemptError) {
                console.error('Error saving attempt:', attemptError);
            }

            // Update attempts count
            this.attemptsUsed++;
            
            const { error: updateError } = await this.client
                .from('quiz_users')
                .update({ attempts_used: this.attemptsUsed })
                .eq('email', this.userEmail);

            if (updateError) {
                console.error('Error updating attempts:', updateError);
            }

            this.updateAttemptsDisplay();

        } catch (err) {
            console.error('Error saving quiz result:', err);
        }
    }

    async getLeaderboard(limit = 50) {
        try {
            const { data, error } = await this.client
                .from('quiz_attempts')
                .select('email, score, time_taken')
                .order('score', { ascending: false })
                .order('time_taken', { ascending: true })
                .limit(limit);

            if (error) throw error;

            return data;
        } catch (err) {
            console.error('Error loading leaderboard:', err);
            return [];
        }
    }

    updateAttemptsDisplay() {
        const remaining = Math.max(0, CONFIG.quiz.maxRewardAttempts - this.attemptsUsed);
        const attemptsEl = document.getElementById('attemptsLeft');
        if (attemptsEl) {
            attemptsEl.textContent = remaining;
        }
    }

    hasRewardAttemptsLeft() {
        return this.attemptsUsed < CONFIG.quiz.maxRewardAttempts;
    }
}

// Initialize Supabase handler
let supabaseHandler;
document.addEventListener('DOMContentLoaded', () => {
    supabaseHandler = new SupabaseHandler();
});
