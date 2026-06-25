/**
 * GapLuck - Centralized Deal Card Component
 * Dynamically renders product deal cards for carousels and grids.
 * Trilingual and currency conversion friendly.
 */

(function () {
  'use strict';

  const GapLuckDealCard = {
    /**
     * Render a single deal card
     * @param {Object} data The deal data object
     * @param {HTMLElement} parentContainer The container to append the card to
     */
    render: function (data, parentContainer) {
      if (!parentContainer || !data) return;

      const card = document.createElement('a');
      card.className = 'ag-deal-card';
      card.href = data.url || 'comparison_V3.html';
      
      // Support custom attributes for currency updates
      if (data.priceBaseTRY) {
        card.setAttribute('data-price-container', 'true');
      }

      const activeLang = window.currentLang || 'en';
      const dict = window.GapLuckI18N ? (window.GapLuckI18N[activeLang] || window.GapLuckI18N.en) : {};
      
      // Get dynamic price text
      let priceText = '';
      if (data.priceBaseTRY) {
        priceText = window.formatMoney(data.priceBaseTRY, window.currentCurrency || 'TRY');
      } else {
        priceText = data.price || '';
      }

      // Get dynamic savings text
      let savingsText = '';
      if (data.savingsBaseTRY) {
        const savingsAmt = window.formatMoney(data.savingsBaseTRY, window.currentCurrency || 'TRY');
        savingsText = `-${data.savingsPercent || '30'}% ${dict['savings'] || 'Savings'}`;
      } else if (data.savingsPercent) {
        savingsText = `-${data.savingsPercent}% ${dict['savings'] || 'Savings'}`;
      } else {
        savingsText = data.savings || '';
      }

      card.innerHTML = `
        <div class="ag-deal-card__image-box" aria-hidden="true">${data.imageLabel || 'Product'}</div>
        <h4 class="ag-deal-card__title">${data.title || 'Product'}</h4>
        <div class="ag-deal-card__brand">${data.brand || ''}</div>
        <div class="ag-deal-card__price-row">
          <span class="ag-deal-card__price" data-price="${data.priceBaseTRY || ''}">${priceText}</span>
          <span class="ag-deal-card__savings">${savingsText}</span>
        </div>
      `;

      parentContainer.appendChild(card);
      return card;
    },


  };

  // Expose component to global namespace
  window.GapLuckDealCard = GapLuckDealCard;
})();
