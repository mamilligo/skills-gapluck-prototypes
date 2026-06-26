/**
 * GapLuck - Pricing Tier Cards Component JS
 * Handles dynamic rendering of standard pricing package columns (Free, Premium, Traveler).
 * Strictly avoids em-dash character, uses BEM, supports trilingual toggle.
 */

(function () {
  'use strict';

  // Trilingual dictionary
  const translations = {
    en: {
      free_name: 'Free Account',
      free_desc: 'Unlock product saving, alerts, and more searches with a free account.',
      free_cta: 'Sign up for free',
      premium_name: 'Premium',
      premium_desc: 'Best for smart shoppers looking for maximum savings.',
      premium_cta: 'Upgrade to Premium',
      traveler_name: 'Traveler',
      traveler_desc: 'Best for frequent travelers wanting to earn on baggage space. Lifetime access.',
      traveler_cta: 'Become a Traveler',
      per_month: '/ month',
      one_time: 'one-time',
      popular_badge: 'Popular',
      traveler_badge: 'Earn',
      upgrade_note: 'Upgrade from Premium for {amount} top-up',
      
      // Billing Toggle & Annual Plan
      billing_monthly: 'Monthly',
      billing_annual: 'Yearly',
      save_badge: 'Save 37%',
      effective_monthly: 'effectively {amount} / month',
      per_year: '/ year',

      // Features list
      feat_searches_free: '20 searches per day',
      feat_save_free: 'Save up to 5 products',
      feat_alerts_free: '3 weekly email alerts',
      feat_requests_free: '1 traveler request per month',
      feat_compare_free: 'Top 3+3 countries comparison',
      feat_history_free: '30-day price history',
      feat_shipping: 'Basic shipping calculations',
      
      feat_searches_premium: 'Unlimited searches',
      feat_worldwide_premium: 'Full worldwide comparisons',
      feat_history_premium: 'Full price history (all data)',
      feat_alerts_premium: 'Unlimited saved & instant alerts',
      feat_calculator_premium: 'Multi-scenario calculator',
      feat_requests_premium: '12 traveler requests per month',
      
      feat_premium_included: 'Includes all Premium features',
      feat_routes_traveler: 'Unlimited route listings',
      feat_requests_traveler: 'Accept buyer requests (up to 30/mo)',
      feat_requests_buyer_traveler: '30 buyer requests per month',
      feat_earn_traveler: 'Earn money on baggage space',
      feat_badge_traveler: 'Verified Traveler badge',
      feat_analytics_traveler: 'Traveler analytics dashboard',

      // Tooltips
      tooltip_requests_free: '$5 per additional request',
      tooltip_requests_premium: '$5 per 5 extra requests bundle',
      tooltip_requests_traveler: '$5 per 5 extra requests bundle'
    },
    tr: {
      free_name: 'Ücretsiz Üyelik',
      free_desc: 'Ücretsiz bir hesapla ürün kaydetme, alarm kurma ve daha fazla arama özelliğini açın.',
      free_cta: 'Ücretsiz Kayıt Ol',
      premium_name: 'Premium',
      premium_desc: 'Maksimum tasarruf arayan akıllı alıcılar için idealdir.',
      premium_cta: 'Premium\'a Yükselt',
      traveler_name: 'Gezgin',
      traveler_desc: 'Bagaj alanından kazanmak isteyen sık seyahat edenler için idealdir. Ömür boyu erişim.',
      traveler_cta: 'Gezgin Ol',
      per_month: '/ ay',
      one_time: 'tek seferlik',
      popular_badge: 'Popüler',
      traveler_badge: 'Kazan',
      upgrade_note: 'Premium\'dan {amount} farkla geçiş yapın',
      
      // Billing Toggle & Annual Plan
      billing_monthly: 'Aylık',
      billing_annual: 'Yıllık',
      save_badge: '%37 Tasarruf',
      effective_monthly: 'aylık net {amount}',
      per_year: '/ yıl',

      // Features list
      feat_searches_free: 'Günde 20 arama hakkı',
      feat_save_free: 'En fazla 5 ürün kaydetme',
      feat_alerts_free: '3 haftalık e-posta alarmı',
      feat_requests_free: 'Ayda 1 gezgin talebi',
      feat_compare_free: 'En ucuz 3+3 ülke karşılaştırması',
      feat_history_free: '30 günlük fiyat geçmişi',
      feat_shipping: 'Temel kargo hesaplamaları',
      
      feat_searches_premium: 'Sınırsız arama hakkı',
      feat_worldwide_premium: 'Tüm ülkelerle karşılaştırma',
      feat_history_premium: 'Tüm fiyat geçmişi verileri',
      feat_alerts_premium: 'Sınırsız kayıt ve anlık alarmlar',
      feat_calculator_premium: 'Çift yönlü maliyet hesaplayıcı',
      feat_requests_premium: 'Ayda 12 gezgin talebi',
      
      feat_premium_included: 'Tüm Premium özellikleri dahil',
      feat_routes_traveler: 'Sınırsız seyahat rotası ekleme',
      feat_requests_traveler: 'Gezgin olarak talep kabul etme (30/ay)',
      feat_requests_buyer_traveler: 'Ayda 30 alıcı talebi',
      feat_earn_traveler: 'Bagaj alanından para kazanma',
      feat_badge_traveler: 'Onaylı Gezgin rozeti',
      feat_analytics_traveler: 'Gezgin analitik paneli',

      // Tooltips
      tooltip_requests_free: 'Ek talep başına $5',
      tooltip_requests_premium: '5 ek talep paketi: $5',
      tooltip_requests_traveler: '5 ek talep paketi: $5'
    },
    ar: {
      free_name: 'حساب مجاني',
      free_desc: 'افتح ميزات حفظ المنتجات والتنبيهات والمزيد من عمليات البحث بحساب مجاني.',
      free_cta: 'سجل مجاناً',
      premium_name: 'مميز',
      premium_desc: 'الأفضل للمتسوقين الأذكياء الذين يبحثون عن أقصى قدر من التوفير.',
      premium_cta: 'الترقية للمميز',
      traveler_name: 'مسافر',
      traveler_desc: 'الأفضل للمسافرين الدائمين الراغبين في تحقيق أرباح من مساحة الأمتعة. وصول مدى الحياة.',
      traveler_cta: 'كن مسافراً',
      per_month: '/ شهرياً',
      one_time: 'مرة واحدة',
      popular_badge: 'شائع',
      upgrade_note: 'ترقية من المميز مقابل فرق {amount}',
      
      // Billing Toggle & Annual Plan
      billing_monthly: 'شهرياً',
      billing_annual: 'سنوياً',
      save_badge: 'وفر ٣٧٪',
      effective_monthly: 'فعلياً {amount} / شهرياً',
      per_year: '/ سنوياً',
      feat_searches_free: '20 عملية بحث يومياً',
      feat_save_free: 'حفظ ما يصل إلى 5 منتجات',
      feat_alerts_free: '3 تنبيهات بريد إلكتروني أسبوعية',
      feat_requests_free: 'طلب مسافر واحد شهرياً',
      traveler_badge: 'كسب',
      feat_compare_free: 'مقارنة أفضل 3+3 دول',
      feat_history_free: 'تاريخ أسعار لمدة 30 يوماً',
      feat_shipping: 'حسابات شحن أساسية',
      
      feat_searches_premium: 'عمليات بحث غير محدودة',
      feat_worldwide_premium: 'مقارنات كاملة حول العالم',
      feat_history_premium: 'تاريخ أسعار كامل (كل البيانات)',
      feat_alerts_premium: 'حفظ وتنبيهات فورية غير محدودة',
      feat_calculator_premium: 'حاسبة شحن متعددة السيناريوهات',
      feat_requests_premium: '12 طلب مسافر شهرياً',
      
      feat_premium_included: 'تشمل جميع ميزات الاشتراك المميز',
      feat_routes_traveler: 'إدراج مسارات رحلات غير محدودة',
      feat_requests_traveler: 'قبول طلبات المشترين (حتى 30/شهراً)',
      feat_requests_buyer_traveler: '30 طلب مشترٍ شهرياً',
      feat_earn_traveler: 'كسب المال من مساحة الأمتعة',
      feat_badge_traveler: 'شعار المسافر الموثق',
      feat_analytics_traveler: 'لوحة تحليلات المسافرين',

      // Tooltips
      tooltip_requests_free: '5$ لكل طلب إضافي',
      tooltip_requests_premium: '5$ لباقة 5 طلبات إضافية',
      tooltip_requests_traveler: '5$ لباقة 5 طلبات إضافية'
    },
  };

  // Helper to extract active language
  function getLanguage() {
    return document.documentElement.getAttribute('lang') || 'en';
  }

  // Custom price formatter to show exact decimals and side-by-side currency formats for inline text
  function formatTierPrice(usdAmount, currencyCode, usdRate) {
    const currencyInfo = window.GapLuckCurrency?.currencies?.[currencyCode] || { symbol: '$', code: 'USD' };
    const symbol = currencyInfo.symbol.trim();
    
    if (currencyCode === 'USD') {
      return `${symbol}${usdAmount.toFixed(2)} USD`;
    }
    
    const converted = usdAmount * usdRate;
    const rounded = Math.round(converted);
    const formattedLocal = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(rounded);
    
    return `${symbol}${formattedLocal} ${currencyCode} ($${usdAmount.toFixed(2)} USD)`;
  }

  // Helper to generate the price box HTML structure with converted price above and greyed-out USD below
  function renderPriceBoxHTML(usdAmount, currencyCode, usdRate, periodLabel = '') {
    const currencyInfo = window.GapLuckCurrency?.currencies?.[currencyCode] || { symbol: '$', code: 'USD' };
    const symbol = currencyInfo.symbol.trim();
    
    const periodHTML = periodLabel ? `<span class="ag-pricing-card__period">${periodLabel}</span>` : '';

    if (currencyCode === 'USD') {
      return `
        <div class="ag-pricing-card__price-box">
          <div class="ag-pricing-card__price-display">
            <span class="ag-pricing-card__amount">${symbol}${usdAmount.toFixed(2)} USD</span>
          </div>
          ${periodHTML}
        </div>
      `;
    }
    
    const converted = usdAmount * usdRate;
    const rounded = Math.round(converted);
    const formattedLocal = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(rounded);
    
    return `
      <div class="ag-pricing-card__price-box">
        <div class="ag-pricing-card__price-display">
          <span class="ag-pricing-card__amount">${symbol}${formattedLocal} ${currencyCode}</span>
          <span class="ag-pricing-card__amount-usd">$${usdAmount.toFixed(2)} USD</span>
        </div>
        ${periodHTML}
      </div>
    `;
  }

  const GapLuckPricingCards = {
    // State to track billing cycle: 'monthly' or 'annual'
    billingCycle: 'monthly',

    // Generate card markup
    createMarkup: function () {
      const lang = getLanguage();
      const t = translations[lang] || translations.en;

      const currencyCode = localStorage.getItem('gl-currency') || localStorage.getItem('ag-currency') || 'TRY';
      // If selected currency is TRY, rate is 1. If USD, rate is 1/32.7. So we need the rate relative to USD.
      // In currency.js, window.GapLuckCurrency.rates.USD is 32.7 (representing 32.7 TRY per USD).
      // So to convert USD amount to TRY: usdAmount * 32.7.
      // To convert USD amount to other currency: usdAmount * 32.7 / currencyRate.
      const usdRateTRY = window.GapLuckCurrency?.rates?.USD || 32.7;
      const targetRateTRY = window.GapLuckCurrency?.rates?.[currencyCode] || 1;
      
      // Calculate active rate from USD to target currency
      const activeRate = usdRateTRY / targetRateTRY;

      const isAnnual = this.billingCycle === 'annual';

      // Define USD values
      const freeUSD = 0.00;
      const premiumUSD = isAnnual ? 60.00 : 7.99;
      const effectiveUSD = 5.00;
      const travelerUSD = 23.99;
      const topUpUSD = 16.00;

      // Format pricing strings
      const freePriceBoxHTML = renderPriceBoxHTML(freeUSD, currencyCode, activeRate);
      const premiumPriceBoxHTML = renderPriceBoxHTML(premiumUSD, currencyCode, activeRate, isAnnual ? t.per_year : t.per_month);
      const travelerPriceBoxHTML = renderPriceBoxHTML(travelerUSD, currencyCode, activeRate, `/ ${t.one_time}`);
      
      const topUpFormatted = formatTierPrice(topUpUSD, currencyCode, activeRate);
      const effectiveFormatted = formatTierPrice(effectiveUSD, currencyCode, activeRate);
      const effectiveLabel = isAnnual ? `<p class="ag-pricing-card__effective">${t.effective_monthly.replace('{amount}', effectiveFormatted)}</p>` : '';

      return `
        <div class="ag-pricing-section">
          <!-- Centered billing toggle switch -->
          <div class="ag-billing-toggle-container">
            <div class="ag-billing-toggle">
              <div class="ag-billing-toggle-bg ${isAnnual ? 'ag-billing-toggle-bg--annual' : ''}"></div>
              <button class="ag-billing-toggle__option ${!isAnnual ? 'ag-billing-toggle__option--active' : ''}" id="ag-billing-btn-monthly" type="button">
                ${t.billing_monthly}
              </button>
              <button class="ag-billing-toggle__option ${isAnnual ? 'ag-billing-toggle__option--active' : ''}" id="ag-billing-btn-annual" type="button">
                ${t.billing_annual}
              </button>
            </div>
          </div>

          <div class="ag-pricing-grid">
            <!-- Free Plan -->
            <div class="ag-pricing-card" id="ag-pricing-free">
              <h3 class="ag-pricing-card__tier-name">${t.free_name}</h3>
              <p class="ag-pricing-card__desc">${t.free_desc}</p>
              ${freePriceBoxHTML}
              <ul class="ag-pricing-card__features-list">
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_searches_free}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_save_free}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_alerts_free}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span class="ag-tooltip-trigger ag-tooltip" tabindex="0">
                    <span>${t.feat_requests_free}</span>
                    <svg class="ag-pricing-card__tooltip-icon" fill="none" height="12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" width="12">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" x2="12.01" y1="8" y2="8"></line>
                      <line x1="12" x2="12" y1="12" y2="16"></line>
                    </svg>
                    <span class="ag-tooltip__content" role="tooltip">${t.tooltip_requests_free}</span>
                  </span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_compare_free}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_history_free}</span>
                </li>
              </ul>
              <a href="#" class="ag-btn ag-btn--secondary ag-pricing-card__cta" id="ag-cta-anonymous">${t.free_cta}</a>
            </div>

            <!-- Premium Plan -->
            <div class="ag-pricing-card ag-pricing-card--featured ${window.innerWidth < 768 ? 'ag-pricing-card--active' : ''}" id="ag-pricing-premium">
              <div class="ag-pricing-card__badge-group">
                <span class="ag-badge ag-badge--in-stock ag-pricing-card__badge">${t.popular_badge}</span>
                ${isAnnual ? `<span class="ag-badge ag-badge--save-highlight ag-pricing-card__badge">${t.save_badge}</span>` : ''}
              </div>
              <h3 class="ag-pricing-card__tier-name">${t.premium_name}</h3>
              <p class="ag-pricing-card__desc">${t.premium_desc}</p>
              ${premiumPriceBoxHTML}
              ${effectiveLabel}
              <ul class="ag-pricing-card__features-list">
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_searches_premium}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_worldwide_premium}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_history_premium}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_alerts_premium}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_calculator_premium}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span class="ag-tooltip-trigger ag-tooltip" tabindex="0">
                    <span>${t.feat_requests_premium}</span>
                    <svg class="ag-pricing-card__tooltip-icon" fill="none" height="12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" width="12">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" x2="12.01" y1="8" y2="8"></line>
                      <line x1="12" x2="12" y1="12" y2="16"></line>
                    </svg>
                    <span class="ag-tooltip__content" role="tooltip">${t.tooltip_requests_premium}</span>
                  </span>
                </li>
              </ul>
              <a href="#" class="ag-btn ag-btn--primary ag-pricing-card__cta" id="ag-cta-premium">${t.premium_cta}</a>
            </div>

            <!-- Traveler Plan -->
            <div class="ag-pricing-card ag-pricing-card--traveler" id="ag-pricing-traveler">
              <div class="ag-pricing-card__badge-group">
                <span class="ag-badge ag-badge--authorized ag-pricing-card__badge">${t.traveler_badge}</span>
              </div>
              <h3 class="ag-pricing-card__tier-name">${t.traveler_name}</h3>
              <p class="ag-pricing-card__desc">${t.traveler_desc}</p>
              ${travelerPriceBoxHTML}
              <ul class="ag-pricing-card__features-list">
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_premium_included}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_routes_traveler}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span class="ag-tooltip-trigger ag-tooltip" tabindex="0">
                    <span>${t.feat_requests_traveler}</span>
                    <svg class="ag-pricing-card__tooltip-icon" fill="none" height="12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" width="12">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" x2="12.01" y1="8" y2="8"></line>
                      <line x1="12" x2="12" y1="12" y2="16"></line>
                    </svg>
                    <span class="ag-tooltip__content" role="tooltip">${t.tooltip_requests_traveler}</span>
                  </span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_earn_traveler}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_badge_traveler}</span>
                </li>
                <li class="ag-pricing-card__feature-item">
                  <svg class="ag-pricing-card__feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${t.feat_analytics_traveler}</span>
                </li>
              </ul>
              <p class="ag-pricing-card__upgrade-note">${t.upgrade_note.replace('{amount}', topUpFormatted)}</p>
              <a href="#" class="ag-btn ag-btn--secondary ag-pricing-card__cta" id="ag-cta-traveler">${t.traveler_cta}</a>
            </div>
          </div>

          <div class="ag-pricing-dots" aria-label="Pricing card navigation">
            <button class="ag-pricing-dots__dot" data-index="0" aria-label="Free plan"></button>
            <button class="ag-pricing-dots__dot ag-pricing-dots__dot--active" data-index="1" aria-label="Premium plan"></button>
            <button class="ag-pricing-dots__dot" data-index="2" aria-label="Traveler plan"></button>
          </div>
        </div>
      `;
    },

    render: function (container) {
      if (!container) return;
      container.innerHTML = this.createMarkup().trim();

      // Clone cards for infinite looping scroll on mobile
      const grid = container.querySelector('.ag-pricing-grid');
      if (grid) {
        const originalCards = Array.from(grid.querySelectorAll('.ag-pricing-card'));
        if (originalCards.length === 3) {
          // Clone the last card (Traveler) to prepend
          const travelerClone = originalCards[2].cloneNode(true);
          travelerClone.id = 'ag-pricing-traveler-clone-start';
          // Update internal CTA button ID
          const travelerCta = travelerClone.querySelector('.ag-pricing-card__cta');
          if (travelerCta) travelerCta.id = 'ag-cta-traveler-clone-start';
          travelerClone.classList.add('ag-pricing-card--clone');

          // Clone the first card (Free) to append
          const freeClone = originalCards[0].cloneNode(true);
          freeClone.id = 'ag-pricing-free-clone-end';
          const freeCta = freeClone.querySelector('.ag-pricing-card__cta');
          if (freeCta) freeCta.id = 'ag-cta-anonymous-clone-end';
          freeClone.classList.add('ag-pricing-card--clone');

          // Insert clones into DOM
          grid.insertBefore(travelerClone, originalCards[0]);
          grid.appendChild(freeClone);
        }
      }

      // Bind click event listeners for billing options
      const btnMonthly = container.querySelector('#ag-billing-btn-monthly');
      if (btnMonthly) {
        btnMonthly.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.billingCycle !== 'monthly') {
            this.billingCycle = 'monthly';
            this.init();
          }
        });
      }

      const btnAnnual = container.querySelector('#ag-billing-btn-annual');
      if (btnAnnual) {
        btnAnnual.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.billingCycle !== 'annual') {
            this.billingCycle = 'annual';
            this.init();
          }
        });
      }

      // Bind click triggers for mock subscription/signup alerts (ctas will select clones as well)
      const ctas = container.querySelectorAll('.ag-pricing-card__cta');
      ctas.forEach(cta => {
        cta.addEventListener('click', (e) => {
          e.preventDefault();
          const card = cta.closest('.ag-pricing-card');
          const isFree = card.id.includes('free');
          const isPremium = card.id.includes('premium');
          const isTraveler = card.id.includes('traveler');
          
          if (isFree) {
            if (window.GapLuckSigninModal && typeof window.GapLuckSigninModal.open === 'function') {
              window.GapLuckSigninModal.open();
            } else if (window.GapLuckToast && typeof window.GapLuckToast.show === 'function') {
              window.GapLuckToast.show('Opening free account signup modal');
            }
          } else if (isPremium) {
            if (window.GapLuckSigninModal && typeof window.GapLuckSigninModal.open === 'function') {
              window.GapLuckSigninModal.open('premium');
            } else if (window.GapLuckToast && typeof window.GapLuckToast.show === 'function') {
              window.GapLuckToast.show('Opening Premium checkout flow');
            }
          } else if (isTraveler) {
            if (window.GapLuckSigninModal && typeof window.GapLuckSigninModal.open === 'function') {
              window.GapLuckSigninModal.open('traveler');
            } else if (window.GapLuckToast && typeof window.GapLuckToast.show === 'function') {
              window.GapLuckToast.show('Opening Traveler registration flow');
            }
          }
        });
      });

      // Dot pagination scroll observer and click bindings
      const dots = container.querySelectorAll('.ag-pricing-dots__dot');
      const cards = container.querySelectorAll('.ag-pricing-card');

      if (grid && dots.length > 0 && cards.length > 0) {
        // Mobile interaction and snap engine variables
        let touchStartX = 0;
        let touchStartY = 0;
        let startScrollLeft = 0;
        let isScrolling = undefined;
        let startTime = 0;
        let animationFrameId = null;
        let leftThreshold = 0;
        let rightThreshold = 0;
        let jumpOffsetLeft = 0;
        let jumpOffsetRight = 0;
        let currentActiveIndex = 2; // Default to Premium (index 2)

        const isMobile = () => window.innerWidth < 768;

        const getCardCenterOffset = (index) => {
          if (!cards[index]) return 0;
          return cards[index].offsetLeft - (grid.clientWidth - cards[index].offsetWidth) / 2;
        };

        const updateThresholds = () => {
          if (cards.length < 5) return;
          const scroll0 = getCardCenterOffset(0);
          const scroll1 = getCardCenterOffset(1);
          const scroll3 = getCardCenterOffset(3);
          const scroll4 = getCardCenterOffset(4);

          leftThreshold = (scroll0 + scroll1) / 2;
          rightThreshold = (scroll3 + scroll4) / 2;

          jumpOffsetLeft = scroll3 - scroll0;
          jumpOffsetRight = scroll1 - scroll4;
        };

        const setActiveCard = (index) => {
          currentActiveIndex = Math.max(1, Math.min(3, index));

          cards.forEach((card, idx) => {
            if (idx === currentActiveIndex) {
              card.classList.add('ag-pricing-card--active');
            } else {
              card.classList.remove('ag-pricing-card--active');
            }
          });

          const dotIndex = currentActiveIndex - 1;
          dots.forEach((dot, idx) => {
            if (idx === dotIndex) {
              dot.classList.add('ag-pricing-dots__dot--active');
            } else {
              dot.classList.remove('ag-pricing-dots__dot--active');
            }
          });
        };

        const updateActiveCardRealtime = (scrollPos) => {
          let closestIndex = 2;
          let minDiff = Infinity;
          for (let i = 0; i < cards.length; i++) {
            const centerOffset = getCardCenterOffset(i);
            const diff = Math.abs(scrollPos - centerOffset);
            if (diff < minDiff) {
              minDiff = diff;
              closestIndex = i;
            }
          }

          let activeIndex = closestIndex;
          if (closestIndex === 0) {
            activeIndex = 3;
          } else if (closestIndex === 4) {
            activeIndex = 1;
          }

          setActiveCard(activeIndex);
        };

        const smoothScrollTo = (targetScrollLeft, targetIndex, duration = 320) => {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);

          const start = grid.scrollLeft;
          const change = targetScrollLeft - start;
          const animStartTime = performance.now();

          function animate(currentTime) {
            const elapsed = currentTime - animStartTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            grid.scrollLeft = start + change * ease;

            // Sync active state mid-scroll
            updateActiveCardRealtime(grid.scrollLeft);

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(animate);
            } else {
              animationFrameId = null;
              grid.scrollLeft = targetScrollLeft;
              setActiveCard(targetIndex);
            }
          }
          animationFrameId = requestAnimationFrame(animate);
        };

        // Touch Interaction Listeners for Custom Snapping & Looping
        grid.addEventListener('touchstart', (e) => {
          if (!isMobile()) return;

          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }

          const touch = e.touches[0];
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
          startScrollLeft = grid.scrollLeft;
          isScrolling = undefined;
          startTime = Date.now();

          updateThresholds();
        }, { passive: true });

        grid.addEventListener('touchmove', (e) => {
          if (!isMobile()) return;

          const touch = e.touches[0];
          const curX = touch.clientX;
          const curY = touch.clientY;

          const dx = curX - touchStartX;
          const dy = curY - touchStartY;

          if (isScrolling === undefined) {
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);
            if (absX > absY && absX > 5) {
              isScrolling = true;
            } else if (absY > absX && absY > 5) {
              isScrolling = false;
            }
          }

          if (isScrolling === true) {
            if (e.cancelable) {
              e.preventDefault();
            }

            let newScrollLeft = startScrollLeft - dx;

            // Seamless infinite looping jump during drag
            if (newScrollLeft < leftThreshold) {
              newScrollLeft += jumpOffsetLeft;
              startScrollLeft += jumpOffsetLeft;
            } else if (newScrollLeft > rightThreshold) {
              newScrollLeft += jumpOffsetRight;
              startScrollLeft += jumpOffsetRight;
            }

            grid.scrollLeft = newScrollLeft;
            updateActiveCardRealtime(newScrollLeft);
          }
        }, { passive: false });

        grid.addEventListener('touchend', (e) => {
          if (!isMobile()) return;
          if (isScrolling !== true) return;

          const touch = e.changedTouches[0];
          const curX = touch.clientX;
          const dt = Math.max(1, Date.now() - startTime);
          const dx = curX - touchStartX;
          const velocity = dx / dt; // Pixels per millisecond

          const projectedScroll = grid.scrollLeft - velocity * 150;

          let targetIndex = 2;
          let minDiff = Infinity;
          for (let i = 1; i <= 3; i++) {
            const centerOffset = getCardCenterOffset(i);
            const diff = Math.abs(projectedScroll - centerOffset);
            if (diff < minDiff) {
              minDiff = diff;
              targetIndex = i;
            }
          }

          smoothScrollTo(getCardCenterOffset(targetIndex), targetIndex);
        }, { passive: true });

        // Dot pagination click handler
        dots.forEach(dot => {
          dot.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isMobile()) return;
            const index = parseInt(dot.getAttribute('data-index'), 10);
            const targetCardIndex = index + 1; // Map 0 -> 1, 1 -> 2, 2 -> 3
            smoothScrollTo(getCardCenterOffset(targetCardIndex), targetCardIndex, 350);
          });
        });

        // Card tap-to-center click handler
        cards.forEach((card, index) => {
          card.addEventListener('click', (e) => {
            if (isMobile() && !card.classList.contains('ag-pricing-card--active')) {
              e.preventDefault();
              e.stopPropagation();
              smoothScrollTo(getCardCenterOffset(index), index, 350);
            }
          }, true);
        });

        // Initialize scroll position on load to center Premium card (index 2)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (isMobile() && cards.length > 2) {
              updateThresholds();
              grid.scrollLeft = getCardCenterOffset(2);
              setActiveCard(2);
            }
          });
        });

        // Handle viewport resize or orientation changes to keep active card centered
        let lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
          if (isMobile()) {
            const currentWidth = window.innerWidth;
            if (currentWidth === lastWidth) return; // Skip height-only resizes (mobile address bar shifts)
            lastWidth = currentWidth;

            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
            updateThresholds();
            grid.scrollLeft = getCardCenterOffset(currentActiveIndex);
          }
        });
      }
    },

    init: function () {
      const containers = document.querySelectorAll('[data-pricing-container]');
      containers.forEach(container => {
        this.render(container);
      });
    }
  };

  // Expose component globally
  window.GapLuckPricingCards = GapLuckPricingCards;

  // Render on ready
  if (document.body) {
    GapLuckPricingCards.init();
  } else {
    document.addEventListener('DOMContentLoaded', () => GapLuckPricingCards.init());
  }

  // Handle language updates
  window.addEventListener('gl-language-change', () => {
    GapLuckPricingCards.init();
  });

  // Handle currency updates
  window.addEventListener('gl-currency-change', () => {
    GapLuckPricingCards.init();
  });

})();
