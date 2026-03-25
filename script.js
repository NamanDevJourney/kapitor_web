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
const TWO_PANEL_MENU_CONFIG = {
  platform: {
    wallet: {
      page: 'kapitor-smart-wallet.html',
      rightAnchors: ['#fiat', '#crypto', '#tokens', '#ledger', '#security']
    },
    pay: {
      page: 'kapitor-pay.html',
      rightAnchors: ['#transfers', '#p2p', '#cards', '#payroll', '#settlement', '#gbps']
    },
    trade: {
      page: 'kapitor-trade.html',
      rightAnchors: ['#spot', '#swaps', '#derivatives', '#otc', '#risk']
    },
    earn: {
      page: 'kapitor-earn.html',
      rightAnchors: ['#strat-conservative', '#strat-balanced', '#strat-growth', '#sources', '#reporting']
    },
    stake: {
      page: 'kapitor-stake.html',
      rightAnchors: ['#eth-liquid-staking', '#sol-staking', '#dot-staking', '#atom-staking', '#layers']
    },
    vaults: {
      page: 'kapitor-vaults.html',
      rightAnchors: [
        '#stable-income-vault',
        '#btc-vault',
        '#bond-backed-vault',
        '#trade-finance-vault',
        '#capital-protected-vault'
      ]
    }
  },
  'digital-assets': {
    kaloft: {
      page: 'kaloft-ept.html',
      rightAnchors: ['#epm', '#pools', '#lock', '#nav-tracking', '#redemption']
    },
    katoin: {
      page: 'katoin.html',
      rightAnchors: ['#tokenization', '#trade-levels', '#profit', '#flow']
    },
    eqouin: {
      page: 'digitalassets.html',
      rightAnchors: ['#valuation', '#dividends', '#appreciation', '#market']
    },
    kfi: {
      page: 'kfi.html',
      rightAnchors: [
        '#bank-guarantees',
        '#sblc',
        '#letter-of-credit',
        '#performance-guarantees',
        '#issuance',
        '#blockchain'
      ]
    }
  }
};

