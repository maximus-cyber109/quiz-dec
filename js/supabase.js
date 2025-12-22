// ========================================
// PINKBLUE QUIZMAS 2025 - SUPABASE HANDLER
// Flow: Load quiz → Start button → Check email → Email modal OR Rules modal
// Priority 0 rewards: Carousel only, never given
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

      // Check if email is in URL
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');

      if (emailParam && this.isValidEmail(emailParam)) {
        this.userEmail = emailParam;
        await this.validateEmailWithMagento();
      }

      // Load rewards (for carousel)
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
    } catch (err) {
      console.warn('Magento API failed, using email as name:', err);
      this.userName = this.userEmail.split('@')[0];
    }

    await this.validateInSupabase();
  }

  async validateInSupabase() {
    if (!this.client) {
      this.isValidated = true;
      this.updateAttemptsDisplay();
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
      } else {
        await this.createUser();
      }

      this.isValidated = true;
      this.updateAttemptsDisplay();
      this.updateHistoryButton();

    } catch (err) {
      console.error('Supabase validation failed:', err);
      this.isValidated = false;
    }
  }

  async createUser() {
    if (!this.client) return;

    try {
      const { data } = await this.client
        .from('quiz_users')
        .insert([{
          email: this.userEmail,
          name: this.userName,
          attempts_used: 0
        }])
        .select()
        .single();

      if (data) {
        this.userId = data.id;
        this.attemptsUsed = 0;
      }
    } catch (err) {
      console.error('Failed to create user:', err);
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
      
      this.allRewards = raw.map(r => ({
        min_score: r.min_score,
        max_score: r.max_score,
        title: r.reward_title,
        description: r.reward_description,
        image_url: r.image_url,
        trophy_emoji: r.trophy_emoji,
        priority: r.priority,
        reward_code: r.reward_code
      }));

      this.rewardCodeMap = {};
      raw.forEach(r => {
        this.rewardCodeMap[`${r.min_score}-${r.max_score}`] = r.reward_code;
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
    
    CONFIG.fallbackRewards.forEach(r => {
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
    
    // Show ALL rewards in carousel (including priority 0)
    const carouselRewards = this.allRewards.slice().sort((a, b) => b.min_score - a.min_score);
    
    carouselRewards.forEach(reward => {
      const card = document.createElement('div');
      card.className = 'reward-card-compact';
      
      const imgStyle = reward.image_url 
        ? `background-image: url('${reward.image_url}'); background-size: cover; background-position: center;`
        : `background: linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%); display: flex; align-items: center; justify-content: center; font-size: 2rem;`;
      
      card.innerHTML = `
        <div class="reward-image-compact" style="${imgStyle}">
          ${!reward.image_url ? reward.trophy_emoji || '🎁' : ''}
        </div>
        <div class="reward-name-compact">${reward.title}</div>
      `;
      
      container.appendChild(card);
    });

    if (carouselRewards.length === 0) {
      container.innerHTML = '<div style="color: var(--text-secondary); padding: 20px; text-align: center;">Loading rewards...</div>';
    }
  }

  hasRewardAttemptsLeft() {
    return this.attemptsUsed < 2;
  }

  // Get reward for score - EXCLUDE priority 0 rewards
  getRewardForScore(score) {
    const eligibleRewards = this.allRewards.filter(r => r.priority > 0);
    return eligibleRewards.find(r => score >= r.min_score && score <= r.max_score) || null;
  }

  getRewardCodeForScore(score) {
    const reward = this.getRewardForScore(score);
    if (!reward) return 'PRACTICE';
    
    const key = `${reward.min_score}-${reward.max_score}`;
    return this.rewardCodeMap[key] || reward.reward_code || 'PRACTICE';
  }

  async saveQuizResult(score, timeTaken, rewardCode, answers) {
    if (!this.userId || !this.client) return;

    try {
      const { error } = await this.client
        .from('quiz_attempts')
        .insert([{
          user_id: this.userId,
          email: this.userEmail,
          score: score,
          time_taken: timeTaken,
          reward: rewardCode,
          answers: answers || [],
          attempt_number: this.attemptsUsed + 1
        }]);

      if (!error && rewardCode !== 'PRACTICE') {
        await this.client
          .from('quiz_users')
          .update({ attempts_used: this.attemptsUsed + 1 })
          .eq('id', this.userId);
        
        this.attemptsUsed++;
        this.updateAttemptsDisplay();
      }
    } catch (err) {
      console.error('Failed to save quiz result:', err);
    }
  }

  async getLeaderboard() {
    if (!this.client) return [];

    try {
      const { data } = await this.client
        .from('quiz_attempts')
        .select(`
          *,
          quiz_users!inner(email, name)
        `)
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
        .limit(50);

      return data || [];
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      return [];
    }
  }

  async getUserHistory() {
    if (!this.userId || !this.client) return [];

    try {
      const { data } = await this.client
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      return data || [];
    } catch (err) {
      console.error('Failed to load history:', err);
      return [];
    }
  }

  updateAttemptsDisplay() {
    const el = document.getElementById('attemptsLeft');
    if (el) {
      el.textContent = Math.max(0, 2 - this.attemptsUsed);
    }
  }

  updateHistoryButton() {
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn && this.userId) {
      historyBtn.style.display = 'block';
    }
  }
}

// Initialize Supabase Handler
window.supabaseHandler = new SupabaseHandler();
