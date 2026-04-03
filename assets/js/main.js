document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            navbar.classList.toggle('menu-open');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
                navbar.classList.remove('menu-open');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    document.querySelectorAll('[data-animate], .portfolio__card, .services__card, .process__step').forEach(el => {
        animateOnScroll.observe(el);
    });

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const trustSection = document.querySelector('.trust__metrics');
    if (trustSection) counterObserver.observe(trustSection);

    function animateCounters() {
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = target <= 100 ? 1800 : 2500;
            const startTime = performance.now();
            let lastDisplayed = -1;

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(eased * target);

                if (current !== lastDisplayed) {
                    counter.textContent = current.toLocaleString();
                    lastDisplayed = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }

            requestAnimationFrame(tick);
        });
    }

    const heroGradients = document.querySelectorAll('.hero__gradient');
    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroGradients.forEach((gradient, i) => {
                gradient.style.transform = `translateY(${scrollY * (0.03 + i * 0.015)}px)`;
            });
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    (function heroSequence() {
        const cursor = document.getElementById('mockupCursor');
        const ring = document.getElementById('cursorRing');
        const appIcon = document.getElementById('appIcon');
        const browser = document.getElementById('mockupBrowser');
        const urlBar = document.getElementById('urlBar');
        const urlText = document.getElementById('urlText');
        const urlCaret = document.getElementById('urlCaret');
        const screenBlank = document.getElementById('screenBlank');
        const screenContent = document.getElementById('screenContent');
        const glow = document.querySelector('.mockup__glow');

        if (!cursor || !browser) return;

        const wait = ms => new Promise(r => setTimeout(r, ms));

        function moveCursor(top, left) {
            cursor.style.top = top;
            cursor.style.left = left;
        }

        function click() {
            ring.classList.remove('click');
            void ring.offsetWidth;
            ring.classList.add('click');
        }

        async function typeText(text, el, delay) {
            for (let i = 0; i < text.length; i++) {
                el.textContent += text[i];
                await wait(delay + Math.random() * 40);
            }
        }

        async function run() {
            await wait(400);
            cursor.classList.add('visible');

            await wait(300);
            moveCursor('48%', '52%');

            await wait(800);
            click();
            appIcon.classList.add('bounce');
            await wait(120);
            appIcon.classList.remove('bounce');
            appIcon.classList.add('unbounce');
            await wait(100);
            appIcon.classList.remove('unbounce');

            await wait(200);
            click();
            appIcon.classList.add('bounce');
            await wait(120);
            appIcon.classList.remove('bounce');
            appIcon.classList.add('unbounce');
            await wait(100);
            appIcon.classList.remove('unbounce');

            await wait(150);
            appIcon.classList.add('shrinking');
            await wait(200);
            browser.classList.add('opening');
            if (glow) glow.classList.add('visible');

            await wait(900);
            cursor.classList.add('fast');
            moveCursor('5%', '80%');

            await wait(500);
            click();
            urlBar.classList.add('focused');
            urlCaret.classList.add('visible');

            await wait(300);
            moveCursor('5%', '92%');
            await wait(100);
            await typeText('yourbusiness.com.au', urlText, 70);

            await wait(300);
            urlCaret.classList.remove('visible');
            urlBar.classList.remove('focused');
            screenBlank.classList.add('loading');

            await wait(600);
            screenBlank.classList.add('hidden');
            await wait(200);
            screenContent.classList.add('visible');

            await wait(300);
            document.querySelectorAll('.mockup__stat-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });

            await wait(500);
            cursor.classList.remove('fast');

            const positions = [
                ['55%', '25%'],
                ['82%', '18%'],
                ['82%', '50%'],
                ['82%', '82%'],
                ['16%', '75%'],
                ['38%', '40%'],
            ];

            async function browse() {
                for (const [top, left] of positions) {
                    await wait(1200);
                    moveCursor(top, left);
                    await wait(600);
                }
                browse();
            }
            browse();
        }

        run();
    })();

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(s => sectionObserver.observe(s));

    document.querySelectorAll('.portfolio__screenshot').forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', () => {
            img.style.display = 'none';
            const placeholder = img.closest('.portfolio__card-img').querySelector('.portfolio__placeholder-url');
            if (placeholder) placeholder.textContent = 'Preview unavailable';
            const spinner = img.closest('.portfolio__card-img').querySelector('.portfolio__spinner');
            if (spinner) spinner.style.display = 'none';
        });
    });

    const modal = document.getElementById('quoteModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');

    function openModal(e) {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.js-open-quote').forEach(btn => btn.addEventListener('click', openModal));
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
});