function initTwoPanelNavDropdowns() {
  const isMobile = () => window.innerWidth <= 767;

  document.querySelectorAll('.nav-two-panel-dropdown').forEach(dropdown => {
    // Avoid re-registering handlers if this function runs multiple times.
    if (dropdown.dataset.twoPanelInit === '1') return;
    dropdown.dataset.twoPanelInit = '1';

    const tabs = dropdown.querySelectorAll('.nav-two-panel-tab');
    const panels = dropdown.querySelectorAll('.nav-two-panel-panel');
    if (!tabs.length || !panels.length) return;

    const menuKey = dropdown.getAttribute('data-key') || '';
    const menuCfg = TWO_PANEL_MENU_CONFIG[menuKey] || {};

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

    // Route-aware default:
    // - If the current URL belongs to one of the mega-menu pages, highlight that left-tab.
    // - Otherwise, fall back to the existing `is-active` state (in markup) or the first tab.
    const page = getPageSlug();
    let routeActiveKey = null;
    Object.entries(menuCfg).forEach(([key, cfg]) => {
      if (cfg && cfg.page === page) routeActiveKey = key;
    });

    if (routeActiveKey) {
      setActive(routeActiveKey);
    } else {
      const initialTab = dropdown.querySelector('.nav-two-panel-tab.is-active') || tabs[0];
      const initialKey = initialTab && initialTab.getAttribute('data-key');
      if (initialKey) setActive(initialKey);
    }

    tabs.forEach(tab => {
      const key = tab.getAttribute('data-key');
      tab.addEventListener('mouseenter', () => {
        if (!isMobile()) setActive(key);
      });
      tab.addEventListener('focus', () => {
        if (!isMobile()) setActive(key);
      });
      tab.addEventListener('click', () => {
        // Industry behavior: left panel click navigates to that product page.
        const page = menuCfg[key] && menuCfg[key].page;
        if (page) window.location.href = page;
        else setActive(key);
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

function applyTwoPanelRightPanelLinkAnchors() {
  // Update right-panel hrefs to include #section anchors on *all* pages,
  // even those that already contain the mega-menu markup in their HTML.
  document.querySelectorAll('.nav-two-panel-dropdown[data-key]').forEach(dropdown => {
    const menuKey = dropdown.getAttribute('data-key');
    const menuCfg = TWO_PANEL_MENU_CONFIG[menuKey];
    if (!menuCfg) return;

    dropdown.querySelectorAll('.nav-two-panel-panel[data-key]').forEach(panel => {
      const panelKey = panel.getAttribute('data-key');
      const catCfg = menuCfg[panelKey];
      if (!catCfg) return;

      const links = panel.querySelectorAll('a[href]');
      links.forEach((a, idx) => {
        const href = a.getAttribute('href') || '';
        if (href.includes('#')) return; // already anchored
        const anchor = catCfg.rightAnchors[idx];
        if (!anchor) return;
        a.setAttribute('href', `${catCfg.page}${anchor}`);
      });
    });
  });
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
          <a href="kapitor-smart-wallet.html#fiat">Multi-Currency Fiat</a>
          <a href="kapitor-smart-wallet.html#crypto">Crypto &amp; Stablecoins</a>
          <a href="kapitor-smart-wallet.html#tokens">Token Holdings (Kaloft, Katoin, EQOUIN, KFI)</a>
          <a href="kapitor-smart-wallet.html#ledger">Unified Ledger Architecture</a>
          <a href="kapitor-smart-wallet.html#security">Security Framework</a>
        </div>
        <div class="nav-two-panel-panel" data-key="pay" role="tabpanel" aria-hidden="true">
          <a href="kapitor-pay.html#transfers">Global Transfers</a>
          <a href="kapitor-pay.html#p2p">QR &amp; P2P</a>
          <a href="kapitor-pay.html#cards">Cards &amp; Virtual Cards</a>
          <a href="kapitor-pay.html#payroll">Salary &amp; Payroll</a>
          <a href="kapitor-pay.html#settlement">International Settlement</a>
          <a href="kapitor-pay.html#gbps">Global Bill Payment System (GBPS)</a>
        </div>
        <div class="nav-two-panel-panel" data-key="trade" role="tabpanel" aria-hidden="true">
          <a href="kapitor-trade.html#spot">Spot Markets</a>
          <a href="kapitor-trade.html#swaps">Swaps &amp; Liquidity Routing</a>
          <a href="kapitor-trade.html#derivatives">Derivatives</a>
          <a href="kapitor-trade.html#otc">OTC Desk</a>
          <a href="kapitor-trade.html#risk">Risk Engine</a>
        </div>
        <div class="nav-two-panel-panel" data-key="earn" role="tabpanel" aria-hidden="true">
          <a href="kapitor-earn.html#strat-conservative">Conservative Strategy</a>
          <a href="kapitor-earn.html#strat-balanced">Balanced Strategy</a>
          <a href="kapitor-earn.html#strat-growth">Growth Strategy</a>
          <a href="kapitor-earn.html#sources">Yield Sources</a>
          <a href="kapitor-earn.html#reporting">Performance Reporting</a>
        </div>
        <div class="nav-two-panel-panel" data-key="stake" role="tabpanel" aria-hidden="true">
          <a href="kapitor-stake.html#eth-liquid-staking">ETH Liquid Staking</a>
          <a href="kapitor-stake.html#sol-staking">SOL Staking</a>
          <a href="kapitor-stake.html#dot-staking">DOT Staking</a>
          <a href="kapitor-stake.html#atom-staking">ATOM Staking</a>
          <a href="kapitor-stake.html#layers">Layered Yield Model</a>
        </div>
        <div class="nav-two-panel-panel" data-key="vaults" role="tabpanel" aria-hidden="true">
          <a href="kapitor-vaults.html#stable-income-vault">Stable Income Vault</a>
          <a href="kapitor-vaults.html#btc-vault">Bitcoin Yield Vault</a>
          <a href="kapitor-vaults.html#bond-backed-vault">Bond-Backed Vault</a>
          <a href="kapitor-vaults.html#trade-finance-vault">Trade Finance Vault</a>
          <a href="kapitor-vaults.html#capital-protected-vault">Capital Protected Vault</a>
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
          <a href="kaloft-ept.html#epm">Economic Participation Model</a>
          <a href="kaloft-ept.html#pools">Pool Structures (1M–100M)</a>
          <a href="kaloft-ept.html#lock">Lock Periods (1Y / 3Y / 5Y)</a>
          <a href="kaloft-ept.html#nav-tracking">NAV Tracking</a>
          <a href="kaloft-ept.html#redemption">Redemption Framework</a>
        </div>
        <div class="nav-two-panel-panel" data-key="katoin" role="tabpanel" aria-hidden="true">
          <a href="katoin.html#tokenization">Commodity Tokenization</a>
          <a href="katoin.html#trade-levels">Trade Levels</a>
          <a href="katoin.html#profit">Profit Distribution Logic</a>
          <a href="katoin.html#flow">Global Commodity Flow</a>
        </div>
        <div class="nav-two-panel-panel" data-key="eqouin" role="tabpanel" aria-hidden="true">
          <a href="digitalassets.html#valuation">Valuation Mechanism</a>
          <a href="digitalassets.html#dividends">Dividend Distribution</a>
          <a href="digitalassets.html#appreciation">Capital Appreciation Model</a>
          <a href="digitalassets.html#market">Internal Trading Market</a>
        </div>
        <div class="nav-two-panel-panel" data-key="kfi" role="tabpanel" aria-hidden="true">
          <a href="kfi.html#bank-guarantees">Bank Guarantees (BG)</a>
          <a href="kfi.html#sblc">SBLC</a>
          <a href="kfi.html#letter-of-credit">Letter of Credit (LC)</a>
          <a href="kfi.html#performance-guarantees">Performance Guarantees</a>
          <a href="kfi.html#issuance">Digital Issuance</a>
          <a href="kfi.html#blockchain">Blockchain Record</a>
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

function resetTwoPanelActiveToRoute(dropdown) {
  if (!dropdown || !dropdown.classList.contains('nav-two-panel-dropdown')) return;
  const menuKey = dropdown.getAttribute('data-key') || '';
  const menuCfg = TWO_PANEL_MENU_CONFIG[menuKey];
  if (!menuCfg) return;

  const tabs = dropdown.querySelectorAll('.nav-two-panel-tab');
  if (!tabs.length) return;

  const page = getPageSlug();
  let activeKey = null;
  Object.entries(menuCfg).forEach(([key, cfg]) => {
    if (cfg && cfg.page === page) activeKey = key;
  });
  // If the current route doesn't belong to this mega-menu,
  // reset to a stable default (the first left-panel tab).
  if (!activeKey) activeKey = tabs[0].getAttribute('data-key');

  const panels = dropdown.querySelectorAll('.nav-two-panel-panel');
  if (!panels.length) return;

  tabs.forEach(tab => {
    const on = tab.getAttribute('data-key') === activeKey;
    tab.classList.toggle('is-active', on);
    tab.setAttribute('aria-selected', on ? 'true' : 'false');
  });

  panels.forEach(panel => {
    const on = panel.getAttribute('data-key') === activeKey;
    panel.classList.toggle('is-active', on);
    panel.setAttribute('aria-hidden', on ? 'false' : 'true');
  });
}

function initNavbarTextOnlyDropdownTriggers() {
  const closeTimers = new WeakMap(); // dropdown -> timer id
  const processedDropdowns = new WeakSet();
  // Hover intent: start close timer when leaving trigger/dropdown.
  // Close delay should be short enough to feel responsive, but long enough
  // to avoid flicker while moving between text and the dropdown panel.
  const CLOSE_DELAY = 650;

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

  function clearCloseTimer(dropdown) {
    const t = closeTimers.get(dropdown);
    if (t) clearTimeout(t);
    closeTimers.delete(dropdown);
  }

  function cancelAutoClose() {
    document.querySelectorAll('.nav-dropdown.is-open').forEach(d => {
      clearCloseTimer(d);
    });
  }

  function closeAllDropdowns() {
    cancelAutoClose();
    document.querySelectorAll('.nav-dropdown.is-open').forEach(dropdown => {
      clearCloseTimer(dropdown);
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

  function scheduleClose(dropdown, navItemWrap) {
    if (!dropdown || !navItemWrap) return;
    if (dropdown.dataset.pinned === '1') return;
    if (!isAutoCloseEligible(dropdown)) return;

    clearCloseTimer(dropdown);
    const t = setTimeout(() => {
      // If the pointer is currently hovering the dropdown, do not close.
      // This prevents accidental closure while reading the menu contents.
      if (dropdown.matches(':hover')) return;

      dropdown.classList.remove('is-open');
      navItemWrap.classList.remove('dropdown-open');
      closeTimers.delete(dropdown);
    }, CLOSE_DELAY);
    closeTimers.set(dropdown, t);
  }

  function openDropdown(dropdown, navItemWrap, openedByClick) {
    if (!dropdown || !navItemWrap) return;
    if (dropdown.classList.contains('kapitor-nav-menu-disabled')) return;

    closeAllDropdowns();
    dropdown.classList.add('is-open');
    navItemWrap.classList.add('dropdown-open');

    // Route-aware mega dropdown default:
    // Every time the user opens Platform/Digital Assets, ensure the right panel
    // shows the sections for the current route/page by default.
    resetTwoPanelActiveToRoute(dropdown);

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

      // Cancel close timer if cursor enters dropdown.
      dropdown.addEventListener('mouseenter', () => {
        clearCloseTimer(dropdown);
      });
      // Cancel close timer if keyboard focus enters dropdown.
      dropdown.addEventListener('focusin', () => {
        clearCloseTimer(dropdown);
      });

      // When cursor leaves dropdown, start auto-close countdown.
      dropdown.addEventListener('mouseleave', () => {
        const navItemWrap = dropdown.closest('.nav-item-wrap');
        scheduleClose(dropdown, navItemWrap);
      });
      // When keyboard focus leaves dropdown, start the same delayed close.
      dropdown.addEventListener('focusout', () => {
        const navItemWrap = dropdown.closest('.nav-item-wrap');
        setTimeout(() => {
          if (!navItemWrap) return;
          if (!dropdown.contains(document.activeElement)) {
            scheduleClose(dropdown, navItemWrap);
          }
        }, 0);
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
      clearCloseTimer(dropdown);
    });

    // Keyboard: open dropdown on focus, close it on blur (with delay).
    const triggerEl = navText.closest('button.nav-trigger, a.nav-link, a.nav-main-link');
    if (triggerEl) {
      triggerEl.addEventListener('focus', () => {
        // On mobile, treat these as navigation-only links to avoid
        // auto-opening dropdowns when the sidebar opens/focus changes.
        if (window.innerWidth <= 767) return;
        openDropdown(dropdown, navItemWrap, false);
        clearCloseTimer(dropdown);
      });
      triggerEl.addEventListener('blur', () => {
        scheduleClose(dropdown, navItemWrap);
      });
    }

    // Text-only hover leave: close after a short delay unless cursor enters dropdown.
    navText.addEventListener('mouseleave', () => {
      scheduleClose(dropdown, navItemWrap);
    });

    // Text-only click to support touch/mobile.
    navText.addEventListener('click', e => {
      // If dropdown isn't available on this page, keep normal navigation.
      if (dropdown.classList.contains('kapitor-nav-menu-disabled')) return;

      const anchor = navText.closest('a[href]');
      if (anchor) {
        // Main navbar item click must navigate to its page (not open the dropdown).
        closeAllDropdowns();
        return;
      }

      // For non-anchor triggers (Platform/Digital Assets), allow tap/click to open/close.
      if (dropdown.classList.contains('is-open') && dropdown.dataset.pinned === '1') {
        closeAllDropdowns();
        return;
      }
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
  // Guarantee mobile sidebar is closed on every page load.
  // Some pages use different header ids (`hdr` vs `main-header`), so we reset globally.
  document.body.classList.remove('kapitor-mobile-nav-open');
  document.body.style.overflow = '';
  document.querySelectorAll('.kapitor-mobile-sidebar').forEach(el => el.remove());
  document.querySelectorAll('header.header-mobile-open').forEach(h => {
    h.classList.remove('header-mobile-open');
  });
  // Remove any backdrops created by our mobile logic.
  document.querySelectorAll('.nav-mobile-backdrop').forEach(el => el.remove());
  // Unlock body scroll if we were previously locking it.
  if (document.body && document.body.style.overflow === 'hidden') {
    document.body.style.overflow = '';
  }
  // Close any open dropdowns (prevents leftover open state on reload/back-forward cache).
  document.querySelectorAll('.nav-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  document.querySelectorAll('.nav-item-wrap.open').forEach(w => w.classList.remove('open'));
  document.querySelectorAll('.nav-item-wrap.dropdown-open').forEach(w => w.classList.remove('dropdown-open'));

  // Close mobile sidebar variants (some pages use `nav.nav-wrap.is-open` instead of header class).
  document.querySelectorAll('nav.nav-wrap.is-open').forEach(n => n.classList.remove('is-open'));
  document.querySelectorAll('.nav-mobile-toggle[aria-expanded="true"]').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });

  // 1) Ensure two-panel Platform/Digital Assets dropdown markup exists everywhere.
  const twoPanelChanged = injectTwoPanelDropdowns();

  // 2) If we injected/updated tabs + panels, re-init the two-panel behavior.
  if (twoPanelChanged && typeof initTwoPanelNavDropdowns === 'function') {
    initTwoPanelNavDropdowns();
  }

  // 2.5) Ensure right-panel links include anchors on all pages.
  applyTwoPanelRightPanelLinkAnchors();

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

  // Mobile UX: close the whole nav menu when a user taps a link,
  // taps outside the menu, or presses Escape.
  initMobileNavMenuClose();
}

function initMobileNavMenuClose() {
  const header =
    document.getElementById('hdr') ||
    document.querySelector('header#hdr') ||
    document.getElementById('main-header') ||
    document.querySelector('header#main-header');
  if (!header) return;

  const mobileToggle = header.querySelector('.nav-mobile-toggle');
  const isMobileView = () => window.innerWidth <= 767;

  // Mobile-only: build a dedicated off-canvas sidebar overlay controlled by a local state.
  // This avoids conflicts with per-page inline hamburger scripts and CSS.
  if (!mobileToggle) return;

  let sidebarOpen = false;
  let openDropdown = null; // 'platform' | 'digital' | null
  let overlayBackdropEl = null;
  let overlaySidebarEl = null;
  let autoCloseTimer = null;

  const HREFS = {
    platform: 'index.html',
    digital: 'digitalassets.html',
    rwa: 'rwa.html',
    prime: 'prime.html',
    globalPayments: 'gp.html',
    compliance: 'compliance.html',
    developers: 'api.html',
    company: 'company.html'
  };

  const PLATFORM_SUBS = [
    { label: 'Smart Wallet', href: 'kapitor-smart-wallet.html' },
    { label: 'Pay', href: 'kapitor-pay.html' },
    { label: 'Trade', href: 'kapitor-trade.html' },
    { label: 'Earn', href: 'kapitor-earn.html' },
    { label: 'Stake', href: 'kapitor-stake.html' },
    { label: 'Vaults', href: 'kapitor-vaults.html' }
  ];

  const DIGITAL_SUBS = [
    { label: 'Kaloft (EPT)', href: 'kaloft-ept.html' },
    { label: 'Katoin', href: 'katoin.html' },
    { label: 'EQOUIN', href: 'digitalassets.html' },
    { label: 'KFI', href: 'kfi.html' }
  ];

  function clearAutoCloseTimer() {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }

  function startAutoCloseTimer() {
    clearAutoCloseTimer();
    autoCloseTimer = setTimeout(() => {
      closeOverlaySidebar({ skipAnimation: false });
    }, 5000);
  }

  function registerInteractionAndResetTimer() {
    // Any interaction inside the sidebar should reset the auto-close countdown.
    if (!sidebarOpen) return;
    startAutoCloseTimer();
  }

  function closeOverlaySidebar(opts) {
    const { skipAnimation } = opts || {};
    sidebarOpen = false;
    openDropdown = null;
    clearAutoCloseTimer();
    document.body.classList.remove('kapitor-mobile-nav-open');
    document.body.style.overflow = '';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');

    const backdrop = overlayBackdropEl;
    const sidebar = overlaySidebarEl;

    overlayBackdropEl = null;
    overlaySidebarEl = null;

    if (backdrop) backdrop.remove();

    if (!sidebar) return;

    if (skipAnimation) {
      sidebar.remove();
      return;
    }

    // Animate out then remove.
    sidebar.classList.remove('is-open');
    setTimeout(() => {
      try {
        sidebar.remove();
      } catch (e) {
        // ignore
      }
    }, 220);
  }

  function updateOverlayDropdownPanels() {
    if (!overlaySidebarEl) return;
    const platformPanel = overlaySidebarEl.querySelector('[data-kapitor-dropdown-panel="platform"]');
    const digitalPanel = overlaySidebarEl.querySelector('[data-kapitor-dropdown-panel="digital"]');
    const platformOpen = openDropdown === 'platform';
    const digitalOpen = openDropdown === 'digital';
    if (platformPanel) platformPanel.style.display = platformOpen ? 'flex' : 'none';
    if (digitalPanel) digitalPanel.style.display = digitalOpen ? 'flex' : 'none';

    const tPlatform = overlaySidebarEl.querySelector('[data-kapitor-dropdown-toggle="platform"]');
    const tDigital = overlaySidebarEl.querySelector('[data-kapitor-dropdown-toggle="digital"]');
    if (tPlatform) tPlatform.setAttribute('aria-expanded', platformOpen ? 'true' : 'false');
    if (tDigital) tDigital.setAttribute('aria-expanded', digitalOpen ? 'true' : 'false');
  }

  function buildOverlaySidebar() {
    overlaySidebarEl = document.createElement('nav');
    overlaySidebarEl.className = 'kapitor-mobile-sidebar';
    overlaySidebarEl.setAttribute('aria-label', 'Mobile navigation');

    // Header row: logo + close button.
    const topRow = document.createElement('div');
    topRow.className = 'kapitor-mobile-sidebar-top';

    const logoWrap = document.createElement('a');
    logoWrap.className = 'kapitor-mobile-sidebar-logo';
    logoWrap.href = 'index.html';
    logoWrap.innerHTML = '';
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/kapitor.svg';
    logoImg.alt = 'Kapitor';
    const logoText = document.createElement('span');
    logoText.className = 'logo-text';
    logoText.textContent = 'Kapitor';
    logoWrap.appendChild(logoImg);
    logoWrap.appendChild(logoText);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'kapitor-mobile-sidebar-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      clearAutoCloseTimer();
      closeOverlaySidebar({ skipAnimation: false });
    });

    topRow.appendChild(logoWrap);
    topRow.appendChild(closeBtn);

    const linksWrap = document.createElement('div');
    linksWrap.className = 'kapitor-mobile-links';

    function addParentWithDropdown(opts) {
      const { key, label, href, subs } = opts;

      const parentRow = document.createElement('div');
      parentRow.className = 'kapitor-mobile-parent-row';

      const parentLink = document.createElement('a');
      parentLink.className = 'kapitor-mobile-link';
      parentLink.href = href;
      parentLink.textContent = label;
      parentLink.addEventListener('click', () => closeOverlaySidebar({ skipAnimation: true }));

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'kapitor-mobile-dropdown-toggle';
      toggleBtn.setAttribute('data-kapitor-dropdown-toggle', key === 'platform' ? 'platform' : 'digital');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-controls', `kapitor-panel-${key}`);
      toggleBtn.textContent = '▾';
      toggleBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        registerInteractionAndResetTimer();
        const newVal = openDropdown === (key === 'platform' ? 'platform' : 'digital')
          ? null
          : (key === 'platform' ? 'platform' : 'digital');
        openDropdown = newVal;
        updateOverlayDropdownPanels();
      });

      parentRow.appendChild(parentLink);
      parentRow.appendChild(toggleBtn);
      linksWrap.appendChild(parentRow);

      const subPanel = document.createElement('div');
      subPanel.className = 'kapitor-mobile-sublist';
      subPanel.setAttribute('data-kapitor-dropdown-panel', key === 'platform' ? 'platform' : 'digital');
      subPanel.style.display = 'none';

      subs.forEach(s => {
        const subA = document.createElement('a');
        subA.className = 'kapitor-mobile-subitem';
        subA.href = s.href;
        subA.textContent = s.label;
        subA.addEventListener('click', () => closeOverlaySidebar({ skipAnimation: true }));
        subPanel.appendChild(subA);
      });

      linksWrap.appendChild(subPanel);
    }

    addParentWithDropdown({
      key: 'platform',
      label: 'Platform',
      href: HREFS.platform,
      subs: PLATFORM_SUBS
    });

    addParentWithDropdown({
      key: 'digital',
      label: 'Digital Assets',
      href: HREFS.digital,
      subs: DIGITAL_SUBS
    });

    const simpleLinks = [
      { label: 'RWA', href: HREFS.rwa },
      { label: 'Prime', href: HREFS.prime },
      { label: 'Global Payments', href: HREFS.globalPayments },
      { label: 'Compliance', href: HREFS.compliance },
      { label: 'Developers', href: HREFS.developers },
      { label: 'Company', href: HREFS.company }
    ];

    simpleLinks.forEach(l => {
      const a = document.createElement('a');
      a.className = 'kapitor-mobile-link';
      a.href = l.href;
      a.textContent = l.label;
      a.addEventListener('click', () => closeOverlaySidebar({ skipAnimation: true }));
      linksWrap.appendChild(a);
    });

    const divider = document.createElement('div');
    divider.className = 'kapitor-mobile-divider';

    const actions = document.createElement('div');
    actions.className = 'kapitor-mobile-actions';

    // Clone Login + Global selector from the desktop header.
    const sourceActions = header.querySelector('.hdr-right') || header.querySelector('.header-right');
    if (sourceActions) {
      const region = sourceActions.querySelector('select.region');
      const loginBtn =
        sourceActions.querySelector('button.btn-ghost') ||
        Array.from(sourceActions.querySelectorAll('button')).find(b => normalizeText(b.textContent).toLowerCase() === 'login');

      if (region) actions.appendChild(region.cloneNode(true));
      if (loginBtn) {
        const loginClone = loginBtn.cloneNode(true);
        loginClone.addEventListener('click', () => closeOverlaySidebar({ skipAnimation: true }));
        actions.appendChild(loginClone);
      }
    }

    overlaySidebarEl.appendChild(topRow);
    overlaySidebarEl.appendChild(linksWrap);
    overlaySidebarEl.appendChild(divider);
    overlaySidebarEl.appendChild(actions);

    document.body.appendChild(overlaySidebarEl);

    // Any click inside the sidebar counts as interaction (resets timer),
    // except link clicks which will close immediately anyway.
    overlaySidebarEl.addEventListener(
      'click',
      e => {
        const t = e.target;
        if (!t) return;
        const clickedLink = t.closest && t.closest('a[href]');
        if (clickedLink) return;
        const clickedButton = t.closest && t.closest('button');
        if (clickedButton) registerInteractionAndResetTimer();
      },
      true
    );
  }

  function openOverlaySidebar() {
    if (sidebarOpen) return;
    sidebarOpen = true;
    openDropdown = null;
    document.body.classList.add('kapitor-mobile-nav-open');
    document.body.style.overflow = 'hidden';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');

    overlayBackdropEl = document.createElement('div');
    overlayBackdropEl.className = 'kapitor-mobile-backdrop';
    overlayBackdropEl.addEventListener('click', () => {
      clearAutoCloseTimer();
      closeOverlaySidebar({ skipAnimation: false });
    });
    document.body.appendChild(overlayBackdropEl);

    buildOverlaySidebar();
    updateOverlayDropdownPanels();
    // Slide-in animation + start auto-close.
    requestAnimationFrame(() => {
      if (overlaySidebarEl) overlaySidebarEl.classList.add('is-open');
    });
    startAutoCloseTimer();
  }

  function toggleOverlaySidebar() {
    if (sidebarOpen) closeOverlaySidebar({ skipAnimation: false });
    else openOverlaySidebar();
  }

  // Capture-phase handler so it runs before any per-page inline hamburger listeners.
  mobileToggle.addEventListener(
    'click',
    e => {
      if (!isMobileView()) return;
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      toggleOverlaySidebar();
    },
    true
  );

  // Close on route changes.
  window.addEventListener('popstate', () => closeOverlaySidebar({ skipAnimation: true }));
  window.addEventListener('hashchange', () => closeOverlaySidebar({ skipAnimation: true }));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeOverlaySidebar({ skipAnimation: false });
  });

  // Best-effort SPA-style route patch.
  try {
    if (!window.__kapitorOverlaySidebarPatched) {
      window.__kapitorOverlaySidebarPatched = true;
      const origPush = history.pushState;
      const origReplace = history.replaceState;
      history.pushState = function () {
        const ret = origPush.apply(this, arguments);
        if (isMobileView()) closeOverlaySidebar({ skipAnimation: true });
        return ret;
      };
      history.replaceState = function () {
        const ret = origReplace.apply(this, arguments);
        if (isMobileView()) closeOverlaySidebar({ skipAnimation: true });
        return ret;
      };
    }
  } catch (e) {
    // Ignore
  }

  window.addEventListener('pageshow', () => {
    if (!isMobileView()) return;
    closeOverlaySidebar({ skipAnimation: true });
  });

  window.addEventListener('resize', () => {
    if (!isMobileView()) closeOverlaySidebar({ skipAnimation: true });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKapitorNavbar);
} else {
  initKapitorNavbar();
}

