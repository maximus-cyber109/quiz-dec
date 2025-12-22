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

    // URLs
    urls: {
        redeem: 'https://pinkblue.in',
        support: 'https://pinkblue.in/contact'
    },

    // Animations
    animations: {
        enabled: true,
        confettiDuration: 3000
    },

    // Share Message Template
    shareMessage: (score, total, name) => {
        return `🎄 I just scored ${score}/${total} in PinkBlue Quizmas 2025!\n\n` +
               `Think you can beat my score? Take the challenge now! 🦷✨\n\n` +
               `https://your-quiz-url.netlify.app`;
    },

    // Reward Tiers (Fallback - fetched from Supabase)
    rewards: [
        {
            minScore: 9,
            maxScore: 10,
            title: '🤯 LEGENDARY',
            trophy: '👑',
            subtitle: 'Top 1% - Basically a Dental Deity',
            description: 'FREE Speedendo Calcipro Rotary File worth ₹1,250!',
            coupon: 'DENTAL9X'
        },
        {
            minScore: 7,
            maxScore: 8,
            title: '😎 EXPERT',
            trophy: '🏆',
            subtitle: 'Top 5% - Expert Mode Unlocked',
            description: '10% PB CASHBACK on your entire order!',
            coupon: 'EXPERT10'
        },
        {
            minScore: 5,
            maxScore: 6,
            title: '⭐ GREAT',
            trophy: '⭐',
            subtitle: 'Top 15% - Solid Performance',
            description: 'Flitt Diamond Burs Pack worth ₹499 FREE!',
            coupon: 'GREAT5X'
        },
        {
            minScore: 3,
            maxScore: 4,
            title: '💪 GOOD START',
            trophy: '💪',
            subtitle: 'Keep Learning!',
            description: 'Flat 5% Off your next order!',
            coupon: 'START5'
        },
        {
            minScore: 0,
            maxScore: 2,
            title: '📚 KEEP LEARNING',
            trophy: '📚',
            subtitle: 'Practice Makes Perfect',
            description: 'Try again! Every expert started somewhere.',
            coupon: 'TRYAGAIN'
        }
    ],

    // Quiz Questions
    questions: [
        {
            question: "What is the hardest substance in the human body?",
            options: ["Bone", "Enamel", "Dentin", "Cementum"],
            correct: 1,
            category: "anatomy"
        },
        {
            question: "Which vitamin deficiency can lead to bleeding gums?",
            options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
            correct: 1,
            category: "nutrition"
        },
        {
            question: "What does the term 'bruxism' refer to?",
            options: ["Tooth decay", "Teeth grinding", "Gum disease", "Bad breath"],
            correct: 1,
            category: "conditions"
        },
        {
            question: "How many permanent teeth does an adult typically have?",
            options: ["28", "30", "32", "34"],
            correct: 2,
            category: "anatomy"
        },
        {
            question: "What is the most common chronic childhood disease?",
            options: ["Asthma", "Dental caries", "Diabetes", "Obesity"],
            correct: 1,
            category: "pediatric"
        },
        {
            question: "Which instrument is used to remove calculus from teeth?",
            options: ["Explorer", "Scaler", "Excavator", "Burnisher"],
            correct: 1,
            category: "instruments"
        },
        {
            question: "What is the recommended time to brush your teeth?",
            options: ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
            correct: 2,
            category: "hygiene"
        },
        {
            question: "What is periodontitis?",
            options: ["Tooth decay", "Gum inflammation", "Advanced gum disease", "Tooth sensitivity"],
            correct: 2,
            category: "conditions"
        },
        {
            question: "Which of these is NOT a type of dental filling material?",
            options: ["Amalgam", "Composite", "Ceramic", "Fluoride"],
            correct: 3,
            category: "materials"
        },
        {
            question: "What is the primary cause of tooth decay?",
            options: ["Sugar", "Bacteria", "Acid", "All of the above"],
            correct: 3,
            category: "prevention"
        },
        {
            question: "What does 'RCT' stand for in dentistry?",
            options: ["Root Canal Therapy", "Routine Cleaning Treatment", "Rapid Cavity Treatment", "Regular Check Treatment"],
            correct: 0,
            category: "procedures"
        },
        {
            question: "Which tooth surface is closest to the lips?",
            options: ["Lingual", "Buccal", "Occlusal", "Labial"],
            correct: 3,
            category: "anatomy"
        },
        {
            question: "What is the dental term for wisdom teeth?",
            options: ["First molars", "Second molars", "Third molars", "Premolars"],
            correct: 2,
            category: "anatomy"
        },
        {
            question: "Which bacteria is primarily responsible for dental caries?",
            options: ["E. coli", "Streptococcus mutans", "Lactobacillus", "Staphylococcus"],
            correct: 1,
            category: "microbiology"
        },
        {
            question: "What is the ideal pH level of saliva?",
            options: ["5.5", "6.5", "7.5", "8.5"],
            correct: 1,
            category: "physiology"
        },
        {
            question: "Which dental specialty focuses on treating children?",
            options: ["Orthodontics", "Pedodontics", "Periodontics", "Prosthodontics"],
            correct: 1,
            category: "specialties"
        },
        {
            question: "What is the function of fluoride in dentistry?",
            options: ["Whitening", "Strengthening enamel", "Removing stains", "Freshening breath"],
            correct: 1,
            category: "prevention"
        },
        {
            question: "Which of these is a temporary tooth?",
            options: ["Incisor", "Canine", "Deciduous tooth", "Molar"],
            correct: 2,
            category: "anatomy"
        },
        {
            question: "What causes tooth sensitivity?",
            options: ["Exposed dentin", "Enamel erosion", "Gum recession", "All of the above"],
            correct: 3,
            category: "conditions"
        },
        {
            question: "How often should you replace your toothbrush?",
            options: ["Every month", "Every 3 months", "Every 6 months", "Every year"],
            correct: 1,
            category: "hygiene"
        }
    ]
};

// Log configuration loaded
console.log('✅ CONFIG loaded:', {
    questions: CONFIG.questions.length,
    rewards: CONFIG.rewards.length,
    timeLimit: CONFIG.quiz.timeLimit
});
