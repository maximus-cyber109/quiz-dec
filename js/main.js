// =================================
// MAIN APPLICATION INITIALIZER
// =================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 PinkBlue Christmas Challenge 2025 Loaded!');
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize accessibility
    initAccessibility();
    
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Add SVG gradient for score ring
    addSVGGradient();
});

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

function initAccessibility() {
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.classList.contains('option')) {
                e.target.click();
            }
        }
    });
    
    // Add focus visible for better keyboard navigation
    document.body.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse');
    });
    
    document.body.addEventListener('keydown', () => {
        document.body.classList.remove('using-mouse');
    });
}

function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        });
    }
}

function addSVGGradient() {
    const svg = document.querySelector('.score-ring');
    if (svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'scoreGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#FFD700');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#FFA500');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
}

// Prevent right-click on production (optional)
if (window.location.hostname !== 'localhost') {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
}

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            (registration) => console.log('✅ Service Worker registered'),
            (err) => console.log('❌ Service Worker registration failed:', err)
        );
    });
}
