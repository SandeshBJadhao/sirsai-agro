// ============================================================
// SIRSAI AGRO - i18n Engine (Vanilla JS)
// Default: Marathi ('mr')
// Persists choice in localStorage
// ============================================================

(function () {
    'use strict';

    const DEFAULT_LANG = 'mr';
    const STORAGE_KEY = 'sirsai_lang';

    // Get saved language or default to Marathi
    function getCurrentLang() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    }

    // Save language choice
    function setCurrentLang(lang) {
        localStorage.setItem(STORAGE_KEY, lang);
    }

    // Apply translations to all [data-i18n] elements
    function applyTranslations(lang) {
        const dict = translations[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                // Check if the translation contains HTML tags
                if (dict[key].includes('<') && dict[key].includes('>')) {
                    el.innerHTML = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // Update the html lang attribute
        document.documentElement.lang = lang === 'mr' ? 'mr' : 'en';

        // Update toggle button text (show the OTHER language to switch to)
        const toggleBtn = document.getElementById('lang-toggle-btn');
        if (toggleBtn) {
            const label = toggleBtn.querySelector('.lang-toggle-label');
            if (label) {
                label.textContent = dict.lang_label;
            }
            // Update active indicator
            toggleBtn.setAttribute('data-active-lang', lang);
        }
    }

    // Toggle between mr and en
    function toggleLanguage() {
        const current = getCurrentLang();
        const next = current === 'mr' ? 'en' : 'mr';
        setCurrentLang(next);
        applyTranslations(next);
    }

    // Initialize on DOM ready
    function init() {
        const lang = getCurrentLang();
        applyTranslations(lang);

        // Bind toggle button
        const toggleBtn = document.getElementById('lang-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleLanguage();
            });
        }
    }

    // Expose globally for product page dynamic content
    window.sirsaiI18n = {
        getCurrentLang,
        applyTranslations,
        toggleLanguage
    };

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
