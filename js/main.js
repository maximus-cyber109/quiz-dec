// =================================
// MAIN APP INITIALIZATION
// Global Error Handling & Logging
// =================================

console.log('%c🎮 PinkBlue Quizmas Loaded!', 'color: #6C5CE7; font-size: 20px; font-weight: bold;');
console.log('📍 Environment:', {
    url: window.location.href,
    userAgent: navigator.userAgent,
    screen: `${window.innerWidth}x${window.innerHeight}`
});

window.addEventListener('error', (e) => {
    console.error('❌ GLOBAL ERROR:', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno,
        error: e.error
    });
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ UNHANDLED PROMISE REJECTION:', {
        reason: e.reason,
        promise: e.promise
    });
});

setTimeout(() => {
    console.log('🔍 Dependency Check:', {
        CONFIG: typeof CONFIG !== 'undefined' ? '✅' : '❌',
        supabaseHandler: typeof supabaseHandler !== 'undefined' ? '✅' : '❌',
        quiz: typeof quiz !== 'undefined' ? '✅' : '❌',
        gsap: typeof gsap !== 'undefined' ? '✅' : '❌',
        confetti: typeof confetti !== 'undefined' ? '✅' : '❌',
        supabase: typeof window.supabase !== 'undefined' ? '✅' : '❌'
    });
}, 1000);

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log('⚡ Page load time:', loadTime + 'ms');
        }, 0);
    });
}
