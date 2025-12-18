export class Footer {
    static render() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                    <!-- Info -->
                    <div class="text-center md:text-left">
                        <p class="mb-2">Data from <a href="https://pokeapi.co" target="_blank" class="text-red-300 hover:underline font-bold">PokéAPI</a></p>
                        <p class="text-sm text-gray-400">Not affiliated with Nintendo or The Pokémon Company</p>
                    </div>
                    
                    <!-- Features -->
                    <div class="flex flex-wrap justify-center gap-4">
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-palette text-red-400"></i>
                            <span>Dark Mode</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-search text-blue-400"></i>
                            <span>Search</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-filter text-green-400"></i>
                            <span>Filters</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-bolt text-yellow-400"></i>
                            <span>900+ Pokémon</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}