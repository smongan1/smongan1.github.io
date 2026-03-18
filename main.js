/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);

    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
      spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('is-open');
      navToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observerOptions = {
  rootMargin: '-40% 0px -55% 0px',
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   SCROLL REVEAL ANIMATION
   ============================================================ */
const revealElements = document.querySelectorAll(
  '.problem-card, .service-card, .work-card, .process-step, .cred-item'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.45s ease ${i * 0.07}s, transform 0.45s ease ${i * 0.07}s`;
  revealObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  // Re-check anything already in viewport on load
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('revealed');
    }
  });
});

// Apply revealed state
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .revealed {
      opacity: 1 !important;
      transform: none !important;
    }
  </style>
`);

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name     = contactForm.querySelector('#name').value.trim();
    const email    = contactForm.querySelector('#email').value.trim();
    const business = contactForm.querySelector('#business').value || 'Not specified';
    const message  = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) return;

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled    = true;

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback_type: 'consulting_inquiry',
          subject: `[${business}] ${name}`,
          message: message,
          email: email
        })
      });

      if (!res.ok) throw new Error(`${res.status}`);

      btn.textContent = 'Message sent';
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled    = false;
      }, 4000);

    } catch (err) {
      console.error('Submission failed:', err);
      btn.textContent = 'Failed — try emailing directly';
      btn.disabled    = false;

      setTimeout(() => {
        btn.textContent = 'Send Message';
      }, 4000);
    }
  });
}

/* ============================================================
   NAV SHADOW ON SCROLL
   ============================================================ */
const navHeader = document.querySelector('.nav-header');

if (navHeader) {
  window.addEventListener('scroll', () => {
    navHeader.style.boxShadow = window.scrollY > 10
      ? '0 2px 12px rgba(0,0,0,0.07)'
      : 'none';
  }, { passive: true });
}
