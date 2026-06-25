/**
 * GapLuck - Watchlist Alert Popover Component JS
 * Programmatic controller for setting price alerts and toggling saved products.
 * Strictly avoids em-dash characters, uses BEM, and translates interfaces trilingually.
 */

(function () {
  'use strict';

  // Trilingual dictionary
  const translations = {
    en: {
      set_alert_title: 'Set Price Alert',
      notify_text: 'Notify me when the price drops below:',
      set_alert_btn: 'Set Alert',
      remove_btn: 'Remove Alert',
      close_btn: 'Close',
      alert_saved_toast: 'Price alert set at {price} successfully!',
      removed_toast: 'Product removed from watchlist.',
      added_toast: 'Product added to watchlist!'
    },
    tr: {
      set_alert_title: 'Fiyat Alarmı Kur',
      notify_text: 'Fiyat şunun altına düştüğünde bana haber ver:',
      set_alert_btn: 'Kur',
      remove_btn: 'Alarmı Kaldır',
      close_btn: 'Kapat',
      alert_saved_toast: 'Fiyat alarmı {price} olarak başarıyla kuruldu!',
      removed_toast: 'Ürün takip listesinden çıkarıldı.',
      added_toast: 'Ürün takip listesine eklendi!'
    },
    ar: {
      set_alert_title: 'تحديد تنبيه السعر',
      notify_text: 'تنبيهي عندما ينخفض السعر عن:',
      set_alert_btn: 'تحديد تنبيه',
      remove_btn: 'إزالة التنبيه',
      close_btn: 'إغلاق',
      alert_saved_toast: 'تم تحديد تنبيه السعر بنجاح عند {price}!',
      removed_toast: 'تم إزالة المنتج من قائمة المراقبة.',
      added_toast: 'تم إضافة المنتج إلى قائمة المراقبة!'
    }
  };

  // Helper to extract active language
  function getLanguage() {
    return document.documentElement.getAttribute('lang') || 'en';
  }

  // Helper to retrieve active currency symbol
  function getCurrencySymbol() {
    const currency = localStorage.getItem('gl-currency') || localStorage.getItem('ag-currency') || 'TRY';
    if (window.GapLuckCurrency && typeof window.GapLuckCurrency.getSymbol === 'function') {
      return window.GapLuckCurrency.getSymbol(currency);
    }
    const symbols = { TRY: '₺', USD: '$', EUR: '€', AED: 'د.إ', GBP: '£' };
    return symbols[currency] || currency;
  }

  const GapLuckWatchlist = {
    popoverHTML: `
      <div class="ag-watchlist-popover">
        <h3 class="ag-watchlist-popover__title">Set Price Alert</h3>
        <div class="ag-watchlist-popover__body">
          <p class="ag-watchlist-popover__text">Notify me when the price drops below:</p>
          <div class="ag-watchlist-popover__input-group">
            <span class="ag-watchlist-popover__currency">₺</span>
            <input class="ag-watchlist-popover__input" type="number" value="48000" />
          </div>
          <div class="ag-watchlist-popover__actions">
            <button class="ag-btn ag-btn--primary ag-btn--small ag-watchlist-popover__btn ag-watchlist-popover__btn--save" type="button">Set Alert</button>
            <button class="ag-btn ag-btn--secondary ag-btn--small ag-watchlist-popover__btn ag-watchlist-popover__btn--remove" type="button" style="display: none;">Remove Alert</button>
            <button class="ag-btn ag-btn--secondary ag-btn--small ag-watchlist-popover__btn ag-watchlist-popover__btn--close" type="button">Close</button>
          </div>
        </div>
      </div>
    `,

    // Instantiates popover inside a container wrapper
    init: function (containerSelector) {
      const container = typeof containerSelector === 'string'
        ? document.querySelector(containerSelector)
        : containerSelector;

      if (!container || container.querySelector('.ag-watchlist-popover')) return;

      // Inject popover HTML structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.popoverHTML.trim();
      const popoverElement = tempDiv.firstChild;
      container.appendChild(popoverElement);

      const watchlistBtn = container.querySelector('.ag-btn--watchlist');
      if (watchlistBtn) {
        this.bindEvents(container, watchlistBtn, popoverElement);
      }
    },

    // Binds interactive triggers
    bindEvents: function (container, button, popover) {
      const saveBtn = popover.querySelector('.ag-watchlist-popover__btn--save');
      const removeBtn = popover.querySelector('.ag-watchlist-popover__btn--remove');
      const closeBtn = popover.querySelector('.ag-watchlist-popover__btn--close');
      const priceInput = popover.querySelector('.ag-watchlist-popover__input');

      // Setup initial visual translation texts
      this.translatePopover(popover);

      // Fallback document focus trap
      const handleDocumentFocusIn = (e) => {
        if (popover.classList.contains('ag-watchlist-popover--open') && !popover.contains(e.target) && e.target !== button) {
          const focusables = [priceInput, saveBtn, removeBtn, closeBtn].filter(
            el => el && el.style.display !== 'none'
          );
          if (focusables.length > 0) {
            e.preventDefault();
            focusables[0].focus();
          }
        }
      };

      popover._focusinListener = handleDocumentFocusIn;

      // Helper to close popover cleanly resetting styles
      const closePopover = () => {
        popover.classList.remove('ag-watchlist-popover--open');
        container.classList.remove('ag-watchlist-container--open');
        
        const actionsPanel = container.closest('.ag-product-summary__actions');
        if (actionsPanel) {
          actionsPanel.classList.remove('ag-product-summary__actions--open');
        }

        if (popover._focusinListener) {
          document.removeEventListener('focusin', popover._focusinListener);
        }

        if (button && typeof button.focus === 'function') {
          button.focus();
        }
      };

      // Helper to open popover with collision detection
      const openPopover = () => {
        popover.classList.add('ag-watchlist-popover--open');
        container.classList.add('ag-watchlist-container--open');
        
        // Elevate parent stacking context to prevent clipping/overlapping
        const actionsPanel = container.closest('.ag-product-summary__actions');
        if (actionsPanel) {
          actionsPanel.classList.add('ag-product-summary__actions--open');
        }

        // Check screen boundaries (right-aligned by default, so check left overflow)
        const rect = popover.getBoundingClientRect();
        const overflowLeft = rect.left < 0;

        if (overflowLeft) {
          popover.classList.add('ag-watchlist-popover--left');
        } else {
          popover.classList.remove('ag-watchlist-popover--left');
        }

        if (popover._focusinListener) {
          document.addEventListener('focusin', popover._focusinListener);
        }

        // Focus input
        setTimeout(() => {
          if (priceInput) priceInput.focus();
        }, 50);

        // Update symbol
        const symbolEl = popover.querySelector('.ag-watchlist-popover__currency');
        if (symbolEl) symbolEl.textContent = getCurrencySymbol();
      };

      // Handle button click toggle (only if not manual watchlist)
      if (!button.hasAttribute('data-manual-watchlist')) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const isActive = button.classList.contains('ag-btn--watchlist-active');

          if (isActive) {
            if (removeBtn) removeBtn.style.display = 'inline-block';
            openPopover();
          } else {
            if (removeBtn) removeBtn.style.display = 'none';
            openPopover();
          }
        });
      }

      // Handle Close Action
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          closePopover();
        });
      }

      // Handle Remove Action
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          button.classList.remove('ag-btn--watchlist-active');
          closePopover();
          this.showToast('removed_toast');

          // Clean alerts history list if needed
          try {
            localStorage.removeItem('gl-watchlist-alerts');
          } catch (err) {
            // storage failed
          }
        });
      }

      // Handle Save Action
      if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const priceVal = priceInput ? priceInput.value : '';
          button.classList.add('ag-btn--watchlist-active');
          closePopover();

          const lang = getLanguage();
          const t = translations[lang] || translations.en;
          const currency = localStorage.getItem('gl-currency') || 'TRY';
          const formatted = `${getCurrencySymbol()}${parseFloat(priceVal).toLocaleString()}`;
          const message = t.alert_saved_toast.replace('{price}', formatted);

          if (window.GapLuckToast && typeof window.GapLuckToast.show === 'function') {
            window.GapLuckToast.show(message);
          } else {
            alert(message);
          }

          // Save alerts history list
          try {
            const alerts = JSON.parse(localStorage.getItem('gl-watchlist-alerts') || '[]');
            alerts.push({ price: priceVal, currency: currency, timestamp: Date.now() });
            localStorage.setItem('gl-watchlist-alerts', JSON.stringify(alerts));
          } catch (err) {
            // storage failed
          }
        });
      }

      // Close popover on Click Outside bounds
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && popover.classList.contains('ag-watchlist-popover--open')) {
          closePopover();
        }
      });

      // Keyboard Accessibility: Escape key and Focus Trap
      popover.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closePopover();
          button.focus();
          return;
        }

        if (e.key === 'Tab') {
          const focusables = [priceInput, saveBtn, removeBtn, closeBtn].filter(
            el => el && el.style.display !== 'none'
          );

          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      });

      // Synchronize dynamically on language update
      window.addEventListener('gl-language-change', () => {
        this.translatePopover(popover);
      });
    },

    // Populate translations on Popover elements
    translatePopover: function (popover) {
      const lang = getLanguage();
      const t = translations[lang] || translations.en;

      const titleEl = popover.querySelector('.ag-watchlist-popover__title');
      const textEl = popover.querySelector('.ag-watchlist-popover__text');
      const saveBtn = popover.querySelector('.ag-watchlist-popover__btn--save');
      const removeBtn = popover.querySelector('.ag-watchlist-popover__btn--remove');
      const closeBtn = popover.querySelector('.ag-watchlist-popover__btn--close');

      if (titleEl) titleEl.textContent = t.set_alert_title;
      if (textEl) textEl.textContent = t.notify_text;
      if (saveBtn) saveBtn.textContent = t.set_alert_btn;
      if (removeBtn) removeBtn.textContent = t.remove_btn;
      if (closeBtn) closeBtn.textContent = t.close_btn;
    },

    showToast: function (key) {
      const lang = getLanguage();
      const t = translations[lang] || translations.en;
      const message = t[key] || t.added_toast;

      if (window.GapLuckToast && typeof window.GapLuckToast.show === 'function') {
        window.GapLuckToast.show(message);
      } else {
        alert(message);
      }
    }
  };

  // Expose both namespaces for backward compatibility
  window.GapLuckWatchlist = GapLuckWatchlist;
  window.GapLuckWatchlistPopover = {
    toggle: function (btn, defaultAlertVal, symbol) {
      const container = btn.closest('.ag-watchlist-container');
      if (!container) return;

      let popover = container.querySelector('.ag-watchlist-popover');
      if (!popover) {
        GapLuckWatchlist.init(container);
        popover = container.querySelector('.ag-watchlist-popover');
      }

      if (!popover) return;

      const isOpen = popover.classList.contains('ag-watchlist-popover--open');
      if (isOpen) {
        // Close cleanly
        popover.classList.remove('ag-watchlist-popover--open');
        container.classList.remove('ag-watchlist-container--open');
        const actionsPanel = container.closest('.ag-product-summary__actions');
        if (actionsPanel) {
          actionsPanel.classList.remove('ag-product-summary__actions--open');
        }
        if (popover._focusinListener) {
          document.removeEventListener('focusin', popover._focusinListener);
        }
        if (btn && typeof btn.focus === 'function') {
          btn.focus();
        }
      } else {
        const isActive = btn.classList.contains('ag-btn--watchlist-active');
        const priceInput = popover.querySelector('.ag-watchlist-popover__input');
        const symbolEl = popover.querySelector('.ag-watchlist-popover__currency');
        const removeBtn = popover.querySelector('.ag-watchlist-popover__btn--remove');

        // Dynamic fallback price calculation if defaultAlertVal is undefined
        let calculatedVal = defaultAlertVal;
        if (calculatedVal === undefined) {
          const rawPriceText = document.querySelector('.ag-product-summary__price-amount, .ag-price-card__price-primary')?.textContent;
          if (rawPriceText) {
            const numericPrice = parseFloat(rawPriceText.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(numericPrice)) {
              calculatedVal = Math.round(numericPrice * 0.9);
            }
          }
          if (!calculatedVal || isNaN(calculatedVal)) {
            calculatedVal = 48000;
          }
        }

        if (priceInput && calculatedVal !== undefined) {
          priceInput.value = calculatedVal;
        }
        if (symbolEl && symbol) {
          symbolEl.textContent = symbol;
        }

        if (isActive) {
          if (removeBtn) removeBtn.style.display = 'inline-block';
        } else {
          if (removeBtn) removeBtn.style.display = 'none';
        }

        // Open popover, elevate stacking context
        popover.classList.add('ag-watchlist-popover--open');
        container.classList.add('ag-watchlist-container--open');
        const actionsPanel = container.closest('.ag-product-summary__actions');
        if (actionsPanel) {
          actionsPanel.classList.add('ag-product-summary__actions--open');
        }

        // Boundary checking (right-aligned by default, check left overflow)
        const rect = popover.getBoundingClientRect();
        const overflowLeft = rect.left < 0;

        if (overflowLeft) {
          popover.classList.add('ag-watchlist-popover--left');
        } else {
          popover.classList.remove('ag-watchlist-popover--left');
        }

        if (popover._focusinListener) {
          document.addEventListener('focusin', popover._focusinListener);
        }

        setTimeout(() => {
          if (priceInput) priceInput.focus();
        }, 50);
      }
    }
  };

  // Initialize auto-scan
  function scanAndInit() {
    const containers = document.querySelectorAll('.ag-watchlist-container');
    containers.forEach(container => {
      GapLuckWatchlist.init(container);
    });
  }

  if (document.body) {
    scanAndInit();
  } else {
    document.addEventListener('DOMContentLoaded', scanAndInit);
  }

})();
