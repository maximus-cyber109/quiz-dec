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
        maxRewardAttempts: 2,
        easyQuestions: 3,      // Questions 1-3
        mediumQuestions: 4,    // Questions 4-7
        hardQuestions: 3       // Questions 8-10
    },

    // URLs
    urls: {
        redeem: 'https://pinkblue.in',
        magentoApi: '/.netlify/functions/quiz-api'
    },

    // Animations
    animations: {
        enabled: true,
        confettiDuration: 3000
    },

    // Share Message Template
    shareMessage: (score, total, name) => {
        const messages = {
            10: `🎯 Boom! Perfect 10/10 on PinkBlue Quizmas! Can you match this?`,
            9: `💪 Crushed it with 9/10 on PinkBlue Quizmas! Your turn to shine!`,
            8: `⚡ Scored a solid 8/10! Think you're smarter? Prove it!`,
            7: `🔥 Not bad with 7/10! Challenge accepted?`,
            6: `📚 Got 6/10. Bet you can do better!`,
            5: `🎲 Hit 5/10. Let's see what you got!`,
            default: `Just scored ${score}/${total} on PinkBlue Quizmas! Can you beat me?`
        };
        return messages[score] || messages.default + `\n\nhttps://your-quiz-url.netlify.app`;
    },

    // Reward Tiers (Fallback - fetched from Supabase)
    rewards: [
        {
            minScore: 9,
            maxScore: 10,
            title: 'FREE Speedendo Rotary File',
            trophy: '👑',
            subtitle: 'Dental Genius!',
            description: 'FREE Speedendo Calcipro Rotary File worth ₹1,250',
            coupon: 'GENIUS10',
            priority: 1
        },
        {
            minScore: 7,
            maxScore: 8,
            title: '10% PB Cashback',
            trophy: '🏆',
            subtitle: 'Knowledge Champion',
            description: '10% PB Cashback on your entire order',
            coupon: 'CHAMP10',
            priority: 1
        },
        {
            minScore: 5,
            maxScore: 6,
            title: 'Flitt Diamond Burs Pack',
            trophy: '⭐',
            subtitle: 'Pretty Sharp',
            description: 'Flitt Diamond Burs Pack worth ₹499 FREE',
            coupon: 'SHARP5',
            priority: 1
        },
        {
            minScore: 3,
            maxScore: 4,
            title: 'Flat 5% Off',
            trophy: '💪',
            subtitle: 'Good Start',
            description: 'Flat 5% Off your next order',
            coupon: 'START5',
            priority: 1
        },
        {
            minScore: 0,
            maxScore: 2,
            title: 'Try Again',
            trophy: '📚',
            subtitle: 'Keep Learning',
            description: 'Better luck next time',
            coupon: 'TRYAGAIN',
            priority: 1
        }
    ],

    // ==========================================
    // 300 QUIZ QUESTIONS (100 Easy, 100 Medium, 100 Hard)
    // ==========================================
    
    questions: [
        // ==========================================
        // EASY QUESTIONS (100)
        // ==========================================
        {
            question: "What is the hardest substance in the human body?",
            options: ["Bone", "Enamel", "Dentin", "Cementum"],
            correct: 1,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "How many baby teeth do children typically have?",
            options: ["16", "20", "24", "28"],
            correct: 1,
            difficulty: "easy",
            category: "pediatric"
        },
        {
            question: "What is the most common chronic childhood disease?",
            options: ["Asthma", "Dental caries", "Diabetes", "Allergies"],
            correct: 1,
            difficulty: "easy",
            category: "pediatric"
        },
        {
            question: "How many permanent teeth does an adult have?",
            options: ["28", "30", "32", "34"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What vitamin helps prevent bleeding gums?",
            options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
            correct: 1,
            difficulty: "easy",
            category: "nutrition"
        },
        {
            question: "What does bruxism refer to?",
            options: ["Tooth decay", "Teeth grinding", "Gum disease", "Bad breath"],
            correct: 1,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "How long should you brush your teeth?",
            options: ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
            correct: 2,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "Which tooth is known as the wisdom tooth?",
            options: ["First molar", "Second molar", "Third molar", "Premolar"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What causes tooth decay?",
            options: ["Bacteria", "Sugar", "Acid", "All of the above"],
            correct: 3,
            difficulty: "easy",
            category: "prevention"
        },
        {
            question: "What is fluoride used for?",
            options: ["Whitening", "Strengthening enamel", "Fresh breath", "Removing stains"],
            correct: 1,
            difficulty: "easy",
            category: "prevention"
        },
        {
            question: "How often should you replace your toothbrush?",
            options: ["Every month", "Every 3 months", "Every 6 months", "Every year"],
            correct: 1,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What is the visible part of the tooth called?",
            options: ["Root", "Crown", "Pulp", "Dentin"],
            correct: 1,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "Which teeth are used for cutting food?",
            options: ["Molars", "Premolars", "Incisors", "Canines"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What is the soft tissue inside the tooth called?",
            options: ["Enamel", "Dentin", "Pulp", "Cementum"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "How many times a day should you brush?",
            options: ["Once", "Twice", "Three times", "Four times"],
            correct: 1,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What is gingivitis?",
            options: ["Tooth decay", "Gum inflammation", "Bad breath", "Tooth sensitivity"],
            correct: 1,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "What does RCT stand for?",
            options: ["Root Canal Therapy", "Regular Cleaning Treatment", "Rapid Cavity Treatment", "Root Check Test"],
            correct: 0,
            difficulty: "easy",
            category: "procedures"
        },
        {
            question: "Which mineral strengthens teeth?",
            options: ["Iron", "Calcium", "Zinc", "Magnesium"],
            correct: 1,
            difficulty: "easy",
            category: "nutrition"
        },
        {
            question: "What is plaque?",
            options: ["Tooth decay", "Bacterial film", "Gum disease", "Tooth stain"],
            correct: 1,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "How many canine teeth do adults have?",
            options: ["2", "4", "6", "8"],
            correct: 1,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What causes bad breath?",
            options: ["Bacteria", "Food", "Poor hygiene", "All of the above"],
            correct: 3,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "At what age do baby teeth start falling?",
            options: ["3 years", "5 years", "6 years", "8 years"],
            correct: 2,
            difficulty: "easy",
            category: "pediatric"
        },
        {
            question: "What is tartar?",
            options: ["Soft plaque", "Hardened plaque", "Food debris", "Tooth stain"],
            correct: 1,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "Which is the strongest chewing tooth?",
            options: ["Incisor", "Canine", "Molar", "Premolar"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What color are healthy gums?",
            options: ["Red", "Pink", "White", "Purple"],
            correct: 1,
            difficulty: "easy",
            category: "diagnosis"
        },
        {
            question: "Should you brush your tongue?",
            options: ["Yes", "No", "Sometimes", "Never"],
            correct: 0,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What is a cavity?",
            options: ["Gum disease", "Tooth hole", "Bad breath", "Tooth stain"],
            correct: 1,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Which teeth help tear food?",
            options: ["Incisors", "Canines", "Molars", "Premolars"],
            correct: 1,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "How often should you visit the dentist?",
            options: ["Once a year", "Twice a year", "Once every 2 years", "Only when needed"],
            correct: 1,
            difficulty: "easy",
            category: "prevention"
        },
        {
            question: "What is enamel erosion?",
            options: ["Tooth decay", "Enamel wearing away", "Gum disease", "Tooth staining"],
            correct: 1,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Can you reverse tooth decay?",
            options: ["Yes, always", "No, never", "Only in early stages", "Only with surgery"],
            correct: 2,
            difficulty: "easy",
            category: "treatment"
        },
        {
            question: "What is dental floss used for?",
            options: ["Whitening", "Cleaning between teeth", "Polishing", "Freshening breath"],
            correct: 1,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "How many roots does a molar typically have?",
            options: ["1", "2", "3", "4"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What causes tooth sensitivity?",
            options: ["Exposed dentin", "Enamel loss", "Gum recession", "All of the above"],
            correct: 3,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Is sugar bad for teeth?",
            options: ["Yes", "No", "Only refined sugar", "Only in large amounts"],
            correct: 0,
            difficulty: "easy",
            category: "nutrition"
        },
        {
            question: "What is a dental crown?",
            options: ["Natural tooth top", "Cap covering tooth", "Tooth root", "Gum tissue"],
            correct: 1,
            difficulty: "easy",
            category: "procedures"
        },
        {
            question: "Which bacteria causes most cavities?",
            options: ["E. coli", "Streptococcus mutans", "Lactobacillus", "Staphylococcus"],
            correct: 1,
            difficulty: "easy",
            category: "microbiology"
        },
        {
            question: "What is orthodontics?",
            options: ["Gum treatment", "Teeth straightening", "Root canal", "Teeth whitening"],
            correct: 1,
            difficulty: "easy",
            category: "specialties"
        },
        {
            question: "Can babies be born with teeth?",
            options: ["Yes", "No", "Very rarely", "Only premature babies"],
            correct: 2,
            difficulty: "easy",
            category: "pediatric"
        },
        {
            question: "What is a filling used for?",
            options: ["Whitening", "Repairing cavities", "Cleaning", "Polishing"],
            correct: 1,
            difficulty: "easy",
            category: "procedures"
        },
        {
            question: "Should you rinse after brushing?",
            options: ["Yes, always", "No, spit only", "Either way", "Only with water"],
            correct: 1,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What is dental calculus?",
            options: ["Soft plaque", "Hardened tartar", "Tooth decay", "Gum tissue"],
            correct: 1,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Are electric toothbrushes better?",
            options: ["Yes, always", "No", "Depends on technique", "Only for kids"],
            correct: 2,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What is a baby bottle tooth decay?",
            options: ["Adult tooth decay", "Decay from prolonged bottle use", "Genetic decay", "Normal decay"],
            correct: 1,
            difficulty: "easy",
            category: "pediatric"
        },
        {
            question: "How many incisors do adults have?",
            options: ["4", "6", "8", "10"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What is periodontics?",
            options: ["Pediatric dentistry", "Gum disease treatment", "Root canal", "Orthodontics"],
            correct: 1,
            difficulty: "easy",
            category: "specialties"
        },
        {
            question: "Can stress affect oral health?",
            options: ["Yes", "No", "Maybe", "Only indirectly"],
            correct: 0,
            difficulty: "easy",
            category: "general"
        },
        {
            question: "What is dental prophylaxis?",
            options: ["Tooth extraction", "Professional cleaning", "Root canal", "Filling"],
            correct: 1,
            difficulty: "easy",
            category: "procedures"
        },
        {
            question: "Is mouthwash necessary?",
            options: ["Yes, always", "No, never", "Helpful but not essential", "Only for bad breath"],
            correct: 2,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What causes tooth staining?",
            options: ["Coffee", "Tea", "Smoking", "All of the above"],
            correct: 3,
            difficulty: "easy",
            category: "cosmetic"
        },
        {
            question: "How many premolars do adults have?",
            options: ["4", "6", "8", "10"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What is dental sealant?",
            options: ["Whitening gel", "Protective coating", "Filling material", "Cleaning solution"],
            correct: 1,
            difficulty: "easy",
            category: "prevention"
        },
        {
            question: "Can teeth repair themselves?",
            options: ["Yes, always", "No, never", "Only enamel minimally", "Only dentin"],
            correct: 2,
            difficulty: "easy",
            category: "biology"
        },
        {
            question: "What is tooth ankylosis?",
            options: ["Tooth fusion to bone", "Tooth decay", "Gum disease", "Tooth sensitivity"],
            correct: 0,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Are dental X-rays safe?",
            options: ["Yes", "No", "Only rarely", "Only for adults"],
            correct: 0,
            difficulty: "easy",
            category: "radiology"
        },
        {
            question: "What is tooth whitening?",
            options: ["Cleaning", "Bleaching", "Polishing", "Filling"],
            correct: 1,
            difficulty: "easy",
            category: "cosmetic"
        },
        {
            question: "Can pregnancy affect oral health?",
            options: ["Yes", "No", "Maybe", "Only in complications"],
            correct: 0,
            difficulty: "easy",
            category: "general"
        },
        {
            question: "What is dental bonding?",
            options: ["Joining teeth", "Applying resin", "Tooth extraction", "Gum surgery"],
            correct: 1,
            difficulty: "easy",
            category: "cosmetic"
        },
        {
            question: "Should kids use fluoride toothpaste?",
            options: ["Yes", "No", "Only after 6", "Only a tiny amount"],
            correct: 3,
            difficulty: "easy",
            category: "pediatric"
        },
        {
            question: "What is dental implant?",
            options: ["Natural tooth", "Artificial tooth root", "Crown", "Bridge"],
            correct: 1,
            difficulty: "easy",
            category: "procedures"
        },
        {
            question: "Can smoking cause oral cancer?",
            options: ["Yes", "No", "Maybe", "Only with alcohol"],
            correct: 0,
            difficulty: "easy",
            category: "prevention"
        },
        {
            question: "What is dental bridge?",
            options: ["Tooth cleaning", "Replacement for missing teeth", "Orthodontic device", "Whitening method"],
            correct: 1,
            difficulty: "easy",
            category: "procedures"
        },
        {
            question: "How many molars do adults have?",
            options: ["8", "10", "12", "16"],
            correct: 2,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "What is dental veneer?",
            options: ["Cleaning tool", "Thin tooth covering", "Filling type", "Crown type"],
            correct: 1,
            difficulty: "easy",
            category: "cosmetic"
        },
        {
            question: "Is tooth extraction painful?",
            options: ["Yes, always", "No, with anesthesia", "Sometimes", "Only for wisdom teeth"],
            correct: 1,
            difficulty: "easy",
            category: "surgery"
        },
        {
            question: "What causes gum bleeding?",
            options: ["Gingivitis", "Hard brushing", "Vitamin C deficiency", "All of the above"],
            correct: 3,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Can diet affect oral health?",
            options: ["Yes", "No", "Maybe", "Only sugary foods"],
            correct: 0,
            difficulty: "easy",
            category: "nutrition"
        },
        {
            question: "What is dental abscess?",
            options: ["Tooth decay", "Pus-filled infection", "Gum inflammation", "Tooth crack"],
            correct: 1,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Should you brush before or after breakfast?",
            options: ["Before", "After", "Either", "Depends"],
            correct: 0,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What is periodontitis?",
            options: ["Tooth decay", "Mild gum disease", "Advanced gum disease", "Tooth sensitivity"],
            correct: 2,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Can teeth move after braces?",
            options: ["Yes", "No", "Only if no retainer", "Only in adults"],
            correct: 2,
            difficulty: "easy",
            category: "orthodontics"
        },
        {
            question: "What is tooth enamel made of?",
            options: ["Calcium phosphate", "Hydroxyapatite", "Calcium carbonate", "Fluoride"],
            correct: 1,
            difficulty: "easy",
            category: "anatomy"
        },
        {
            question: "Is dental tourism safe?",
            options: ["Yes, always", "No, never", "Depends on standards", "Only for simple procedures"],
            correct: 2,
            difficulty: "easy",
            category: "general"
        },
        {
            question: "What is malocclusion?",
            options: ["Tooth decay", "Misaligned teeth", "Gum disease", "Tooth sensitivity"],
            correct: 1,
            difficulty: "easy",
            category: "orthodontics"
        },
        {
            question: "Can allergies affect oral health?",
            options: ["Yes", "No", "Maybe", "Only sinus issues"],
            correct: 0,
            difficulty: "easy",
            category: "general"
        },
        {
            question: "What is dental irrigation?",
            options: ["Teeth cleaning", "Water flossing", "Bleaching", "Polishing"],
            correct: 1,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "Should you floss before or after brushing?",
            options: ["Before", "After", "Either", "Never"],
            correct: 0,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What is dental fluorosis?",
            options: ["Fluoride deficiency", "Excess fluoride staining", "Tooth decay", "Gum disease"],
            correct: 1,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Can dry mouth cause problems?",
            options: ["Yes", "No", "Maybe", "Only bad breath"],
            correct: 0,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "What is dental emergency?",
            options: ["Routine checkup", "Urgent tooth problem", "Teeth cleaning", "Normal pain"],
            correct: 1,
            difficulty: "easy",
            category: "general"
        },
        {
            question: "Should seniors get dental checkups?",
            options: ["Yes", "No", "Optional", "Only if problems"],
            correct: 0,
            difficulty: "easy",
            category: "geriatric"
        },
        {
            question: "What is teething?",
            options: ["Adult tooth eruption", "Baby tooth eruption", "Tooth decay", "Gum disease"],
            correct: 1,
            difficulty: "easy",
            category: "pediatric"
        },
        {
            question: "Can medications affect oral health?",
            options: ["Yes", "No", "Maybe", "Only antibiotics"],
            correct: 0,
            difficulty: "easy",
            category: "pharmacology"
        },
        {
            question: "What is dental plaque index?",
            options: ["Tooth count", "Plaque measurement", "Gum health score", "Cavity count"],
            correct: 1,
            difficulty: "easy",
            category: "diagnosis"
        },
        {
            question: "Should you brush your gums?",
            options: ["Yes, gently", "No", "Only with soft brush", "Only if diseased"],
            correct: 0,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What causes tooth grinding?",
            options: ["Stress", "Sleep disorders", "Misalignment", "All of the above"],
            correct: 3,
            difficulty: "easy",
            category: "conditions"
        },
        {
            question: "Can wisdom teeth cause problems?",
            options: ["Yes", "No", "Sometimes", "Only if impacted"],
            correct: 2,
            difficulty: "easy",
            category: "surgery"
        },
        {
            question: "What is dental hygiene?",
            options: ["Tooth cleaning", "Oral care practices", "Professional treatment", "Surgery"],
            correct: 1,
            difficulty: "easy",
            category: "general"
        },
        {
            question: "Should you change toothpaste brands?",
            options: ["Yes, regularly", "No, never", "Doesn't matter", "Only if problems"],
            correct: 2,
            difficulty: "easy",
            category: "hygiene"
        },
        {
            question: "What is tooth mobility?",
            options: ["Tooth movement", "Tooth growth", "Tooth decay", "Tooth color change"],
            correct: 0,
            difficulty: "easy",
            category: "diagnosis"
        },
        {
            question: "Can diabetes affect oral health?",
            options: ["Yes", "No", "Maybe", "Only Type 1"],
            correct: 0,
            difficulty: "easy",
            category: "systemic"
        },
        {
            question: "What is dental scaling?",
            options: ["Tooth measurement", "Tartar removal", "Tooth whitening", "Crown placement"],
            correct: 1,
            difficulty: "easy",
            category: "procedures"
        },
        {
            question: "Should kids visit the dentist?",
            options: ["Yes", "No", "Only if problems", "Only after 5"],
            correct: 0,
            difficulty: "easy",
            category: "pediatric"
        },
        {
            question: "What is dental health?",
            options: ["White teeth only", "Disease-free mouth", "Strong teeth only", "Fresh breath only"],
            correct: 1,
            difficulty: "easy",
            category: "general"
        },
        {
            question: "Can sports injure teeth?",
            options: ["Yes", "No", "Maybe", "Only contact sports"],
            correct: 0,
            difficulty: "easy",
            category: "trauma"
        },
        {
            question: "What is dental care?",
            options: ["Tooth cleaning", "Oral maintenance", "Professional treatment", "All of the above"],
            correct: 3,
            difficulty: "easy",
            category: "general"
        },
        {
            question: "Should you use mouthguards?",
            options: ["Yes, for sports", "No", "Only professionals", "Only kids"],
            correct: 0,
            difficulty: "easy",
            category: "prevention"
        },
        {
            question: "What causes dry mouth?",
            options: ["Medications", "Dehydration", "Medical conditions", "All of the above"],
            correct: 3,
            difficulty: "easy",
            category: "conditions"
        },

        // ==========================================
        // MEDIUM QUESTIONS (100)
        // ==========================================
        {
            question: "What is the dental term for the chewing surface of teeth?",
            options: ["Incisal", "Occlusal", "Lingual", "Buccal"],
            correct: 1,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "Which instrument is used to remove calculus?",
            options: ["Explorer", "Scaler", "Excavator", "Burnisher"],
            correct: 1,
            difficulty: "medium",
            category: "instruments"
        },
        {
            question: "What is the ideal pH level of saliva?",
            options: ["5.5", "6.5", "7.5", "8.5"],
            correct: 1,
            difficulty: "medium",
            category: "physiology"
        },
        {
            question: "Which surface of the tooth is closest to the lips?",
            options: ["Lingual", "Buccal", "Occlusal", "Labial"],
            correct: 3,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is amelogenesis imperfecta?",
            options: ["Enamel defect", "Dentin defect", "Gum disease", "Bone disorder"],
            correct: 0,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "Which nerve supplies sensation to upper teeth?",
            options: ["Mandibular nerve", "Maxillary nerve", "Facial nerve", "Trigeminal nerve"],
            correct: 1,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is the primary component of dentin?",
            options: ["Hydroxyapatite", "Collagen", "Both", "Neither"],
            correct: 2,
            difficulty: "medium",
            category: "histology"
        },
        {
            question: "What does DMFT index measure?",
            options: ["Gum health", "Caries experience", "Tooth alignment", "Oral hygiene"],
            correct: 1,
            difficulty: "medium",
            category: "epidemiology"
        },
        {
            question: "Which cell produces enamel?",
            options: ["Odontoblast", "Ameloblast", "Cementoblast", "Fibroblast"],
            correct: 1,
            difficulty: "medium",
            category: "histology"
        },
        {
            question: "What is xerostomia?",
            options: ["Bad breath", "Dry mouth", "Excessive saliva", "Gum bleeding"],
            correct: 1,
            difficulty: "medium",
            category: "conditions"
        },
        {
            question: "Which filling material is most aesthetic?",
            options: ["Amalgam", "Composite", "Gold", "Glass ionomer"],
            correct: 1,
            difficulty: "medium",
            category: "materials"
        },
        {
            question: "What is leukoplakia?",
            options: ["White patch", "Red patch", "Ulcer", "Swelling"],
            correct: 0,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "Which vitamin is synthesized by sun exposure?",
            options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
            correct: 2,
            difficulty: "medium",
            category: "nutrition"
        },
        {
            question: "What is Ellis Class II fracture?",
            options: ["Enamel only", "Enamel and dentin", "Pulp involved", "Root fracture"],
            correct: 1,
            difficulty: "medium",
            category: "trauma"
        },
        {
            question: "Which bacteria is associated with periodontitis?",
            options: ["S. mutans", "P. gingivalis", "L. acidophilus", "S. aureus"],
            correct: 1,
            difficulty: "medium",
            category: "microbiology"
        },
        {
            question: "What is ankylosis?",
            options: ["Tooth fusion to bone", "Tooth decay", "Gum recession", "Tooth mobility"],
            correct: 0,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "Which angle classification has a mesial molar relationship?",
            options: ["Class I", "Class II", "Class III", "Class IV"],
            correct: 2,
            difficulty: "medium",
            category: "orthodontics"
        },
        {
            question: "What is the function of cementum?",
            options: ["Tooth protection", "Tooth anchorage", "Nerve supply", "Blood supply"],
            correct: 1,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "Which local anesthetic is most commonly used?",
            options: ["Procaine", "Lidocaine", "Articaine", "Mepivacaine"],
            correct: 1,
            difficulty: "medium",
            category: "pharmacology"
        },
        {
            question: "What is apexification?",
            options: ["Root tip formation", "Crown formation", "Pulp removal", "Tooth extraction"],
            correct: 0,
            difficulty: "medium",
            category: "endodontics"
        },
        {
            question: "Which disease is characterized by osteolytic jaw lesions?",
            options: ["Paget's disease", "Multiple myeloma", "Osteoporosis", "Osteogenesis imperfecta"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "What is the most radiosensitive salivary gland?",
            options: ["Parotid", "Submandibular", "Sublingual", "Minor glands"],
            correct: 0,
            difficulty: "medium",
            category: "radiology"
        },
        {
            question: "Which muscle elevates the mandible?",
            options: ["Masseter", "Lateral pterygoid", "Digastric", "Geniohyoid"],
            correct: 0,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is fluorosis threshold?",
            options: ["0.5 ppm", "1.0 ppm", "1.5 ppm", "2.0 ppm"],
            correct: 2,
            difficulty: "medium",
            category: "prevention"
        },
        {
            question: "Which type of impression material is most accurate?",
            options: ["Alginate", "Polyether", "Silicone", "Zinc oxide eugenol"],
            correct: 2,
            difficulty: "medium",
            category: "materials"
        },
        {
            question: "What is taurodontism?",
            options: ["Extra cusp", "Enlarged pulp chamber", "Extra root", "Small crown"],
            correct: 1,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "Which artery supplies the maxillary teeth?",
            options: ["Facial artery", "Lingual artery", "Maxillary artery", "Inferior alveolar artery"],
            correct: 2,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is the critical pH for enamel demineralization?",
            options: ["5.0", "5.5", "6.0", "6.5"],
            correct: 1,
            difficulty: "medium",
            category: "cariology"
        },
        {
            question: "Which cement is most biocompatible?",
            options: ["Zinc phosphate", "Glass ionomer", "Zinc oxide eugenol", "Resin cement"],
            correct: 1,
            difficulty: "medium",
            category: "materials"
        },
        {
            question: "What is natal tooth?",
            options: ["First baby tooth", "Tooth present at birth", "Wisdom tooth", "Extra tooth"],
            correct: 1,
            difficulty: "medium",
            category: "pediatric"
        },
        {
            question: "Which radiograph shows entire tooth?",
            options: ["Bitewing", "Periapical", "Panoramic", "Cephalometric"],
            correct: 1,
            difficulty: "medium",
            category: "radiology"
        },
        {
            question: "What is gingival crevicular fluid?",
            options: ["Saliva", "Blood serum", "Inflammatory exudate", "Lymph"],
            correct: 2,
            difficulty: "medium",
            category: "periodontics"
        },
        {
            question: "Which tooth has the longest root?",
            options: ["Central incisor", "Canine", "First molar", "Second premolar"],
            correct: 1,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is internal resorption?",
            options: ["External root loss", "Internal root/dentin loss", "Bone loss", "Enamel loss"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "Which antibiotic is used for endocarditis prophylaxis?",
            options: ["Tetracycline", "Amoxicillin", "Erythromycin", "Metronidazole"],
            correct: 1,
            difficulty: "medium",
            category: "pharmacology"
        },
        {
            question: "What is stephan curve?",
            options: ["Caries progression", "pH change after sugar", "Tooth eruption pattern", "Bone growth"],
            correct: 1,
            difficulty: "medium",
            category: "cariology"
        },
        {
            question: "Which condition causes 'mulberry molars'?",
            options: ["Fluorosis", "Congenital syphilis", "Rickets", "Tetracycline staining"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "What is the width of periodontal ligament?",
            options: ["0.1-0.2mm", "0.2-0.3mm", "0.3-0.4mm", "0.4-0.5mm"],
            correct: 1,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "Which gland is affected in Sjögren's syndrome?",
            options: ["Thyroid", "Salivary", "Adrenal", "Pituitary"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "What is overjet?",
            options: ["Vertical overlap", "Horizontal overlap", "Tooth rotation", "Tooth spacing"],
            correct: 1,
            difficulty: "medium",
            category: "orthodontics"
        },
        {
            question: "Which nerve provides motor supply to tongue?",
            options: ["Glossopharyngeal", "Vagus", "Hypoglossal", "Facial"],
            correct: 2,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is the purpose of zinc in amalgam?",
            options: ["Strength", "Reduce oxidation", "Setting reaction", "Corrosion resistance"],
            correct: 1,
            difficulty: "medium",
            category: "materials"
        },
        {
            question: "Which stage of tooth development involves enamel formation?",
            options: ["Bud stage", "Cap stage", "Bell stage", "Eruption stage"],
            correct: 2,
            difficulty: "medium",
            category: "embryology"
        },
        {
            question: "What is furcation involvement?",
            options: ["Root canal anatomy", "Bone loss between roots", "Crown fracture", "Pulp exposure"],
            correct: 1,
            difficulty: "medium",
            category: "periodontics"
        },
        {
            question: "Which suture technique is most common in oral surgery?",
            options: ["Continuous", "Interrupted", "Mattress", "Subcuticular"],
            correct: 1,
            difficulty: "medium",
            category: "surgery"
        },
        {
            question: "What is condensing osteitis?",
            options: ["Bone loss", "Bone sclerosis", "Bone fracture", "Bone infection"],
            correct: 1,
            difficulty: "medium",
            category: "radiology"
        },
        {
            question: "Which muscle protrudes the mandible?",
            options: ["Masseter", "Temporalis", "Lateral pterygoid", "Medial pterygoid"],
            correct: 2,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is hypercementosis?",
            options: ["Excess enamel", "Excess cementum", "Excess dentin", "Excess bone"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "Which test determines pulp vitality?",
            options: ["Percussion", "Thermal", "Mobility", "Probing"],
            correct: 1,
            difficulty: "medium",
            category: "diagnosis"
        },
        {
            question: "What is Miller's classification?",
            options: ["Caries", "Gingival recession", "Malocclusion", "Tooth mobility"],
            correct: 1,
            difficulty: "medium",
            category: "periodontics"
        },
        {
            question: "Which element strengthens glass ionomer?",
            options: ["Fluoride", "Silver", "Zinc", "Copper"],
            correct: 1,
            difficulty: "medium",
            category: "materials"
        },
        {
            question: "What is dens in dente?",
            options: ["Tooth within tooth", "Extra tooth", "Fused teeth", "Dilacerated root"],
            correct: 0,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "Which artery bleeds most during extraction?",
            options: ["Facial", "Maxillary", "Lingual", "Inferior alveolar"],
            correct: 3,
            difficulty: "medium",
            category: "surgery"
        },
        {
            question: "What is Riga-Fede disease?",
            options: ["Gum ulcer from natal tooth", "Oral cancer", "Fungal infection", "Vitamin deficiency"],
            correct: 0,
            difficulty: "medium",
            category: "pediatric"
        },
        {
            question: "Which wave is produced by pulp tester?",
            options: ["Sine wave", "Square wave", "Triangular wave", "Sawtooth wave"],
            correct: 1,
            difficulty: "medium",
            category: "diagnosis"
        },
        {
            question: "What is transillumination used for?",
            options: ["Caries detection", "Fracture detection", "Both", "Neither"],
            correct: 2,
            difficulty: "medium",
            category: "diagnosis"
        },
        {
            question: "Which solution is used for root canal irrigation?",
            options: ["Saline", "Sodium hypochlorite", "Hydrogen peroxide", "Chlorhexidine"],
            correct: 1,
            difficulty: "medium",
            category: "endodontics"
        },
        {
            question: "What is fenestration?",
            options: ["Root exposure through bone", "Crown fracture", "Pulp exposure", "Gum recession"],
            correct: 0,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "Which crown has best strength?",
            options: ["Porcelain", "Metal-ceramic", "All-ceramic", "Gold"],
            correct: 3,
            difficulty: "medium",
            category: "prosthodontics"
        },
        {
            question: "What is primary herpetic gingivostomatitis?",
            options: ["Bacterial infection", "Viral infection", "Fungal infection", "Autoimmune disease"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "Which cusp is missing in mandibular second premolar?",
            options: ["Buccal", "Lingual", "Mesial", "Distal"],
            correct: 1,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is the ideal implant length?",
            options: ["8mm", "10mm", "12mm", "15mm"],
            correct: 1,
            difficulty: "medium",
            category: "implantology"
        },
        {
            question: "Which disease shows 'strawberry tongue'?",
            options: ["Measles", "Scarlet fever", "Diphtheria", "Mumps"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "What is the setting time of alginate?",
            options: ["1-2 minutes", "2-3 minutes", "3-5 minutes", "5-7 minutes"],
            correct: 2,
            difficulty: "medium",
            category: "materials"
        },
        {
            question: "Which forceps is used for maxillary molars?",
            options: ["No. 150", "No. 151", "No. 17", "No. 18"],
            correct: 1,
            difficulty: "medium",
            category: "surgery"
        },
        {
            question: "What is Bennett movement?",
            options: ["Forward mandible movement", "Lateral mandible movement", "Vertical mandible movement", "Rotational movement"],
            correct: 1,
            difficulty: "medium",
            category: "prosthodontics"
        },
        {
            question: "Which papilla is affected first in gingivitis?",
            options: ["Marginal", "Interdental", "Attached", "Alveolar"],
            correct: 1,
            difficulty: "medium",
            category: "periodontics"
        },
        {
            question: "What is luxation?",
            options: ["Tooth fracture", "Tooth displacement", "Tooth avulsion", "Tooth mobility"],
            correct: 1,
            difficulty: "medium",
            category: "trauma"
        },
        {
            question: "Which vitamin deficiency causes angular cheilitis?",
            options: ["Vitamin A", "Vitamin B2", "Vitamin C", "Vitamin D"],
            correct: 1,
            difficulty: "medium",
            category: "nutrition"
        },
        {
            question: "What is osteotomy?",
            options: ["Bone removal", "Bone cutting", "Bone grafting", "Bone shaping"],
            correct: 1,
            difficulty: "medium",
            category: "surgery"
        },
        {
            question: "Which test checks occlusal contacts?",
            options: ["Disclosing", "Articulating paper", "Transillumination", "Probing"],
            correct: 1,
            difficulty: "medium",
            category: "diagnosis"
        },
        {
            question: "What is pulpotomy?",
            options: ["Complete pulp removal", "Partial pulp removal", "Pulp capping", "Root canal"],
            correct: 1,
            difficulty: "medium",
            category: "endodontics"
        },
        {
            question: "Which syndrome shows cleft palate?",
            options: ["Down syndrome", "Pierre Robin sequence", "Turner syndrome", "Klinefelter syndrome"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "What is Hawley's retainer?",
            options: ["Fixed retainer", "Removable retainer", "Lingual retainer", "Clear aligner"],
            correct: 1,
            difficulty: "medium",
            category: "orthodontics"
        },
        {
            question: "Which cusp is largest in maxillary first molar?",
            options: ["Mesiobuccal", "Distobuccal", "Mesiopalatal", "Distopalatal"],
            correct: 2,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is dry socket?",
            options: ["Socket infection", "Socket fracture", "Alveolar osteitis", "Socket bleeding"],
            correct: 2,
            difficulty: "medium",
            category: "surgery"
        },
        {
            question: "Which alloy is used in dentures?",
            options: ["Stainless steel", "Cobalt-chromium", "Titanium", "Gold"],
            correct: 1,
            difficulty: "medium",
            category: "prosthodontics"
        },
        {
            question: "What is ghost tooth?",
            options: ["Supernumerary tooth", "Regional odontodysplasia", "Natal tooth", "Impacted tooth"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "Which stain penetrates enamel?",
            options: ["Coffee", "Tetracycline", "Tobacco", "Betel nut"],
            correct: 1,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "What is frenotomy?",
            options: ["Frenulum removal", "Frenulum cutting", "Frenulum repair", "Frenulum lengthening"],
            correct: 1,
            difficulty: "medium",
            category: "surgery"
        },
        {
            question: "Which material bonds chemically to tooth?",
            options: ["Amalgam", "Composite", "Glass ionomer", "Gold"],
            correct: 2,
            difficulty: "medium",
            category: "materials"
        },
        {
            question: "What is gingival zenith?",
            options: ["Gum height", "Most apical point of gingival margin", "Gum thickness", "Gum color"],
            correct: 1,
            difficulty: "medium",
            category: "aesthetics"
        },
        {
            question: "Which lymph node drains anterior tongue?",
            options: ["Submandibular", "Submental", "Cervical", "Parotid"],
            correct: 1,
            difficulty: "medium",
            category: "anatomy"
        },
        {
            question: "What is space maintainer?",
            options: ["Orthodontic appliance", "Denture", "Crown", "Bridge"],
            correct: 0,
            difficulty: "medium",
            category: "pediatric"
        },
        {
            question: "Which radiograph shows TMJ?",
            options: ["Periapical", "Bitewing", "Panoramic", "Occlusal"],
            correct: 2,
            difficulty: "medium",
            category: "radiology"
        },
        {
            question: "What is overbite?",
            options: ["Horizontal overlap", "Vertical overlap", "Tooth rotation", "Tooth crowding"],
            correct: 1,
            difficulty: "medium",
            category: "orthodontics"
        },
        {
            question: "Which enzyme initiates starch digestion?",
            options: ["Pepsin", "Amylase", "Lipase", "Protease"],
            correct: 1,
            difficulty: "medium",
            category: "physiology"
        },
        {
            question: "What is calculus bridge?",
            options: ["Calculus between two teeth", "Crown bridge", "Prosthetic device", "Orthodontic wire"],
            correct: 0,
            difficulty: "medium",
            category: "periodontics"
        },
        {
            question: "Which agent prevents biofilm?",
            options: ["Fluoride", "Chlorhexidine", "Hydrogen peroxide", "Sodium bicarbonate"],
            correct: 1,
            difficulty: "medium",
            category: "prevention"
        },
        {
            question: "What is parulis?",
            options: ["Gum boil", "Ulcer", "Cyst", "Tumor"],
            correct: 0,
            difficulty: "medium",
            category: "pathology"
        },
        {
            question: "Which tooth most commonly has extra canal?",
            options: ["Maxillary incisor", "Mandibular incisor", "Maxillary molar", "Mandibular molar"],
            correct: 3,
            difficulty: "medium",
            category: "endodontics"
        },
        {
            question: "What is Bolton's analysis?",
            options: ["Jaw size", "Tooth size discrepancy", "Bone density", "Gum health"],
            correct: 1,
            difficulty: "medium",
            category: "orthodontics"
        },
        {
            question: "Which impression is used for edentulous patients?",
            options: ["Alginate", "Silicone", "Polyether", "Impression compound"],
            correct: 3,
            difficulty: "medium",
            category: "prosthodontics"
        },
        {
            question: "What is CBCT?",
            options: ["2D X-ray", "3D X-ray", "Ultrasound", "MRI"],
            correct: 1,
            difficulty: "medium",
            category: "radiology"
        },
        {
            question: "Which cells form dentin?",
            options: ["Ameloblasts", "Odontoblasts", "Cementoblasts", "Fibroblasts"],
            correct: 1,
            difficulty: "medium",
            category: "histology"
        },
        {
            question: "What is abfraction?",
            options: ["Tooth wear from grinding", "Tooth wear from acid", "Tooth wear from brushing", "Tooth wear from flexure"],
            correct: 3,
            difficulty: "medium",
            category: "pathology"
        },

        // ==========================================
        // HARD QUESTIONS (100)
        // ==========================================
        {
            question: "What is the mechanism of action of bisphosphonates in BRONJ?",
            options: ["Inhibit osteoclasts", "Promote angiogenesis", "Increase bone turnover", "Enhance osteoblast activity"],
            correct: 0,
            difficulty: "hard",
            category: "pharmacology"
        },
        {
            question: "Which cranial nerve provides taste to posterior 1/3 of tongue?",
            options: ["Facial", "Glossopharyngeal", "Vagus", "Hypoglossal"],
            correct: 1,
            difficulty: "hard",
            category: "anatomy"
        },
        {
            question: "What is the Weis-Fogh mechanism in mastication?",
            options: ["Chewing efficiency", "Mandibular movement", "Tooth wear pattern", "Saliva production"],
            correct: 1,
            difficulty: "hard",
            category: "biomechanics"
        },
        {
            question: "Which gene mutation causes amelogenesis imperfecta?",
            options: ["AMELX", "COL1A1", "DSPP", "RUNX2"],
            correct: 0,
            difficulty: "hard",
            category: "genetics"
        },
        {
            question: "What is the Frankfort horizontal plane?",
            options: ["Cephalometric reference", "Occlusal plane", "Camper's plane", "Bonwill triangle"],
            correct: 0,
            difficulty: "hard",
            category: "orthodontics"
        },
        {
            question: "Which cytokine is primarily responsible for bone resorption in periodontitis?",
            options: ["IL-1", "IL-6", "TNF-α", "RANKL"],
            correct: 3,
            difficulty: "hard",
            category: "immunology"
        },
        {
            question: "What is the critical defect size in bone regeneration?",
            options: ["3mm", "5mm", "7mm", "10mm"],
            correct: 1,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "Which bacteria is implicated in necrotizing ulcerative gingivitis?",
            options: ["P. gingivalis", "Prevotella intermedia", "T. denticola", "F. nucleatum"],
            correct: 1,
            difficulty: "hard",
            category: "microbiology"
        },
        {
            question: "What is the gold standard for measuring alveolar bone loss?",
            options: ["Clinical probing", "Radiographs", "Subtraction radiography", "CBCT"],
            correct: 2,
            difficulty: "hard",
            category: "diagnosis"
        },
        {
            question: "Which zone of pulp has the highest concentration of odontoblasts?",
            options: ["Cell-rich zone", "Cell-free zone", "Odontoblastic zone", "Pulp core"],
            correct: 2,
            difficulty: "hard",
            category: "histology"
        },
        {
            question: "What is the mechanism of MTA in pulp capping?",
            options: ["Antibacterial", "pH increase", "Dentin bridge formation", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "endodontics"
        },
        {
            question: "Which polymerization shrinkage is highest?",
            options: ["Flowable composite", "Packable composite", "Bulk-fill composite", "Nanohybrid composite"],
            correct: 0,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "What is the Posselt envelope?",
            options: ["Mandibular movement boundary", "TMJ anatomy", "Occlusal plane", "Arch form"],
            correct: 0,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which immunoglobulin is most abundant in saliva?",
            options: ["IgA", "IgG", "IgM", "IgE"],
            correct: 0,
            difficulty: "hard",
            category: "immunology"
        },
        {
            question: "What is the biologic width?",
            options: ["1mm", "2mm", "3mm", "4mm"],
            correct: 1,
            difficulty: "hard",
            category: "periodontics"
        },
        {
            question: "Which growth factor is used in bone regeneration?",
            options: ["BMP-2", "PDGF", "VEGF", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "What is the Hanau quint?",
            options: ["Five factors of occlusion", "Five cusps", "Five roots", "Five arches"],
            correct: 0,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which cell is the precursor of osteoclast?",
            options: ["Monocyte", "Fibroblast", "Osteoblast", "Macrophage"],
            correct: 0,
            difficulty: "hard",
            category: "histology"
        },
        {
            question: "What is the Angle of Convenience in access cavity?",
            options: ["45 degrees", "60 degrees", "90 degrees", "120 degrees"],
            correct: 2,
            difficulty: "hard",
            category: "endodontics"
        },
        {
            question: "Which test has highest specificity for pulp vitality?",
            options: ["Cold test", "Heat test", "Electric pulp test", "Laser Doppler flowmetry"],
            correct: 3,
            difficulty: "hard",
            category: "diagnosis"
        },
        {
            question: "What is the Curve of Monson?",
            options: ["Anteroposterior curve", "Mediolateral curve", "3D curve", "Vertical curve"],
            correct: 2,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which protein is defective in dentinogenesis imperfecta?",
            options: ["Amelogenin", "Dentin sialophosphoprotein", "Collagen I", "Alkaline phosphatase"],
            correct: 1,
            difficulty: "hard",
            category: "genetics"
        },
        {
            question: "What is the mechanism of Nd:YAG laser in surgery?",
            options: ["Ablation", "Coagulation", "Both", "Neither"],
            correct: 2,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "Which staging system is used for oral cancer?",
            options: ["Duke's", "TNM", "Ann Arbor", "Clark's"],
            correct: 1,
            difficulty: "hard",
            category: "pathology"
        },
        {
            question: "What is osseointegration time for mandible?",
            options: ["2 months", "3 months", "4 months", "6 months"],
            correct: 1,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "Which wavelength is best for caries detection?",
            options: ["488nm", "655nm", "810nm", "1310nm"],
            correct: 2,
            difficulty: "hard",
            category: "diagnosis"
        },
        {
            question: "What is the mechanism of piezoelectric surgery?",
            options: ["Ultrasonic vibration", "Laser ablation", "Electrosurgery", "Cryotherapy"],
            correct: 0,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "Which salivary gland produces most saliva at rest?",
            options: ["Parotid", "Submandibular", "Sublingual", "Minor glands"],
            correct: 1,
            difficulty: "hard",
            category: "physiology"
        },
        {
            question: "What is the Steiner analysis based on?",
            options: ["Soft tissue", "Skeletal pattern", "Dental relationship", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "orthodontics"
        },
        {
            question: "Which adhesive generation has highest bond strength?",
            options: ["4th generation", "5th generation", "6th generation", "7th generation"],
            correct: 3,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "What is the acceptable microleakage for restorations?",
            options: ["< 10 microns", "< 25 microns", "< 50 microns", "< 100 microns"],
            correct: 1,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "Which classification is used for furcation involvement?",
            options: ["Miller", "Glickman", "Stillman", "Kennedy"],
            correct: 1,
            difficulty: "hard",
            category: "periodontics"
        },
        {
            question: "What is the primary buffer system in saliva?",
            options: ["Bicarbonate", "Phosphate", "Protein", "All of the above"],
            correct: 0,
            difficulty: "hard",
            category: "physiology"
        },
        {
            question: "Which suture material has longest resorption time?",
            options: ["Catgut", "Vicryl", "PDS", "Prolene"],
            correct: 2,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "What is the critical energy dose for low-level laser therapy?",
            options: ["2-4 J/cm²", "4-6 J/cm²", "6-8 J/cm²", "8-10 J/cm²"],
            correct: 1,
            difficulty: "hard",
            category: "laser"
        },
        {
            question: "Which endodontic file has maximum cutting efficiency?",
            options: ["K-file", "H-file", "ProTaper", "Mtwo"],
            correct: 3,
            difficulty: "hard",
            category: "endodontics"
        },
        {
            question: "What is the mechanism of chlorhexidine substantivity?",
            options: ["Chemical bonding", "Electrostatic interaction", "Mechanical retention", "pH change"],
            correct: 1,
            difficulty: "hard",
            category: "pharmacology"
        },
        {
            question: "Which porcelain has highest flexural strength?",
            options: ["Feldspathic", "Leucite-reinforced", "Lithium disilicate", "Zirconia"],
            correct: 3,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "What is the mechanism of PDT in periodontitis?",
            options: ["Bacterial killing", "Anti-inflammatory", "Tissue regeneration", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "periodontics"
        },
        {
            question: "Which growth factor promotes cementogenesis?",
            options: ["BMP", "TGF-β", "PDGF", "IGF"],
            correct: 1,
            difficulty: "hard",
            category: "periodontics"
        },
        {
            question: "What is the ideal implant primary stability?",
            options: ["< 35 ISQ", "35-45 ISQ", "45-60 ISQ", "> 60 ISQ"],
            correct: 3,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "Which biomarker indicates active periodontitis?",
            options: ["MMP-8", "IL-1β", "PGE2", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "diagnosis"
        },
        {
            question: "What is the mechanism of GBR membranes?",
            options: ["Space maintenance", "Cell occlusion", "Both", "Neither"],
            correct: 2,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "Which etchant concentration is ideal for dentin?",
            options: ["10%", "20%", "30%", "37%"],
            correct: 1,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "What is the Christensen phenomenon?",
            options: ["Mandibular flexure", "Posterior space opening", "Anterior guidance", "Lateral shift"],
            correct: 1,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which nerve block anesthetizes entire maxilla?",
            options: ["Infraorbital", "Posterior superior alveolar", "V2 block", "Nasopalatine"],
            correct: 2,
            difficulty: "hard",
            category: "anesthesia"
        },
        {
            question: "What is the ideal torque for implant placement?",
            options: ["15-25 Ncm", "25-35 Ncm", "35-45 Ncm", "45-55 Ncm"],
            correct: 2,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "Which radiograph shows best bone architecture?",
            options: ["Periapical", "Bitewing", "CBCT", "Panoramic"],
            correct: 2,
            difficulty: "hard",
            category: "radiology"
        },
        {
            question: "What is the mechanism of remineralization?",
            options: ["Fluoride uptake", "Calcium phosphate deposition", "pH neutralization", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "cariology"
        },
        {
            question: "Which classification system is used for socket preservation?",
            options: ["Seibert", "Cawood & Howell", "Misch", "Elian"],
            correct: 3,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "What is the ideal emergence profile angle?",
            options: ["15 degrees", "30 degrees", "45 degrees", "60 degrees"],
            correct: 1,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which test detects Porphyromonas gingivalis?",
            options: ["Culture", "PCR", "ELISA", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "microbiology"
        },
        {
            question: "What is the refractory period of local anesthetics?",
            options: ["0.5-1ms", "1-2ms", "2-3ms", "3-4ms"],
            correct: 1,
            difficulty: "hard",
            category: "pharmacology"
        },
        {
            question: "Which technique reduces polymerization shrinkage?",
            options: ["Incremental filling", "Soft-start curing", "High C-factor", "All except high C-factor"],
            correct: 3,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "What is the width of attached gingiva?",
            options: ["1-2mm", "2-4mm", "4-6mm", "6-8mm"],
            correct: 1,
            difficulty: "hard",
            category: "periodontics"
        },
        {
            question: "Which artery supplies the pulp?",
            options: ["Dental artery", "Alveolar artery", "Maxillary artery", "All of the above"],
            correct: 1,
            difficulty: "hard",
            category: "anatomy"
        },
        {
            question: "What is the mechanism of erbium laser in cavity preparation?",
            options: ["Thermal ablation", "Microexplosions", "Photodisruption", "Vaporization"],
            correct: 1,
            difficulty: "hard",
            category: "laser"
        },
        {
            question: "Which growth factor is in PRF?",
            options: ["PDGF", "TGF-β", "VEGF", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "What is the ideal interocclusal space?",
            options: ["1-2mm", "2-3mm", "3-4mm", "4-5mm"],
            correct: 1,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which cell mediates periapical bone resorption?",
            options: ["Osteoblast", "Osteoclast", "Macrophage", "Lymphocyte"],
            correct: 1,
            difficulty: "hard",
            category: "pathology"
        },
        {
            question: "What is the mechanism of silver diamine fluoride?",
            options: ["Remineralization", "Antibacterial", "Protein precipitation", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "prevention"
        },
        {
            question: "Which analysis evaluates facial harmony?",
            options: ["Steiner", "Downs", "Ricketts", "Arnett"],
            correct: 3,
            difficulty: "hard",
            category: "orthodontics"
        },
        {
            question: "What is the ideal implant-abutment connection?",
            options: ["External hex", "Internal hex", "Morse taper", "All are equal"],
            correct: 2,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "Which cytokine inhibits bone resorption?",
            options: ["IL-1", "TNF-α", "OPG", "RANKL"],
            correct: 2,
            difficulty: "hard",
            category: "immunology"
        },
        {
            question: "What is the mechanism of diode laser in soft tissue surgery?",
            options: ["Cutting", "Coagulation", "Both", "Neither"],
            correct: 2,
            difficulty: "hard",
            category: "laser"
        },
        {
            question: "Which classification is used for vertical root fracture?",
            options: ["Ellis", "Andreasen", "AAE", "WHO"],
            correct: 2,
            difficulty: "hard",
            category: "endodontics"
        },
        {
            question: "What is the ideal implant width for anterior teeth?",
            options: ["3.0-3.5mm", "3.5-4.0mm", "4.0-4.5mm", "4.5-5.0mm"],
            correct: 1,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "Which test measures masticatory performance?",
            options: ["Sieve method", "Optical scanning", "Colorimetric method", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "What is the mechanism of ozone in dentistry?",
            options: ["Oxidation", "Oxygenation", "Remineralization", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "prevention"
        },
        {
            question: "Which graft material has best osteoconductivity?",
            options: ["Autograft", "Allograft", "Xenograft", "Alloplast"],
            correct: 0,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "What is the ideal cantilever length in implant bridge?",
            options: ["5mm", "7mm", "10mm", "15mm"],
            correct: 2,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "Which bacteria produces hydrogen sulfide?",
            options: ["S. mutans", "P. gingivalis", "T. denticola", "F. nucleatum"],
            correct: 1,
            difficulty: "hard",
            category: "microbiology"
        },
        {
            question: "What is the mechanism of CAD/CAM milling?",
            options: ["Subtractive", "Additive", "Both", "Neither"],
            correct: 0,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which test evaluates periodontal regeneration?",
            options: ["Probing", "Re-entry surgery", "Radiograph", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "periodontics"
        },
        {
            question: "What is the ideal occlusal clearance for crown?",
            options: ["0.5mm", "1.0mm", "1.5mm", "2.0mm"],
            correct: 2,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which wavelength is used for composite curing?",
            options: ["380-420nm", "420-480nm", "480-520nm", "520-560nm"],
            correct: 1,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "What is the mechanism of calcium hydroxide in apexification?",
            options: ["pH increase", "Antimicrobial", "Hard tissue formation", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "endodontics"
        },
        {
            question: "Which cell produces periodontal ligament?",
            options: ["Osteoblast", "Cementoblast", "Fibroblast", "Odontoblast"],
            correct: 2,
            difficulty: "hard",
            category: "histology"
        },
        {
            question: "What is the ideal labial reduction for veneer?",
            options: ["0.3mm", "0.5mm", "0.7mm", "1.0mm"],
            correct: 1,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which analysis evaluates airway space?",
            options: ["McNamara", "Downs", "Steiner", "Tweed"],
            correct: 0,
            difficulty: "hard",
            category: "orthodontics"
        },
        {
            question: "What is the mechanism of glass ionomer bonding?",
            options: ["Micromechanical", "Chemical", "Both", "Neither"],
            correct: 1,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "Which test detects apical periodontitis?",
            options: ["Percussion", "Palpation", "Radiograph", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "diagnosis"
        },
        {
            question: "What is the ideal abutment height for implant?",
            options: ["2mm", "3mm", "4mm", "5mm"],
            correct: 1,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "Which factor affects osseointegration most?",
            options: ["Implant surface", "Bone quality", "Surgical technique", "All equally"],
            correct: 3,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "What is the mechanism of nitrous oxide sedation?",
            options: ["GABA agonist", "NMDA antagonist", "Opioid receptor", "Unknown"],
            correct: 1,
            difficulty: "hard",
            category: "anesthesia"
        },
        {
            question: "Which classification is used for peri-implantitis?",
            options: ["Mombelli", "Froum", "Schwarz", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "What is the ideal ferrule height?",
            options: ["0.5mm", "1.0mm", "1.5mm", "2.0mm"],
            correct: 3,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which test evaluates masticatory muscles?",
            options: ["EMG", "MRI", "Ultrasound", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "diagnosis"
        },
        {
            question: "What is the mechanism of bioactive glass?",
            options: ["Ion release", "pH change", "Hydroxyapatite formation", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "Which growth factor promotes angiogenesis?",
            options: ["PDGF", "BMP", "VEGF", "TGF-β"],
            correct: 2,
            difficulty: "hard",
            category: "surgery"
        },
        {
            question: "What is the ideal pontic design for aesthetics?",
            options: ["Ridge lap", "Ovate", "Modified ridge lap", "Hygienic"],
            correct: 1,
            difficulty: "hard",
            category: "prosthodontics"
        },
        {
            question: "Which technique reduces marginal leakage?",
            options: ["Incremental filling", "Flowable liner", "Both", "Neither"],
            correct: 2,
            difficulty: "hard",
            category: "materials"
        },
        {
            question: "What is the mechanism of stem cell therapy in regeneration?",
            options: ["Cell replacement", "Paracrine signaling", "Both", "Neither"],
            correct: 2,
            difficulty: "hard",
            category: "regeneration"
        },
        {
            question: "Which classification evaluates craniofacial pattern?",
            options: ["Steiner", "Ricketts", "Björk", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "orthodontics"
        },
        {
            question: "What is the ideal implant placement depth?",
            options: ["At bone level", "1mm subcrestal", "2mm subcrestal", "Supracrestal"],
            correct: 1,
            difficulty: "hard",
            category: "implantology"
        },
        {
            question: "Which factor determines denture retention?",
            options: ["Adhesion", "Cohesion", "Atmospheric pressure", "All of the above"],
            correct: 3,
            difficulty: "hard",
            category: "prosthodontics"
        }
    ]
};

console.log('✅ CONFIG loaded:', {
    questions: CONFIG.questions.length,
    easy: CONFIG.questions.filter(q => q.difficulty === 'easy').length,
    medium: CONFIG.questions.filter(q => q.difficulty === 'medium').length,
    hard: CONFIG.questions.filter(q => q.difficulty === 'hard').length,
    rewards: CONFIG.rewards.length,
    timeLimit: CONFIG.quiz.timeLimit
});
