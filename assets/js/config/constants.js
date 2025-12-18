// Pokémon Explorer Constants

// API Configuration
const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon";
const POKEMON_LIMIT = 20;
const POKEMON_LOAD_MORE_LIMIT = 10;

// Pokémon Type Colors Mapping
const TYPE_COLORS = {
    normal: { bg: '#A8A878', text: 'white' },
    fire: { bg: '#F08030', text: 'white' },
    water: { bg: '#6890F0', text: 'white' },
    grass: { bg: '#78C850', text: 'white' },
    electric: { bg: '#F8D030', text: '#333' },
    ice: { bg: '#98D8D8', text: '#333' },
    fighting: { bg: '#C03028', text: 'white' },
    poison: { bg: '#A040A0', text: 'white' },
    ground: { bg: '#E0C068', text: '#333' },
    flying: { bg: '#A890F0', text: 'white' },
    psychic: { bg: '#F85888', text: 'white' },
    bug: { bg: '#A8B820', text: 'white' },
    rock: { bg: '#B8A038', text: 'white' },
    ghost: { bg: '#705898', text: 'white' },
    dark: { bg: '#705848', text: 'white' },
    dragon: { bg: '#7038F8', text: 'white' },
    steel: { bg: '#B8B8D0', text: '#333' },
    fairy: { bg: '#EE99AC', text: '#333' }
};

// Filter Types
const FILTER_TYPES = {
    ALL: 'all',
    FIRE: 'fire',
    WATER: 'water',
    GRASS: 'grass',
    ELECTRIC: 'electric',
    BUG: 'bug',
    POISON: 'poison',
    FLYING: 'flying'
};

// Local Storage Keys
const STORAGE_KEYS = {
    THEME: 'pokemon_explorer_theme',
    FAVORITES: 'pokemon_explorer_favorites',
    LAST_SEARCH: 'pokemon_explorer_last_search'
};

// Cache Configuration
const CACHE_CONFIG = {
    DURATION: 60 * 60 * 1000, // 1 hour in milliseconds
    KEY: 'pokemon_cache'
};

// Default Pokémon Image (fallback)
const DEFAULT_POKEMON_IMAGE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

// Stat Names Mapping
const STAT_NAMES = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed'
};

// Pokémon Generations
const GENERATIONS = {
    1: { start: 1, end: 151, name: 'Generation I' },
    2: { start: 152, end: 251, name: 'Generation II' },
    3: { start: 252, end: 386, name: 'Generation III' },
    4: { start: 387, end: 493, name: 'Generation IV' },
    5: { start: 494, end: 649, name: 'Generation V' },
    6: { start: 650, end: 721, name: 'Generation VI' },
    7: { start: 722, end: 809, name: 'Generation VII' },
    8: { start: 810, end: 898, name: 'Generation VIII' },
    9: { start: 899, end: 1025, name: 'Generation IX' }
};

// Export all constants
window.PokemonConstants = {
    POKEAPI_URL,
    POKEMON_LIMIT,
    POKEMON_LOAD_MORE_LIMIT,
    TYPE_COLORS,
    FILTER_TYPES,
    STORAGE_KEYS,
    CACHE_CONFIG,
    DEFAULT_POKEMON_IMAGE,
    STAT_NAMES,
    GENERATIONS
};