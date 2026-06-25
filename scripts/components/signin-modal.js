/**
 * GapLuck - Reusable Sign-In Modal Component
 * Centralizes the markup, behavior, and styling integration for the sign-in modal.
 */

(function () {
  'use strict';

  // Modal HTML structure
  const modalHTML = `
    <div class="ag-modal-backdrop" id="signin-modal-backdrop">
      <div class="ag-signin-modal" role="dialog" aria-modal="true" aria-labelledby="signin-title">
        <button class="ag-signin-modal__close-btn" id="signin-close-btn" aria-label="Close dialog">
          <svg fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20">
            <line x1="18" x2="6" y1="6" y2="18"></line>
            <line x1="6" x2="18" y1="6" y2="18"></line>
          </svg>
        </button>
        <div class="ag-signin-modal__container">
          <div class="ag-signin-modal__form-pane">
            <div class="ag-signin-modal__logo-container">
              <span class="ag-navbar__logo-text">Gap<span class="ag-navbar__logo-text--highlight">Luck</span></span>
            </div>
            <h2 class="ag-signin-modal__title" id="signin-title" data-i18n="signin_modal_title">Not a myth, there is a right moment to save</h2>
            <p class="ag-signin-modal__description" data-i18n="signin_modal_desc">Sign in or create an account to track prices, compare saved choices, and save when the price drops.</p>
            <form class="ag-signin-modal__form" id="signin-form">
              <div class="ag-form-group">
                <label class="ag-form-label" for="signin-email" data-i18n="email_label">Email</label>
                <input class="ag-form-input" id="signin-email" type="email" data-i18n-placeholder="email_placeholder" placeholder="Enter your email address" required />
              </div>
              <button type="submit" class="ag-btn ag-btn--primary ag-signin-modal__submit-btn" data-i18n="continue_btn">Continue</button>
            </form>
            <div class="ag-signin-modal__divider">
              <span class="ag-signin-modal__divider-text" data-i18n="or_separator">or</span>
            </div>
            <div class="ag-signin-modal__social-group" id="signin-social-group">
              <!-- Dynamically populated by social-auth.js -->
            </div>
            <div class="ag-signin-modal__footer-options">
              <label class="ag-form-checkbox-row">
                <input type="checkbox" id="signin-remember" checked />
                <span data-i18n="remember_me">Remember me</span>
              </label>
            </div>
            <p class="ag-signin-modal__terms-text" data-i18n="signin_legal_html">
              By continuing you agree to GapLuck's <a href="#" class="ag-signin-modal__link">Terms of Service</a> and acknowledge that you have read our <a href="#" class="ag-signin-modal__link">Privacy Policy</a>.
            </p>
          </div>
          <div class="ag-signin-modal__image-pane">
            <img class="ag-signin-modal__image" src="../assets/traveler_marketplace_hero.png" alt="A traveler carrying packages, representing GapLuck's global marketplace courier network" />
            <div class="ag-signin-modal__image-badge">
              <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Dynamic Injection on Load
  function injectModal() {
    // Prevent duplicate injection
    if (document.getElementById('signin-modal-backdrop')) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML.trim();
    const modalElement = wrapper.firstChild;
    document.body.appendChild(modalElement);

    setupEventListeners();
  }

  // Event Listeners Setup
  function setupEventListeners() {
    const backdrop = document.getElementById('signin-modal-backdrop');
    const closeBtn = document.getElementById('signin-close-btn');
    const form = document.getElementById('signin-form');

    if (!backdrop) return;

    // Render dynamic social buttons
    const socialContainer = document.getElementById('signin-social-group');
    if (socialContainer && window.GapLuckSocialAuth) {
      window.GapLuckSocialAuth.render(socialContainer, { showText: false, responsive: false });
    }

    let lastActiveElement = null;
    const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex="0"], [contenteditable]';

    function handleTrapFocus(e) {
      if (e.key !== 'Tab') return;

      const focusableElements = Array.from(backdrop.querySelectorAll(focusableSelector)).filter(
        el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
      );
      if (focusableElements.length === 0) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    function handleDocumentFocusIn(e) {
      const modal = backdrop.querySelector('.ag-signin-modal');
      if (modal && !modal.contains(e.target)) {
        const focusableElements = Array.from(modal.querySelectorAll(focusableSelector)).filter(
          el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
        );
        if (focusableElements.length > 0) {
          e.preventDefault();
          focusableElements[0].focus();
        }
      }
    }

    // Open Modal Function
    window.GapLuckSigninModal.open = function (context) {
      lastActiveElement = document.activeElement;
      backdrop.classList.add('ag-modal-backdrop--open');
      document.body.style.overflow = 'hidden';

      // Bind accessibility listeners
      backdrop.addEventListener('keydown', handleTrapFocus);
      document.addEventListener('focusin', handleDocumentFocusIn);

      // Apply context-specific title and description if provided
      const titleEl = document.getElementById('signin-title');
      const descEl = document.querySelector('.ag-signin-modal__description');
      
      if (titleEl && descEl) {
        if (context === 'premium') {
          titleEl.innerText = 'Unlock Premium Price Intelligence';
          descEl.innerText = 'Sign up for a Premium account to track unlimited products, get instant notifications, and unlock advanced search metrics.';
        } else if (context === 'traveler') {
          titleEl.innerText = 'Become a GapLuck Marketplace Traveler';
          descEl.innerText = 'Register as a traveler to monetize your extra luggage space by delivering packages on your routes.';
        } else if (context && typeof context === 'object') {
          if (context.title) titleEl.innerText = context.title;
          if (context.description) descEl.innerText = context.description;
        } else {
          // Reset to defaults
          titleEl.innerText = 'Not a myth, there is a right moment to save';
          descEl.innerText = 'Sign in or create an account to track prices, compare saved choices, and save when the price drops.';
        }
      }

      // Auto-focus email input
      setTimeout(() => {
        const emailInput = document.getElementById('signin-email');
        if (emailInput) emailInput.focus();
      }, 100);
    };

    // Close Modal Function
    window.GapLuckSigninModal.close = function () {
      backdrop.classList.remove('ag-modal-backdrop--open');
      document.body.style.overflow = '';

      // Unbind accessibility listeners
      backdrop.removeEventListener('keydown', handleTrapFocus);
      document.removeEventListener('focusin', handleDocumentFocusIn);

      // Restore focus
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
      lastActiveElement = null;
    };

    // Bind Close Triggers
    if (closeBtn) {
      closeBtn.addEventListener('click', window.GapLuckSigninModal.close);
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        window.GapLuckSigninModal.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('ag-modal-backdrop--open')) {
        window.GapLuckSigninModal.close();
      }
    });

    // Mock Form Submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('signin-email');
        const email = emailInput ? emailInput.value : '';
        const currentLang = document.documentElement.getAttribute('lang') || 'en';

        const welcomeMsgs = {
          en: `Login successful! Welcome: ${email}`,
          tr: `Giriş başarılı! Hoş geldiniz: ${email}`,
          ar: `تم تسجيل الدخول بنجاح! مرحبًا بك: ${email}`
        };

        const message = welcomeMsgs[currentLang] || welcomeMsgs.en;
        if (window.GapLuckToast && typeof window.GapLuckToast.show === 'function') {
          window.GapLuckToast.show(message);
        } else {
          alert(message);
        }
        window.GapLuckSigninModal.close();
      });
    }
  }

  // Expose Global Controller Namespace
  window.GapLuckSigninModal = {
    open: function () {
      console.warn('GapLuckSigninModal: Modal is not injected yet.');
    },
    close: function () {
      console.warn('GapLuckSigninModal: Modal is not injected yet.');
    },
    translate: function (lang) {
      // The parent page's own translation engine handles translating the newly injected DOM elements
      // since they contain standard [data-i18n] and [data-i18n-placeholder] attributes.
      // This is a placeholder hook for page scripts to sync state if needed.
    }
  };

  // Inject as soon as document body is ready
  if (document.body) {
    injectModal();
  } else {
    document.addEventListener('DOMContentLoaded', injectModal);
  }

  // Delegate sign-in button clicks globally to support static & dynamic buttons
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.ag-navbar__btn-signin');
    if (trigger) {
      e.preventDefault();
      window.GapLuckSigninModal.open();
    }
  });

})();
