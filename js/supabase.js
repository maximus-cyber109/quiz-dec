// ========================================
// PINKBLUE QUIZMAS 2025 - SUPABASE HANDLER
// ========================================

class SupabaseHandler {
  constructor() {
    this.client = null;
    this.userEmail = null;
    this.userName = null;
    this.userId = null;
    this.attemptsUsed = 0;
    this.isValidated = false;

    this.allRewards = [];
    this.rewardCodeMap = {};

    this.emailModal = document.getElementById('emailModal');

    this.init();
  }

  async init() {
    try {
      if (!window.supabase) {
        console.warn('⚠️ Supabase CDN not loaded, using fallback');
        this.loadFallbackRewards();
        return;
      }

      this.client = window.supabase.createClient(
        CONFIG.supabase.url,
        CONFIG.supabase.key
      );

      console.log('✅ Supabase client initialized');

      // Check if email is in URL
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');

      if (emailParam && this.isValidEmail(emailParam)) {
        this.userEmail = emailParam;
        console.log('📧 Email from URL:', emailParam);
        await this.validateEmailWithMagento();
      }

      // Load rewards (for carousel)
      await this.loadRewardsPreview();
    } catch (err) {
      console.error('❌ Supabase init error:', err);
      this.loadFallbackRewards();
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showEmailModal() {
    if (!this.emailModal) return;

    this.emailModal.classList.add('active');

    const input = document.getElementById('emailInput');
    const submitBtn = document.getElementById('emailSubmitBtn');
    if (!input || !submitBtn) return;

    input.value = '';
    input.classList.remove('error');

    setTimeout(() => input.focus(), 200);

    const handleSubmit = async () => {
      const email = input.value.trim();

      if (!this.isValidEmail(email)) {
        if (window.quiz?.showToast) {
          quiz.showToast('Please enter a valid email', 2000);
        }
        input.classList.add('error');
        return;
      }

      input.classList.remove('error');
      this.userEmail = email;
      this.emailModal.classList.remove('active');

      try {
        await this.validateEmailWithMagento();

        // After validation, show rules modal
        if (window.quiz?.showRulesModal) {
          quiz.showRulesModal();
        }
      } catch (err) {
        console.error('Email validation failed:', err);
        this.showEmailModal();
      }
    };

    submitBtn.onclick = handleSubmit;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') handleSubmit();
    };
  }

  async validateEmailWithMagento() {
    try {
      const response = await fetch(CONFIG.urls.magentoApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCustomer', email: this.userEmail })
      });

      const result = await response.json();

      if (result.success && result.customer) {
        this.userName = `${result.customer.firstname} ${result.customer.lastname}`;
      } else {
        this.userName = this.userEmail.split('@')[0];
      }

      console.log('👤 User name:', this.userName);
    } catch (err) {
      console.warn('⚠️ Magento API failed, using email as name:', err);
      this.userName = this.userEmail.split('@')[0];
    }

    await this.validateInSupabase();
  }

  async validateInSupabase() {
    if (!this.client) {
      this.isValidated = true;
      this.attemptsUsed = 0;
      this.updateAttemptsDisplay();
      this.updateHistoryButton();
      return;
    }

    try {
      const { data, error } = await this.client
        .from('quiz_users')
        .select('*')
        .eq('email', this.userEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        this.userId = data.id;
        this.attemptsUsed = data.attempts_used || 0;
        console.log('✅ User found - attempts used:', this.attemptsUsed);
      } else {
        console.log('🆕 Creating new user');
        await this.createUser();
      }

      this.isValidated = true;
      this.updateAttemptsDisplay();
      this.updateHistoryButton();
    } catch (err) {
      console.error('❌ Supabase validation failed:', err);
      this.isValidated = false;
    }
  }

