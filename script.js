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
// KAPITOR – TWO-PANEL NAV DROPDOWNS (Platform / Digital Assets)
// Left tabs swap the active right-side panel.
// ========================================================================
function initTwoPanelNavDropdowns() {
  const isMobile = () => window.innerWidth <= 900;

  document.querySelectorAll('.nav-two-panel-dropdown').forEach(dropdown => {
    const tabs = dropdown.querySelectorAll('.nav-two-panel-tab');
    const panels = dropdown.querySelectorAll('.nav-two-panel-panel');
    if (!tabs.length || !panels.length) return;

    function setActive(key) {
      tabs.forEach(tab => {
        const on = tab.getAttribute('data-key') === key;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      panels.forEach(panel => {
        const on = panel.getAttribute('data-key') === key;
        panel.classList.toggle('is-active', on);
        panel.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
    }

    // Ensure one panel is active on load (first tab by default).
    const initialTab = dropdown.querySelector('.nav-two-panel-tab.is-active') || tabs[0];
    const initialKey = initialTab && initialTab.getAttribute('data-key');
    if (initialKey) setActive(initialKey);

    tabs.forEach(tab => {
      const key = tab.getAttribute('data-key');
      tab.addEventListener('mouseenter', () => {
        if (!isMobile()) setActive(key);
      });
      tab.addEventListener('focus', () => {
        if (!isMobile()) setActive(key);
      });
      tab.addEventListener('click', () => {
        setActive(key);
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTwoPanelNavDropdowns);
} else {
  initTwoPanelNavDropdowns();
}

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

// ========================================================================
// KAPITOR – NAVBAR SYNC (Dropdown injection + page-only gating)
// ========================================================================

function getPageSlug() {
  const p = window.location.pathname.split('/').filter(Boolean);
  return p.length ? p[p.length - 1] : 'index.html';
}

function normalizeText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function injectTwoPanelDropdowns() {
  const platformInner = `
    <div class="nav-two-panel-grid">
      <div class="nav-two-panel-left" role="tablist" aria-label="Platform categories">
        <button type="button" class="nav-two-panel-tab is-active" data-key="wallet" role="tab" aria-selected="true">Kapitor Smart Wallet</button>
        <button type="button" class="nav-two-panel-tab" data-key="pay" role="tab" aria-selected="false">Kapitor Pay</button>
        <button type="button" class="nav-two-panel-tab" data-key="trade" role="tab" aria-selected="false">Kapitor Trade</button>
        <button type="button" class="nav-two-panel-tab" data-key="earn" role="tab" aria-selected="false">Kapitor Earn</button>
        <button type="button" class="nav-two-panel-tab" data-key="stake" role="tab" aria-selected="false">Kapitor Stake</button>
        <button type="button" class="nav-two-panel-tab" data-key="vaults" role="tab" aria-selected="false">Kapitor Vaults</button>
      </div>
      <div class="nav-two-panel-right" role="region" aria-live="polite">
        <div class="nav-two-panel-panel is-active" data-key="wallet" role="tabpanel" aria-hidden="false">
          <a href="kapitor-smart-wallet.html">Multi-Currency Fiat</a>
          <a href="kapitor-smart-wallet.html">Crypto &amp; Stablecoins</a>
          <a href="kapitor-smart-wallet.html">Token Holdings (Kaloft, Katoin, EQOUIN, KFI)</a>
          <a href="kapitor-smart-wallet.html">Unified Ledger Architecture</a>
          <a href="kapitor-smart-wallet.html">Security Framework</a>
        </div>
        <div class="nav-two-panel-panel" data-key="pay" role="tabpanel" aria-hidden="true">
          <a href="kapitor-pay.html">Global Transfers</a>
          <a href="kapitor-pay.html">QR &amp; P2P</a>
          <a href="kapitor-pay.html">Cards &amp; Virtual Cards</a>
          <a href="kapitor-pay.html">Salary &amp; Payroll</a>
          <a href="kapitor-pay.html">International Settlement</a>
          <a href="kapitor-pay.html">Global Bill Payment System (GBPS)</a>
        </div>
        <div class="nav-two-panel-panel" data-key="trade" role="tabpanel" aria-hidden="true">
          <a href="kapitor-trade.html">Spot Markets</a>
          <a href="kapitor-trade.html">Swaps &amp; Liquidity Routing</a>
          <a href="kapitor-trade.html">Derivatives</a>
          <a href="kapitor-trade.html">OTC Desk</a>
          <a href="kapitor-trade.html">Risk Engine</a>
        </div>
        <div class="nav-two-panel-panel" data-key="earn" role="tabpanel" aria-hidden="true">
          <a href="kapitor-earn.html">Conservative Strategy</a>
          <a href="kapitor-earn.html">Balanced Strategy</a>
          <a href="kapitor-earn.html">Growth Strategy</a>
          <a href="kapitor-earn.html">Yield Sources</a>
          <a href="kapitor-earn.html">Performance Reporting</a>
        </div>
        <div class="nav-two-panel-panel" data-key="stake" role="tabpanel" aria-hidden="true">
          <a href="kapitor-stake.html">ETH Liquid Staking</a>
          <a href="kapitor-stake.html">SOL Staking</a>
          <a href="kapitor-stake.html">DOT Staking</a>
          <a href="kapitor-stake.html">ATOM Staking</a>
          <a href="kapitor-stake.html">Layered Yield Model</a>
        </div>
        <div class="nav-two-panel-panel" data-key="vaults" role="tabpanel" aria-hidden="true">
          <a href="kapitor-vaults.html">Stable Income Vault</a>
          <a href="kapitor-vaults.html">Bitcoin Yield Vault</a>
          <a href="kapitor-vaults.html">Bond-Backed Vault</a>
          <a href="kapitor-vaults.html">Trade Finance Vault</a>
          <a href="kapitor-vaults.html">Capital Protected Vault</a>
        </div>
      </div>
    </div>
  `;

  const digitalInner = `
    <div class="nav-two-panel-grid">
      <div class="nav-two-panel-left" role="tablist" aria-label="Digital assets categories">
        <button type="button" class="nav-two-panel-tab is-active" data-key="kaloft" role="tab" aria-selected="true">Kaloft (EPT)</button>
        <button type="button" class="nav-two-panel-tab" data-key="katoin" role="tab" aria-selected="false">Katoin</button>
        <button type="button" class="nav-two-panel-tab" data-key="eqouin" role="tab" aria-selected="false">EQOUIN</button>
        <button type="button" class="nav-two-panel-tab" data-key="kfi" role="tab" aria-selected="false">KFI – Kapitor Financial Instruments</button>
      </div>
      <div class="nav-two-panel-right" role="region" aria-live="polite">
        <div class="nav-two-panel-panel is-active" data-key="kaloft" role="tabpanel" aria-hidden="false">
          <a href="kaloft-ept.html">Economic Participation Model</a>
          <a href="kaloft-ept.html">Pool Structures (1M–100M)</a>
          <a href="kaloft-ept.html">Lock Periods (1Y / 3Y / 5Y)</a>
          <a href="kaloft-ept.html">NAV Tracking</a>
          <a href="kaloft-ept.html">Redemption Framework</a>
        </div>
        <div class="nav-two-panel-panel" data-key="katoin" role="tabpanel" aria-hidden="true">
          <a href="katoin.html">Commodity Tokenization</a>
          <a href="katoin.html">Trade Levels</a>
          <a href="katoin.html">Profit Distribution Logic</a>
          <a href="katoin.html">Global Commodity Flow</a>
        </div>
        <div class="nav-two-panel-panel" data-key="eqouin" role="tabpanel" aria-hidden="true">
          <a href="digitalassets.html">Valuation Mechanism</a>
          <a href="digitalassets.html">Dividend Distribution</a>
          <a href="digitalassets.html">Capital Appreciation Model</a>
          <a href="digitalassets.html">Internal Trading Market</a>
        </div>
        <div class="nav-two-panel-panel" data-key="kfi" role="tabpanel" aria-hidden="true">
          <a href="kfi.html">Bank Guarantees (BG)</a>
          <a href="kfi.html">SBLC</a>
          <a href="kfi.html">Letter of Credit (LC)</a>
          <a href="kfi.html">Performance Guarantees</a>
          <a href="kfi.html">Digital Issuance</a>
          <a href="kfi.html">Blockchain Record</a>
        </div>
      </div>
    </div>
  `;

  let changed = false;

  // Index page uses `.nav-mega`; convert it to `.nav-dropdown` so shared CSS applies.
  document
    .querySelectorAll('.nav-mega[aria-label="Platform menu"]')
    .forEach(el => {
      if (el.querySelector('.nav-two-panel-grid')) return;
      changed = true;
      el.classList.remove('nav-mega');
      el.classList.add('nav-dropdown', 'nav-two-panel-dropdown');
      el.setAttribute('data-key', 'platform');
      el.setAttribute('role', 'menu');
      el.setAttribute('aria-label', 'Platform menu');
      el.innerHTML = platformInner;
    });

  document
    .querySelectorAll('.nav-mega[aria-label="Digital Asset Layer menu"]')
    .forEach(el => {
      if (el.querySelector('.nav-two-panel-grid')) return;
      changed = true;
      el.classList.remove('nav-mega');
      el.classList.add('nav-dropdown', 'nav-two-panel-dropdown');
      el.setAttribute('data-key', 'digital-assets');
      el.setAttribute('role', 'menu');
      el.setAttribute('aria-label', 'Digital Assets menu');
      el.innerHTML = digitalInner;
    });

  // All other pages: look for nav trigger buttons and replace the existing dropdown inner content.
  document.querySelectorAll('button.nav-trigger').forEach(btn => {
    const txt = normalizeText(btn.textContent).toLowerCase();
    const wrap = btn.closest('.nav-item-wrap') || btn.parentElement;
    const dropdown = wrap && wrap.querySelector('.nav-dropdown');
    if (!dropdown) return;

    if (txt.startsWith('platform')) {
      if (dropdown.querySelector('.nav-two-panel-grid')) return;
      changed = true;
      dropdown.classList.add('nav-two-panel-dropdown');
      dropdown.setAttribute('data-key', 'platform');
      dropdown.setAttribute('role', 'menu');
      dropdown.setAttribute('aria-label', 'Platform menu');
      dropdown.innerHTML = platformInner;
    }

    if (txt.startsWith('digital assets') || txt.startsWith('digital asset layer')) {
      if (dropdown.querySelector('.nav-two-panel-grid')) return;
      changed = true;
      dropdown.classList.add('nav-two-panel-dropdown');
      dropdown.setAttribute('data-key', 'digital-assets');
      dropdown.setAttribute('role', 'menu');
      dropdown.setAttribute('aria-label', 'Digital Assets menu');
      dropdown.innerHTML = digitalInner;
    }
  });

  // Some legacy pages (e.g. `prime.html`) still use plain anchor tags as triggers.
  // Convert those anchors into the same button+dropdown structure as `api.html`.
  document.querySelectorAll('nav a[href="index.html"]').forEach(a => {
    const txt = normalizeText(a.textContent).toLowerCase();
    if (!txt.startsWith('platform')) return;
    if (a.closest('.nav-item-wrap') && a.closest('.nav-item-wrap').querySelector('.nav-two-panel-dropdown')) return;

    changed = true;
    const wrap = document.createElement('div');
    wrap.className = 'nav-item-wrap';
    wrap.innerHTML = `
      <button type="button" class="nav-trigger" aria-haspopup="true" aria-expanded="false">Platform <span class="chevron">▾</span></button>
      <div class="nav-dropdown nav-two-panel-dropdown" data-key="platform" role="menu" aria-label="Platform menu"></div>
    `;
    const dropdown = wrap.querySelector('.nav-dropdown');
    dropdown.innerHTML = platformInner;
    a.replaceWith(wrap);
  });

  document.querySelectorAll('nav a[href="digitalassets.html"]').forEach(a => {
    const txt = normalizeText(a.textContent).toLowerCase();
    if (!txt.startsWith('digital assets')) return;
    if (a.closest('.nav-item-wrap') && a.closest('.nav-item-wrap').querySelector('.nav-two-panel-dropdown')) return;

    changed = true;
    const wrap = document.createElement('div');
    wrap.className = 'nav-item-wrap';
    wrap.innerHTML = `
      <button type="button" class="nav-trigger" aria-haspopup="true" aria-expanded="false">Digital Assets <span class="chevron">▾</span></button>
      <div class="nav-dropdown nav-two-panel-dropdown" data-key="digital-assets" role="menu" aria-label="Digital Assets menu"></div>
    `;
    const dropdown = wrap.querySelector('.nav-dropdown');
    dropdown.innerHTML = digitalInner;
    a.replaceWith(wrap);
  });

  return changed;
}

function syncPageOnlyDropdownVisibility() {
  const page = getPageSlug();

  const menuToPage = {
    'RWA menu': 'rwa.html',
    'Prime menu': 'prime.html',
    'Global Payments menu': 'gp.html',
    'Compliance menu': 'compliance.html',
    'Developers menu': 'api.html',
    'Company menu': 'company.html'
  };

  Object.entries(menuToPage).forEach(([ariaLabel, pageFile]) => {
    const menus = document.querySelectorAll(
      `.nav-dropdown[role="menu"][aria-label="${ariaLabel}"], .nav-mega[role="menu"][aria-label="${ariaLabel}"]`
    );
    menus.forEach(menu => {
      if (page !== pageFile) {
        menu.classList.add('kapitor-nav-menu-disabled');
      } else {
        menu.classList.remove('kapitor-nav-menu-disabled');
      }
    });
  });
}

function syncActiveMainNavLink() {
  const page = getPageSlug();
  const knownPages = [
    'rwa.html',
    'prime.html',
    'gp.html',
    'compliance.html',
    'api.html',
    'company.html'
  ];

  document.querySelectorAll('a.nav-link[href], a.nav-main-link[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    const file = href.split('/').pop();
    if (!knownPages.includes(file)) return;

    if (file === page) a.classList.add('active');
    else a.classList.remove('active');
  });
}

function applySectionIdRenamesAndAdditions() {
  const page = getPageSlug();

  // RWA
  if (page === 'rwa.html') {
    const el = document.getElementById('trade-finance-assets');
    if (el) el.id = 'trade-finance';
  }

  // Prime
  if (page === 'prime.html') {
    const el = document.getElementById('treasury-solutions');
    if (el) el.id = 'treasury';
  }

  // Global Payments
  if (page === 'gp.html') {
    const cards = Array.from(document.querySelectorAll('div.rc-card, div.rc-card *'))
      .filter(n => n.classList && n.classList.contains('rc-card'));
    const uniqCards = Array.from(new Set(cards));

    uniqCards.forEach(card => {
      const regionEl = card.querySelector('.rcc-region');
      const region = normalizeText(regionEl && regionEl.textContent).toLowerCase();
      if (!region) return;

      if (region === 'india') card.id = 'india';
      if (region === 'united states') card.id = 'usa';
      if (region === 'europe') card.id = 'europe';
      if (region === 'united kingdom') card.id = 'uk';
      if (region === 'brazil') card.id = 'brazil';
      if (region === 'africa') card.id = 'africa';

      if (region === 'global rail') {
        // #swift scroll target (card wrapper)
        card.id = 'swift';

        // #card-rails scroll target (visa/mcard rail span inside card)
        const visaSpan = Array.from(card.querySelectorAll('span.rcc-rail')).find(s =>
          normalizeText(s.textContent).toLowerCase().includes('visa')
        );
        const mcSpan = Array.from(card.querySelectorAll('span.rcc-rail')).find(s =>
          normalizeText(s.textContent).toLowerCase().includes('mastercard')
        );
        const target = visaSpan || mcSpan;
        if (target) target.id = 'card-rails';
      }
    });
  }

  // Compliance
  if (page === 'compliance.html') {
    const aml = document.getElementById('aml-framework');
    if (aml) aml.id = 'aml';

    const jur = document.getElementById('jurisdiction-controls');
    if (jur) jur.id = 'jurisdiction';

    const audit = document.getElementById('audit-transparency');
    if (audit) audit.id = 'audit';
  }

  // Developers
  if (page === 'api.html') {
    const plItems = Array.from(document.querySelectorAll('.portal-links .pl-item, .pl-item'));
    plItems.forEach(item => {
      const nameEl = item.querySelector('.pl-name');
      const name = normalizeText(nameEl && nameEl.textContent);
      if (!name) return;

      if (name === 'REST Documentation') item.id = 'api-docs';
      if (name === 'SDK Libraries') item.id = 'sdks';
      if (name === 'Authentication Guide') item.id = 'integration';
      if (name === 'Status Page') item.id = 'status';
    });
  }

  // Company
  if (page === 'company.html') {
    const governance = document.getElementById('governance');
    if (governance) governance.id = 'leadership';
  }
}

function applyNavbarDropdownHrefFixes() {
  const page = getPageSlug();

  // RWA dropdown: ensure #trade-finance
  if (page === 'rwa.html') {
    const menu = document.querySelector('.nav-dropdown[role="menu"][aria-label="RWA menu"]');
    if (menu) {
      const links = Array.from(menu.querySelectorAll('a'));
      if (links[5]) {
        links[5].setAttribute('href', '#trade-finance');
        links[5].textContent = 'Trade Finance Assets';
      }
    }
  }

  // Prime dropdown: ensure #treasury
  if (page === 'prime.html') {
    const menu = document.querySelector('.nav-dropdown[role="menu"][aria-label="Prime menu"]');
    if (menu) {
      const links = Array.from(menu.querySelectorAll('a'));
      // Expected order: Custody, FX, Institutional Lending, Treasury Solutions, Compliance Reporting, API Access
      if (links[3]) {
        links[3].setAttribute('href', '#treasury');
        links[3].textContent = 'Treasury Solutions';
      }
    }
  }

  // Global Payments dropdown: ensure per-rail ids.
  if (page === 'gp.html') {
    const menu = document.querySelector('.nav-dropdown[role="menu"][aria-label="Global Payments menu"]');
    if (menu) {
      const links = Array.from(menu.querySelectorAll('a'));
      const wanted = [
        { t: 'India — UPI, IMPS, NEFT, RuPay', h: '#india' },
        { t: 'USA — ACH, FedNow, Wire', h: '#usa' },
        { t: 'Europe — SEPA, SEPA Instant', h: '#europe' },
        { t: 'UK — Faster Payments', h: '#uk' },
        { t: 'Brazil — PIX', h: '#brazil' },
        { t: 'Africa — Mobile Money', h: '#africa' },
        { t: 'SWIFT', h: '#swift' },
        { t: 'Visa & Mastercard', h: '#card-rails' }
      ];
      wanted.forEach((w, idx) => {
        if (!links[idx]) return;
        links[idx].textContent = w.t;
        links[idx].setAttribute('href', w.h);
      });
    }
  }

  // Compliance dropdown ids.
  if (page === 'compliance.html') {
    const menu = document.querySelector(
      '.nav-dropdown[role="menu"][aria-label="Compliance menu"]'
    );
    if (menu) {
      const links = Array.from(menu.querySelectorAll('a'));
      // Expected order: KYC, KYB, AML Framework, Risk Profiling, Jurisdiction Controls, Investment Limits, Audit & Transparency, Proof of Reserves
      if (links[2]) links[2].setAttribute('href', '#aml');
      if (links[4]) links[4].setAttribute('href', '#jurisdiction');
      if (links[6]) links[6].setAttribute('href', '#audit');
    }
  }

  // Developers dropdown ids.
  if (page === 'api.html') {
    const menu = document.querySelector('.nav-dropdown[role="menu"][aria-label="Developers menu"]');
    if (menu) {
      const links = Array.from(menu.querySelectorAll('a'));
      // Expected order: API Documentation, SDKs, Sandbox, Integration Guides, Status Page
      const wanted = ['#api-docs', '#sdks', '#sandbox', '#integration', '#status'];
      wanted.forEach((href, idx) => {
        if (!links[idx]) return;
        links[idx].setAttribute('href', href);
      });
    }
  }

  // Company dropdown ids.
  if (page === 'company.html') {
    const menu = document.querySelector('.nav-dropdown[role="menu"][aria-label="Company menu"]');
    if (menu) {
      const links = Array.from(menu.querySelectorAll('a'));
      // Expected order: About Kapitor, Leadership, Security Architecture, Regulatory Framework, Careers, Media & Press, Contact
      if (links[1]) {
        links[1].setAttribute('href', '#leadership');
        links[1].textContent = 'Leadership';
      }
    }
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Runtime DOM tweak: wrap only visible trigger text in `.nav-text`.
 * This lets us attach precise hover listeners that open dropdowns
 * only when the cursor is over the text itself.
 */
function ensureNavTextSpans() {
  // Platform / Digital Assets triggers (buttons)
  document.querySelectorAll('button.nav-trigger').forEach(btn => {
    if (btn.querySelector('.nav-text')) return;

    const chevron = btn.querySelector('.chevron');
    const chevronHtml = chevron
      ? chevron.outerHTML
      : '<span class="chevron">▾</span>';

    // Remove chevron text from the button label.
    let label = btn.textContent || '';
    if (chevron && chevron.textContent) {
      label = label.replace(chevron.textContent, '');
    }
    label = normalizeText(label);
    if (!label) return;

    btn.innerHTML = `<span class="nav-text">${escapeHtml(label)}</span>${chevronHtml}`;
  });

  // Other nav triggers (anchors)
  document
    .querySelectorAll('a.nav-link[href], a.nav-main-link[href]')
    .forEach(a => {
      if (a.querySelector('.nav-text')) return;
      const label = normalizeText(a.textContent || '');
      if (!label) return;
      a.innerHTML = `<span class="nav-text">${escapeHtml(label)}</span>`;
    });
}

function initNavbarTextOnlyDropdownTriggers() {
  const closeTimers = new WeakMap(); // dropdown -> timer id
  const processedDropdowns = new WeakSet();
  const DROPDOWN_TIMEOUT = 2000;
  let autoCloseTimer = null;

  function isAutoCloseEligible(dropdown) {
    if (!dropdown) return false;
    if (dropdown.classList.contains('kapitor-nav-menu-disabled')) return false;

    const page = getPageSlug();
    const aria = dropdown.getAttribute('aria-label') || '';
    if (aria === 'Platform menu' || aria === 'Digital Assets menu') return true;
    const wantedPageByAria = {
      'RWA menu': 'rwa.html',
      'Prime menu': 'prime.html',
      'Global Payments menu': 'gp.html',
      'Compliance menu': 'compliance.html',
      'Developers menu': 'api.html',
      'Company menu': 'company.html'
    };
    const wanted = wantedPageByAria[aria];
    return Boolean(wanted && page === wanted);
  }

  function cancelAutoClose() {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }

  function startAutoClose(dropdown) {
    if (!dropdown || !isAutoCloseEligible(dropdown)) return;
    cancelAutoClose();
    autoCloseTimer = setTimeout(() => {
      const navItemWrap = dropdown.closest('.nav-item-wrap');
      dropdown.classList.remove('is-open');
      if (navItemWrap) navItemWrap.classList.remove('dropdown-open');
      autoCloseTimer = null;
    }, DROPDOWN_TIMEOUT);
  }

  function resetAutoClose(dropdown) {
    startAutoClose(dropdown);
  }

  function closeAllDropdowns() {
    cancelAutoClose();
    document.querySelectorAll('.nav-dropdown.is-open').forEach(dropdown => {
      dropdown.classList.remove('is-open');
      delete dropdown.dataset.pinned;
    });
    document.querySelectorAll('.nav-item-wrap.dropdown-open').forEach(wrap => {
      wrap.classList.remove('dropdown-open');
    });
    // Keep mobile two-panel behavior consistent with existing `.open` toggles.
    document.querySelectorAll('.nav-item-wrap.open').forEach(wrap => {
      wrap.classList.remove('open');
    });
  }

  function openDropdown(dropdown, navItemWrap, openedByClick) {
    if (!dropdown || !navItemWrap) return;
    if (dropdown.classList.contains('kapitor-nav-menu-disabled')) return;

    closeAllDropdowns();
    dropdown.classList.add('is-open');
    navItemWrap.classList.add('dropdown-open');

    startAutoClose(dropdown);

    if (openedByClick) dropdown.dataset.pinned = '1';
    else delete dropdown.dataset.pinned;
  }

  function getAssociated(navText) {
    const navItemWrap = navText.closest('.nav-item-wrap');
    if (!navItemWrap) return { navItemWrap: null, dropdown: null };
    const dropdown = navItemWrap.querySelector('.nav-dropdown');
    return { navItemWrap, dropdown };
  }

  document.querySelectorAll('.nav-text').forEach(navText => {
    const { navItemWrap, dropdown } = getAssociated(navText);
    if (!navItemWrap || !dropdown) return;

    // Initialize dropdown listeners once per dropdown element.
    if (!processedDropdowns.has(dropdown)) {
      processedDropdowns.add(dropdown);
      let lastMove = null;
      let lastResetAt = 0;

      // Cancel close timer if cursor enters dropdown.
      dropdown.addEventListener('mouseenter', () => {
        const t = closeTimers.get(dropdown);
        if (t) clearTimeout(t);
        closeTimers.delete(dropdown);
        resetAutoClose(dropdown);
      });

      // Reset timer while user moves inside dropdown panel.
      dropdown.addEventListener('mousemove', e => {
        // Avoid keeping the dropdown open forever due to 1px trackpad jitter.
        if (typeof e?.clientX !== 'number' || typeof e?.clientY !== 'number') {
          resetAutoClose(dropdown);
          return;
        }
        if (lastMove) {
          const dx = Math.abs(e.clientX - lastMove.x);
          const dy = Math.abs(e.clientY - lastMove.y);
          // Trackpad jitter can fire frequent mousemove events.
          // Only treat it as "intentional" if the move is large enough.
          if (dx < 4 && dy < 4) return;
        }
        lastMove = { x: e.clientX, y: e.clientY };
        const now = Date.now();
        // Throttle timer resets so it still auto-closes even if the pointer
        // produces continuous micro-movements while the user reads.
        if (now - lastResetAt < 350) return;
        lastResetAt = now;
        resetAutoClose(dropdown);
      });

      // When cursor leaves dropdown, start auto-close countdown.
      dropdown.addEventListener('mouseleave', () => {
        startAutoClose(dropdown);
      });

      // Clicking submenu items should close (navigation will happen next).
      dropdown.addEventListener(
        'click',
        e => {
          if (e.target && e.target.closest('a')) {
            cancelAutoClose();
            closeAllDropdowns();
          }
        },
        true
      );
    }

    // Text-only hover open.
    navText.addEventListener('mouseenter', () => {
      openDropdown(dropdown, navItemWrap, false);
    });

    // Text-only hover leave: close after 120ms unless cursor is over dropdown.
    navText.addEventListener('mouseleave', () => {
      if (dropdown.dataset.pinned === '1') return;

      const existing = closeTimers.get(dropdown);
      if (existing) clearTimeout(existing);

      const t = setTimeout(() => {
        if (!dropdown.matches(':hover')) {
          dropdown.classList.remove('is-open');
          navItemWrap.classList.remove('dropdown-open');
        }
        closeTimers.delete(dropdown);
      }, 120);

      closeTimers.set(dropdown, t);
    });

    // Text-only click to support touch/mobile.
    navText.addEventListener('click', e => {
      // If dropdown isn't available on this page, keep normal navigation.
      if (dropdown.classList.contains('kapitor-nav-menu-disabled')) return;

      const anchor = navText.closest('a[href]');
      if (anchor) e.preventDefault();

      openDropdown(dropdown, navItemWrap, true);
    });
  });

  // Click outside to close.
  document.addEventListener('click', e => {
    const insideNav = e.target && e.target.closest('.nav-item-wrap');
    if (!insideNav) closeAllDropdowns();
  });

  // Escape key closes dropdown.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
}

function initKapitorNavbar() {
  // 1) Ensure two-panel Platform/Digital Assets dropdown markup exists everywhere.
  const twoPanelChanged = injectTwoPanelDropdowns();

  // 2) If we injected/updated tabs + panels, re-init the two-panel behavior.
  if (twoPanelChanged && typeof initTwoPanelNavDropdowns === 'function') {
    initTwoPanelNavDropdowns();
  }

  // 3) Apply dropdown visibility gating for page-only menus.
  syncPageOnlyDropdownVisibility();

  // 4) Highlight the active main nav link based on pathname.
  syncActiveMainNavLink();

  // 5) Align page-only dropdown hrefs + section ids for anchor scrolling.
  applyNavbarDropdownHrefFixes();
  applySectionIdRenamesAndAdditions();

  // 6) Text-only hover triggers for ALL navbar dropdowns.
  ensureNavTextSpans();
  initNavbarTextOnlyDropdownTriggers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKapitorNavbar);
} else {
  initKapitorNavbar();
}

