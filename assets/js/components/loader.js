// Loading Component

const PokemonLoader = {
    /**
     * Show loading state
     */
    show: function() {
        const loadingElement = document.getElementById('loadingState');
        const errorElement = document.getElementById('errorState');
        const noResultsElement = document.getElementById('noResultsState');
        const pokemonGrid = document.getElementById('pokemonGrid');
        
        if (loadingElement) loadingElement.classList.remove('hidden');
        if (errorElement) errorElement.classList.add('hidden');
        if (noResultsElement) noResultsElement.classList.add('hidden');
        if (pokemonGrid) pokemonGrid.innerHTML = '';
        
        // Disable search and filter inputs
        this.disableInputs(true);
    },

    /**
     * Hide loading state
     */
    hide: function() {
        const loadingElement = document.getElementById('loadingState');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
        
        // Re-enable inputs
        this.disableInputs(false);
    },

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError: function(message = 'Failed to load Pokémon data') {
        const errorElement = document.getElementById('errorState');
        const loadingElement = document.getElementById('loadingState');
        
        if (errorElement) {
            errorElement.classList.remove('hidden');
            
            // Update error message if needed
            const errorMessage = errorElement.querySelector('p');
            if (errorMessage && message) {
                errorMessage.textContent = message;
            }
        }
        
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
        
        // Re-enable inputs
        this.disableInputs(false);
    },

    /**
     * Show no results state
     */
    showNoResults: function() {
        const noResultsElement = document.getElementById('noResultsState');
        const loadingElement = document.getElementById('loadingState');
        const pokemonGrid = document.getElementById('pokemonGrid');
        
        if (noResultsElement) noResultsElement.classList.remove('hidden');
        if (loadingElement) loadingElement.classList.add('hidden');
        if (pokemonGrid) pokemonGrid.innerHTML = '';
    },

    /**
     * Hide no results state
     */
    hideNoResults: function() {
        const noResultsElement = document.getElementById('noResultsState');
        if (noResultsElement) {
            noResultsElement.classList.add('hidden');
        }
    },

    /**
     * Show load more button
     */
    showLoadMore: function() {
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            loadMoreContainer.classList.remove('hidden');
        }
    },

    /**
     * Hide load more button
     */
    hideLoadMore: function() {
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            loadMoreContainer.classList.add('hidden');
        }
    },

    /**
     * Show skeleton loading cards
     * @param {number} count - Number of skeleton cards
     */
    showSkeletons: function(count = 12) {
        const pokemonGrid = document.getElementById('pokemonGrid');
        if (!pokemonGrid) return;
        
        let skeletonHtml = '';
        for (let i = 0; i < count; i++) {
            skeletonHtml += `
                <div class="pokemon-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
                    <div class="p-4">
                        <div class="flex justify-between mb-2">
                            <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                            <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                        </div>
                        
                        <div class="flex justify-center my-4">
                            <div class="h-32 w-32 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        </div>
                        
                        <div class="flex gap-2 mb-3">
                            <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
                            <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div class="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                            <div class="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                        
                        <div class="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
            `;
        }
        
        pokemonGrid.innerHTML = skeletonHtml;
    },

    /**
     * Enable/disable inputs during loading
     * @param {boolean} disable - Whether to disable inputs
     */
    disableInputs: function(disable) {
        const searchInput = document.getElementById('searchInput');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (searchInput) {
            searchInput.disabled = disable;
            searchInput.classList.toggle('opacity-50', disable);
            searchInput.classList.toggle('cursor-not-allowed', disable);
        }
        
        filterButtons.forEach(btn => {
            btn.disabled = disable;
            btn.classList.toggle('opacity-50', disable);
            btn.classList.toggle('cursor-not-allowed', disable);
        });
        
        if (loadMoreBtn) {
            loadMoreBtn.disabled = disable;
            loadMoreBtn.classList.toggle('opacity-50', disable);
            loadMoreBtn.classList.toggle('cursor-not-allowed', disable);
        }
    },

    /**
     * Update counters
     * @param {number} showing - Number of Pokémon showing
     * @param {number} total - Total number of Pokémon
     * @param {number} loaded - Number of Pokémon loaded
     */
    updateCounters: function(showing, total, loaded) {
        const showingElement = document.getElementById('showingCount');
        const totalElement = document.getElementById('totalCount');
        const generationElement = document.getElementById('generationCount');
        
        if (showingElement) showingElement.textContent = showing;
        if (totalElement) totalElement.textContent = total;
        if (generationElement) generationElement.textContent = loaded;
    },

    /**
     * Show inline loading spinner
     * @param {HTMLElement} element - Element to show spinner in
     */
    showInlineSpinner: function(element) {
        if (!element) return;
        
        const spinnerHtml = `
            <div class="inline-flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mr-2"></div>
                <span>Loading...</span>
            </div>
        `;
        
        const originalContent = element.innerHTML;
        element.innerHTML = spinnerHtml;
        element.dataset.originalContent = originalContent;
    },

    /**
     * Hide inline loading spinner
     * @param {HTMLElement} element - Element with spinner
     */
    hideInlineSpinner: function(element) {
        if (!element || !element.dataset.originalContent) return;
        
        element.innerHTML = element.dataset.originalContent;
        delete element.dataset.originalContent;
    },

    /**
     * Show toast message
     * @param {string} message - Message to show
     * @param {string} type - 'success', 'error', 'info', 'warning'
     */
    showToast: function(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.pokemon-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toastHtml = `
            <div class="pokemon-toast fixed top-4 right-4 z-50 animate-fade-in">
                <div class="px-6 py-3 rounded-lg shadow-lg ${this.getToastClass(type)}">
                    <div class="flex items-center">
                        ${this.getToastIcon(type)}
                        <span class="ml-2 font-medium">${message}</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toastHtml);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            const toast = document.querySelector('.pokemon-toast');
            if (toast) {
                toast.classList.add('animate-fade-out');
                setTimeout(() => toast.remove(), 300);
            }
        }, 3000);
    },

    /**
     * Get toast CSS class based on type
     * @param {string} type - Toast type
     * @returns {string} CSS class
     */
    getToastClass: function(type) {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
    },

    /**
     * Get toast icon based on type
     * @param {string} type - Toast type
     * @returns {string} Icon HTML
     */
    getToastIcon: function(type) {
        switch (type) {
            case 'success': return '<i class="fas fa-check-circle"></i>';
            case 'error': return '<i class="fas fa-exclamation-circle"></i>';
            case 'warning': return '<i class="fas fa-exclamation-triangle"></i>';
            default: return '<i class="fas fa-info-circle"></i>';
        }
    }
};

// Export to global scope
window.PokemonLoader = PokemonLoader;