// Theme Management Utility

const ThemeManager = {
    /**
     * Initialize theme from localStorage or system preference
     */
    init: function() {
        const savedTheme = localStorage.getItem(PokemonConstants.STORAGE_KEYS.THEME);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let theme = savedTheme;
        
        // If no saved theme, use system preference
        if (!theme) {
            theme = systemPrefersDark ? 'dark' : 'light';
        }
        
        this.setTheme(theme);
        this.updateThemeIcon(theme === 'dark');
    },

    /**
     * Set theme on document
     * @param {string} theme - 'light' or 'dark'
     */
    setTheme: function(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        localStorage.setItem(PokemonConstants.STORAGE_KEYS.THEME, theme);
    },

    /**
     * Toggle between light and dark theme
     */
    toggle: function() {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        
        this.setTheme(newTheme);
        this.updateThemeIcon(!isDark);
        
        // Dispatch custom event for theme change
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: newTheme }
        }));
    },

    /**
     * Update theme toggle button icon
     * @param {boolean} isDark - Whether dark theme is active
     */
    updateThemeIcon: function(isDark) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun text-xl' : 'fas fa-moon text-xl';
        }
        
        // Update aria-label for accessibility
        themeToggle.setAttribute('aria-label', 
            isDark ? 'Switch to light theme' : 'Switch to dark theme'
        );
    },

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    getCurrentTheme: function() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    },

    /**
     * Check if system prefers dark mode
     * @returns {boolean} True if system prefers dark mode
     */
    systemPrefersDark: function() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /**
     * Listen for system theme changes
     */
    watchSystemTheme: function() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only change if user hasn't set a preference
            if (!localStorage.getItem(PokemonConstants.STORAGE_KEYS.THEME)) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
                this.updateThemeIcon(e.matches);
            }
        });
    },

    /**
     * Apply theme to specific element
     * @param {HTMLElement} element - Element to apply theme to
     * @param {string} theme - Theme to apply
     */
    applyToElement: function(element, theme) {
        if (!element) return;
        
        if (theme === 'dark') {
            element.classList.add('dark');
        } else {
            element.classList.remove('dark');
        }
    },

    /**
     * Get theme colors for custom styling
     * @returns {Object} Theme colors
     */
    getThemeColors: function() {
        const isDark = this.getCurrentTheme() === 'dark';
        
        return {
            background: isDark ? '#1f2937' : '#f3f4f6',
            card: isDark ? '#374151' : '#ffffff',
            text: isDark ? '#f9fafb' : '#111827',
            border: isDark ? '#4b5563' : '#d1d5db',
            primary: isDark ? '#ef4444' : '#dc2626'
        };
    },

    /**
     * Add theme transition class to element
     * @param {HTMLElement} element - Element to add transition to
     */
    addTransition: function(element) {
        if (element) {
            element.classList.add('theme-transition');
        }
    }
};

// Initialize when constants are loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for constants to load
    setTimeout(() => {
        if (window.PokemonConstants) {
            ThemeManager.init();
            ThemeManager.watchSystemTheme();
        }
    }, 100);
});

// Export to global scope
window.ThemeManager = ThemeManager;