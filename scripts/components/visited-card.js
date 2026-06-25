/**
 * GapLuck - Centralized Visited Card Component
 * Dynamically renders the "Last Visited Comparisons" cards.
 * Trilingual and currency conversion friendly.
 */

(function () {
  'use strict';

  const GapLuckVisitedCard = {
    /**
     * Render a single visited card
     * @param {Object} data The card data object
     * @param {HTMLElement} parentContainer The container to append the card to
     */
    render: function (data, parentContainer) {
      if (!parentContainer || !data) return;

      const card = document.createElement('a');
      card.className = 'ag-visited-card';
      card.href = data.url || 'comparison_V3.html';
      
      // Support custom attributes for currency updates
      if (data.savingsBaseTRY) {
        card.setAttribute('data-price-container', 'true');
      }

      const activeLang = window.currentLang || 'en';
      const dict = window.GapLuckI18N ? (window.GapLuckI18N[activeLang] || window.GapLuckI18N.en) : {};
      
      // Get dynamic savings text
      let savingsText = data.savingsText || '';
      if (data.savingsBaseTRY) {
        const fmtSavings = window.formatMoney(data.savingsBaseTRY, window.currentCurrency || 'TRY');
        const savePrefix = dict['save'] || (activeLang === 'tr' ? 'Tasarruf Edin' : (activeLang === 'ar' ? 'وفر' : 'Save'));
        savingsText = `${savePrefix} ${fmtSavings}`;
      }

      card.innerHTML = `
        <div class="ag-visited-card__info">
          <div class="ag-visited-card__image" aria-hidden="true">${data.emoji || '📦'}</div>
          <div class="ag-visited-card__details">
            <div class="ag-visited-card__title">${data.title || 'Product'}</div>
            <div class="ag-visited-card__meta">${data.category || ''} · ${data.brand || ''}</div>
          </div>
        </div>
        <div class="ag-visited-card__footer">
          <span class="ag-visited-card__route">${data.route || ''}</span>
          <span class="ag-visited-card__savings" data-price="${data.savingsBaseTRY || ''}">${savingsText}</span>
        </div>
      `;

      parentContainer.appendChild(card);
      return card;
    }
  };

  // Expose component to global namespace
  window.GapLuckVisitedCard = GapLuckVisitedCard;
})();
