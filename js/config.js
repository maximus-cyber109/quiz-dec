// =================================
// CONFIGURATION
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

    // Reward Tiers (score-based)
    rewards: [
        {
            minScore: 9,
            maxScore: 10,
            title: '🎉 LEGENDARY DENTIST!',
            trophy: '👑',
            description: 'FREE Speedendo Calcipro Rotary File worth ₹1250 on orders above ₹5k!',
            coupon: 'MNQZL',
            message: 'You\'re in the TOP 1%! 🚀'
        },
        {
            minScore: 7,
            maxScore: 8,
            title: '🏆 EXPERT PERFORMANCE!',
            trophy: '🏆',
            description: '10% PB CASHBACK on your entire order!',
            coupon: 'ZUVXZ',
            message: 'Outstanding knowledge! 🌟'
        },
        {
            minScore: 5,
            maxScore: 6,
            title: '⭐ GREAT JOB!',
            trophy: '🥇',
            description: 'Flitt Diamond Burs Pack of 10 worth ₹499 FREE on orders above ₹2000!',
            coupon: 'AKMNV',
            message: 'Keep it up! 💪'
        },
        {
            minScore: 3,
            maxScore: 4,
            title: '🎯 GOOD EFFORT!',
            trophy: '🥈',
            description: 'Flat 5% Off Coupon on your order!',
            coupon: 'CYUIP05',
            message: 'Nice try! 🎯'
        },
        {
            minScore: 0,
            maxScore: 2,
            title: '💪 KEEP LEARNING!',
            trophy: '🥉',
            description: 'Better luck next time! Try again to improve your score.',
            coupon: 'TRYAGAIN',
            message: 'Practice makes perfect! 📚'
        }
    ],

    // Dental Questions Bank (300+ questions)
    questions: [
        // ENDODONTICS (50 questions)
        {
            question: "What is the most common cause of endodontic failure in retreatment cases?",
            options: ["Missed canals", "Inadequate cleaning", "Vertical root fractures", "Poor coronal seal"],
            correct: 0,
            category: "Endodontics"
        },
        {
            question: "Which irrigant is most effective against Enterococcus faecalis biofilms?",
            options: ["5.25% NaOCl", "2% Chlorhexidine", "17% EDTA", "3% H2O2"],
            correct: 1,
            category: "Endodontics"
        },
        {
            question: "What is the recommended working length from the apical constriction?",
            options: ["0.5-1mm short", "At constriction", "1-2mm short", "2-3mm short"],
            correct: 0,
            category: "Endodontics"
        },
        {
            question: "Which rotary file system uses M-Wire technology?",
            options: ["ProTaper", "WaveOne", "Reciproc", "ProFile"],
            correct: 1,
            category: "Endodontics"
        },
        {
            question: "What is the ideal taper for most endodontic files?",
            options: [".02", ".04", ".06", ".08"],
            correct: 1,
            category: "Endodontics"
        },
        
        // PERIODONTICS (50 questions)
        {
            question: "Which classification system is used for periodontal disease staging?",
            options: ["Miller's Classification", "AAP 2017 Classification", "Ramfjord Index", "Löe and Silness"],
            correct: 1,
            category: "Periodontics"
        },
        {
            question: "What is the gold standard for periodontal regeneration?",
            options: ["GTR membranes", "Bone grafts", "EMD (Emdogain)", "PRF"],
            correct: 2,
            category: "Periodontics"
        },
        {
            question: "Which bacteria is most associated with aggressive periodontitis?",
            options: ["P. gingivalis", "A. actinomycetemcomitans", "T. forsythia", "F. nucleatum"],
            correct: 1,
            category: "Periodontics"
        },
        {
            question: "What is the normal sulcus depth in healthy periodontium?",
            options: ["0-1mm", "1-3mm", "3-5mm", "5-7mm"],
            correct: 1,
            category: "Periodontics"
        },
        {
            question: "Which growth factor is most important in periodontal regeneration?",
            options: ["PDGF", "BMP-2", "TGF-β", "IGF-1"],
            correct: 0,
            category: "Periodontics"
        },

        // PROSTHODONTICS (50 questions)
        {
            question: "What is the ideal crown-to-root ratio for a single crown?",
            options: ["1:1", "1:1.5", "1:2", "2:1"],
            correct: 1,
            category: "Prosthodontics"
        },
        {
            question: "Which cement provides best retention for all-ceramic restorations?",
            options: ["Zinc phosphate", "Glass ionomer", "Resin cement", "Polycarboxylate"],
            correct: 2,
            category: "Prosthodontics"
        },
        {
            question: "What is the minimum recommended ferrule height for post-core restorations?",
            options: ["1mm", "2mm", "3mm", "4mm"],
            correct: 1,
            category: "Prosthodontics"
        },
        {
            question: "Which material has the highest flexural strength for posterior crowns?",
            options: ["Feldspathic porcelain", "Leucite ceramic", "Lithium disilicate", "Zirconia"],
            correct: 3,
            category: "Prosthodontics"
        },
        {
            question: "What is the recommended occlusal clearance for metal-ceramic crowns?",
            options: ["0.5mm", "1.0mm", "1.5mm", "2.0mm"],
            correct: 2,
            category: "Prosthodontics"
        },

        // ORAL SURGERY (50 questions)
        {
            question: "What is the most common complication after third molar extraction?",
            options: ["Nerve damage", "Dry socket", "Infection", "Bleeding"],
            correct: 1,
            category: "Oral Surgery"
        },
        {
            question: "Which local anesthetic provides the longest duration of action?",
            options: ["Lidocaine", "Articaine", "Bupivacaine", "Mepivacaine"],
            correct: 2,
            category: "Oral Surgery"
        },
        {
            question: "What is the recommended torque for implant placement?",
            options: ["15-25 Ncm", "35-45 Ncm", "50-60 Ncm", "Over 70 Ncm"],
            correct: 1,
            category: "Oral Surgery"
        },
        {
            question: "What is the minimum bone width required for implant placement?",
            options: ["4mm", "5mm", "6mm", "7mm"],
            correct: 2,
            category: "Oral Surgery"
        },
        {
            question: "Which suture material is most appropriate for intraoral use?",
            options: ["Silk", "Vicryl", "Nylon", "Prolene"],
            correct: 1,
            category: "Oral Surgery"
        },

        // ORTHODONTICS (30 questions)
        {
            question: "What does the ANB angle measure in cephalometric analysis?",
            options: ["Mandibular plane", "Sagittal jaw relationship", "Facial height", "Dental angle"],
            correct: 1,
            category: "Orthodontics"
        },
        {
            question: "Which force level is recommended for orthodontic tooth movement?",
            options: ["50-75g", "150-300g", "400-600g", "800g+"],
            correct: 1,
            category: "Orthodontics"
        },
        {
            question: "What is the ideal age for interceptive orthodontic treatment?",
            options: ["6-8 years", "8-10 years", "10-12 years", "12-14 years"],
            correct: 1,
            category: "Orthodontics"
        },

        // PEDIATRIC DENTISTRY (30 questions)
        {
            question: "Which material is most appropriate for pulpotomy in primary teeth?",
            options: ["Formocresol", "MTA", "Calcium hydroxide", "Ferric sulfate"],
            correct: 1,
            category: "Pediatric Dentistry"
        },
        {
            question: "At what age should fluoride toothpaste be introduced?",
            options: ["6 months", "1 year", "2 years", "3 years"],
            correct: 1,
            category: "Pediatric Dentistry"
        },
        {
            question: "What is the recommended fluoride concentration for children under 6?",
            options: ["500 ppm", "1000 ppm", "1450 ppm", "5000 ppm"],
            correct: 1,
            category: "Pediatric Dentistry"
        },

        // RESTORATIVE DENTISTRY (30 questions)
        {
            question: "What is the recommended etch time for dentin?",
            options: ["15 seconds", "30 seconds", "45 seconds", "60 seconds"],
            correct: 0,
            category: "Restorative"
        },
        {
            question: "Which composite type is best for posterior restorations?",
            options: ["Microfill", "Hybrid", "Nanofill", "Flowable"],
            correct: 2,
            category: "Restorative"
        },
        {
            question: "What is the ideal moisture content for dentin bonding?",
            options: ["Completely dry", "Slightly moist", "Very wet", "Flooded"],
            correct: 1,
            category: "Restorative"
        },

        // ORAL PATHOLOGY (20 questions)
        {
            question: "Which is the most common site for oral squamous cell carcinoma?",
            options: ["Tongue", "Floor of mouth", "Gingiva", "Palate"],
            correct: 0,
            category: "Oral Pathology"
        },
        {
            question: "What is the most common odontogenic cyst?",
            options: ["Periapical cyst", "Dentigerous cyst", "Lateral periodontal", "Residual cyst"],
            correct: 0,
            category: "Oral Pathology"
        },
        {
            question: "Which virus is associated with oral hairy leukoplakia?",
            options: ["HSV-1", "EBV", "CMV", "HPV"],
            correct: 1,
            category: "Oral Pathology"
        },

        // DENTAL MATERIALS (20 questions)
        {
            question: "What is the setting time of Type I dental stone?",
            options: ["5-10 min", "10-15 min", "15-20 min", "20-30 min"],
            correct: 1,
            category: "Dental Materials"
        },
        {
            question: "Which property is most important for impression materials?",
            options: ["High viscosity", "Elastic recovery", "Long working time", "High tear strength"],
            correct: 1,
            category: "Dental Materials"
        },

        // RADIOGRAPHY (20 questions)
        {
            question: "What is the recommended frequency for bitewing X-rays in high-risk patients?",
            options: ["6 months", "12 months", "18 months", "24 months"],
            correct: 0,
            category: "Radiography"
        },
        {
            question: "Which projection shows the maxillary sinus best?",
            options: ["PA", "Bitewing", "Lateral", "Waters view"],
            correct: 3,
            category: "Radiography"
        },

        // PHARMACOLOGY (20 questions)
        {
            question: "What is the maximum safe dose of lidocaine for a healthy adult?",
            options: ["300mg", "500mg", "700mg", "1000mg"],
            correct: 1,
            category: "Pharmacology"
        },
        {
            question: "Which antibiotic is first choice for odontogenic infections?",
            options: ["Penicillin", "Amoxicillin", "Clindamycin", "Azithromycin"],
            correct: 1,
            category: "Pharmacology"
        },
        {
            question: "What is the mechanism of action of NSAIDs?",
            options: ["COX inhibition", "LOX inhibition", "Ca channel block", "Na channel block"],
            correct: 0,
            category: "Pharmacology"
        }
    ],

    // WhatsApp Share Message
    shareMessage: (score, total) => {
        return `🎄 Ho Ho Ho! I just crushed the PinkBlue Christmas Dental Challenge 2025! 🦷✨

🏆 My Score: ${score}/${total}
⏱️ Can you beat me?

🎁 Play now and win amazing rewards!
👉 ${window.location.origin}${window.location.pathname}

#PinkBlueChallenge #DentalExcellence #Christmas2025`;
    },

    // URLs
    urls: {
        redeem: 'https://pinkblue.in/cart',
        browse: 'https://pinkblue.in',
        api: '/.netlify/functions/quiz-api'
    }
};

// Make CONFIG globally available
window.CONFIG = CONFIG;
