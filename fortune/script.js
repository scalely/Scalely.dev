(function () {
  'use strict';

  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  function onNavScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .reveal-tag-1, .reveal-tag-2'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -160px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));

  const track    = document.getElementById('testimonialsTrack');
  const dotsWrap = document.getElementById('tDots');
  const prevBtn  = document.getElementById('tPrev');
  const nextBtn  = document.getElementById('tNext');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let perView = getPerView();
    let maxIndex = Math.max(0, cards.length - perView);
    let autoTimer;

    function getPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1100) return 2;
      return 3;
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const total = maxIndex + 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 't-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex));
      track.style.transform = `translateX(-${cards[current].offsetLeft}px)`;
      dotsWrap.querySelectorAll('.t-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => {
        goTo(current >= maxIndex ? 0 : current + 1);
      }, 5000);
    }

    function stopAuto() { clearInterval(autoTimer); }

    prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { stopAuto(); goTo(current >= maxIndex ? 0 : current + 1); startAuto(); });

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    });

    function init() {
      perView  = getPerView();
      maxIndex = Math.max(0, cards.length - perView);
      current  = Math.min(current, maxIndex);
      buildDots();
      goTo(current);
    }

    window.addEventListener('resize', init);
    init();
    startAuto();
  }

  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');

  if (form) {
    function validateField(input) {
      const group = input.closest('.form-group');
      if (!group) return true;
      let valid = true;

      if (input.hasAttribute('required') && !input.value.trim()) {
        valid = false;
      } else if (input.type === 'email' && input.value) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      }

      group.classList.toggle('has-error', !valid);
      input.classList.toggle('error', !valid);
      return valid;
    }

    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      let allValid = true;
      form.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        const data = new FormData(form);
        const response = await fetch('https://formspree.io/f/mvzvowno', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data,
        });

        if (response.ok) {
          successMsg.classList.add('visible');
          form.style.display = 'none';
        } else {
          const json = await response.json().catch(() => ({}));
          const msg = (json.errors || []).map(e => e.message).join(', ') || 'Submission failed. Please try again.';
          throw new Error(msg);
        }
      } catch (err) {
        alert(err.message || 'Something went wrong. Please try again or call us directly.');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  }

  const brandsWrap = document.getElementById('brandsWrap');
  const brandsTrack = document.getElementById('brandsTrack');

  if (brandsWrap && brandsTrack) {
    const orig = brandsTrack.innerHTML;
    brandsTrack.innerHTML = orig + orig + orig + orig;

    let isDragging = false;
    let dragStartX = 0;
    let dragOriginX = 0;

    function getTrackX() {
      const mat = new DOMMatrix(getComputedStyle(brandsTrack).transform);
      return mat.m41;
    }

    function setTrackX(x) {
      const quarter = -brandsTrack.offsetWidth / 4;
      if (x < quarter) x -= quarter;
      if (x > 0) x += quarter;
      brandsTrack.style.transform = `translateX(${x}px)`;
    }

    function resumeAt(x) {
      const totalWidth = brandsTrack.offsetWidth / 4;
      const duration = 28;
      const progress = Math.abs(x) / totalWidth;
      const delay = -(progress * duration);
      brandsTrack.style.transform = '';
      brandsTrack.style.animation = `brandsMarquee ${duration}s linear ${delay}s infinite`;
    }

    brandsWrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.pageX;
      dragOriginX = getTrackX();
      brandsTrack.style.animation = 'none';
      brandsTrack.style.transform = `translateX(${dragOriginX}px)`;
      brandsWrap.classList.add('dragging');
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = e.pageX - dragStartX;
      setTrackX(dragOriginX + delta);
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      brandsWrap.classList.remove('dragging');
      resumeAt(getTrackX());
    });

    brandsWrap.addEventListener('touchstart', (e) => {
      isDragging = true;
      dragStartX = e.touches[0].pageX;
      dragOriginX = getTrackX();
      brandsTrack.style.animation = 'none';
      brandsTrack.style.transform = `translateX(${dragOriginX}px)`;
    }, { passive: true });

    brandsWrap.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const delta = e.touches[0].pageX - dragStartX;
      setTrackX(dragOriginX + delta);
    }, { passive: true });

    brandsWrap.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      resumeAt(getTrackX());
    });
  }

  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const heroContent = document.querySelector('.hero-content');
  const heroBgImage = document.querySelector('.hero-bg-image');

  function heroParallax() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.18}px)`;
      heroContent.style.opacity   = 1 - scrollY / (window.innerHeight * 0.75);
    }
    if (heroBgImage) {
      heroBgImage.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }

  window.addEventListener('scroll', heroParallax, { passive: true });

})();
