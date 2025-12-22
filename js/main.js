// =================================
// MAIN APPLICATION
// Initialize everything
// =================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎮 PinkBlue Dental Challenge 2025', 'color: #6C5CE7; font-size: 20px; font-weight: bold;');
    console.log('%c💜 Loaded Successfully!', 'color: #A29BFE; font-size: 14px;');
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize accessibility features
    initAccessibility();
    
    // Initialize performance monitoring
    initPerformance();
    
    // Prevent double-tap zoom on mobile
    preventDoubleTapZoom();
    
    // Handle online/offline status
    handleNetworkStatus();
});

// =====================================
// SMOOTH SCROLL
// =====================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// =====================================
// ACCESSIBILITY
// =====================================

function initAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Space or Enter on options
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.classList.contains('option-item')) {
                e.preventDefault();
                e.target.click();
            }
        }
        
        // Escape to go back
        if (e.key === 'Escape') {
            const backBtn = document.getElementById('backBtn');
            if (backBtn && backBtn.offsetParent !== null) {
                backBtn.click();
            }
        }
    });
    
    // Focus visible for keyboard users
    document.body.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse');
    });
    
    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
    
    // Add focus styles
    const style = document.createElement('style');
    style.textContent = `
        body.using-mouse *:focus {
            outline: none;
        }
        body:not(.using-mouse) *:focus {
            outline: 2px solid #4FACFE;
            outline-offset: 4px;
        }
    `;
    document.head.appendChild(style);
}

// =====================================
// PERFORMANCE MONITORING
// =====================================

function initPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                console.log(`⚡ Page loaded in ${loadTime}ms`);
                
                // Log to analytics if needed
                if (loadTime > 3000) {
                    console.warn('⚠️ Slow page load detected');
                }
            }, 0);
        });
    }
    
    // Monitor FPS (optional)
    if (typeof requestAnimationFrame !== 'undefined') {
        let lastTime = performance.now();
        let frames = 0;
        
        function measureFPS() {
            const now = performance.now();
            frames++;
            
            if (now >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (now - lastTime));
                if (fps < 30) {
                    console.warn(`⚠️ Low FPS detected: ${fps}`);
                }
                frames = 0;
                lastTime = now;
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        // Uncomment to enable FPS monitoring
        // requestAnimationFrame(measureFPS);
    }
}

// =====================================
// MOBILE OPTIMIZATIONS
// =====================================

function preventDoubleTapZoom() {
    let lastTouchEnd = 0;
    
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

// =====================================
// NETWORK STATUS
// =====================================

function handleNetworkStatus() {
    function updateOnlineStatus() {
        if (!navigator.onLine) {
            quiz.showToast('⚠️ You are offline. Some features may not work.', 5000);
        }
    }
    
    window.addEventListener('online', () => {
        quiz.showToast('✅ You are back online!', 2000);
    });
    
    window.addEventListener('offline', updateOnlineStatus);
    
    // Check initial status
    updateOnlineStatus();
}

// =====================================
// ERROR HANDLING
// =====================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    
    // Show user-friendly error message
    if (quiz) {
        quiz.showToast('❌ Something went wrong. Please refresh the page.', 5000);
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// =====================================
// PREVENT CONTEXT MENU (OPTIONAL)
// =====================================

if (window.location.hostname !== 'localhost') {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
}

// =====================================
// SERVICE WORKER (OPTIONAL PWA SUPPORT)
// =====================================

if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(err => {
                console.log('❌ Service Worker registration failed:', err);
            });
    });
}

// =====================================
// PAGE VISIBILITY API
// =====================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 Tab hidden');
        // Optionally pause timer when tab is hidden
    } else {
        console.log('👀 Tab visible');
    }
});

// =====================================
// ORIENTATION CHANGE
// =====================================

window.addEventListener('orientationchange', () => {
    console.log('📱 Orientation changed');
    
    // Optionally show message for portrait mode
    if (window.innerWidth < window.innerHeight) {
        // Portrait mode - optimal
    } else {
        // Landscape mode
        quiz.showToast('💡 For best experience, use portrait mode', 3000);
    }
});

// =====================================
// BATTERY API (OPTIONAL)
// =====================================

if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        if (battery.level < 0.2 && !battery.charging) {
            quiz.showToast('🔋 Low battery - Consider saving your progress', 3000);
        }
    });
}

// =====================================
// ANALYTICS (OPTIONAL)
// =====================================

function trackEvent(eventName, eventData = {}) {
    // Implement your analytics here
    // Google Analytics, Mixpanel, etc.
    console.log('📊 Event:', eventName, eventData);
    
    // Example: Google Analytics
    // if (window.gtag) {
    //     gtag('event', eventName, eventData);
    // }
}

// Track page views
trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href
});

// =====================================
// UTILITIES
// =====================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Make utilities globally available
window.debounce = debounce;
window.throttle = throttle;
window.trackEvent = trackEvent;

// =====================================
// CONSOLE EASTER EGG
// =====================================

console.log(`
%c
██████╗ ██╗███╗   ██╗██╗  ██╗██████╗ ██╗     ██╗   ██╗███████╗
██╔══██╗██║████╗  ██║██║ ██╔╝██╔══██╗██║     ██║   ██║██╔════╝
██████╔╝██║██╔██╗ ██║█████╔╝ ██████╔╝██║     ██║   ██║█████╗  
██╔═══╝ ██║██║╚██╗██║██╔═██╗ ██╔══██╗██║     ██║   ██║██╔══╝  
██║     ██║██║ ╚████║██║  ██╗██████╔╝███████╗╚██████╔╝███████╗
╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝
`, 'color: #6C5CE7; font-weight: bold;');

console.log('%c💜 Dental Excellence Challenge 2025', 'color: #A29BFE; font-size: 16px;');
console.log('%c🚀 Made with love for dentists', 'color: #4FACFE; font-size: 12px;');
console.log('%c⚡ Powered by Supabase + Netlify', 'color: #00D68F; font-size: 12px;');
