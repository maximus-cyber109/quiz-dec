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
        console.warn('Supabase CDN not loaded, using fallback');
        this.loadFallbackRewards();
        return;
      }

      this.client = window.supabase.createClient(
        CONFIG.supabase.url,
        CONFIG.supabase.key
      );

      console.log('✅ Supabase client initialized');

      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');

      if (emailParam && this.isValidEmail(emailParam)) {
        this.userEmail = emailParam;
        await this.validateEmailWithMagento();
      }

      await this.loadRewardsPreview();
    } catch (err) {
      console.error('Supabase init error:', err);
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
    } catch (err) {
      console.warn('Magento API failed, using email as name:', err);
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
      console.log('🔍 Validating user:', this.userEmail);

      const { data, error } = await this.client
        .from('quiz_users')
        .select('*')
        .eq('email', this.userEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Query error:', error);
        throw error;
      }

      if (data) {
        console.log('✅ User found:', data);
        this.userId = data.id;
        this.attemptsUsed = Number(data.attempts_used || 0);
      } else {
        console.log('⚠️ User not found, creating...');
        await this.createUser();
        
        if (!this.userId) {
          console.error('❌ Failed to create user');
          throw new Error('User creation failed');
        }
        
        console.log('✅ User created with ID:', this.userId);
      }

      this.isValidated = true;
      this.updateAttemptsDisplay();
      this.updateHistoryButton();

      console.log('✅ Validation complete:', {
        userId: this.userId,
        attemptsUsed: this.attemptsUsed
      });

    } catch (err) {
      console.error('❌ Validation failed:', err);
      this.isValidated = false;
    }
  }

  async createUser() {
    if (!this.client) {
      console.error('❌ No client for createUser');
      return;
    }

    try {
      console.log('💾 Creating user:', this.userEmail);

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

      if (error) {
        console.error('❌ Create user error:', error);
        throw error;
      }

      if (data) {
        console.log('✅ User created:', data);
        this.userId = data.id;
        this.attemptsUsed = 0;
      } else {
        console.error('❌ No data returned from insert');
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

      this.renderRewardsCarousel();
    } catch (err) {
      console.warn('Rewards load failed, using fallback:', err);
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
    if (window.quiz && typeof quiz.updateAttemptsUI === 'function') {
      quiz.updateAttemptsUI(this.attemptsUsed, this.isValidated);
    } else {
      const el = document.getElementById('attemptsLeft');
      if (el) {
        el.textContent = Math.max(0, 2 - this.attemptsUsed);
      }
    }
  }

  updateHistoryButton() {
    if (window.quiz && typeof quiz.updateHistoryState === 'function') {
      quiz.updateHistoryState(this.userEmail, this.isValidated);
    } else {
      const historyBtn = document.getElementById('historyBtn');
      if (historyBtn) {
        historyBtn.style.display =
          this.isValidated && this.userEmail ? 'inline-flex' : 'none';
      }
    }
  }

  hasRewardAttemptsLeft() {
    return this.attemptsUsed < 2;
  }

  getRewardForScore(score) {
    if (!this.allRewards || this.allRewards.length === 0) return null;

    const reward = this.allRewards.find(
      (r) => score >= r.min_score && score <= r.max_score
    );

    if (!reward) return null;

    const key = `${reward.min_score}-${reward.max_score}`;
    const codeFromMap = this.rewardCodeMap[key];

    return {
      ...reward,
      reward_code: codeFromMap || reward.reward_code || 'TRYAGAIN'
    };
  }

  getRewardCodeForScore(score) {
    const hasLeft = this.hasRewardAttemptsLeft();
    const reward = this.getRewardForScore(score);

    if (!hasLeft) {
      return 'PRACTICE';
    }

    return reward?.reward_code || 'TRYAGAIN';
  }

  async saveQuizResult(score, timeTaken, rewardCode, answers) {
    console.log('🔍 SAVE DEBUG:', {
      client: !!this.client,
      email: this.userEmail,
      userId: this.userId,
      score,
      rewardCode,
      attemptsUsed: this.attemptsUsed
    });

    if (!this.client) {
      console.error('❌ SAVE FAILED: No Supabase client');
      return;
    }

    if (!this.userEmail) {
      console.error('❌ SAVE FAILED: No email');
      return;
    }

    if (!this.userId) {
      console.error('❌ SAVE FAILED: No userId - user not created in database');
      await this.createUser();
      if (!this.userId) {
        console.error('❌ SAVE FAILED: Could not create user');
        return;
      }
    }

    try {
      const newAttemptNumber = this.attemptsUsed + 1;

      console.log('💾 Inserting quiz attempt:', {
        user_id: this.userId,
        email: this.userEmail,
        score,
        reward: rewardCode,
        attempt_number: newAttemptNumber
      });

      // Insert quiz attempt
      const { data: insertData, error: insertError } = await this.client
        .from('quiz_attempts')
        .insert([{
          user_id: this.userId,
          email: this.userEmail,
          score,
          time_taken: timeTaken,
          reward: rewardCode,
          attempt_number: newAttemptNumber,
          answers
        }])
        .select();

      if (insertError) {
        console.error('❌ INSERT ERROR:', insertError);
        throw insertError;
      }

      console.log('✅ Quiz attempt inserted:', insertData);

      // Get current user data to compare best score/time
      const { data: currentUser } = await this.client
        .from('quiz_users')
        .select('best_score, best_time, total_score')
        .eq('id', this.userId)
        .single();

      const bestScore = currentUser?.best_score || 0;
      const bestTime = currentUser?.best_time || null;
      const totalScore = currentUser?.total_score || 0;

      // Calculate new best values
      const newBestScore = Math.max(bestScore, score);
      const newBestTime = (bestTime === null || timeTaken < bestTime) ? timeTaken : bestTime;
      const newTotalScore = totalScore + score;

      console.log('💾 Updating user:', {
        attempts_used: newAttemptNumber,
        best_score: newBestScore,
        best_time: newBestTime,
        total_score: newTotalScore
      });

      // Update quiz_users
      const { data: userData, error: updateError } = await this.client
        .from('quiz_users')
        .update({
          attempts_used: newAttemptNumber,
          best_score: newBestScore,
          best_time: newBestTime,
          total_score: newTotalScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.userId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ UPDATE ERROR:', updateError);
        throw updateError;
      }

      console.log('✅ User updated:', userData);

      this.attemptsUsed = userData.attempts_used || newAttemptNumber;
      this.updateAttemptsDisplay();

      console.log('✅ SAVE COMPLETE. New attempts:', this.attemptsUsed);

    } catch (err) {
      console.error('❌ SAVE FAILED:', err);
      // No popup - just log to console
    }
  }

  async getLeaderboard(limit = 20) {
    return this.fetchLeaderboard(limit);
  }

  async getUserHistory() {
    return this.fetchUserHistory();
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
      return data || [];
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      return [];
    }
  }

  async fetchUserHistory() {
    if (!this.client || !this.userEmail) return [];

    try {
      const { data, error } = await this.client
        .from('quiz_attempts')
        .select('*')
        .eq('email', this.userEmail)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch history:', err);
      return [];
    }
  }
}

window.supabaseHandler = new SupabaseHandler();
