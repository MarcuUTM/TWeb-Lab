// ===== CHIPZILLA — Clean Performance =====

// ===== MOBILE MENU =====
const menuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        nav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
    const increment = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== INTERSECTION OBSERVER =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Counter animation
            const counters = entry.target.querySelectorAll('[data-target]');
            counters.forEach(counter => {
                if (!counter.dataset.animated) {
                    counter.dataset.animated = 'true';
                    animateCounter(counter, parseInt(counter.dataset.target));
                }
            });

            // Performance bar animation
            const bars = entry.target.querySelectorAll('.perf-bar-fill');
            bars.forEach(bar => {
                if (!bar.dataset.animated) {
                    bar.dataset.animated = 'true';
                    setTimeout(() => {
                        bar.style.width = bar.dataset.percent + '%';
                    }, 200);
                }
            });
        }
    });
}, observerOptions);

// ===== STAGGERED ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Observe all animated elements
    document.querySelectorAll('[data-animate]').forEach((el, i) => {
        // Add stagger delay to grid children
        const parent = el.parentElement;
        if (parent && (
            parent.classList.contains('services-grid') ||
            parent.classList.contains('advantages-grid')
        )) {
            const siblings = [...parent.querySelectorAll('[data-animate]')];
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${index * 0.08}s`;
        }
        observer.observe(el);
    });

    // Observe hero stats for counter animation
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }

    // Observe performance card for bar animation
    const perfCard = document.querySelector('.performance-card');
    if (perfCard) {
        observer.observe(perfCard);
    }

    // Observe info cards
    document.querySelectorAll('.info-card').forEach((card, i) => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(16px)';
        card.style.transition = `opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out), background 0.25s var(--ease), border-color 0.25s var(--ease)`;
        card.style.transitionDelay = `${i * 0.08}s`;
        observer.observe(card);
    });
});

// ===== PARALLAX HERO =====
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-content');
            if (hero && scrolled < window.innerHeight) {
                const opacity = 1 - (scrolled / window.innerHeight) * 1.2;
                const translate = scrolled * 0.2;
                hero.style.transform = `translateY(${translate}px)`;
                hero.style.opacity = Math.max(0, opacity);
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ===== ACTIVE NAV HIGHLIGHTING =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-list a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ===== FORM HANDLING =====
const form = document.getElementById('contactForm');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const values = Object.fromEntries(data);

        // Validation
        if (!values.name || !values.email || !values.phone) {
            showMessage('Completează toate câmpurile obligatorii.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            showMessage('Introdu o adresă de email validă.', 'error');
            return;
        }

        if (!/^[\d\s+\-()]+$/.test(values.phone)) {
            showMessage('Introdu un număr de telefon valid.', 'error');
            return;
        }

        // Submit animation
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = 'Se trimite...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        setTimeout(() => {
            showMessage('Mesaj trimis cu succes! Te vom contacta în curând.', 'success');
            form.reset();
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.style.opacity = '1';
        }, 1500);
    });
}

function showMessage(text, type) {
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = `form-message form-message-${type}`;
    msg.textContent = text;
    form.insertBefore(msg, form.firstChild);

    if (type === 'success') {
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-8px)';
            msg.style.transition = 'all 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        }, 5000);
    }
}

// ===== PREVENT FORM RESUBMISSION =====
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
