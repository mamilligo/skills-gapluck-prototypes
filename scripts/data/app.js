/**
 * app.js
 * Centralized application state controller and global event bus for the GapLuck platform.
 * Synchronizes multi-language (i18n) and currency settings across pages and components.
 *
 * Exposes: window.GapLuckApp
 */

(function () {
  'use strict';

  var savedLang = localStorage.getItem('gl-lang') || localStorage.getItem('ag-lang') || 'en';
  var savedCurrency = localStorage.getItem('gl-currency') || localStorage.getItem('ag-currency') || 'TRY';

  var GapLuckApp = {
    language: savedLang.toLowerCase(),
    currency: savedCurrency.toUpperCase(),

    /**
     * Sets the global application language, persists it, and fires the change event.
     * @param {string} lang - The language code (e.g. 'en', 'tr', 'ar')
     */
    setLanguage: function (lang) {
      if (!lang) return;
      var code = lang.toLowerCase();
      this.language = code;

      localStorage.setItem('gl-lang', code);
      localStorage.setItem('ag-lang', code);

      // Dispatch global event for all listeners
      window.dispatchEvent(new CustomEvent('gl-language-change', {
        detail: { language: code }
      }));
    },

    /**
     * Sets the global application currency, persists it, and fires the change event.
     * @param {string} currencyCode - The currency code (e.g. 'TRY', 'USD', 'EUR')
     */
    setCurrency: function (currencyCode) {
      if (!currencyCode) return;
      var code = currencyCode.toUpperCase();
      this.currency = code;

      localStorage.setItem('gl-currency', code);
      localStorage.setItem('ag-currency', code);

      // Dispatch global event for all listeners
      window.dispatchEvent(new CustomEvent('gl-currency-change', {
        detail: { currency: code }
      }));
    }
  };

  // Expose to window
  window.GapLuckApp = GapLuckApp;

  // Initialize and bind navbar elements once DOM is ready
  function initApp() {
    // 1. Dispatch initial state events so loaded components synchronize immediately
    GapLuckApp.setLanguage(GapLuckApp.language);
    GapLuckApp.setCurrency(GapLuckApp.currency);

    // 2. Bind change listeners to navbar selectors (desktop and mobile)
    var langSel = document.getElementById('lang-selector');
    var langSelMob = document.getElementById('lang-selector-mobile');
    var currSel = document.getElementById('currency-selector');
    var currSelMob = document.getElementById('currency-selector-mobile');

    if (langSel) {
      langSel.addEventListener('change', function (e) {
        GapLuckApp.setLanguage(e.target.value);
      });
    }
    if (langSelMob) {
      langSelMob.addEventListener('change', function (e) {
        GapLuckApp.setLanguage(e.target.value);
      });
    }
    if (currSel) {
      currSel.addEventListener('change', function (e) {
        GapLuckApp.setCurrency(e.target.value);
      });
    }
    if (currSelMob) {
      currSelMob.addEventListener('change', function (e) {
        GapLuckApp.setCurrency(e.target.value);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
