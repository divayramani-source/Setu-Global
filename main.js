// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('active'));
});

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
  modalTitle.textContent = 'Inquire: ' + productName;
  modalOverlay.classList.add('active');
}
function closeModal() {
  modalOverlay.classList.remove('active');
}
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.getElementById('modalForm').addEventListener('submit', (e) => {
  e.preventDefault();
  closeModal();
  alert('Inquiry sent. Our trading desk will respond within 24 business hours.');
  e.target.reset();
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('formSuccess').style.display = 'block';
  e.target.reset();
});

// Impact counter animation
const counterEl = document.getElementById('impactCounter');
let counted = false;
function animateCounter() {
  if (counted) return;
  const rect = counterEl.getBoundingClientRect();
  if (rect.top > window.innerHeight) return;
  counted = true;
  const target = 12480;
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counterEl.textContent = Math.floor(eased * target).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(tick);
    else counterEl.textContent = target.toLocaleString('en-IN') + '+';
  }
  requestAnimationFrame(tick);
}
window.addEventListener('scroll', animateCounter);
animateCounter();

// Header shadow on scroll (subtle)
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.style.borderBottomColor = window.scrollY > 10 ? '#333' : '#242424';
});
