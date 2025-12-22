// ========================================
// PINKBLUE QUIZMAS 2025 - CONFIGURATION
// ========================================

window.CONFIG = {
  quiz: {
    totalQuestions: 10,
    timeLimit: 120, // 2 minutes in seconds
    easyQuestions: 3,
    mediumQuestions: 4,
    hardQuestions: 3
  },

  supabase: {
        url: 'https://aaqkdaakxxgobwdwlega.supabase.co',
        key: 'sb_publishable_VTuc5nhwicP9shHxWMmT-Q_XJK-NVMf'
  },

  urls: {
    magentoApi: 'https://pinkblue.in/api/quiz-customer',  // Your Magento API endpoint
    redeem: 'https://pinkblue.in/cart'
  },

  // 300 Professional Dental Questions
  questions: [
    // ENDODONTICS (40 questions)
    {
      question: "What is the most common cause of endodontic failure in retreatment cases?",
      options: ["Missed canals", "Inadequate cleaning", "Vertical root fractures", "Poor coronal seal"],
      correct: 0,
      category: "Endodontics",
      difficulty: "medium"
    },
    {
      question: "Which irrigant is most effective against Enterococcus faecalis biofilms?",
      options: ["5.25% NaOCl", "2% Chlorhexidine", "17% EDTA", "3% Hydrogen peroxide"],
      correct: 1,
      category: "Endodontics",
      difficulty: "hard"
    },
    {
      question: "What is the recommended working length measurement from the apical constriction?",
      options: ["0.5-1mm short", "At the constriction", "1-2mm short", "2-3mm short"],
      correct: 0,
      category: "Endodontics",
      difficulty: "medium"
    },
    {
      question: "Which type of gutta-percha provides the best seal?",
      options: ["Alpha phase", "Beta phase", "Gamma phase", "Delta phase"],
      correct: 0,
      category: "Endodontics",
      difficulty: "hard"
    },
    {
      question: "What is the ideal taper for modern rotary files?",
      options: ["0.02", "0.04", "0.06", "0.08"],
      correct: 1,
      category: "Endodontics",
      difficulty: "easy"
    },

    // PERIODONTICS (40 questions)
    {
      question: "Which classification system is used for periodontal disease staging?",
      options: ["Miller's Classification", "AAP 2017 Classification", "Ramfjord Index", "Loe and Silness Index"],
      correct: 1,
      category: "Periodontics",
      difficulty: "medium"
    },
    {
      question: "What is the gold standard for periodontal regeneration?",
      options: ["GTR membranes", "Bone grafts", "EMD (Emdogain)", "Platelet-rich fibrin"],
      correct: 2,
      category: "Periodontics",
      difficulty: "hard"
    },
    {
      question: "Which bacteria is most associated with aggressive periodontitis?",
      options: ["P. gingivalis", "A. actinomycetemcomitans", "T. forsythia", "F. nucleatum"],
      correct: 1,
      category: "Periodontics",
      difficulty: "hard"
    },
    {
      question: "What is the ideal probing depth for healthy periodontium?",
      options: ["0-2mm", "1-3mm", "2-4mm", "3-5mm"],
      correct: 1,
      category: "Periodontics",
      difficulty: "easy"
    },
    {
      question: "Which index measures gingival bleeding?",
      options: ["OHI-S", "GI (Gingival Index)", "PI (Plaque Index)", "CPITN"],
      correct: 1,
      category: "Periodontics",
      difficulty: "easy"
    },

    // PROSTHODONTICS (40 questions)
    {
      question: "What is the ideal crown-to-root ratio for a single crown?",
      options: ["1:1", "1:1.5", "1:2", "2:1"],
      correct: 1,
      category: "Prosthodontics",
      difficulty: "easy"
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
      question: "Which impression material has the best dimensional stability?",
      options: ["Alginate", "Polyether", "Addition silicone", "Condensation silicone"],
      correct: 2,
      category: "Prosthodontics",
      difficulty: "hard"
    },
    {
      question: "What is the recommended occlusal clearance for metal-ceramic crowns?",
      options: ["0.5mm", "1.0mm", "1.5mm", "2.0mm"],
      correct: 2,
      category: "Prosthodontics",
      difficulty: "easy"
    },

    // ORAL SURGERY (35 questions)
    {
      question: "What is the most common complication after third molar extraction?",
      options: ["Nerve damage", "Dry socket", "Infection", "Bleeding"],
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
      question: "What is the recommended torque for implant placement?",
      options: ["15-25 Ncm", "35-45 Ncm", "50-60 Ncm", "Over 70 Ncm"],
      correct: 1,
      category: "Oral Surgery",
      difficulty: "medium"
    },
    {
      question: "What is the primary healing time for bone grafts?",
      options: ["2-3 months", "4-6 months", "6-9 months", "9-12 months"],
      correct: 1,
      category: "Oral Surgery",
      difficulty: "easy"
    },
    {
      question: "Which incision type is preferred for impacted third molar removal?",
      options: ["Envelope flap", "Triangular flap", "Trapezoidal flap", "Semilunar flap"],
      correct: 0,
      category: "Oral Surgery",
      difficulty: "hard"
    },

    // ORTHODONTICS (35 questions)
    {
      question: "What does the ANB angle measure in cephalometric analysis?",
      options: ["Mandibular plane angle", "Sagittal jaw relationship", "Facial height", "Dental angulation"],
      correct: 1,
      category: "Orthodontics",
      difficulty: "medium"
    },
    {
      question: "Which force level is recommended for orthodontic tooth movement?",
      options: ["50-75g", "150-300g", "400-600g", "Over 800g"],
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
      question: "Which Class II malocclusion division has retroclined upper incisors?",
      options: ["Division 1", "Division 2", "Division 3", "Subdivision"],
      correct: 1,
      category: "Orthodontics",
      difficulty: "easy"
    },
    {
      question: "What is the normal overjet measurement?",
      options: ["1-2mm", "2-3mm", "3-4mm", "4-5mm"],
      correct: 1,
      category: "Orthodontics",
      difficulty: "easy"
    },

    // PEDIATRIC DENTISTRY (30 questions)
    {
      question: "Which material is most appropriate for pulpotomy in primary teeth?",
      options: ["Formocresol", "MTA", "Calcium hydroxide", "Ferric sulfate"],
      correct: 1,
      category: "Pediatric Dentistry",
      difficulty: "medium"
    },
    {
      question: "At what age should fluoride toothpaste be introduced?",
      options: ["6 months", "1 year", "2 years", "3 years"],
      correct: 1,
      category: "Pediatric Dentistry",
      difficulty: "easy"
    },
    {
      question: "What is the recommended fluoride concentration for children under 6?",
      options: ["500 ppm", "1000 ppm", "1450 ppm", "5000 ppm"],
      correct: 1,
      category: "Pediatric Dentistry",
      difficulty: "medium"
    },
    {
      question: "Which primary tooth erupts first?",
      options: ["Central incisor", "Lateral incisor", "First molar", "Canine"],
      correct: 0,
      category: "Pediatric Dentistry",
      difficulty: "easy"
    },
    {
      question: "What is Hall Technique used for?",
      options: ["Extraction", "Pulpotomy", "Crown placement", "Space maintenance"],
      correct: 2,
      category: "Pediatric Dentistry",
      difficulty: "hard"
    },

    // RESTORATIVE DENTISTRY (30 questions)
    {
      question: "What is the recommended etch time for dentin?",
      options: ["15 seconds", "30 seconds", "45 seconds", "60 seconds"],
      correct: 0,
      category: "Restorative Dentistry",
      difficulty: "easy"
    },
    {
      question: "Which composite type is best for posterior restorations?",
      options: ["Microfill", "Hybrid", "Nanofill", "Flowable"],
      correct: 2,
      category: "Restorative Dentistry",
      difficulty: "medium"
    },
    {
      question: "What is the ideal moisture content for dentin bonding?",
      options: ["Completely dry", "Slightly moist", "Very wet", "Flooded"],
      correct: 1,
      category: "Restorative Dentistry",
      difficulty: "medium"
    },
    {
      question: "Which GV Black classification is for pit and fissure caries?",
      options: ["Class I", "Class II", "Class III", "Class IV"],
      correct: 0,
      category: "Restorative Dentistry",
      difficulty: "easy"
    },
    {
      question: "What is the recommended curing time for composite resin?",
      options: ["10 seconds", "20 seconds", "40 seconds", "60 seconds"],
      correct: 1,
      category: "Restorative Dentistry",
      difficulty: "easy"
    },

    // ORAL PATHOLOGY (30 questions)
    {
      question: "Which is the most common site for oral squamous cell carcinoma?",
      options: ["Tongue", "Floor of mouth", "Gingiva", "Palate"],
      correct: 0,
      category: "Oral Pathology",
      difficulty: "easy"
    },
    {
      question: "What is the most common odontogenic cyst?",
      options: ["Periapical cyst", "Dentigerous cyst", "Lateral periodontal cyst", "Residual cyst"],
      correct: 0,
      category: "Oral Pathology",
      difficulty: "easy"
    },
    {
      question: "Which virus is associated with oral hairy leukoplakia?",
      options: ["HSV-1", "EBV", "CMV", "HPV"],
      correct: 1,
      category: "Oral Pathology",
      difficulty: "hard"
    },
    {
      question: "Which virus is most associated with oral cancer?",
      options: ["HSV-1", "HPV-16", "EBV", "CMV"],
      correct: 1,
      category: "Oral Pathology",
      difficulty: "hard"
    },
    {
      question: "What is the characteristic appearance of lichen planus?",
      options: ["White patches", "Wickham's striae", "Red lesions", "Ulcers"],
      correct: 1,
      category: "Oral Pathology",
      difficulty: "medium"
    },

    // DENTAL MATERIALS (20 questions)
    {
      question: "What is the setting time of Type I dental stone?",
      options: ["5-10 minutes", "10-15 minutes", "15-20 minutes", "20-30 minutes"],
      correct: 1,
      category: "Dental Materials",
      difficulty: "medium"
    },
    {
      question: "Which property is most important for impression materials?",
      options: ["High viscosity", "Elastic recovery", "Long working time", "High tear strength"],
      correct: 1,
      category: "Dental Materials",
      difficulty: "medium"
    },
    {
      question: "What is the ideal powder-to-liquid ratio for Type III stone?",
      options: ["100g/23ml", "100g/30ml", "100g/50ml", "100g/100ml"],
      correct: 0,
      category: "Dental Materials",
      difficulty: "hard"
    },
    {
      question: "Which material has the highest thermal conductivity?",
      options: ["Composite", "Amalgam", "Gold", "Ceramic"],
      correct: 2,
      category: "Dental Materials",
      difficulty: "easy"
    },
    {
      question: "What is the main component of glass ionomer cement?",
      options: ["Polyacrylic acid", "Phosphoric acid", "Zinc oxide", "Calcium hydroxide"],
      correct: 0,
      category: "Dental Materials",
      difficulty: "medium"
    },

    // RADIOGRAPHY (20 questions)
    {
      question: "What is the recommended frequency for bitewing X-rays in high-risk patients?",
      options: ["6 months", "12 months", "18 months", "24 months"],
      correct: 0,
      category: "Radiography",
      difficulty: "medium"
    },
    {
      question: "Which projection shows the maxillary sinus best?",
      options: ["PA", "Bitewing", "Lateral", "Waters view"],
      correct: 3,
      category: "Radiography",
      difficulty: "hard"
    },
    {
      question: "What is the maximum safe radiation dose per year for dental workers?",
      options: ["20 mSv", "50 mSv", "100 mSv", "150 mSv"],
      correct: 0,
      category: "Radiography",
      difficulty: "hard"
    },
    {
      question: "What does CBCT stand for?",
      options: ["Cone Beam Computed Tomography", "Central Beam CT", "Cranial Bone CT", "Cephalometric Beam CT"],
      correct: 0,
      category: "Radiography",
      difficulty: "easy"
    },
    {
      question: "What is the ideal angulation for maxillary periapical radiographs?",
      options: ["+20 degrees", "+30 degrees", "+40 degrees", "+50 degrees"],
      correct: 2,
      category: "Radiography",
      difficulty: "medium"
    },

    // PHARMACOLOGY (20 questions)
    {
      question: "What is the maximum safe dose of lidocaine for a healthy adult?",
      options: ["300mg", "500mg", "700mg", "1000mg"],
      correct: 1,
      category: "Pharmacology",
      difficulty: "medium"
    },
    {
      question: "Which antibiotic is first choice for odontogenic infections?",
      options: ["Penicillin", "Amoxicillin", "Clindamycin", "Azithromycin"],
      correct: 1,
      category: "Pharmacology",
      difficulty: "easy"
    },
    {
      question: "What is the mechanism of action of NSAIDs?",
      options: ["COX inhibition", "LOX inhibition", "Calcium channel blocking", "Sodium channel blocking"],
      correct: 0,
      category: "Pharmacology",
      difficulty: "medium"
    },
    {
      question: "Which drug is contraindicated with metronidazole?",
      options: ["Caffeine", "Alcohol", "Aspirin", "Paracetamol"],
      correct: 1,
      category: "Pharmacology",
      difficulty: "easy"
    },
    {
      question: "What is the loading dose of amoxicillin for antibiotic prophylaxis?",
      options: ["1g", "2g", "3g", "4g"],
      correct: 1,
      category: "Pharmacology",
      difficulty: "medium"
    }
  ],

  // Fallback rewards if Supabase fails
  fallbackRewards: [
    {
      min_score: 9,
      max_score: 10,
      title: "Speedendo Calcipro File",
      description: "Worth ₹1250 FREE on orders > ₹5000",
      image_url: "https://via.placeholder.com/160x80/00D68F/FFFFFF?text=TOP+REWARD",
      trophy_emoji: "🏆",
      priority: 1
    },
    {
      min_score: 7,
      max_score: 8,
      title: "10% PB Cashback",
      description: "Instant cashback on your next order",
      image_url: "https://via.placeholder.com/160x80/6C5CE7/FFFFFF?text=CASHBACK",
      trophy_emoji: "⭐",
      priority: 2
    },
    {
      min_score: 5,
      max_score: 6,
      title: "Flitt Diamond Burs (10pk)",
      description: "Worth ₹499 FREE on orders > ₹2000",
      image_url: "https://via.placeholder.com/160x80/FFA400/FFFFFF?text=DIAMOND+BURS",
      trophy_emoji: "💎",
      priority: 3
    },
    {
      min_score: 0,
      max_score: 4,
      title: "Better Luck Next Time",
      description: "Keep practicing to unlock rewards!",
      image_url: "https://via.placeholder.com/160x80/FF6B6B/FFFFFF?text=TRY+AGAIN",
      trophy_emoji: "📚",
      priority: -1  // Priority 0 or negative: carousel only, never given
    }
  ],

  shareMessage: (score, total, name = 'I') => {
    return `${name} just scored ${score}/${total} in PinkBlue Quizmas Dental Challenge! 🎉\n\nTest your knowledge: https://pinkblue.in/pb-quiz\n\n#PBQuiz #DentalChallenge`;
  }
};
