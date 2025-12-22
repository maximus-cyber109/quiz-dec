// =================================
// CONFIGURATION
// Modern Quiz App Configuration
// =================================

const CONFIG = {
    // Supabase Configuration
    supabase: {
        url: 'YOUR_SUPABASE_URL_HERE',
        key: 'YOUR_SUPABASE_ANON_KEY_HERE'
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
            title: '🎯 LEGENDARY PERFORMANCE!',
            trophy: '👑',
            subtitle: 'Top 1% Dentist',
            description: 'FREE Speedendo Calcipro Rotary File worth ₹1,250 on orders above ₹5,000!',
            coupon: 'DENTAL9X',
            color: '#FFD700'
        },
        {
            minScore: 7,
            maxScore: 8,
            title: '🏆 EXPERT LEVEL!',
            trophy: '🏆',
            subtitle: 'Top 5% Dentist',
            description: '10% PB CASHBACK on your entire order! Maximum savings unlocked.',
            coupon: 'EXPERT10',
            color: '#4FACFE'
        },
        {
            minScore: 5,
            maxScore: 6,
            title: '⭐ GREAT WORK!',
            trophy: '⭐',
            subtitle: 'Top 15% Dentist',
            description: 'Flitt Diamond Burs Pack of 10 worth ₹499 FREE on orders above ₹2,000!',
            coupon: 'FLITT5',
            color: '#A29BFE'
        },
        {
            minScore: 3,
            maxScore: 4,
            title: '💪 GOOD EFFORT!',
            trophy: '💪',
            subtitle: 'Keep Improving',
            description: 'Flat 5% Off Coupon on your next order! Every purchase matters.',
            coupon: 'SAVE5',
            color: '#00D68F'
        },
        {
            minScore: 0,
            maxScore: 2,
            title: '📚 KEEP LEARNING!',
            trophy: '📚',
            subtitle: 'Practice Makes Perfect',
            description: 'Better luck next time! Try again to improve your score and unlock bigger rewards.',
            coupon: 'TRYAGAIN',
            color: '#FF6B6B'
        }
    ],

    // Dental Questions Bank (100+ questions for variety)
    questions: [
        // ENDODONTICS
        {
            question: "What is the most common cause of endodontic failure in retreatment cases?",
            options: ["Missed canals", "Inadequate cleaning", "Vertical root fractures", "Poor coronal seal"],
            correct: 0,
            category: "Endodontics",
            difficulty: "hard"
        },
        {
            question: "Which irrigant is most effective against Enterococcus faecalis biofilms?",
            options: ["5.25% NaOCl", "2% Chlorhexidine", "17% EDTA", "3% H₂O₂"],
            correct: 1,
            category: "Endodontics",
            difficulty: "hard"
        },
        {
            question: "What is the recommended working length from the apical constriction?",
            options: ["0.5-1mm short", "At the constriction", "1-2mm short", "2-3mm short"],
            correct: 0,
            category: "Endodontics",
            difficulty: "medium"
        },
        {
            question: "Which rotary file system uses M-Wire technology?",
            options: ["ProTaper", "WaveOne", "Reciproc", "ProFile"],
            correct: 1,
            category: "Endodontics",
            difficulty: "medium"
        },
        {
            question: "What is the ideal taper for most endodontic files?",
            options: [".02", ".04", ".06", ".08"],
            correct: 1,
            category: "Endodontics",
            difficulty: "easy"
        },

        // PERIODONTICS
        {
            question: "Which classification system is currently used for periodontal disease staging?",
            options: ["Miller's Classification", "AAP 2017 Classification", "Ramfjord Index", "Löe and Silness"],
            correct: 1,
            category: "Periodontics",
            difficulty: "medium"
        },
        {
            question: "What is the gold standard material for periodontal regeneration?",
            options: ["GTR membranes", "Autogenous bone grafts", "EMD (Emdogain)", "PRF"],
            correct: 2,
            category: "Periodontics",
            difficulty: "hard"
        },
        {
            question: "Which bacteria is most strongly associated with aggressive periodontitis?",
            options: ["P. gingivalis", "A. actinomycetemcomitans", "T. forsythia", "F. nucleatum"],
            correct: 1,
            category: "Periodontics",
            difficulty: "medium"
        },
        {
            question: "What is the normal sulcus depth in healthy periodontium?",
            options: ["0-1mm", "1-3mm", "3-5mm", "5-7mm"],
            correct: 1,
            category: "Periodontics",
            difficulty: "easy"
        },
        {
            question: "Which growth factor is most important in periodontal tissue regeneration?",
            options: ["PDGF", "BMP-2", "TGF-β", "IGF-1"],
            correct: 0,
            category: "Periodontics",
            difficulty: "hard"
        },

        // PROSTHODONTICS
        {
            question: "What is the ideal crown-to-root ratio for a single crown restoration?",
            options: ["1:1", "1:1.5", "1:2", "2:1"],
            correct: 1,
            category: "Prosthodontics",
            difficulty: "medium"
        },
        {
            question: "Which cement provides the best retention for all-ceramic restorations?",
            options: ["Zinc phosphate", "Glass ionomer", "Resin cement", "Polycarboxylate"],
            correct: 2,
            category: "Prosthodontics",
            difficulty: "medium"
        },
        {
            question: "What is the minimum recommended ferrule height for post-core restorations?",
            options: ["1mm", "2mm", "3mm", "4mm"],
            correct: 1,
            category: "Prosthodontics",
            difficulty: "medium"
        },
        {
            question: "Which material has the highest flexural strength for posterior crowns?",
            options: ["Feldspathic porcelain", "Leucite-reinforced ceramic", "Lithium disilicate", "Zirconia"],
            correct: 3,
            category: "Prosthodontics",
            difficulty: "easy"
        },
        {
            question: "What is the recommended occlusal clearance for metal-ceramic crowns?",
            options: ["0.5mm", "1.0mm", "1.5mm", "2.0mm"],
            correct: 2,
            category: "Prosthodontics",
            difficulty: "medium"
        },

        // ORAL SURGERY
        {
            question: "What is the most common complication after third molar extraction?",
            options: ["Nerve damage", "Dry socket (alveolar osteitis)", "Infection", "Bleeding"],
            correct: 1,
            category: "Oral Surgery",
            difficulty: "easy"
        },
        {
            question: "Which local anesthetic provides the longest duration of action?",
            options: ["Lidocaine", "Articaine", "Bupivacaine", "Mepivacaine"],
            correct: 2,
            category: "Oral Surgery",
            difficulty: "medium"
        },
        {
            question: "What is the recommended insertion torque for dental implants?",
            options: ["15-25 Ncm", "35-45 Ncm", "50-60 Ncm", "Over 70 Ncm"],
            correct: 1,
            category: "Oral Surgery",
            difficulty: "medium"
        },
        {
            question: "What is the minimum bone width required for standard implant placement?",
            options: ["4mm", "5mm", "6mm", "7mm"],
            correct: 2,
            category: "Oral Surgery",
            difficulty: "medium"
        },
        {
            question: "Which suture material is most appropriate for intraoral soft tissue closure?",
            options: ["Silk", "Vicryl (polyglactin)", "Nylon", "Prolene"],
            correct: 1,
            category: "Oral Surgery",
            difficulty: "easy"
        },

        // ORTHODONTICS
        {
            question: "What does the ANB angle measure in cephalometric analysis?",
            options: ["Mandibular plane angle", "Sagittal jaw relationship", "Facial height ratio", "Dental inclination"],
            correct: 1,
            category: "Orthodontics",
            difficulty: "medium"
        },
        {
            question: "Which force level is recommended for optimal orthodontic tooth movement?",
            options: ["50-75g", "150-300g", "400-600g", "800g+"],
            correct: 1,
            category: "Orthodontics",
            difficulty: "medium"
        },
        {
            question: "What is the ideal age for interceptive orthodontic treatment?",
            options: ["6-8 years", "8-10 years", "10-12 years", "12-14 years"],
            correct: 1,
            category: "Orthodontics",
            difficulty: "easy"
        },
        {
            question: "What is the normal overjet measurement in ideal occlusion?",
            options: ["0-1mm", "2-3mm", "4-5mm", "6-7mm"],
            correct: 1,
            category: "Orthodontics",
            difficulty: "easy"
        },

        // PEDIATRIC DENTISTRY
        {
            question: "Which material is most appropriate for pulpotomy in primary teeth?",
            options: ["Formocresol", "MTA (Mineral Trioxide Aggregate)", "Calcium hydroxide", "Ferric sulfate"],
            correct: 1,
            category: "Pediatric Dentistry",
            difficulty: "medium"
        },
        {
            question: "At what age should fluoride toothpaste be introduced for children?",
            options: ["6 months", "1 year", "2 years", "3 years"],
            correct: 1,
            category: "Pediatric Dentistry",
            difficulty: "easy"
        },
        {
            question: "What is the recommended fluoride concentration in toothpaste for children under 6?",
            options: ["500 ppm", "1000 ppm", "1450 ppm", "5000 ppm"],
            correct: 1,
            category: "Pediatric Dentistry",
            difficulty: "medium"
        },
        {
            question: "At what age does the first permanent molar typically erupt?",
            options: ["4-5 years", "6-7 years", "8-9 years", "10-11 years"],
            correct: 1,
            category: "Pediatric Dentistry",
            difficulty: "easy"
        },

        // RESTORATIVE DENTISTRY
        {
            question: "What is the recommended etch time for dentin bonding?",
            options: ["15 seconds", "30 seconds", "45 seconds", "60 seconds"],
            correct: 0,
            category: "Restorative",
            difficulty: "medium"
        },
        {
            question: "Which composite type is best suited for posterior restorations?",
            options: ["Microfill", "Hybrid", "Nanofill/nanohybrid", "Flowable"],
            correct: 2,
            category: "Restorative",
            difficulty: "easy"
        },
        {
            question: "What is the ideal moisture content for dentin bonding?",
            options: ["Completely dry", "Slightly moist (wet bonding)", "Very wet", "Flooded"],
            correct: 1,
            category: "Restorative",
            difficulty: "medium"
        },
        {
            question: "What is the recommended thickness for ceramic veneers?",
            options: ["0.3-0.5mm", "0.5-0.7mm", "0.7-1.0mm", "1.0-1.5mm"],
            correct: 1,
            category: "Restorative",
            difficulty: "medium"
        },

        // ORAL PATHOLOGY
        {
            question: "Which is the most common site for oral squamous cell carcinoma?",
            options: ["Lateral border of tongue", "Floor of mouth", "Gingiva", "Hard palate"],
            correct: 0,
            category: "Oral Pathology",
            difficulty: "medium"
        },
        {
            question: "What is the most common odontogenic cyst?",
            options: ["Periapical (radicular) cyst", "Dentigerous cyst", "Lateral periodontal cyst", "Residual cyst"],
            correct: 0,
            category: "Oral Pathology",
            difficulty: "easy"
        },
        {
            question: "Which virus is most strongly associated with oral hairy leukoplakia?",
            options: ["HSV-1", "EBV (Epstein-Barr)", "CMV", "HPV"],
            correct: 1,
            category: "Oral Pathology",
            difficulty: "hard"
        },
        {
            question: "What is the most common benign odontogenic tumor?",
            options: ["Ameloblastoma", "Odontoma", "Odontogenic myxoma", "Cementoblastoma"],
            correct: 1,
            category: "Oral Pathology",
            difficulty: "medium"
        },

        // DENTAL MATERIALS
        {
            question: "What is the setting time of Type III dental stone?",
            options: ["5-10 minutes", "10-15 minutes", "15-20 minutes", "20-30 minutes"],
            correct: 1,
            category: "Dental Materials",
            difficulty: "medium"
        },
        {
            question: "Which property is most critical for impression materials?",
            options: ["High viscosity", "Elastic recovery", "Long working time", "High tear strength"],
            correct: 1,
            category: "Dental Materials",
            difficulty: "medium"
        },
        {
            question: "What is the ideal powder-to-liquid ratio for Type III stone?",
            options: ["100g:23ml", "100g:30ml", "100g:50ml", "100g:100ml"],
            correct: 0,
            category: "Dental Materials",
            difficulty: "hard"
        },

        // RADIOGRAPHY
        {
            question: "What is the recommended frequency for bitewing radiographs in high-risk patients?",
            options: ["6 months", "12 months", "18 months", "24 months"],
            correct: 0,
            category: "Radiography",
            difficulty: "medium"
        },
        {
            question: "Which projection best shows the maxillary sinuses?",
            options: ["Periapical", "Bitewing", "Lateral cephalometric", "Waters view"],
            correct: 3,
            category: "Radiography",
            difficulty: "medium"
        },
        {
            question: "What is the maximum safe radiation dose per year for dental workers?",
            options: ["20 mSv", "50 mSv", "100 mSv", "150 mSv"],
            correct: 0,
            category: "Radiography",
            difficulty: "hard"
        },

        // PHARMACOLOGY
        {
            question: "What is the maximum safe dose of lidocaine for a healthy adult (70kg)?",
            options: ["300mg", "500mg", "700mg", "1000mg"],
            correct: 1,
            category: "Pharmacology",
            difficulty: "medium"
        },
        {
            question: "Which antibiotic is the first-line choice for odontogenic infections?",
            options: ["Penicillin V", "Amoxicillin", "Clindamycin", "Azithromycin"],
            correct: 1,
            category: "Pharmacology",
            difficulty: "easy"
        },
        {
            question: "What is the primary mechanism of action of NSAIDs?",
            options: ["COX enzyme inhibition", "LOX inhibition", "Calcium channel blocking", "Sodium channel blocking"],
            correct: 0,
            category: "Pharmacology",
            difficulty: "easy"
        },
        {
            question: "Which antibiotic should be avoided in children under 8 years?",
            options: ["Amoxicillin", "Cephalexin", "Tetracycline", "Erythromycin"],
            correct: 2,
            category: "Pharmacology",
            difficulty: "medium"
        },

        // ADVANCED TOPICS
        {
            question: "What is the most predictable method for root coverage procedures?",
            options: ["Free gingival graft", "Connective tissue graft", "GTR", "Coronally advanced flap alone"],
            correct: 1,
            category: "Periodontics",
            difficulty: "hard"
        },
        {
            question: "Which factor most influences long-term implant success?",
            options: ["Implant diameter", "Primary stability", "Surface treatment", "Implant length"],
            correct: 1,
            category: "Oral Surgery",
            difficulty: "medium"
        },
        {
            question: "What is the recommended maintenance interval for periodontitis patients?",
            options: ["2 months", "3 months", "6 months", "12 months"],
            correct: 1,
            category: "Periodontics",
            difficulty: "medium"
        },
        {
            question: "What is the most common cause of post-operative sensitivity in composite restorations?",
            options: ["Polymerization shrinkage", "Incomplete polymerization", "Microleakage", "Thermal expansion"],
            correct: 2,
            category: "Restorative",
            difficulty: "medium"
        },
        {
            question: "Which virus type is most associated with oral cancer?",
            options: ["HSV-1", "HPV-16", "EBV", "CMV"],
            correct: 1,
            category: "Oral Pathology",
            difficulty: "hard"
        },
        {
            question: "What is the recommended fiber post diameter relative to root canal diameter?",
            options: ["1/4", "1/3", "1/2", "2/3"],
            correct: 1,
            category: "Prosthodontics",
            difficulty: "hard"
        },
        {
            question: "What is the recommended waiting period after extraction before implant placement?",
            options: ["Immediate", "4-6 weeks", "8-12 weeks", "4-6 months"],
            correct: 2,
            category: "Oral Surgery",
            difficulty: "medium"
        },
        {
            question: "What is the most accurate method for caries detection?",
            options: ["Visual examination", "Bitewing radiography", "Laser fluorescence (DIAGNOdent)", "Transillumination"],
            correct: 1,
            category: "Restorative",
            difficulty: "medium"
        }
    ],

    // WhatsApp Share Template
    shareMessage: (score, total, userName) => {
        const percentage = Math.round((score / total) * 100);
        let emoji = '🏆';
        let message = '';
        
        if (score >= 9) {
            emoji = '👑';
            message = 'LEGENDARY performance!';
        } else if (score >= 7) {
            emoji = '🔥';
            message = 'EXPERT level!';
        } else if (score >= 5) {
            emoji = '⭐';
            message = 'GREAT work!';
        } else {
            emoji = '💪';
            message = 'Good effort!';
        }

        return `${emoji} *PinkBlue Dental Challenge 2025* ${emoji}

I just scored *${score}/${total}* (${percentage}%) - ${message}

Can you beat my score? 🎯

🚀 Take the challenge now:
${window.location.origin}${window.location.pathname}

🎁 Win exclusive rewards & cashback!
🏆 Climb the global leaderboard!

#PinkBlueChallenge #DentalExcellence #TestYourSkills`;
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
