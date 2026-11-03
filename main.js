// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('active'));
  });
}

// Product category accordion
document.querySelectorAll('.product-cat-head').forEach(head => {
  head.addEventListener('click', () => {
    const items = head.nextElementSibling;
    items.style.display = items.style.display === 'none' ? 'grid' : 'none';
  });
});

// Inquiry modal
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');

function openModal(productName) {
  if (!modalOverlay) return;
  modalTitle.textContent = 'Inquire: ' + productName;
  modalOverlay.classList.add('active');
}
function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
}
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

const modalForm = document.getElementById('modalForm');
if (modalForm) {
  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    alert('Inquiry sent. Our trading desk will respond within 24 business hours.');
    e.target.reset();
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('formSuccess').style.display = 'block';
    e.target.reset();
  });
}

// Generic animated counters: #impactCounter (legacy) and any [data-count-to]
(function initCounters() {
  const runCounter = (el, target, suffix, duration) => {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + (progress < 1 ? '' : suffix);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const targets = [];

  const legacy = document.getElementById('impactCounter');
  if (legacy) targets.push({ el: legacy, target: 2500000, suffix: '+ KG', duration: 1800 });

  document.querySelectorAll('[data-count-to]').forEach((el) => {
    targets.push({
      el,
      target: parseInt(el.getAttribute('data-count-to'), 10),
      suffix: el.getAttribute('data-suffix') || '',
      duration: 1600,
    });
  });

  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => runCounter(t.el, t.target, t.suffix, t.duration));
    return;
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const match = targets.find((t) => t.el === entry.target);
      if (entry.isIntersecting && match) {
        runCounter(match.el, match.target, match.suffix, match.duration);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  targets.forEach((t) => counterObserver.observe(t.el));
})();

// Header shadow on scroll
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// Scroll reveal animations
(function initReveal() {
  const autoTargets = document.querySelectorAll(
    '.section-head, .card, .mission-box, .route-map, .about-grid > div, ' +
    '.product-cat, .gallery-item, .founder-photo, .founder-wrap > div, ' +
    '.bulletin, .callout-strip .card, .impact-counter, .pillar, ' +
    '.offer-sheet-cta, .contact-wrap > *'
  );
  autoTargets.forEach((el) => el.classList.add('reveal'));

  // stagger cards within the same grid row
  document.querySelectorAll('.grid-3, .grid-4').forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('reveal-delay-' + Math.min(i + 1, 4));
    });
  });

  // combine auto-targeted elements with any pre-marked in markup (e.g. hero bits)
  const allRevealEls = new Set([...autoTargets, ...document.querySelectorAll('.reveal')]);

  if (!('IntersectionObserver' in window)) {
    allRevealEls.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  allRevealEls.forEach((el) => observer.observe(el));
})();

// Hero headline/subhead word-by-word reveal
(function initWordReveal() {
  const els = document.querySelectorAll('.word-reveal');
  els.forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w, i) => {
        const delay = (0.1 + i * 0.045).toFixed(3);
        return `<span class="word-mask"><span class="word-inner" style="animation-delay:${delay}s">${w}</span></span>`;
      })
      .join(' ');
  });
})();

// Card spotlight cursor glow, plus a gentle 3D tilt on the same cards
(function initCardSpotlight() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length || window.matchMedia('(hover: none)').matches) return;
  cards.forEach((card) => {
    card.classList.add('tilt-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--spot-x', x + '%');
      card.style.setProperty('--spot-y', y + '%');

      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((e.clientX - rect.left - midX) / midX) * 6;
      const rotateX = -((e.clientY - rect.top - midY) / midY) * 6;
      card.style.setProperty('--tilt-x', rotateX.toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', rotateY.toFixed(2) + 'deg');
    });
    card.addEventListener('mouseenter', () => card.classList.add('spotlight-active'));
    card.addEventListener('mouseleave', () => {
      card.classList.remove('spotlight-active');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
})();

// Scroll-triggered quick enquiry popup (home page only)
const quickEnquiry = document.getElementById('quickEnquiry');
if (quickEnquiry) {
  const closeBtn = document.getElementById('quickEnquiryClose');
  const qeForm = document.getElementById('quickEnquiryForm');
  const qeSuccess = document.getElementById('quickEnquirySuccess');
  const DISMISS_KEY = 'setuGlobalQuickEnquiryDismissed';
  let hasShown = false;

  const maybeShow = () => {
    if (hasShown) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const scrolled = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (scrolled > pageHeight * 0.45) {
      hasShown = true;
      quickEnquiry.classList.add('show');
      window.removeEventListener('scroll', maybeShow);
    }
  };
  window.addEventListener('scroll', maybeShow, { passive: true });

  const dismiss = () => {
    quickEnquiry.classList.remove('show');
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
  };
  if (closeBtn) closeBtn.addEventListener('click', dismiss);

  if (qeForm) {
    qeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      qeForm.style.display = 'none';
      if (qeSuccess) qeSuccess.style.display = 'block';
      setTimeout(dismiss, 2600);
    });
  }
}
