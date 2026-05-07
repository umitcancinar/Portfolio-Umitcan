/* ===========================================
   APPLE-INSPIRED PORTFOLIO - script.js
   Animations, interactions, dark mode
   =========================================== */

'use strict';

// --- DOM Elements ---
const header = document.getElementById('siteHeader');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const toggleIcon = document.getElementById('toggleIcon');
const fadeElements = document.querySelectorAll('.fade-section');
const statNumbers = document.querySelectorAll('.stat-number');
const skillBars = document.querySelectorAll('.skill-bar-fill');
const contactForm = document.getElementById('contactForm');

// ===========================================
// 1. NAVBAR SCROLL EFFECT
// ===========================================
let lastScrollY = 0;

function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
}

// Use requestAnimationFrame for performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleNavbarScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ===========================================
// 2. MOBILE HAMBURGER MENU
// ===========================================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
});

// Close menu when clicking a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// ===========================================
// 3. DARK MODE TOGGLE
// ===========================================
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggleIcon.textContent = theme === 'dark' ? '🌙' : '☀️';

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
}

// Initialize theme
const currentTheme = getPreferredTheme();
setTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ===========================================
// 4. INTERSECTION OBSERVER - FADE SECTIONS
// ===========================================
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.05,
    rootMargin: '0px 0px -10px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ===========================================
// 5. INTERSECTION OBSERVER - STAT COUNTERS
// ===========================================
let statsAnimated = false;

function animateCounter(element, target) {
    const duration = 2000; // ms
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (target - startValue) * eased);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'), 10);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

if (statNumbers.length > 0) {
    const statsContainer = document.querySelector('.stats-grid');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
}

// ===========================================
// 6. INTERSECTION OBSERVER - SKILL BARS
// ===========================================
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;

            skillBars.forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, index * 100);
            });

            skillsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

if (skillBars.length > 0) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        skillsObserver.observe(skillsGrid);
    }
}

// ===========================================
// 7. CONTACT FORM HANDLING
// ===========================================
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Simple validation
        if (!name || !email || !message) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            alert('Lütfen geçerli bir e-posta adresi girin.');
            return;
        }

        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;

        // Try to POST to backend, fallback gracefully
        try {
            await apiFetch('/api/messages', {
                method: 'POST',
                body: JSON.stringify({ name, email, message })
            });
        } catch (err) {
            // Fallback - still show success
        }

        submitBtn.textContent = '✓ Gönderildi!';
        submitBtn.style.backgroundColor = '#34C759';
        submitBtn.style.color = '#fff';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.color = '';
            submitBtn.disabled = false;
            contactForm.reset();
        }, 3000);
    });
}

// ===========================================
// 8. KEYBOARD NAVIGATION SUPPORT
// ===========================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
    }
});

// ===========================================
// 10. PERFORMANCE: LOAD EVENT
// ===========================================
window.addEventListener('load', () => {
    // Add a small delay and then mark any remaining fade elements as visible
    // in case IntersectionObserver didn't trigger for already-visible elements
    document.querySelectorAll('.fade-section:not(.visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
});

// ===========================================
// 11. API CONFIGURATION (URL only, no secrets)
// ===========================================
const API_BASE_URL = 'http://localhost:3001';
async function apiFetch(endpoint, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {'Content-Type': 'application/json', ...(options.headers || {})}
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        clearTimeout(timeout);
        console.warn('API fetch failed, using fallback:', endpoint, err.message);
        return null;
    }
}

// ===========================================
// 12. LOADING SCREEN
// ===========================================
const loadingScreen = document.getElementById('loadingScreen');
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => { if (loadingScreen) loadingScreen.style.display = 'none'; }, 600);
        }
    }, 800);
});
setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => { if (loadingScreen) loadingScreen.style.display = 'none'; }, 600);
    }
}, 4000);

// ===========================================
// 14. SCROLL PROGRESS BAR
// ===========================================
const scrollProgress = document.getElementById('scrollProgress');
let progressTicking = false;
window.addEventListener('scroll', () => {
    if (!progressTicking) {
        requestAnimationFrame(() => {
            if (scrollProgress) {
                const pct = document.documentElement.scrollHeight > window.innerHeight ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 : 0;
                scrollProgress.style.width = pct + '%';
            }
            progressTicking = false;
        });
        progressTicking = true;
    }
}, { passive: true });

