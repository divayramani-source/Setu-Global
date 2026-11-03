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

// Impact counter animation (25,00,000 KG)
const counterEl = document.getElementById('impactCounter');
if (counterEl) {
  let counted = false;
  const animateCounter = () => {
    if (counted) return;
    const rect = counterEl.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;
    counted = true;
    const target = 2500000;
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counterEl.textContent = Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
      else counterEl.textContent = target.toLocaleString('en-IN') + '+ KG';
    }
    requestAnimationFrame(tick);
  };
  window.addEventListener('scroll', animateCounter);
  animateCounter();
}

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
    '.offer-sheet-cta, .contact-wrap > *, .hero-inner > *'
  );
  autoTargets.forEach((el) => el.classList.add('reveal'));

  // stagger cards within the same grid row
  document.querySelectorAll('.grid-3, .grid-4').forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('reveal-delay-' + Math.min(i + 1, 4));
    });
  });

  if (!('IntersectionObserver' in window)) {
    autoTargets.forEach((el) => el.classList.add('in-view'));
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

  autoTargets.forEach((el) => observer.observe(el));
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
