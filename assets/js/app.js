// Pokémon Explorer Main Application

const PokemonExplorer = {
    // App state
    state: {
        allPokemon: [],
        filteredPokemon: [],
        isLoading: false,
        hasError: false,
        currentOffset: 0,
        canLoadMore: true
    },

    /**
     * Initialize the application
     */
    init: function() {
        console.log('Initializing Pokémon Explorer...');
        
        // Initialize theme
        if (typeof ThemeManager !== 'undefined') {
            ThemeManager.init();
        }
        
        // Load last search
        if (typeof PokemonFilters !== 'undefined') {
            PokemonFilters.loadLastSearch();
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial Pokémon data
        this.loadInitialPokemon();
    },

    /**
     * Set up event listeners
     */
    setupEventListeners: function() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (typeof ThemeManager !== 'undefined') {
                    ThemeManager.toggle();
                }
            });
        }
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.handleFilter(filter, e.currentTarget);
            });
        });
        
        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadInitialPokemon();
            });
        }
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePokemon();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape to clear search
            if (e.key === 'Escape') {
                if (searchInput && document.activeElement === searchInput) {
                    searchInput.value = '';
                    this.handleSearch('');
                }
            }
        });
        
        // Listen for theme changes
        if (typeof ThemeManager !== 'undefined') {
            document.addEventListener('themechange', (e) => {
                this.onThemeChange(e.detail.theme);
            });
        }
    },

    /**
     * Load initial Pokémon data
     */
    loadInitialPokemon: async function() {
        if (this.state.isLoading) return;
        
        try {
            this.state.isLoading = true;
            this.state.hasError = false;
            
            // Show loading state
            PokemonLoader.show();
            
            // Load Pokémon data
            const pokemonData = await PokemonAPI.loadPokemonData();
            
            // Update state
            this.state.allPokemon = pokemonData;
            this.state.currentOffset = pokemonData.length;
            this.state.canLoadMore = pokemonData.length > 0;
            
            // Apply filters
            this.applyFilters();
            
            // Show load more button if applicable
            if (this.state.canLoadMore) {
                PokemonLoader.showLoadMore();
            }
            
            // Show success message
            PokemonLoader.showToast(`Loaded ${pokemonData.length} Pokémon`, 'success');
            
        } catch (error) {
            console.error('Error loading Pokémon:', error);
            this.state.hasError = true;
            PokemonLoader.showError('Failed to load Pokémon. Please check your internet connection.');
            PokemonLoader.showToast('Failed to load Pokémon', 'error');
        } finally {
            this.state.isLoading = false;
            PokemonLoader.hide();
        }
    },

    /**
     * Load more Pokémon
     */
    loadMorePokemon: async function() {
        if (this.state.isLoading || !this.state.canLoadMore) return;
        
        try {
            this.state.isLoading = true;
            
            // Show loading on button
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn && typeof PokemonLoader !== 'undefined') {
                PokemonLoader.showInlineSpinner(loadMoreBtn);
            }
            
            // Load more Pokémon
            const newPokemon = await PokemonAPI.loadMorePokemon(this.state.currentOffset);
            
            if (newPokemon && newPokemon.length > 0) {
                // Update state
                this.state.allPokemon = [...this.state.allPokemon, ...newPokemon];
                this.state.currentOffset += newPokemon.length;
                this.state.canLoadMore = newPokemon.length === PokemonConstants.POKEMON_LOAD_MORE_LIMIT;
                
                // Apply filters to include new Pokémon
                this.applyFilters();
                
                // Show success message
                PokemonLoader.showToast(`Loaded ${newPokemon.length} more Pokémon`, 'success');
                
                // Hide load more button if no more Pokémon
                if (!this.state.canLoadMore) {
                    PokemonLoader.hideLoadMore();
                }
            } else {
                this.state.canLoadMore = false;
                PokemonLoader.hideLoadMore();
            }
            
        } catch (error) {
            console.error('Error loading more Pokémon:', error);
            PokemonLoader.showToast('Failed to load more Pokémon', 'error');
        } finally {
            this.state.isLoading = false;
            
            // Hide loading on button
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn && typeof PokemonLoader !== 'undefined') {
                PokemonLoader.hideInlineSpinner(loadMoreBtn);
            }
        }
    },

    /**
     * Handle search input
     * @param {string} searchTerm - Search term
     */
    handleSearch: function(searchTerm) {
        if (typeof PokemonFilters !== 'undefined') {
            PokemonFilters.setSearchTerm(searchTerm);
        }
        this.applyFilters();
    },

    /**
     * Handle filter selection
     * @param {string} filterType - Filter type
     * @param {HTMLElement} button - Filter button
     */
    handleFilter: function(filterType, button) {
        if (typeof PokemonFilters !== 'undefined') {
            PokemonFilters.setFilter(filterType);
            PokemonFilters.updateFilterButtons(filterType);
        }
        this.applyFilters();
    },

    /**
     * Apply current filters and update UI
     */
    applyFilters: function() {
        if (!this.state.allPokemon.length) return;
        
        // Apply filters
        if (typeof PokemonFilters !== 'undefined') {
            this.state.filteredPokemon = PokemonFilters.filter(this.state.allPokemon);
        } else {
            this.state.filteredPokemon = this.state.allPokemon;
        }
        
        // Update counters
        if (typeof PokemonLoader !== 'undefined') {
            const stats = PokemonFilters.getStats(this.state.allPokemon, this.state.filteredPokemon);
            PokemonLoader.updateCounters(stats.showing, stats.total, this.state.allPokemon.length);
        }
        
        // Render Pokémon grid
        if (typeof PokemonCard !== 'undefined') {
            if (this.state.filteredPokemon.length === 0) {
                PokemonLoader.showNoResults();
            } else {
                PokemonLoader.hideNoResults();
                PokemonCard.renderGrid(this.state.filteredPokemon);
            }
        }
    },

    /**
     * Handle theme change
     * @param {string} theme - New theme ('light' or 'dark')
     */
    onThemeChange: function(theme) {
        console.log(`Theme changed to: ${theme}`);
        
        // Update any theme-specific UI elements
        const themeIndicator = document.getElementById('themeIndicator');
        if (themeIndicator) {
            themeIndicator.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
        }
        
        // Save scroll position if needed
        this.saveScrollPosition();
        
        // Restore scroll position after theme transition
        setTimeout(() => {
            this.restoreScrollPosition();
        }, 300);
    },

    /**
     * Save current scroll position
     */
    saveScrollPosition: function() {
        sessionStorage.setItem('scrollPosition', window.scrollY);
    },

    /**
     * Restore scroll position
     */
    restoreScrollPosition: function() {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
            sessionStorage.removeItem('scrollPosition');
        }
    },

    /**
     * Get app statistics
     * @returns {Object} App statistics
     */
    getStats: function() {
        return {
            totalPokemon: this.state.allPokemon.length,
            filteredPokemon: this.state.filteredPokemon.length,
            isLoading: this.state.isLoading,
            hasError: this.state.hasError,
            currentOffset: this.state.currentOffset,
            canLoadMore: this.state.canLoadMore
        };
    },

    /**
     * Reset app state
     */
    reset: function() {
        this.state = {
            allPokemon: [],
            filteredPokemon: [],
            isLoading: false,
            hasError: false,
            currentOffset: 0,
            canLoadMore: true
        };
        
        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset filters
        if (typeof PokemonFilters !== 'undefined') {
            PokemonFilters.reset();
        }
        
        // Clear Pokémon grid
        const pokemonGrid = document.getElementById('pokemonGrid');
        if (pokemonGrid) {
            pokemonGrid.innerHTML = '';
        }
        
        // Show loading state
        PokemonLoader.show();
    },

    /**
     * Refresh Pokémon data
     */
    refresh: async function() {
        // Clear cache
        if (typeof PokemonAPI !== 'undefined') {
            PokemonAPI.cache.clear();
        }
        
        // Reset app
        this.reset();
        
        // Reload Pokémon data
        await this.loadInitialPokemon();
        
        // Show success message
        PokemonLoader.showToast('Pokémon data refreshed', 'success');
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if all required dependencies are loaded
    const dependencies = [
        'PokemonConstants',
        'PokemonFormatters',
        'ThemeManager',
        'PokemonFilters',
        'PokemonAPI',
        'PokemonCard',
        'PokemonLoader'
    ];
    
    const missingDeps = dependencies.filter(dep => !window[dep]);
    
    if (missingDeps.length > 0) {
        console.error('Missing dependencies:', missingDeps);
        alert('Error: Some required files failed to load. Please check the console for details.');
        return;
    }
    
    // Initialize app
    PokemonExplorer.init();
    
    // Make app available globally for debugging
    window.PokemonExplorer = PokemonExplorer;
    
    console.log('Pokémon Explorer initialized successfully!');
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    if (typeof PokemonLoader !== 'undefined') {
        PokemonLoader.showError('An unexpected error occurred. Please refresh the page.');
    }
});

// Handle offline/online status
window.addEventListener('offline', function() {
    if (typeof PokemonLoader !== 'undefined') {
        PokemonLoader.showToast('You are offline. Some features may not work.', 'warning');
    }
});

window.addEventListener('online', function() {
    if (typeof PokemonLoader !== 'undefined') {
        PokemonLoader.showToast('You are back online!', 'success');
    }
});