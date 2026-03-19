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
    let isScrolled = false;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 80;
          if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            navbar.classList.toggle('navbar-scrolled', isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── HERO PARALLAX ──
  const hero = document.querySelector('.hero');
  if (hero) {
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrollY * 0.3}px`;
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ── (Card tilt removed — caused scroll jank) ──

  // ── TESTIMONIAL STARS SPARKLE ──
  document.querySelectorAll('.testimonial-rating').forEach(rating => {
    rating.classList.add('stars-animate');
  });
});