  async createUser() {
    if (!this.client) return;

    try {
      const { data, error } = await this.client
        .from('quiz_users')
        .insert([
          {
            email: this.userEmail,
            name: this.userName,
            attempts_used: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        this.userId = data.id;
        this.attemptsUsed = 0;
        console.log('✅ User created with ID:', this.userId);
      }
    } catch (err) {
      console.error('❌ Failed to create user:', err);
    }
  }

  async loadRewardsPreview() {
    if (!this.client) {
      this.loadFallbackRewards();
      return;
    }

    try {
      const { data } = await this.client
        .from('reward_config')
        .select('*')
        .eq('active', true)
        .order('min_score', { ascending: false });

      const raw = data || [];

      this.allRewards = raw.map((r) => ({
        min_score: r.min_score,
        max_score: r.max_score,
        title: r.reward_title,
        description: r.reward_description,
        image_url: r.image_url,
        trophy_emoji: r.trophy_emoji,
        priority: r.priority,
        reward_code: r.reward
      }));

      this.rewardCodeMap = {};
      raw.forEach((r) => {
        this.rewardCodeMap[`${r.min_score}-${r.max_score}`] = r.reward;
      });

      console.log('✅ Loaded', this.allRewards.length, 'rewards');
      this.renderRewardsCarousel();
    } catch (err) {
      console.warn('⚠️ Rewards load failed, using fallback:', err);
      this.loadFallbackRewards();
    }
  }

  loadFallbackRewards() {
    this.allRewards = CONFIG.fallbackRewards;
    this.rewardCodeMap = {};

    CONFIG.fallbackRewards.forEach((r) => {
      if (r.priority > 0) {
        this.rewardCodeMap[`${r.min_score}-${r.max_score}`] = `REWARD${r.min_score}`;
      }
    });

    this.renderRewardsCarousel();
  }

  renderRewardsCarousel() {
    const container = document.getElementById('rewardsCarousel');
    if (!container) return;

    container.innerHTML = '';

    const carouselRewards = this.allRewards
      .slice()
      .sort((a, b) => b.min_score - a.min_score);

    carouselRewards.forEach((reward) => {
      const card = document.createElement('div');
      card.className = 'reward-card-compact';

      const hasValidImage =
        reward.image_url &&
        reward.image_url.startsWith('http') &&
        !reward.image_url.includes('placeholder');

      let imageHTML;
      if (hasValidImage) {
        imageHTML = `<div class="reward-image-compact" style="background-image: url('${reward.image_url}');"></div>`;
      } else {
        imageHTML = `<div class="reward-image-compact">${reward.trophy_emoji || '🎁'}</div>`;
      }

      card.innerHTML = `
        ${imageHTML}
        <div class="reward-name-compact">${reward.title}</div>
      `;

      container.appendChild(card);
    });

    if (carouselRewards.length === 0) {
      container.innerHTML =
        '<div style="color: var(--text-secondary); padding: 20px; text-align: center; font-size: 0.9rem;">Loading rewards...</div>';
    }
  }

  updateAttemptsDisplay() {
    console.log('🔄 Updating attempts display:', this.attemptsUsed, '/', 2);
    if (window.quiz && typeof quiz.updateAttemptsUI === 'function') {
      quiz.updateAttemptsUI(this.attemptsUsed, this.isValidated);
    }
  }

  updateHistoryButton() {
    console.log('🔄 Updating history button - Email:', this.userEmail, 'Validated:', this.isValidated);
    if (window.quiz && typeof quiz.updateHistoryState === 'function') {
      quiz.updateHistoryState(this.userEmail, this.isValidated);
    }
  }

  hasRewardAttemptsLeft() {
    const hasLeft = this.attemptsUsed < 2;
    console.log('🎁 Reward attempts left?', hasLeft, '(', this.attemptsUsed, '/ 2)');
    return hasLeft;
  }

  getRewardCodeForScore(score) {
    const reward = this.getRewardForScore(score);
    const code = reward?.reward_code || 'PRACTICE';
    console.log('🎫 Reward code for score', score, ':', code);
    return code;
  }

  async saveQuizResult(score, timeTaken, rewardCode, answers) {
    if (!this.client || !this.userEmail || !this.userId) {
      console.warn('⚠️ Cannot save result - user not validated');
      return;
    }

    console.log('💾 Saving quiz result - Score:', score, 'Time:', timeTaken, 'Reward:', rewardCode);

    try {
      const newAttemptNumber = this.attemptsUsed + 1;

      // ✅ FIX 1: Insert quiz attempt
      const { data: attemptData, error: insertError } = await this.client
        .from('quiz_attempts')
        .insert([{
          user_id: this.userId,
          email: this.userEmail,
          score: score,
          total_questions: 10,
          time_taken: timeTaken,
          reward: rewardCode,
          attempt_number: newAttemptNumber
        }])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Insert attempt error:', insertError);
        throw insertError;
      }

      console.log('✅ Attempt saved:', attemptData);

      // ✅ FIX 2: Update user attempts_used
      const { data: userData, error: updateError } = await this.client
        .from('quiz_users')
        .update({
          attempts_used: newAttemptNumber,
          last_score: score,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.userId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Update user error:', updateError);
        throw updateError;
      }

      console.log('✅ User updated:', userData);

      // ✅ FIX 3: Update local state
      this.attemptsUsed = newAttemptNumber;
      this.updateAttemptsDisplay();

      console.log('✅ Quiz result saved successfully - New attempts used:', this.attemptsUsed);
    } catch (err) {
      console.error('❌ Failed to save quiz result:', err);
    }
  }

  getRewardForScore(score) {
    if (!this.allRewards || this.allRewards.length === 0) return null;

    const reward = this.allRewards.find(
      (r) => score >= r.min_score && score <= r.max_score && r.priority > 0
    );

    if (!reward) return null;

    const key = `${reward.min_score}-${reward.max_score}`;
    const code = this.rewardCodeMap[key] || null;

    return {
      ...reward,
      reward_code: code
    };
  }

  async getLeaderboard(limit = 20) {
    return await this.fetchLeaderboard(limit);
  }

  async getUserHistory() {
    return await this.fetchUserHistory();
  }

  async fetchLeaderboard(limit = 20) {
    if (!this.client) return [];

    try {
      const { data, error } = await this.client
        .from('quiz_attempts')
        .select('*')
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      console.log('📊 Leaderboard loaded:', data?.length, 'entries');
      return data || [];
    } catch (err) {
      console.error('❌ Failed to fetch leaderboard:', err);
      return [];
    }
  }

  async fetchUserHistory() {
    if (!this.client || !this.userEmail) {
      console.warn('⚠️ Cannot fetch history - No client or email');
      return [];
    }

    try {
      console.log('📜 Fetching history for:', this.userEmail);
      
      const { data, error } = await this.client
        .from('quiz_attempts')
        .select('*')
        .eq('email', this.userEmail)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      console.log('✅ History loaded:', data?.length, 'attempts');
      return data || [];
    } catch (err) {
      console.error('❌ Failed to fetch history:', err);
      return [];
    }
  }
}

// Global instance
window.supabaseHandler = new SupabaseHandler();
