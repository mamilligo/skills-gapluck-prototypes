/**
 * i18n-controller.js
 * Centralized multi-language translation and layout direction (RTL/LTR) controller
 * for the GapLuck platform.
 *
 * Exposes: window.GapLuckI18N_Controller
 */

(function () {
  'use strict';

  var i18nController = {
    /**
     * Translates all elements on the page with [data-i18n] and [data-i18n-placeholder] attributes
     * and switches layout direction between RTL and LTR as necessary.
     * 
     * @param {string} lang - The language code (e.g., 'en', 'tr', 'ar')
     */
    translate: function (lang) {
      if (!lang) return;
      var code = lang.toLowerCase();
      window.currentLang = code;

      // Toggle RTL/LTR and set CSS custom property
      var isRtl = code === 'ar';
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      document.documentElement.style.setProperty('--rtl-flip', isRtl ? '-1' : '1');

      // Sync navbar selectors if they exist
      var langSel = document.getElementById('lang-selector');
      if (langSel) langSel.value = code;
      var langSelMob = document.getElementById('lang-selector-mobile');
      if (langSelMob) langSelMob.value = code;

      // 1. Loop over elements with [data-i18n]
      var elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        var dict = window.GapLuckI18N ? (window.GapLuckI18N[code] || window.GapLuckI18N.en) : {};
        var dictEn = window.GapLuckI18N ? window.GapLuckI18N.en : {};
        var txt = dict[key] || dictEn[key] || '';

        // Handle format templates (like {count}, {locked}, {time}, {date})
        if (key === 'markets_shown') {
          var count = el.getAttribute('data-i18n-val-count') || '';
          var locked = el.getAttribute('data-i18n-val-locked') || '';
          txt = txt.replace('{count}', count).replace('{locked}', locked);
        } else if (key === 'updated') {
          var val = el.getAttribute('data-i18n-val') || '';
          txt = txt.replace('{time}', val);
        } else if (key === 'last_verified') {
          var dateVal = el.getAttribute('data-i18n-val') || '';
          txt = txt.replace('{date}', dateVal);
        }

        if (key === 'signin_legal_html') {
          el.innerHTML = txt;
        } else {
          el.textContent = txt;
        }
      });

      // 2. Loop over inputs with [data-i18n-placeholder]
      var inputs = document.querySelectorAll('[data-i18n-placeholder]');
      inputs.forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        var dict = window.GapLuckI18N ? (window.GapLuckI18N[code] || window.GapLuckI18N.en) : {};
        var dictEn = window.GapLuckI18N ? window.GapLuckI18N.en : {};
        var txt = dict[key] || dictEn[key] || '';
        el.setAttribute('placeholder', txt);
      });
    }
  };

  // Expose to window
  window.GapLuckI18N_Controller = i18nController;

  // Listen to the global language change event automatically
  window.addEventListener('gl-language-change', function (e) {
    if (e.detail && e.detail.language) {
      i18nController.translate(e.detail.language);
    }
  });
})();
