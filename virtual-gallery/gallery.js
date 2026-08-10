/**
 * NOCTURNE VIRTUAL GALLERY — gallery.js
 * Handles: scroll observation, nav dots, hotspot cards, ambient particles
 */

'use strict';

/* =============================================
   1. CONFIGURATION
   ============================================= */
const ROOMS = ['room-0', 'room-1', 'room-2', 'room-3', 'room-4', 'room-5', 'room-outro'];
const NAV_DOTS = 6; // only dot-indexed rooms (0–5), not outro

/* =============================================
   2. DOM REFERENCES
   ============================================= */
const galleryNav = document.getElementById('gallery-nav');
const overlay = document.getElementById('overlay');
const scrollHint = document.querySelector('.nav-scroll-hint');
const enterBtn = document.getElementById('enter-btn');
const restartBtn = document.getElementById('restart-btn');

/* =============================================
   3. INTERSECTION OBSERVER — ROOM VISIBILITY
   ============================================= */
const observerOptions = {
  root: null,
  threshold: 0.45,
};

const roomObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const room = entry.target;
    if (entry.isIntersecting) {
      room.classList.add('visible');
      updateNavDot(room.id);
      if (room.id !== 'room-0') {
        scrollHint?.classList.add('hidden');
      }
    } else {
      room.classList.remove('visible');
    }
  });
}, observerOptions);

ROOMS.forEach((id) => {
  const el = document.getElementById(id);
  if (el) roomObserver.observe(el);
});

/* =============================================
   4. NAV DOT UPDATES
   ============================================= */
function updateNavDot(roomId) {
  // Map room IDs to dot indices
  const dotMap = {
    'room-0': 0,
    'room-1': 1,
    'room-2': 2,
    'room-3': 3,
    'room-4': 4,
    'room-5': 5,
    'room-outro': 5, // keep last dot active at outro
  };

  const dotIndex = dotMap[roomId];
  if (dotIndex === undefined) return;

  document.querySelectorAll('.room-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === dotIndex);
  });
}

/* =============================================
   5. NAV DOT CLICK — SMOOTH SCROLL TO ROOM
   ============================================= */
document.querySelectorAll('.room-dot').forEach((dot) => {
  dot.addEventListener('click', () => {
    const roomIndex = parseInt(dot.dataset.room, 10);
    scrollToRoom(roomIndex);
  });
});

function scrollToRoom(index) {
  const id = index === 0 ? 'room-0' : `room-${index}`;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// CTA buttons
if (enterBtn) {
  enterBtn.addEventListener('click', () => scrollToRoom(1));
}
if (restartBtn) {
  restartBtn.addEventListener('click', () => scrollToRoom(0));
}

/* =============================================
   6. HOTSPOT & INFO CARD INTERACTION
   ============================================= */
let activeCard = null;
let activeHotspot = null;

function openCard(hotspot) {
  const cardId = hotspot.getAttribute('aria-controls');
  const card = document.getElementById(cardId);
  if (!card) return;

  // Close previously open card first
  if (activeCard && activeCard !== card) {
    closeCard(activeHotspot, activeCard);
  }

  card.removeAttribute('hidden');
  hotspot.setAttribute('aria-expanded', 'true');
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  // Move focus into the card for accessibility
  const closeBtn = card.querySelector('.info-card-close');
  if (closeBtn) {
    // Use a short delay to allow display transition
    requestAnimationFrame(() => closeBtn.focus());
  }

  activeCard = card;
  activeHotspot = hotspot;
}

function closeCard(hotspot, card) {
  if (!card) return;
  card.setAttribute('hidden', '');
  if (hotspot) hotspot.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');

  if (hotspot) hotspot.focus();
  activeCard = null;
  activeHotspot = null;
}

// Wire hotspot buttons
document.querySelectorAll('.hotspot').forEach((hotspot) => {
  hotspot.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = hotspot.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      const cardId = hotspot.getAttribute('aria-controls');
      closeCard(hotspot, document.getElementById(cardId));
    } else {
      openCard(hotspot);
    }
  });
});

// Wire close buttons inside info cards
document.querySelectorAll('.info-card-close').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeCard(activeHotspot, activeCard);
  });
});

// Close on overlay click
overlay.addEventListener('click', () => {
  if (activeCard) closeCard(activeHotspot, activeCard);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeCard) {
    closeCard(activeHotspot, activeCard);
  }
});

// Prevent click inside card from closing
document.querySelectorAll('.info-card').forEach((card) => {
  card.addEventListener('click', (e) => e.stopPropagation());
});

/* =============================================
   7. NAV TRANSPARENCY ON SCROLL
   ============================================= */
let lastScrollY = window.scrollY;
const navEl = document.getElementById('gallery-nav');

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (lastScrollY > 80) {
    navEl.style.background = 'rgba(8, 8, 16, 0.92)';
  } else {
    navEl.style.background = '';
  }
}, { passive: true });

/* =============================================
   8. AMBIENT PARTICLE SYSTEM (Canvas)
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // Respect prefers-reduced-motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  let animFrame;

  // Particle pool
  const PARTICLE_COUNT = 80;
  const particles = [];

  const COLORS = [
    'hsla(42, 80%, 70%, ',   // gold
    'hsla(275, 65%, 75%, ',  // violet
    'hsla(200, 70%, 70%, ',  // blue
    'hsla(158, 55%, 65%, ',  // emerald
    'hsla(0, 0%, 90%, ',     // white
  ];

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.6 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.35 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.alphaSpeed = (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1);
      this.color = randomColor();
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.twinkle += this.twinkleSpeed;
      this.alpha += this.alphaSpeed;

      // Clamp alpha
      if (this.alpha <= 0.05 || this.alpha >= 0.65) {
        this.alphaSpeed *= -1;
        this.alpha = Math.max(0.05, Math.min(0.65, this.alpha));
      }

      // Twinkle alpha modifier
      const twinkledAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.twinkle));

      if (this.y < -10) this.reset();
      return twinkledAlpha;
    }

    draw(twinkledAlpha) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${twinkledAlpha.toFixed(3)})`;
      ctx.fill();
    }
  }

  function initParticlePool() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      const a = p.update();
      p.draw(a);
    }
    animFrame = requestAnimationFrame(render);
  }

  // Init
  resize();
  initParticlePool();
  render();

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });
})();
