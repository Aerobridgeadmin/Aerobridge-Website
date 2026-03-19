/**
 * AeroBridge Website — Animations Engine
 * Scroll-reveal, parallax, counters, navbar morph, stagger
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── SCROLL REVEAL ──
  const revealElements = document.querySelectorAll(
    '.card, .testimonial-card, .stat-card, .pricing-card, .section-title, ' +
    '.hero-content, .cta-form, .accordion-item, [data-reveal]'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.revealDelay || (index % 6) * 80;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('revealed');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => {
    el.classList.add('reveal-element');
    revealObserver.observe(el);
  });

  // ── STAGGERED GRID REVEAL ──
  document.querySelectorAll('.row.g-4, .row.g-3').forEach(row => {
    const cards = row.querySelectorAll('.col-md-6, .col-lg-4, .col-lg-3');
    const rowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 120}ms`;
            card.classList.add('stagger-revealed');
          });
          rowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    rowObserver.observe(row);
    cards.forEach(c => c.classList.add('stagger-element'));
  });

  // ── COUNTER ANIMATION ──
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          let current = 0;
          const step = Math.ceil(target / 40);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            el.textContent = current + suffix;
          }, 30);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  // ── NAVBAR MORPH ON SCROLL ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 60) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  // ── HERO PARALLAX ──
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrollY * 0.4}px`;
        const overlay = hero.querySelector('.hero-overlay');
        if (overlay) overlay.style.opacity = Math.min(1, 0.85 + scrollY * 0.0003);
      }
    }, { passive: true });
  }

  // ── FLOATING PLANE IN HERO ──
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const plane = document.createElement('div');
    plane.className = 'hero-plane';
    plane.innerHTML = `<svg width="48" height="48" viewBox="0 0 16 16" fill="rgba(255,255,255,0.12)"><path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"/></svg>`;
    heroSection.appendChild(plane);

    // Second smaller plane
    const plane2 = document.createElement('div');
    plane2.className = 'hero-plane hero-plane-2';
    plane2.innerHTML = `<svg width="28" height="28" viewBox="0 0 16 16" fill="rgba(255,255,255,0.07)"><path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"/></svg>`;
    heroSection.appendChild(plane2);
  }

  // ── SMOOTH CARD TILT ON HOVER ──
  document.querySelectorAll('.card, .testimonial-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── HERO TEXT SLIDE-IN (letters) ──
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const words = heroTitle.textContent.trim().split(' ');
    heroTitle.innerHTML = words.map((word, i) => 
      `<span class="hero-word" style="animation-delay: ${i * 0.08}s">${word}</span>`
    ).join(' ');
    heroTitle.classList.add('hero-title-animated');
  }

  // ── TESTIMONIAL STARS SPARKLE ──
  document.querySelectorAll('.testimonial-rating').forEach(rating => {
    rating.classList.add('stars-animate');
  });
});
