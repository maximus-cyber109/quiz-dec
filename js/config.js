// =================================
// CONFIGURATION
// PinkBlue Quizmas 2025
// =================================

const CONFIG = {
    // Supabase Configuration
    supabase: {
        url: 'https://aaqkdaakxxgobwdwlega.supabase.co',
        key: 'sb_publishable_VTuc5nhwicP9shHxWMmT-Q_XJK-NVMf'
    },

    // Quiz Settings
    quiz: {
        totalQuestions: 10,
        timeLimit: 120, // seconds
        maxRewardAttempts: 2
    },

    // Reward Tiers (dynamically fetched from Supabase, but fallback here)
    rewards: [
        {
            minScore: 9,
            maxScore: 10,
            title: '🤯 YOU\'RE THE TOOTH FAIRY\'S FAVORITE!',
            trophy: '👑',
            subtitle: 'Top 1% - Basically a Dental Deity',
            description: 'FREE Speedendo Calcipro Rotary File worth ₹1,250! Because you just drilled that quiz!',
            coupon: 'DENTAL9X',
            image_url: null
        },
        {
            minScore: 7,
            maxScore: 8,
            title: '😎 FLOSS LIKE A BOSS!',
            trophy: '🏆',
            subtitle: 'Top 5% - Expert Mode Unlocked',
            description: '10% PB CASHBACK on your entire order! Your knowledge just paid off... literally.',
            coupon: 'EXPERT10',
            image_url: null
        },
        {
            minScore: 5,
            maxScore: 6,
            title: '⭐ CAVITY-FREE CHAMPION!',
            trophy: '⭐',
            subtitle: 'Top 15% - Solid Performance',
            description: 'Flitt Diamond Burs Pack worth ₹499 FREE! Not too shabby, Doc!',
            coupon: 'FLITT5',
            image_url: null
        },
        {
            minScore: 3,
            maxScore: 4,
            title: '💪 WISDOM TOOTH IN PROGRESS',
            trophy: '💪',
            subtitle: 'Room for Improvement',
            description: 'Flat 5% Off! Hey, even wisdom teeth take time to grow.',
            coupon: 'SAVE5',
            image_url: null
        },
        {
            minScore: 0,
            maxScore: 2,
            title: '😅 DENTAL STUDENT VIBES',
            trophy: '📚',
            subtitle: 'Better Luck Next Time!',
            description: 'No worries! Even the best dentists had to start somewhere. Try again and show \'em what you got!',
            coupon: 'TRYAGAIN',
            image_url: null
        }
    ],

    // Dental Questions (keeping your existing questions)
    questions: [
        // ... (keep all your existing questions from before)
        {
            question: "What is the most common cause of endodontic failure in retreatment cases?",
            options: ["Missed canals", "Inadequate cleaning", "Vertical root fractures", "Poor coronal seal"],
            correct: 0,
            category: "Endodontics",
            difficulty: "hard"
        },
        // ... add rest of questions
    ],

    // WhatsApp Share Template (Updated with humor)
    shareMessage: (score, total, userName) => {
        const percentage = Math.round((score / total) * 100);
        let emoji = '🏆';
        let message = '';
        
        if (score >= 9) {
            emoji = '👑';
            message = 'I\'m basically a dental god now!';
        } else if (score >= 7) {
            emoji = '😎';
            message = 'Flossing like a BOSS!';
        } else if (score >= 5) {
            emoji = '⭐';
            message = 'Not bad for a quiz before coffee!';
        } else {
            emoji = '💪';
            message = 'Practice makes perfect!';
        }

        return `${emoji} *PinkBlue Quizmas 2025* 🎄

I just scored *${score}/${total}* (${percentage}%)!
${message}

Think you can beat me? 😏

🦷 Take the quiz: ${window.location.origin}${window.location.pathname}

🎁 Win FREE products & cashback!
🏆 Flex on the leaderboard!

#PinkBlueQuizmas #DentalIQ #TestYourself`;
    },

    // URLs
    urls: {
        redeem: 'https://pinkblue.in/cart',
        browse: 'https://pinkblue.in',
        api: '/.netlify/functions/quiz-api'
    },

    // Animation Settings
    animations: {
        enabled: true,
        confettiDuration: 3000,
        scoreAnimationDuration: 2000
    }
};

// Make CONFIG globally available
window.CONFIG = CONFIG;