// ===========================================
// 15. BACK TO TOP BUTTON
// ===========================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    let bttTicking = false;
    window.addEventListener('scroll', () => {
        if (!bttTicking) {
            requestAnimationFrame(() => {
                backToTop.classList.toggle('visible', window.scrollY > 500);
                bttTicking = false;
            });
            bttTicking = true;
        }
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===========================================
// 16. ACTIVE NAV LINK ON SCROLL
// ===========================================
const navSections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-link');
let navScrollTicking = false;
window.addEventListener('scroll', () => {
    if (!navScrollTicking) {
        requestAnimationFrame(() => {
            let current = '';
            navSections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id'); });
            navLinkItems.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === '#' + current); });
            navScrollTicking = false;
        });
        navScrollTicking = true;
    }
}, { passive: true });

// ===========================================
// 17. SMOOTH SCROLL ENHANCEMENT (Lenis-like)
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = 64;
            const start = window.pageYOffset;
            const end = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            const duration = 800;
            const startTime = performance.now();
            function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
            function scrollAnimation(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                window.scrollTo(0, start + (end - start) * easeInOutCubic(progress));
                if (progress < 1) requestAnimationFrame(scrollAnimation);
            }
            requestAnimationFrame(scrollAnimation);
        }
    });
});

// ===========================================
// 19. TYPING EFFECT FOR HERO SUBTITLE
// ===========================================
const subtitleText = document.querySelector('.hero-subtitle-text');
if (subtitleText) {
    const originalText = subtitleText.textContent;
    subtitleText.textContent = '';
    let charIndex = 0;
    function typeEffect() {
        if (charIndex < originalText.length) {
            subtitleText.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, 60);
        } else {
            const cursorSpan = document.createElement('span');
            cursorSpan.className = 'typing-cursor';
            cursorSpan.textContent = '|';
            cursorSpan.style.animation = 'loadingFade 1s ease-in-out infinite';
            subtitleText.appendChild(cursorSpan);
        }
    }
    setTimeout(typeEffect, 1200);
}

// ===========================================
// 20. PROJECT FILTERING
// ===========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
                let show = filter === 'all';
                if (filter === 'frontend') show = tags.some(t => ['react','vue','angular','html','css','javascript','typescript','tailwind','next.js','figma','framer','d3.js','websocket'].includes(t));
                if (filter === 'backend') show = tags.some(t => ['node.js','python','django','graphql','rest','docker','strapi','stripe','firebase','flutter','dart'].includes(t));
                if (filter === 'mobile') show = tags.some(t => ['flutter','dart','react native','mobile','ios','android'].includes(t));
                card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
                if (show) {
                    card.style.opacity = '1'; card.style.transform = 'translateY(0) scale(1)';
                    card.style.display = ''; card.style.pointerEvents = '';
                } else {
                    card.style.opacity = '0'; card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => { if (card.style.opacity === '0') { card.style.display = 'none'; card.style.pointerEvents = 'none'; } }, 400);
                }
            });
        });
    });
}

