// Pokémon Formatters Utility

const PokemonFormatters = {
    /**
     * Capitalize the first letter of a string
     * @param {string} text - Text to capitalize
     * @returns {string} Capitalized text
     */
    capitalize: function(text) {
        if (!text || typeof text !== 'string') return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    /**
     * Format Pokémon ID with leading zeros
     * @param {number} id - Pokémon ID
     * @returns {string} Formatted ID (e.g., #001)
     */
    formatId: function(id) {
        if (!id && id !== 0) return '#???';
        return `#${id.toString().padStart(3, '0')}`;
    },

    /**
     * Format height from decimeters to meters
     * @param {number} height - Height in decimeters
     * @returns {string} Formatted height (e.g., "0.7 m")
     */
    formatHeight: function(height) {
        if (!height && height !== 0) return '? m';
        return `${(height / 10).toFixed(1)} m`;
    },

    /**
     * Format weight from hectograms to kilograms
     * @param {number} weight - Weight in hectograms
     * @returns {string} Formatted weight (e.g., "6.9 kg")
     */
    formatWeight: function(weight) {
        if (!weight && weight !== 0) return '? kg';
        return `${(weight / 10).toFixed(1)} kg`;
    },

    /**
     * Get Pokémon image URL
     * @param {number} id - Pokémon ID
     * @param {string} type - Image type (default, shiny, etc.)
     * @returns {string} Image URL
     */
    getImageUrl: function(id, type = 'default') {
        if (!id) return '';
        
        const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
        
        if (type === 'shiny') {
            return `${baseUrl}/shiny/${id}.png`;
        }
        
        // Try official artwork first
        return `${baseUrl}/other/official-artwork/${id}.png`;
    },

    /**
     * Get stat percentage for visual representation
     * @param {number} statValue - Stat value (0-255)
     * @returns {number} Percentage (0-100)
     */
    getStatPercentage: function(statValue) {
        if (!statValue && statValue !== 0) return 0;
        return Math.min((statValue / 255) * 100, 100);
    },

    /**
     * Get stat color based on value
     * @param {number} value - Stat value
     * @returns {string} Tailwind color class
     */
    getStatColor: function(value) {
        if (value >= 100) return 'bg-green-500';
        if (value >= 75) return 'bg-blue-500';
        if (value >= 50) return 'bg-yellow-500';
        if (value >= 25) return 'bg-orange-500';
        return 'bg-red-500';
    },

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncateText: function(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    /**
     * Format Pokémon type for display
     * @param {string} type - Pokémon type
     * @returns {string} Formatted type
     */
    formatType: function(type) {
        return this.capitalize(type);
    },

    /**
     * Get Pokémon generation
     * @param {number} id - Pokémon ID
     * @returns {string} Generation name
     */
    getGeneration: function(id) {
        if (!id) return 'Unknown';
        
        for (const [gen, range] of Object.entries(PokemonConstants.GENERATIONS)) {
            if (id >= range.start && id <= range.end) {
                return range.name;
            }
        }
        
        return 'Unknown';
    },

    /**
     * Format ability name
     * @param {string} ability - Ability name
     * @returns {string} Formatted ability
     */
    formatAbility: function(ability) {
        if (!ability) return '';
        return ability.split('-').map(word => this.capitalize(word)).join(' ');
    },

    /**
     * Get type effectiveness color
     * @param {number} effectiveness - Effectiveness multiplier
     * @returns {string} Color class
     */
    getEffectivenessColor: function(effectiveness) {
        if (effectiveness === 0) return 'bg-gray-500';
        if (effectiveness === 0.25) return 'bg-purple-500';
        if (effectiveness === 0.5) return 'bg-red-500';
        if (effectiveness === 1) return 'bg-gray-300';
        if (effectiveness === 2) return 'bg-green-500';
        if (effectiveness === 4) return 'bg-green-700';
        return 'bg-gray-300';
    }
};

// Export to global scope
window.PokemonFormatters = PokemonFormatters;