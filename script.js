// ===========================
// Fyxx Christmas Landing Page
// Interactive Features
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scrolling for anchor links
    initSmoothScroll();

    // Intersection Observer for animations
    initScrollAnimations();

    // Add countdown timer if desired
    initCountdown();

    // Track promo interactions
    initPromoTracking();
});

// ===========================
// Smooth Scroll
// ===========================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Check if it's a valid anchor
            if (href !== '#' && href !== '#shop' && href !== '#events') {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===========================
// Scroll Animations
// ===========================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.event-card, .promo-day, .section-header');
    animatedElements.forEach(el => observer.observe(el));
}

// ===========================
// Countdown Timer
// ===========================

function initCountdown() {
    // Set the countdown date (December 13, 2025)
    const countdownDate = new Date('December 13, 2025 00:00:00').getTime();

    // Update the countdown every second
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        // Calculate days, hours, minutes, seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Check if countdown element exists
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownEl.innerHTML = 'The celebration has begun!';
            } else {
                countdownEl.innerHTML = `
                    <div class="countdown-item">
                        <span class="countdown-value">${days}</span>
                        <span class="countdown-label">Days</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-value">${hours}</span>
                        <span class="countdown-label">Hours</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-value">${minutes}</span>
                        <span class="countdown-label">Minutes</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-value">${seconds}</span>
                        <span class="countdown-label">Seconds</span>
                    </div>
                `;
            }
        }
    }, 1000);
}

// ===========================
// Promo Tracking
// ===========================

function initPromoTracking() {
    const promoDays = document.querySelectorAll('.promo-day');

    promoDays.forEach((promo, index) => {
        promo.addEventListener('click', function() {
            // Add active class
            promoDays.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            // Track the click (you can integrate with analytics here)
            console.log(`Promo clicked: Day ${index + 1}`);

            // Optional: Show more details or redirect
            // You can add a modal or expand the promo details here
        });
    });
}

// ===========================
// Event Card Interactions
// ===========================

const eventCards = document.querySelectorAll('.event-card');

eventCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-12px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===========================
// Snow Effect (Optional)
// ===========================

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';

    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

// Uncomment to enable snowflake effect
// setInterval(createSnowflake, 300);

// ===========================
// Utility Functions
// ===========================

// Debounce function for scroll events
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

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===========================
// Responsive Navigation
// ===========================

window.addEventListener('scroll', debounce(function() {
    const scrollPosition = window.scrollY;

    // Add shadow to header on scroll (if header exists)
    const header = document.querySelector('header');
    if (header) {
        if (scrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 10));

// ===========================
// Print Analytics
// ===========================

console.log('%c🎄 Fyxx Christmas Landing Page 🎄', 'color: #C41E3A; font-size: 20px; font-weight: bold;');
console.log('%cHappy Holidays from Fyxx!', 'color: #0F4C3A; font-size: 14px;');