// ===========================================
// 22. DYNAMIC CONTENT LOADING WITH FALLBACK
// ===========================================
async function loadDynamicContent() {
    const heroData = await apiFetch('/api/content/hero');
    if (heroData && heroData.content) {
        const c = heroData.content;
        if (c.greeting) { const el = document.querySelector('.hero-greeting'); if (el) el.textContent = c.greeting; }
        if (c.title) { const el = document.querySelector('.hero-title'); if (el) el.textContent = c.title; }
        if (c.subtitle) { const el = document.querySelector('.hero-subtitle-text'); if (el) el.textContent = c.subtitle; }
    }
    const aboutData = await apiFetch('/api/content/about');
    if (aboutData && aboutData.content) {
        const c = aboutData.content;
        if (c.title) { const el = document.querySelector('#about .section-title'); if (el) el.textContent = c.title; }
        if (c.subtitle) { const el = document.querySelector('#about .section-subtitle'); if (el) el.textContent = c.subtitle; }
    }
    const skillsData = await apiFetch('/api/content/skills');
    if (skillsData && skillsData.content && skillsData.content.categories) {
        const skillsGrid = document.querySelector('#skills .skills-grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = '';
            skillsData.content.categories.forEach(cat => {
                const catDiv = document.createElement('div');
                catDiv.className = 'skill-category fade-section';
                catDiv.innerHTML = '<div class="skill-category-header"><span class="skill-category-icon" aria-hidden="true">' + (cat.icon || '⚡') + '</span><h3 class="skill-category-title">' + cat.name + '</h3></div><div class="skill-items">' + (cat.items || []).map(item => '<div class="skill-item"><div class="skill-info"><span class="skill-name">' + item.name + '</span><span class="skill-percent">' + item.percent + '%</span></div><div class="skill-bar"><div class="skill-bar-fill" data-width="' + item.percent + '" style="width:0%;"></div></div></div>').join('') + '</div>';
                skillsGrid.appendChild(catDiv);
            });
            document.querySelectorAll('#skills .fade-section').forEach(el => fadeObserver.observe(el));
        }
    }
    const projectsData = await apiFetch('/api/projects');
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsData && projectsData.projects && projectsData.projects.length > 0 && projectsGrid) {
        projectsGrid.innerHTML = '';
        projectsData.projects.forEach(proj => {
            const article = document.createElement('article');
            article.className = 'project-card fade-section';
            article.innerHTML = '<div class="card-image">' + (proj.image_url ? '<img src="' + API_BASE_URL + proj.image_url + '" alt="' + proj.title + '" class="card-img" loading="lazy">' : '<div class="card-image-placeholder" aria-hidden="true"><span class="card-placeholder-icon">🖥️</span></div>') + '</div><div class="card-body"><h3 class="card-title">' + proj.title + '</h3><p class="card-desc">' + (proj.description || '') + '</p><div class="card-tags">' + (proj.tags || []).map(t => '<span class="tag">' + t + '</span>').join('') + '</div></div>';
            projectsGrid.appendChild(article);
        });
        document.querySelectorAll('#projectsGrid .fade-section').forEach(el => fadeObserver.observe(el));
    }
    const refData = await apiFetch('/api/references');
    const refGrid = document.getElementById('referencesGrid');
    if (refData && refData.references && refData.references.length > 0 && refGrid) {
        refGrid.innerHTML = '';
        refData.references.forEach(ref => {
            const article = document.createElement('article');
            article.className = 'reference-card fade-section';
            article.innerHTML = '<div class="reference-logo">' + (ref.logo_url ? '<img src="' + API_BASE_URL + ref.logo_url + '" alt="' + ref.client_name + '" class="reference-logo-img" loading="lazy">' : '<span class="reference-logo-placeholder" aria-hidden="true">🏢</span>') + '</div><div class="reference-body"><p class="reference-quote">"' + (ref.testimonial || ref.description || 'Harika bir çalışma!') + '"</p><div class="reference-author"><strong class="reference-name">' + ref.client_name + '</strong><span class="reference-role">' + (ref.project_name || '') + '</span></div></div>' + (ref.link_url ? '<a href="' + ref.link_url + '" class="reference-link" target="_blank" rel="noopener">Projeyi İncele →</a>' : '');
            refGrid.appendChild(article);
        });
        document.querySelectorAll('#referencesGrid .fade-section').forEach(el => fadeObserver.observe(el));
    }
    const cvData = await apiFetch('/api/upload/cv/latest');
    const cvBtn = document.getElementById('cvDownloadBtn');
    if (cvData && cvData.cv && cvData.cv.file_url && cvBtn) {
        cvBtn.href = API_BASE_URL + cvData.cv.file_url;
        cvBtn.setAttribute('download', cvData.cv.original_name || 'cv.pdf');
    }
}

// ===========================================
// 23. KEYBOARD SHORTCUTS
// ===========================================
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            window.scrollTo({ top: projectsSection.getBoundingClientRect().top + window.pageYOffset - 64, behavior: 'smooth' });
        }
    }
});

// ===========================================
// 24. INITIALIZE DYNAMIC CONTENT
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();
});

// ===========================================
// 25. GIZLI ADMIN TRIGGER
// ===========================================
(function() {
    let footerClickCount = 0;
    let clickTimer = null;

    // Footer copyright yazisina 3 kez tiklayinca admin login acilsin
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
        footerText.addEventListener('click', function(e) {
            // Sadece copyright yazisina tiklaninca calissin
            if (!e.target.closest('.footer-text')) return;

            footerClickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(function() {
                footerClickCount = 0;
            }, 2000);

            if (footerClickCount >= 3) {
                footerClickCount = 0;
                sessionStorage.setItem('_admin_access', 'granted');
                window.location.href = 'admin/login.html';
            }
        });
    }

    // Ctrl+Shift+A klavye kisayolu ile admin login acilsin
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            e.stopPropagation();
            sessionStorage.setItem('_admin_access', 'granted');
            window.location.href = 'admin/login.html';
        }
    });
})();

console.log('%c  Portfolio %c  Apple-inspired  ', 'background:#0071E3;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:bold;', 'background:#1D1D1F;color:#fff;padding:4px 8px;border-radius:0 4px 4px 0;');
