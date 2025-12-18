// Pokémon Card Component

const PokemonCard = {
    /**
     * Create HTML for a Pokémon card
     * @param {Object} pokemon - Pokémon data
     * @returns {string} HTML string
     */
    create: function(pokemon) {
        if (!pokemon) return '';
        
        const id = PokemonFormatters.formatId(pokemon.id);
        const name = PokemonFormatters.capitalize(pokemon.name);
        const types = pokemon.types.map(t => t.type.name);
        const mainType = types[0] || 'normal';
        
        // Get image URL
        const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                        pokemon.sprites?.front_default ||
                        PokemonFormatters.getImageUrl(pokemon.id);
        
        // Get stats
        const stats = {};
        pokemon.stats.forEach(stat => {
            stats[stat.stat.name] = stat.base_stat;
        });
        
        // Format height and weight
        const height = PokemonFormatters.formatHeight(pokemon.height);
        const weight = PokemonFormatters.formatWeight(pokemon.weight);
        
        // Get type colors
        const typeColor = PokemonConstants.TYPE_COLORS[mainType] || PokemonConstants.TYPE_COLORS.normal;
        const typeClass = `type-${mainType}`;
        
        return `
            <div class="pokemon-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700" data-pokemon-id="${pokemon.id}" data-pokemon-name="${pokemon.name}">
                
                <!-- Card Header with Type Background -->
                <div class="${typeClass} bg-opacity-20 p-4">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white">${name}</h3>
                        <span class="font-mono text-gray-600 dark:text-gray-300 font-semibold">${id}</span>
                    </div>
                    
                    <!-- Pokémon Image -->
                    <div class="flex justify-center my-2">
                        <img src="${imageUrl}" 
                             alt="${name}"
                             class="h-32 w-32 object-contain drop-shadow-lg hover:scale-110 transition-transform duration-300"
                             loading="lazy"
                             onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
                    </div>
                </div>
                
                <!-- Card Content -->
                <div class="p-4">
                    <!-- Pokémon Types -->
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${types.map(type => `
                            <span class="type-badge type-${type}">
                                ${PokemonFormatters.formatType(type)}
                            </span>
                        `).join('')}
                    </div>
                    
                    <!-- Basic Stats -->
                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div class="font-bold text-lg">${stats.hp || 0}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 uppercase">HP</div>
                        </div>
                        <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div class="font-bold text-lg">${stats.attack || 0}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 uppercase">Attack</div>
                        </div>
                    </div>
                    
                    <!-- Height & Weight -->
                    <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div class="text-center">
                            <div class="font-semibold text-gray-700 dark:text-gray-300">${height}</div>
                            <div class="text-gray-500 dark:text-gray-400">Height</div>
                        </div>
                        <div class="text-center">
                            <div class="font-semibold text-gray-700 dark:text-gray-300">${weight}</div>
                            <div class="text-gray-500 dark:text-gray-400">Weight</div>
                        </div>
                    </div>
                    
                    <!-- View Details Button -->
                    <button onclick="PokemonCard.showDetails(${pokemon.id})" 
                            class="w-full mt-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                            aria-label="View details for ${name}">
                        <i class="fas fa-eye mr-2"></i>
                        View Details
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render multiple Pokémon cards
     * @param {Array} pokemonList - List of Pokémon
     * @param {string} containerId - Container element ID
     */
    renderGrid: function(pokemonList, containerId = 'pokemonGrid') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }
        
        if (!pokemonList || !Array.isArray(pokemonList) || pokemonList.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 col-span-full">No Pokémon to display</p>';
            return;
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Add cards with staggered animation
        pokemonList.forEach((pokemon, index) => {
            const cardHtml = this.create(pokemon);
            const cardElement = this.htmlToElement(cardHtml);
            
            // Add animation delay for staggered effect
            cardElement.style.animationDelay = `${index * 0.05}s`;
            
            container.appendChild(cardElement);
        });
    },

    /**
     * Convert HTML string to DOM element
     * @param {string} html - HTML string
     * @returns {HTMLElement} DOM element
     */
    htmlToElement: function(html) {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    },

    /**
     * Show Pokémon details (modal or page)
     * @param {number} pokemonId - Pokémon ID
     */
    showDetails: async function(pokemonId) {
        try {
            // Show loading
            this.showLoading();
            
            // Fetch Pokémon details
            const pokemon = await PokemonAPI.fetchPokemonById(pokemonId);
            
            // Create and show modal
            this.createDetailModal(pokemon);
            
        } catch (error) {
            console.error('Error showing Pokémon details:', error);
            alert(`Failed to load details for Pokémon #${pokemonId}`);
        }
    },

    /**
     * Create detail modal for Pokémon
     * @param {Object} pokemon - Pokémon data
     */
    createDetailModal: function(pokemon) {
        const name = PokemonFormatters.capitalize(pokemon.name);
        const id = PokemonFormatters.formatId(pokemon.id);
        const types = pokemon.types.map(t => t.type.name);
        const mainType = types[0] || 'normal';
        
        // Get all stats
        const stats = {};
        pokemon.stats.forEach(stat => {
            stats[stat.stat.name] = stat.base_stat;
        });
        
        // Get image
        const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                        pokemon.sprites?.front_default;
        
        // Create modal HTML
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <!-- Modal Header -->
                    <div class="type-${mainType} bg-opacity-20 p-6">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${name}</h2>
                                <p class="text-gray-600 dark:text-gray-300">${id}</p>
                            </div>
                            <button onclick="PokemonCard.closeModal()" 
                                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <!-- Pokémon Image -->
                        <div class="flex justify-center my-4">
                            <img src="${imageUrl}" 
                                 alt="${name}"
                                 class="h-48 w-48 object-contain">
                        </div>
                        
                        <!-- Types -->
                        <div class="flex flex-wrap gap-2 justify-center">
                            ${types.map(type => `
                                <span class="type-badge type-${type}">
                                    ${PokemonFormatters.formatType(type)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6">
                        <!-- Stats -->
                        <div class="mb-6">
                            <h3 class="text-lg font-bold mb-3 text-gray-800 dark:text-white">Base Stats</h3>
                            <div class="space-y-2">
                                ${Object.entries(stats).map(([statName, value]) => `
                                    <div class="flex items-center">
                                        <span class="w-24 text-sm text-gray-600 dark:text-gray-400">
                                            ${PokemonFormatters.capitalize(statName.replace('-', ' '))}
                                        </span>
                                        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mx-3">
                                            <div class="${PokemonFormatters.getStatColor(value)} h-2 rounded-full" 
                                                 style="width: ${PokemonFormatters.getStatPercentage(value)}%">
                                            </div>
                                        </div>
                                        <span class="w-10 text-right font-bold">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Physical Details -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <div class="font-bold text-lg">${PokemonFormatters.formatHeight(pokemon.height)}</div>
                                <div class="text-gray-500 dark:text-gray-400">Height</div>
                            </div>
                            <div class="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <div class="font-bold text-lg">${PokemonFormatters.formatWeight(pokemon.weight)}</div>
                                <div class="text-gray-500 dark:text-gray-400">Weight</div>
                            </div>
                        </div>
                        
                        <!-- Abilities -->
                        <div class="mb-6">
                            <h3 class="text-lg font-bold mb-2 text-gray-800 dark:text-white">Abilities</h3>
                            <div class="flex flex-wrap gap-2">
                                ${pokemon.abilities.map(ability => `
                                    <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                        ${PokemonFormatters.formatAbility(ability.ability.name)}
                                        ${ability.is_hidden ? '(Hidden)' : ''}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div class="flex justify-end gap-3">
                            <button onclick="PokemonCard.closeModal()" 
                                    class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                Close
                            </button>
                            <a href="https://www.pokemon.com/us/pokedex/${pokemon.name}" 
                               target="_blank"
                               class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                                Official Pokédex
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        this.closeModal();
        
        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close modal
     */
    closeModal: function() {
        const modal = document.querySelector('.fixed.inset-0.bg-black');
        if (modal) {
            modal.remove();
        }
        document.body.style.overflow = '';
    },

    /**
     * Show loading overlay
     */
    showLoading: function() {
        const loadingHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="pokeball-loading">
                    <div class="w-16 h-16 bg-white rounded-full border-8 border-red-600 relative">
                        <div class="w-8 h-8 bg-red-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div class="w-16 h-4 bg-black absolute top-1/2 transform -translate-y-1/2"></div>
                    </div>
                    <p class="text-white mt-4">Loading details...</p>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHtml);
    },

    /**
     * Hide loading overlay
     */
    hideLoading: function() {
        const loading = document.querySelector('.fixed.inset-0.bg-black');
        if (loading) {
            loading.remove();
        }
    },

    /**
     * Create simple Pokémon card for list view
     * @param {Object} pokemon - Pokémon data
     * @returns {string} HTML string
     */
    createSimpleCard: function(pokemon) {
        const name = PokemonFormatters.capitalize(pokemon.name);
        const id = pokemon.id.toString().padStart(3, '0');
        const mainType = pokemon.types[0]?.type.name || 'normal';
        
        return `
            <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                 onclick="PokemonCard.showDetails(${pokemon.id})">
                <span class="text-gray-500 dark:text-gray-400 w-10">#${id}</span>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" 
                     alt="${name}"
                     class="h-10 w-10 mx-3">
                <span class="font-medium flex-1">${name}</span>
                <span class="type-badge type-${mainType} text-xs">
                    ${PokemonFormatters.formatType(mainType)}
                </span>
            </div>
        `;
    }
};

// Export to global scope
window.PokemonCard = PokemonCard;