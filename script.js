// ========================================================================
// KAPITOR – HEADER INTERACTIONS
// ========================================================================

window.addEventListener('scroll', () => {
  const header =
    document.getElementById('main-header') || document.querySelector('header');
  if (!header) return;
  header.style.padding = window.scrollY > 60 ? '0.7rem 2rem' : '1rem 2rem';
});

// Ensure Kapitor logo uses SVG from assets at runtime
window.addEventListener('DOMContentLoaded', () => {
  const headerLogoImg = document.querySelector('.logo img');
  if (headerLogoImg) {
    headerLogoImg.src = 'assets/kapitor.svg';
  }

  // On Prime page, make logo click go back to main index
  const logoLink = document.querySelector('a.logo');
  if (logoLink && window.location.pathname.endsWith('prime.html')) {
    logoLink.addEventListener('click', event => {
      event.preventDefault();
      window.location.href = 'index.html';
    });
  }

  const footerLogoImg = document.querySelector('.footer-logo-wrap img');
  if (footerLogoImg) {
    footerLogoImg.src = 'assets/kapitor.svg';
  }

  // Prime page footer logo
  const primeFooterLogo = document.querySelector('.footer-logo-row img');
  if (primeFooterLogo) {
    primeFooterLogo.src = 'assets/kapitor.svg';
  }
});

// ========================================================================
// KAPITOR – SCROLL REVEAL ANIMATIONS
// ========================================================================

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.08 }
);

document
  .querySelectorAll(
    '.wallet-asset, .rail-card, .yield-row, .token-card, .inst-item, .comp-item, .por-feat, .gips-cap'
  )
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    observer.observe(el);
  });

