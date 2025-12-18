// Pokémon API Service

const PokemonAPI = {
    // Cache for Pokémon data
    cache: {
        data: null,
        timestamp: null,
        
        /**
         * Check if cache is valid
         * @returns {boolean} True if cache is valid
         */
        isValid: function() {
            if (!this.data || !this.timestamp) return false;
            
            const cacheAge = Date.now() - this.timestamp;
            return cacheAge < PokemonConstants.CACHE_CONFIG.DURATION;
        },
        
        /**
         * Get cached data
         * @returns {Array|null} Cached data or null
         */
        get: function() {
            if (this.isValid()) {
                console.log('Using cached Pokémon data');
                return this.data;
            }
            return null;
        },
        
        /**
         * Set cache data
         * @param {Array} data - Data to cache
         */
        set: function(data) {
            this.data = data;
            this.timestamp = Date.now();
            
            // Also save to localStorage for persistence
            try {
                const cacheData = {
                    data: data,
                    timestamp: this.timestamp
                };
                localStorage.setItem(PokemonConstants.CACHE_CONFIG.KEY, JSON.stringify(cacheData));
            } catch (error) {
                console.warn('Could not save cache to localStorage:', error);
            }
            
            console.log('Pokémon data cached');
        },
        
        /**
         * Load cache from localStorage
         */
        loadFromStorage: function() {
            try {
                const stored = localStorage.getItem(PokemonConstants.CACHE_CONFIG.KEY);
                if (stored) {
                    const cacheData = JSON.parse(stored);
                    this.data = cacheData.data;
                    this.timestamp = cacheData.timestamp;
                    
                    if (this.isValid()) {
                        console.log('Loaded Pokémon cache from localStorage');
                    }
                }
            } catch (error) {
                console.warn('Could not load cache from localStorage:', error);
            }
        },
        
        /**
         * Clear cache
         */
        clear: function() {
            this.data = null;
            this.timestamp = null;
            localStorage.removeItem(PokemonConstants.CACHE_CONFIG.KEY);
            console.log('Pokémon cache cleared');
        }
    },

    /**
     * Fetch Pokémon list from API
     * @param {number} limit - Number of Pokémon to fetch
     * @param {number} offset - Offset for pagination
     * @returns {Promise<Array>} Pokémon list
     */
    fetchPokemonList: async function(limit = PokemonConstants.POKEMON_LIMIT, offset = 0) {
        try {
            console.log(`Fetching Pokémon list: limit=${limit}, offset=${offset}`);
            
            const url = `${PokemonConstants.POKEAPI_URL}?limit=${limit}&offset=${offset}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Fetched ${data.results.length} Pokémon from list`);
            
            return data;
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            throw error;
        }
    },

    /**
     * Fetch detailed Pokémon data
     * @param {string} url - Pokémon detail URL
     * @returns {Promise<Object>} Pokémon details
     */
    fetchPokemonDetails: async function(url) {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
            throw error;
        }
    },

    /**
     * Fetch multiple Pokémon details
     * @param {Array} pokemonList - List of Pokémon URLs
     * @returns {Promise<Array>} Detailed Pokémon data
     */
    fetchMultiplePokemonDetails: async function(pokemonList) {
        try {
            console.log(`Fetching details for ${pokemonList.length} Pokémon...`);
            
            const promises = pokemonList.map(pokemon => 
                this.fetchPokemonDetails(pokemon.url)
            );
            
            const results = await Promise.all(promises);
            console.log(`Successfully fetched details for ${results.length} Pokémon`);
            
            return results;
        } catch (error) {
            console.error('Error fetching multiple Pokémon details:', error);
            throw error;
        }
    },

    /**
     * Fetch Pokémon by ID
     * @param {number} id - Pokémon ID
     * @returns {Promise<Object>} Pokémon data
     */
    fetchPokemonById: async function(id) {
        try {
            const url = `${PokemonConstants.POKEAPI_URL}/${id}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching Pokémon ${id}:`, error);
            throw error;
        }
    },

    /**
     * Search Pokémon by name
     * @param {string} name - Pokémon name
     * @returns {Promise<Object>} Pokémon data
     */
    searchPokemon: async function(name) {
        try {
            const url = `${PokemonConstants.POKEAPI_URL}/${name.toLowerCase()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Pokémon "${name}" not found`);
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error searching Pokémon "${name}":`, error);
            throw error;
        }
    },

    /**
     * Load initial Pokémon data
     * @returns {Promise<Array>} Pokémon data
     */
    loadPokemonData: async function() {
        // Check cache first
        this.cache.loadFromStorage();
        const cached = this.cache.get();
        if (cached) {
            return cached;
        }
        
        // Fetch from API
        try {
            const data = await this.fetchPokemonList(PokemonConstants.POKEMON_LIMIT);
            const pokemonDetails = await this.fetchMultiplePokemonDetails(data.results);
            
            // Cache the data
            this.cache.set(pokemonDetails);
            
            return pokemonDetails;
        } catch (error) {
            console.error('Error loading Pokémon data:', error);
            throw error;
        }
    },

    /**
     * Load more Pokémon
     * @param {number} currentCount - Current number of Pokémon loaded
     * @returns {Promise<Array>} Additional Pokémon data
     */
    loadMorePokemon: async function(currentCount) {
        try {
            const data = await this.fetchPokemonList(PokemonConstants.POKEMON_LOAD_MORE_LIMIT, currentCount);
            const pokemonDetails = await this.fetchMultiplePokemonDetails(data.results);
            
            // Update cache with new data
            const cached = this.cache.get() || [];
            this.cache.set([...cached, ...pokemonDetails]);
            
            return pokemonDetails;
        } catch (error) {
            console.error('Error loading more Pokémon:', error);
            throw error;
        }
    },

    /**
     * Get Pokémon types
     * @returns {Promise<Array>} Pokémon types
     */
    fetchPokemonTypes: async function() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/type');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching Pokémon types:', error);
            throw error;
        }
    },

    /**
     * Get Pokémon abilities
     * @param {number} id - Pokémon ID
     * @returns {Promise<Array>} Pokémon abilities
     */
    fetchPokemonAbilities: async function(id) {
        try {
            const pokemon = await this.fetchPokemonById(id);
            return pokemon.abilities;
        } catch (error) {
            console.error(`Error fetching abilities for Pokémon ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get Pokémon moves
     * @param {number} id - Pokémon ID
     * @returns {Promise<Array>} Pokémon moves
     */
    fetchPokemonMoves: async function(id) {
        try {
            const pokemon = await this.fetchPokemonById(id);
            return pokemon.moves.slice(0, 10); // Return first 10 moves
        } catch (error) {
            console.error(`Error fetching moves for Pokémon ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get Pokémon species info
     * @param {number} id - Pokémon ID
     * @returns {Promise<Object>} Pokémon species data
     */
    fetchPokemonSpecies: async function(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching species for Pokémon ${id}:`, error);
            throw error;
        }
    }
};

// Initialize cache from localStorage
document.addEventListener('DOMContentLoaded', function() {
    PokemonAPI.cache.loadFromStorage();
});

// Export to global scope
window.PokemonAPI = PokemonAPI;