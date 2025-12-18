// Pokémon Filters Utility

const PokemonFilters = {
    // Current filter state
    currentFilter: PokemonConstants ? PokemonConstants.FILTER_TYPES.ALL : 'all',
    searchTerm: '',
    sortBy: 'id',
    sortOrder: 'asc',

    /**
     * Filter Pokémon based on current criteria
     * @param {Array} pokemonList - List of Pokémon to filter
     * @returns {Array} Filtered Pokémon list
     */
    filter: function(pokemonList) {
        if (!pokemonList || !Array.isArray(pokemonList)) return [];
        
        let filtered = [...pokemonList];
        
        // Apply search filter
        if (this.searchTerm.trim() !== '') {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(pokemon => 
                pokemon.name.toLowerCase().includes(term) ||
                pokemon.types.some(t => t.type.name.toLowerCase().includes(term)) ||
                pokemon.id.toString().includes(term)
            );
        }
        
        // Apply type filter
        if (this.currentFilter !== PokemonConstants.FILTER_TYPES.ALL) {
            filtered = filtered.filter(pokemon =>
                pokemon.types.some(t => t.type.name === this.currentFilter)
            );
        }
        
        // Apply sorting
        filtered = this.sort(filtered);
        
        return filtered;
    },

    /**
     * Sort Pokémon list
     * @param {Array} pokemonList - List to sort
     * @returns {Array} Sorted list
     */
    sort: function(pokemonList) {
        if (!pokemonList || !Array.isArray(pokemonList)) return [];
        
        const sorted = [...pokemonList];
        
        sorted.sort((a, b) => {
            let aValue, bValue;
            
            switch (this.sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'type':
                    aValue = a.types[0]?.type.name || '';
                    bValue = b.types[0]?.type.name || '';
                    break;
                case 'hp':
                    aValue = a.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
                    bValue = b.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
                    break;
                case 'attack':
                    aValue = a.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
                    bValue = b.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
                    break;
                case 'id':
                default:
                    aValue = a.id;
                    bValue = b.id;
                    break;
            }
            
            if (this.sortOrder === 'desc') {
                return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });
        
        return sorted;
    },

    /**
     * Update filter buttons UI
     * @param {string} activeFilter - Active filter type
     */
    updateFilterButtons: function(activeFilter) {
        const buttons = document.querySelectorAll('.filter-btn');
        if (!buttons.length) return;
        
        buttons.forEach(btn => {
            const filter = btn.dataset.filter;
            if (filter === activeFilter) {
                btn.classList.remove('bg-gray-200', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                btn.classList.add('bg-red-600', 'text-white');
                btn.setAttribute('aria-current', 'true');
            } else {
                btn.classList.remove('bg-red-600', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                btn.removeAttribute('aria-current');
            }
        });
    },

    /**
     * Set search term
     * @param {string} term - Search term
     */
    setSearchTerm: function(term) {
        this.searchTerm = term || '';
        
        // Save last search to localStorage
        if (term.trim()) {
            localStorage.setItem(PokemonConstants.STORAGE_KEYS.LAST_SEARCH, term);
        }
    },

    /**
     * Set current filter
     * @param {string} filter - Filter type
     */
    setFilter: function(filter) {
        this.currentFilter = filter;
        this.updateFilterButtons(filter);
    },

    /**
     * Set sort criteria
     * @param {string} by - Field to sort by
     * @param {string} order - Sort order ('asc' or 'desc')
     */
    setSort: function(by, order = 'asc') {
        this.sortBy = by;
        this.sortOrder = order;
    },

    /**
     * Get current filter stats
     * @param {Array} allPokemon - All Pokémon
     * @param {Array} filteredPokemon - Filtered Pokémon
     * @returns {Object} Filter statistics
     */
    getStats: function(allPokemon, filteredPokemon) {
        if (!allPokemon || !Array.isArray(allPokemon)) {
            return { total: 0, showing: 0, percentage: 0 };
        }
        
        const total = allPokemon.length;
        const showing = filteredPokemon ? filteredPokemon.length : 0;
        const percentage = total > 0 ? Math.round((showing / total) * 100) : 0;
        
        return { total, showing, percentage };
    },

    /**
     * Get available types from Pokémon list
     * @param {Array} pokemonList - Pokémon list
     * @returns {Array} Unique types
     */
    getAvailableTypes: function(pokemonList) {
        if (!pokemonList || !Array.isArray(pokemonList)) return [];
        
        const types = new Set();
        pokemonList.forEach(pokemon => {
            pokemon.types.forEach(type => {
                types.add(type.type.name);
            });
        });
        
        return Array.from(types).sort();
    },

    /**
     * Reset all filters
     */
    reset: function() {
        this.currentFilter = PokemonConstants.FILTER_TYPES.ALL;
        this.searchTerm = '';
        this.sortBy = 'id';
        this.sortOrder = 'asc';
        this.updateFilterButtons(this.currentFilter);
    },

    /**
     * Load last search from localStorage
     */
    loadLastSearch: function() {
        const lastSearch = localStorage.getItem(PokemonConstants.STORAGE_KEYS.LAST_SEARCH);
        if (lastSearch) {
            this.searchTerm = lastSearch;
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = lastSearch;
            }
        }
    }
};

// Export to global scope
window.PokemonFilters = PokemonFilters;