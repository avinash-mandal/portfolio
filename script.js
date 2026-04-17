/* =============================================
   AVINASH MANDAL — PORTFOLIO JAVASCRIPT
   script.js
============================================= */

// ─── 1. ANIMATED CANVAS BACKGROUND ──────────────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.floor((W * H) / 12000);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 120) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  loop();
})();


// ─── 2. NAVBAR SCROLL EFFECT ─────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
})();


// ─── 3. HAMBURGER MENU ───────────────────────────────────────────────────────
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('open');
    });
  });
})();


// ─── 4. INTERSECTION OBSERVER — SCROLL REVEAL ────────────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger cards
        const siblings = Array.from(el.parentElement.children);
        const i = siblings.indexOf(el);
        setTimeout(() => {
          el.classList.add('visible');
          // Animate skill bars
          el.querySelectorAll('.skill-fill').forEach(bar => {
            const w = bar.getAttribute('data-width');
            bar.style.width = w + '%';
          });
        }, i * 120);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    observer.observe(el);
  });
})();


// ─── 5. COUNTER ANIMATION ────────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '+';
        let current  = 0;
        const step   = Math.ceil(target / 40);
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
            el.textContent = current + suffix;
          } else {
            el.textContent = current;
          }
        }, 40);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();


// ─── 6. CONTACT FORM ─────────────────────────────────────────────────────────
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      btnText.textContent = 'Send Message';
      btn.disabled = false;
      success.classList.add('show');
      form.reset();

      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  });
})();


// ─── 7. SMOOTH ACTIVE NAV HIGHLIGHT ─────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--accent)' : '';
    });
  });
})();


// ─── 8. CURSOR GLOW (desktop only) ───────────────────────────────────────────
(function initCursorGlow() {
  if (window.innerWidth < 768) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.4s;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
})();


// ─── 9. TYPING EFFECT FOR HERO NAME ─────────────────────────────────────────
(function initTyping() {
  const roles = [
    'JavaScript Developer',
    'Networking Enthusiast',
    'C Programmer',
    'Data Visualizer',
    'CS Student @ MRU'
  ];
  const subEl = document.querySelector('.hero-sub');
  if (!subEl) return;

  const baseText = 'CS Student @ <span class="accent">Manav Rachna</span> &nbsp;·&nbsp; ';
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingEl;

  // Wait for animation to complete first
  setTimeout(() => {
    subEl.innerHTML = baseText + '<span id="typing-role"></span><span class="cursor-blink">|</span>';
    typingEl = document.getElementById('typing-role');

    // Add blink style
    const style = document.createElement('style');
    style.textContent = `.cursor-blink { animation: blink 1s step-end infinite; color: var(--accent); }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`;
    document.head.appendChild(style);

    type();
  }, 1200);

  function type() {
    const role = roles[roleIndex];
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    if (typingEl) typingEl.textContent = role.substring(0, charIndex);

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === role.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
})();