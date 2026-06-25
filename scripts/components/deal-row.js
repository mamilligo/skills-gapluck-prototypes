/**
 * GapLuck - Centralized Retailer Deal Rows & Price Cards Component
 * Handles trilingual rendering, dynamic currency conversions,
 * landed cost estimations, and smooth accordion drawers.
 */

(function () {
  'use strict';

  // Translation dictionary and formatting utilities are now centralized in GapLuckI18N and GapLuckCurrency



  // Get active translation string
  function getTxt(key, lang) {
    const activeLang = lang || window.currentLang || "en";
    const dict = window.GapLuckI18N ? (window.GapLuckI18N[activeLang] || window.GapLuckI18N.en) : null;
    return dict ? (dict[key] || dict[key.toLowerCase()] || "") : "";
  }



  // Render trust badge and tooltip HTML
  function renderTrustBadgeHTML(meta, lang) {
    if (!meta || !meta.type) return "";

    const type = meta.type;
    const tier = meta.tier || 3;
    const lastVerified = meta.last_verified || "2026-06-01";
    const label = getTxt(type, lang);
    const tierLabel = getTxt(`tier_${tier}`, lang);
    const descLabel = getTxt(`${type}_desc`, lang);
    const lastVerifiedLabel = getTxt("last_verified", lang).replace("{date}", lastVerified);
    const learnMoreLabel = getTxt("learn_more", lang);
    const warningLabel = meta.verification_due ? `<span class="ag-tooltip__warning" tabindex="0">${getTxt("verification_due", lang)}</span>` : "";

    const warningClass = meta.verification_due ? " ag-badge--warning" : "";
    const tooltipBottomClass = (type === "official" || type === "verified") ? " ag-tooltip--bottom" : "";

    return `
      <span class="ag-badge ag-badge--${type}${warningClass} ag-tooltip" tabindex="0">
        <span>${label}</span>
        <span class="ag-tooltip__content${tooltipBottomClass}" tabindex="0">
          <strong>${tierLabel}</strong> · <span>${descLabel}</span>
          ${warningLabel}
          <span class="ag-tooltip__date" tabindex="0">${lastVerifiedLabel}</span>
          <a class="ag-tooltip__link" href="methodology.html#tier-system">${learnMoreLabel}</a>
        </span>
      </span>
    `;
  }

  // Calculate landed cost breakdown
  function calculateLandedCosts(priceTRY) {
    const rates = window.rates || { TRY: 1, USD: 32.7, EUR: 35.1, AED: 8.9, GBP: 41.5, JPY: 0.21, CAD: 24.0 };
    const usdRate = rates.USD || 32.7;

    const duty = Math.round(priceTRY * 0.18);
    const vat = Math.round(priceTRY * 0.20);
    const shipping = 1200; // flat 1,200 TRY DHL estimation
    const totalTrad = priceTRY + duty + vat + shipping;

    const priceUSD = priceTRY / usdRate;
    const travelerFee = priceUSD < 500 ? Math.round(50 * usdRate) : Math.round(priceTRY * 0.10);
    const platformFee = Math.round(priceTRY * 0.06);
    const totalP2P = priceTRY + travelerFee + platformFee;

    return { duty, vat, shipping, totalTrad, travelerFee, platformFee, totalP2P };
  }

  // Create landed cost drawer HTML content
  function getLandedDrawerInnerHTML(baseTRY, localCurrencyCode, lang, selectedCurrency) {
    const { duty, vat, shipping, totalTrad, travelerFee, platformFee, totalP2P } = calculateLandedCosts(baseTRY);

    const priceConverted = formatMoney(baseTRY, selectedCurrency);
    const priceLocalConverted = localCurrencyCode !== selectedCurrency ? ` (~${formatMoney(baseTRY, localCurrencyCode)})` : "";

    const courierToast = getTxt("get_via_courier_toast", lang);
    const travelerToast = getTxt("get_via_traveler_toast", lang);

    return `
      <div class="ag-landed-drawer__inner">
        <div class="ag-landed-grid">
          <div class="ag-landed-card">
            <div class="ag-landed-card__subtitle">${getTxt("via_shipping_services", lang)}</div>
            <div class="ag-landed-card__title">${getTxt("traditional_shipping", lang)}</div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label">${getTxt("product_price", lang)}</span>
              <span class="ag-landed-line__value">${priceConverted}${priceLocalConverted}</span>
            </div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label">${getTxt("estimated_duty", lang)}</span>
              <span class="ag-landed-line__value">+${formatMoney(duty, selectedCurrency)}</span>
            </div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label">${getTxt("estimated_vat", lang)}</span>
              <span class="ag-landed-line__value">+${formatMoney(vat, selectedCurrency)}</span>
            </div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label">${getTxt("estimated_shipping", lang)}</span>
              <span class="ag-landed-line__value">+${formatMoney(shipping, selectedCurrency)}</span>
            </div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label ag-landed-line__label--strong">${getTxt("estimated_total_landed", lang)}</span>
              <span class="ag-landed-line__value ag-landed-line__value--strong">≈${formatMoney(totalTrad, selectedCurrency)}</span>
            </div>
            <button class="ag-btn ag-btn--primary ag-btn--small ag-landed-card__btn" onclick="window.GapLuckToast.show('${courierToast}')">
              <span>${getTxt("get_via_courier", lang)}</span>
            </button>
          </div>

          <div class="ag-landed-card">
            <div class="ag-landed-card__subtitle">${getTxt("via_traveler_passenger", lang)}</div>
            <div class="ag-landed-card__title">${getTxt("peer_to_peer_shipping", lang)}</div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label">${getTxt("product_price", lang)}</span>
              <span class="ag-landed-line__value">${priceConverted}${priceLocalConverted}</span>
            </div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label">${getTxt("traveler_fee", lang)}</span>
              <span class="ag-landed-line__value">+${formatMoney(travelerFee, selectedCurrency)}</span>
            </div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label">${getTxt("platform_service_fee", lang)}</span>
              <span class="ag-landed-line__value">+${formatMoney(platformFee, selectedCurrency)}</span>
            </div>
            <div class="ag-landed-line">
              <span class="ag-landed-line__label ag-landed-line__label--strong">${getTxt("total_landed_cost", lang)}</span>
              <span class="ag-landed-line__value ag-landed-line__value--strong">≈${formatMoney(totalP2P, selectedCurrency)}</span>
            </div>
            <button class="ag-btn ag-btn--primary ag-btn--small ag-landed-card__btn" onclick="window.GapLuckToast.show('${travelerToast}')">
              <span>${getTxt("get_via_traveler", lang)}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Toggle Landed Drawer state safely
  function handleLandedToggle(btn, drawer, baseTRY, localCurrencyCode) {
    const lang = window.currentLang || "en";
    const selectedCurrency = window.currentCurrency || "TRY";
    const isOpen = drawer.classList.contains("ag-landed-drawer--open");

    if (isOpen) {
      drawer.classList.remove("ag-landed-drawer--open");
      btn.classList.remove("ag-price-card__btn-toggle--active");
      setTimeout(() => {
        if (!drawer.classList.contains("ag-landed-drawer--open")) {
          drawer.innerHTML = "";
        }
      }, 350);
    } else {
      drawer.innerHTML = getLandedDrawerInnerHTML(baseTRY, localCurrencyCode, lang, selectedCurrency);
      drawer.classList.add("ag-landed-drawer--open");
      btn.classList.add("ag-price-card__btn-toggle--active");
    }
  }

  // Global Deal Row API
  window.GapLuckDealRow = {
    /**
     * Renders a dynamic deal component
     * @param {Object} dealData pricing and metadata for the row
     * @param {HTMLElement} parentContainer target parent node
     * @param {string} variant visual style type ('demo-row' | 'worldwide-row' | 'local-card')
     */
    render: function (dealData, parentContainer, variant) {
      if (!parentContainer) return;

      const lang = window.currentLang || "en";
      const currency = window.currentCurrency || "TRY";

      const countryId = dealData.countryId;
      const retailerId = dealData.retailerId;
      const meta = dealData.retailerMeta || {};
      const baseTRY = dealData.priceTRY;
      const localCurrencyCode = dealData.currency || "TRY";
      const isWinner = !!dealData.isWinner;
      const isOutOfStock = meta.stock === "out-of-stock";
      const isFeatured = !!meta.featured;

      const flagFile = dealData.flagFile || "us.svg";
      const countryName = dealData.countryName || "USA";
      const countryCode = dealData.countryCode || "US";

      if (variant === "demo-row") {
        // ── VARIANT: DEMO ROW (Landing Page Step 02 Demo) ──────────────────
        const rowDiv = document.createElement("div");
        rowDiv.className = `ag-demo-row${isWinner ? " ag-demo-row--best" : ""}${dealData.isYours ? " ag-demo-row--yours" : ""}`;

        let badgeHTML = "";
        if (isWinner) {
          badgeHTML = `<span class="ag-demo-badge ag-demo-badge--best">${getTxt("cheapest_store", lang)}</span>`;
        } else if (dealData.isYours) {
          badgeHTML = `<span class="ag-demo-badge ag-demo-badge--yours">${lang === "tr" ? "Sizin Fiyatınız" : (lang === "ar" ? "سعرك" : "Your Price")}</span>`;
        } else if (dealData.savingsPercent) {
          badgeHTML = `<span class="ag-demo-badge ag-demo-badge--saving">-${dealData.savingsPercent}%</span>`;
        } else if (dealData.isBasePrice) {
          badgeHTML = `<span class="ag-demo-badge ag-demo-badge--saving">${lang === "tr" ? "Taban Fiyat" : (lang === "ar" ? "السعر الأساسي" : "Base Price")}</span>`;
        }

        const localPriceFormatted = formatMoney(baseTRY, localCurrencyCode);
        const displayPriceFormatted = formatMoney(baseTRY, currency);

        rowDiv.innerHTML = `
          <img src="../assets/flags/${flagFile}" alt="${countryName} flag" class="ag-demo-row__flag" width="28" height="20" />
          <div class="ag-demo-row__country-block">
            <div class="ag-demo-row__country-name">${countryName}</div>
            <div class="ag-demo-row__country-note">${meta.name || "Brand Store"} - ${localCurrencyCode} ${localPriceFormatted.replace(/[^\d,.]/g, '')}</div>
          </div>
          <div class="ag-demo-row__price-block">
            <div class="ag-demo-row__price">${displayPriceFormatted}</div>
          </div>
          <div class="ag-demo-row__badge-col">
            ${badgeHTML}
          </div>
        `;
        parentContainer.appendChild(rowDiv);

      } else if (variant === "worldwide-row") {
        // ── VARIANT: WORLDWIDE ROW (Main Table List) ───────────────────────
        const containerDiv = document.createElement("div");
        containerDiv.className = "ag-retailer-row-container";

        const rowDiv = document.createElement("div");
        rowDiv.className = `ag-retailers-row${isOutOfStock ? " ag-retailers-row--muted" : ""}`;

        // Generate trust badge markup
        const trustBadgeHTML = renderTrustBadgeHTML(meta, lang);

        // Landed Cost minimum estimation teaser
        const { totalTrad, totalP2P } = calculateLandedCosts(baseTRY);
        const minLandedTRY = Math.min(totalTrad, totalP2P);
        const formattedLanded = formatMoney(minLandedTRY, currency);
        const landedCostButtonLabel = getTxt("landed_from", lang).replace("{price}", formattedLanded);

        const primaryPriceText = isOutOfStock ? `₺${baseTRY.toLocaleString()}` : formatMoney(baseTRY, currency);
        const showPrimary = isOutOfStock ? primaryPriceText : (localCurrencyCode !== currency ? `≈ ${primaryPriceText}` : primaryPriceText);

        const secondaryPriceHTML = (localCurrencyCode !== currency && !isOutOfStock)
          ? `<div class="ag-price-card__price-secondary" style="display:block;">${formatMoney(baseTRY, localCurrencyCode)}</div>`
          : "";

        const outOfStockLabel = isOutOfStock ? `<span class="ag-price-card__out-of-stock">${getTxt("out_of_stock", lang)}</span>` : "";

        rowDiv.innerHTML = `
          <div>
            ${outOfStockLabel}
            <div class="ag-price-card__name">
              <span>${meta.name || "Retailer"}</span>
              ${trustBadgeHTML}
            </div>
            <div class="ag-price-card__seller-name">${meta.seller_name || ""}</div>
            <div class="ag-price-card__retailer-meta">${getTxt("updated", lang).replace("{time}", meta.time || "5h ago")}</div>
          </div>
          <div class="ag-price-card__price-wrapper">
            <div class="ag-price-card__price-primary" id="price-${retailerId}-primary" data-price="${baseTRY}" data-local="${localCurrencyCode}" data-price-key="${retailerId}">${showPrimary}</div>
            <div class="ag-price-card__price-secondary" id="price-${retailerId}-secondary" data-price="${baseTRY}" data-local="${localCurrencyCode}" data-price-key="${retailerId}">${secondaryPriceHTML}</div>
          </div>
          <div class="ag-retailers-row__actions">
            <button class="ag-btn ag-btn--text ag-price-card__btn-toggle${isOutOfStock ? " ag-price-card__btn-toggle--hidden" : ""}" id="btn-landed-${retailerId}">
              <span>${landedCostButtonLabel}</span>
              <svg fill="none" height="10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="10">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <a class="ag-btn ${isOutOfStock ? "ag-btn--outline-muted" : (isWinner ? "ag-btn--primary" : "ag-btn--secondary")} ag-btn--small" href="${meta.url || "#"}">
              <span>${getTxt("go_to_store", lang)}</span>
              <svg class="ag-rtl-flip" fill="none" height="12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewbox="0 0 24 24" width="12">
                <line x1="5" x2="19" y1="12" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        `;

        const drawerDiv = document.createElement("div");
        drawerDiv.className = "ag-landed-drawer";
        drawerDiv.id = `drawer-landed-${retailerId}`;

        // Bind events dynamically
        const toggleBtn = rowDiv.querySelector(".ag-price-card__btn-toggle");
        if (toggleBtn) {
          toggleBtn.addEventListener("click", () => {
            handleLandedToggle(toggleBtn, drawerDiv, baseTRY, localCurrencyCode);
          });
        }

        containerDiv.appendChild(rowDiv);
        containerDiv.appendChild(drawerDiv);
        parentContainer.appendChild(containerDiv);

      } else if (variant === "local-card") {
        // ── VARIANT: LOCAL CARD (Side Panel Retailer Blocks) ──────────────
        const cardDiv = document.createElement("div");
        cardDiv.className = `ag-price-card ag-price-card--retailer${isOutOfStock ? " ag-price-card--out-of-stock" : ""}`;
        cardDiv.setAttribute("data-country", countryId);
        cardDiv.setAttribute("data-in-stock", !isOutOfStock);
        cardDiv.setAttribute("data-local-retailer", retailerId);
        cardDiv.setAttribute("data-tier", meta.tier || 3);

        const trustBadgeHTML = renderTrustBadgeHTML(meta, lang);
        const featuredBadgeHTML = isFeatured ? `<span class="ag-badge ag-badge--featured">${getTxt("featured", lang)}</span>` : "";

        const primaryPriceText = isOutOfStock ? `₺${baseTRY.toLocaleString()}` : formatMoney(baseTRY, currency);
        const showPrimary = isOutOfStock ? primaryPriceText : (localCurrencyCode !== currency ? `≈ ${primaryPriceText}` : primaryPriceText);

        const secondaryPriceHTML = (localCurrencyCode !== currency && !isOutOfStock)
          ? `${formatMoney(baseTRY, localCurrencyCode)}`
          : "";

        const outOfStockHTML = isOutOfStock ? `<span class="ag-price-card__out-of-stock">${getTxt("out_of_stock", lang)}</span>` : "";

        cardDiv.innerHTML = `
          <div class="ag-price-card__header">
            <div class="ag-price-card__info-group">
              <div class="ag-price-card__name-row">
                <span class="ag-price-card__name">${meta.name || "Retailer"}</span>
                ${featuredBadgeHTML}
                ${trustBadgeHTML}
              </div>
              <div class="ag-price-card__seller-name">${meta.seller_name || ""}</div>
              <div class="ag-price-card__retailer-meta">${getTxt("updated", lang).replace("{time}", meta.time || "5h ago")}</div>
            </div>
            <div class="ag-price-card__price-wrapper">
              ${outOfStockHTML}
              <div class="ag-price-card__price-primary" data-local="${localCurrencyCode}" data-price="${baseTRY}" data-price-key="${retailerId}">${showPrimary}</div>
              <div class="ag-price-card__price-secondary" data-local="${localCurrencyCode}" data-price="${baseTRY}" data-price-key="${retailerId}" style="${secondaryPriceHTML ? 'display:block;' : 'display:none;'}">${secondaryPriceHTML}</div>
            </div>
            <a class="ag-btn ${isOutOfStock ? "ag-btn--outline-muted" : (isWinner ? "ag-btn--primary" : "ag-btn--secondary")} ag-btn--small ag-price-card__btn-action" href="${meta.url || "#"}">
              <span>${getTxt("go_to_store", lang)}</span>
              <svg class="ag-rtl-flip" fill="none" height="14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="14">
                <line x1="5" x2="19" y1="12" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        `;
        parentContainer.appendChild(cardDiv);
      }
    },

    // Delegate to central Toast notification trigger
    showToast: function (message) {
      if (window.GapLuckToast && typeof window.GapLuckToast.show === "function") {
        window.GapLuckToast.show(message);
      } else {
        console.warn("GapLuckToast: Central toast component is not loaded.");
      }
    }
  };

})();
