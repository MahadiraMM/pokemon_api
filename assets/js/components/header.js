export class Header {
    static render() {
        return `
            <div class="container mx-auto px-4 py-6">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <!-- Logo & Title -->
                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <div class="w-8 h-8 bg-red-600 rounded-full"></div>
                                <div class="absolute w-12 h-2 bg-black top-1/2 transform -translate-y-1/2"></div>
                            </div>
                        </div>
                        <div>
                            <h1 class="text-3xl md:text-4xl font-bold">Pokémon Explorer</h1>
                            <p class="text-red-100">Discover all Pokémon from the API</p>
                        </div>
                    </div>
                    
                    <!-- Stats & Theme -->
                    <div class="flex items-center gap-4">
                        <div class="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <i class="fas fa-database"></i>
                            <span>API: </span>
                            <a href="https://pokeapi.co" target="_blank" class="font-bold hover:underline">
                                PokeAPI
                            </a>
                        </div>
                        
                        <!-- Theme Toggle -->
                        <button id="themeToggle" class="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors">
                            <i class="fas fa-moon text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static renderSearchFilter() {
        return `
            <!-- Search Box -->
            <div class="max-w-2xl mx-auto mb-8">
                <div class="relative">
                    <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="text" id="searchInput" 
                           class="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                           placeholder="Search Pokémon by name or type...">
                </div>
            </div>
            
            <!-- Filter Buttons -->
            <div class="flex flex-wrap justify-center gap-3 mb-6">
                <button class="filter-btn active px-5 py-2.5 rounded-full bg-red-600 text-white font-medium flex items-center gap-2 hover:bg-red-700 transition-all shadow-md" data-filter="all">
                    <i class="fas fa-globe"></i>
                    <span>All Pokémon</span>
                </button>
                <button class="filter-btn px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all" data-filter="fire">
                    <span class="type-badge type-fire">Fire</span>
                    <span>Fire Type</span>
                </button>
                <button class="filter-btn px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all" data-filter="water">
                    <span class="type-badge type-water">Water</span>
                    <span>Water Type</span>
                </button>
                <button class="filter-btn px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all" data-filter="grass">
                    <span class="type-badge type-grass">Grass</span>
                    <span>Grass Type</span>
                </button>
                <button class="filter-btn px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all" data-filter="electric">
                    <span class="type-badge type-electric">Electric</span>
                    <span>Electric Type</span>
                </button>
            </div>
            
            <!-- Stats -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center gap-6 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow">
                    <div class="text-center">
                        <div id="totalCount" class="text-2xl font-bold text-red-600 dark:text-red-400">0</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Total Pokémon</div>
                    </div>
                    <div class="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <div class="text-center">
                        <div id="showingCount" class="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Showing</div>
                    </div>
                    <div class="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <div class="text-center">
                        <div id="generationCount" class="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Loaded</div>
                    </div>
                </div>
            </div>
        `;
    }
}