const pokemonList = document.getElementById('pokemonList')

const startScreen = document.getElementById('startScreen')
const startButton = document.getElementById('startButton')
const pokedexLoading =
    document.getElementById('pokedexLoading')
const pokemonModal = document.getElementById('pokemonModal')
const pokemonModalBody = document.getElementById('pokemonModalBody')
const closePokemonModal = document.getElementById('closePokemonModal')
const pokemonSearch =
    document.getElementById('pokemonSearch')

const filterButtons =
    document.querySelectorAll('.filter-button')

const maxRecords = 151
const certificateModal =
    document.getElementById(
        'certificateModal'
    )

const closeCertificate =
    document.getElementById(
        'closeCertificate'
    )

const certificateTrainer =
    document.getElementById(
        'certificateTrainer'
    )

const viewCertificateButton =
    document.getElementById(
        'viewCertificateButton'
    )
    const selectAllButton =
    document.getElementById(
        'selectAllButton'
    )

const clearAllButton =
    document.getElementById(
        'clearAllButton'
    )

    let trainerName =
    localStorage.getItem('trainerName') || ''

let pokedexCompleted =
    localStorage.getItem(
        'pokedexCompleted'
    ) === 'true'
let loadedPokemons = []
let currentFilter = 'all'
let currentSearch = ''
let caughtPokemons =
    JSON.parse(localStorage.getItem('caughtPokemons')) || []


// ========================================
// TELA INICIAL
// ========================================

startButton.addEventListener('click', () => {

    startScreen.classList.add('starting')

    setTimeout(() => {
        startScreen.style.display = 'none'
    }, 800)

})


// ========================================
// CONVERTE POKÉMON PARA CARD
// ========================================

function convertPokemonToLi(pokemon) {

    const caught =
        isPokemonCaught(pokemon.number)

    return `
        <li
            class="pokemon ${pokemon.type} ${caught ? 'caught' : ''}"
            data-pokemon-id="${pokemon.number}"
        >

            <span class="number">
                #${pokemon.number}
            </span>

            <span class="caught-indicator">
                ${caught ? '✓' : ''}
            </span>

            <span class="name">
                ${pokemon.name}
            </span>

            <div class="detail">

                <ol class="types">

                    ${pokemon.types.map((type) => `
                        <li class="type ${type}">
                            ${type}
                        </li>
                    `).join('')}

                </ol>

                <img
                    src="${pokemon.photo}"
                    alt="${pokemon.name}"
                >

            </div>

        </li>
    `
}

function clearAllPokemons() {

    const confirmed =
        window.confirm(
            'Remove all Pokémon from your caught list?'
        )

    if (!confirmed) {
        return
    }

    caughtPokemons = []

    saveCaughtPokemons()
    renderPokemonList()
    updateCaughtCounter()
}

function selectAllPokemons() {

    const confirmed =
        window.confirm(
            'Mark all 151 Pokémon as caught?'
        )

    if (!confirmed) {
        return
    }


    const certificateWasAlreadyUnlocked =
        pokedexCompleted


    caughtPokemons =
        Array.from(
            { length: maxRecords },
            (_, index) => index + 1
        )


    saveCaughtPokemons()

    renderPokemonList()

    updateCaughtCounter()


    // Se já havia conquistado antes,
    // apenas abre novamente
    if (certificateWasAlreadyUnlocked) {

        openCertificate()

    }

}

selectAllButton.addEventListener(
    'click',
    selectAllPokemons
)


clearAllButton.addEventListener(
    'click',
    clearAllPokemons
)

function getTrainerName() {

    if (trainerName) {
        return trainerName
    }


    const name =
        window.prompt(
            'Kanto Pokédex Complete!\n\nEnter your Trainer Name:'
        )


    trainerName =
        name && name.trim()
            ? name.trim()
            : 'TRAINER'


    localStorage.setItem(
        'trainerName',
        trainerName
    )


    return trainerName
}


function openCertificate() {

    const name =
        getTrainerName()


    certificateTrainer.textContent =
        name


    certificateModal.classList.add(
        'active'
    )

}


function closeCertificateModal() {

    certificateModal.classList.remove(
        'active'
    )

}


function unlockCertificate() {

    pokedexCompleted = true


    localStorage.setItem(
        'pokedexCompleted',
        'true'
    )


    viewCertificateButton.hidden =
        false


    openCertificate()

}

function renderPokemonList() {

    const filteredPokemons =
        loadedPokemons.filter((pokemon) => {

            const pokemonNumber =
                String(pokemon.number)

            const formattedNumber =
                String(pokemon.number)
                    .padStart(3, '0')


            const matchesSearch =
                pokemon.name
                    .toLowerCase()
                    .includes(currentSearch) ||

                pokemonNumber === currentSearch ||

                formattedNumber === currentSearch ||

                currentSearch === ''


            let matchesFilter = true


            if (currentFilter === 'caught') {

                matchesFilter =
                    isPokemonCaught(
                        pokemon.number
                    )

            }


            if (currentFilter === 'missing') {

                matchesFilter =
                    !isPokemonCaught(
                        pokemon.number
                    )

            }


            return (
                matchesSearch &&
                matchesFilter
            )
        })


    pokemonList.innerHTML =
        filteredPokemons
            .map(convertPokemonToLi)
            .join('')
}

function updatePokemonCards() {

    const pokemonCards =
        document.querySelectorAll('.pokemon')


    pokemonCards.forEach((card) => {

        const pokemonId =
            Number(card.dataset.pokemonId)

        const caught =
            isPokemonCaught(pokemonId)


        card.classList.toggle(
            'caught',
            caught
        )


        const indicator =
            card.querySelector('.caught-indicator')


        if (indicator) {

            indicator.textContent =
                caught ? '✓' : ''

        }

    })

}

// ========================================
// CARREGA POKÉMON
// ========================================

async function loadPokemonItens(offset, limit) {

    try {

        const pokemons =
            await pokeApi.getPokemons(
                offset,
                limit
            )

        loadedPokemons.push(
            ...pokemons
        )

        renderPokemonList()


        // Pokédex terminou de carregar
        if (pokedexLoading) {

            pokedexLoading.classList.add(
                'finished'
            )

            setTimeout(() => {

                pokedexLoading.style.display =
                    'none'

            }, 400)

        }

    } catch (error) {

        console.error(
            'Erro ao carregar Pokédex:',
            error
        )


        if (pokedexLoading) {

            pokedexLoading.innerHTML = `

                <strong>
                    FAILED TO LOAD POKÉDEX
                </strong>

                <span>
                    Check your connection
                    and try again.
                </span>

            `
        }

    }

}

pokemonSearch.addEventListener(
    'input',
    (event) => {

        currentSearch =
            event.target.value
                .trim()
                .toLowerCase()

        renderPokemonList()

    }
)
filterButtons.forEach((button) => {

    button.addEventListener(
        'click',
        () => {

            currentFilter =
                button.dataset.filter


            filterButtons.forEach(
                (filterButton) => {

                    filterButton.classList.remove(
                        'active'
                    )

                }
            )


            button.classList.add(
                'active'
            )


            renderPokemonList()

        }
    )

})

// ========================================
// ABRE PAINEL DO POKÉMON
// ========================================

async function openPokemonModal(pokemon) {

    pokemonModalBody.innerHTML = `

        <div class="pokemon-modal-header ${pokemon.type}">

            <span class="modal-number">
                #${pokemon.number}
            </span>

            <h2 class="modal-name">
                ${pokemon.name}
            </h2>

            <div class="modal-types">

                ${pokemon.types.map((type) => `
                    <span class="modal-type">
                        ${type}
                    </span>
                `).join('')}

            </div>

            <img
                class="modal-pokemon-image"
                src="${pokemon.photo}"
                alt="${pokemon.name}"
            >

        </div>


        <div class="pokemon-modal-info">

            <div class="pokemon-about">

                <div>
                    <span>Height</span>
                    <strong>${pokemon.height} m</strong>
                </div>

                <div>
                    <span>Weight</span>
                    <strong>${pokemon.weight} kg</strong>
                </div>

                <div>
                    <span>Abilities</span>

                    <strong>
                        ${pokemon.abilities.join(', ')}
                    </strong>
                </div>

            </div>


            <div class="caught-control">

                <button
                    id="caughtButton"
                    class="caught-button ${isPokemonCaught(pokemon.number) ? 'caught' : ''}"
                    type="button"
                >
                    ${
                        isPokemonCaught(pokemon.number)
                            ? '✓ CAUGHT'
                            : '○ MARK AS CAUGHT'
                    }
                </button>

            </div>


            <div class="pokemon-stats">

                <h3>
                    Base Stats
                </h3>

                ${pokemon.stats.map((stat) => `

                    <div class="stat">

                        <span class="stat-name">
                            ${formatStatName(stat.name)}
                        </span>

                        <span class="stat-value">
                            ${stat.value}
                        </span>

                        <div class="stat-bar">

                            <div
                                class="stat-progress"
                                style="width: ${Math.min(stat.value / 255 * 100, 100)}%"
                            >
                            </div>

                        </div>

                    </div>

                `).join('')}

            </div>


            <div class="pokemon-locations">

                <h3>
                    📍 Kanto Locations
                </h3>

                <p>
                    Loading locations...
                </p>

            </div>
<div class="pokemon-navigation">

    <button
        id="previousPokemon"
        class="pokemon-nav-button"
        type="button"
        ${pokemon.number === 1 ? 'disabled' : ''}
    >
        ← PREVIOUS
    </button>

    <span class="pokemon-nav-number">
        #${String(pokemon.number).padStart(3, '0')}
    </span>

    <button
        id="nextPokemon"
        class="pokemon-nav-button"
        type="button"
        ${pokemon.number === 151 ? 'disabled' : ''}
    >
        NEXT →
    </button>

</div>
        </div>
    `


    // Abre o modal
    pokemonModal.classList.add('active')
    const previousButton =
    document.getElementById('previousPokemon')

const nextButton =
    document.getElementById('nextPokemon')


previousButton.addEventListener('click', () => {

    openAdjacentPokemon(
        pokemon.number - 1
    )

})


nextButton.addEventListener('click', () => {

    openAdjacentPokemon(
        pokemon.number + 1
    )

})


    // Botão CAUGHT
    const caughtButton =
        document.getElementById('caughtButton')


    caughtButton.addEventListener('click', () => {

        toggleCaughtPokemon(pokemon.number)

    })


    // Busca localizações do Pokémon
    const locations =
        await pokeApi.getKantoLocations(
            pokemon.number
        )


    // Se existir encontro selvagem em FireRed / LeafGreen
    if (locations.length > 0) {

        renderPokemonLocations(
            locations
        )

    } else {

        // Se não existir encontro selvagem,
        // procura outra forma de obter o Pokémon
        await renderHowToObtain(
            pokemon
        )

    }

}

function openAdjacentPokemon(pokemonId) {

    const selectedPokemon =
        loadedPokemons.find(
            (pokemon) =>
                pokemon.number === pokemonId
        )


    if (!selectedPokemon) {
        return
    }


    openPokemonModal(
        selectedPokemon
    )
}

// fecha openPokemonModal()


function updateCaughtButton(pokemonId) {

    const caughtButton =
        document.getElementById('caughtButton')

    if (!caughtButton) {
        return
    }

    const caught =
        isPokemonCaught(pokemonId)

    caughtButton.classList.toggle(
        'caught',
        caught
    )

    caughtButton.textContent =
        caught
            ? '✓ CAUGHT'
            : '○ MARK AS CAUGHT'
}

async function renderHowToObtain(pokemon) {

    const locationsContainer =
        document.querySelector('.pokemon-locations')


    if (!locationsContainer) {
        return
    }


    locationsContainer.innerHTML = `

        <h3>
            🎒 How to Obtain
        </h3>

        <p>
            Loading obtain method...
        </p>
    `


    const evolution =
        await pokeApi.getEvolutionMethod(
            pokemon.number
        )


    if (evolution) {

        renderEvolutionMethod(
            locationsContainer,
            evolution
        )

        return
    }


    renderSpecialObtainMethod(
        locationsContainer,
        pokemon
    )
}

function renderEvolutionMethod(
    container,
    evolution
) {

    let methodText = 'Evolution'


    if (
        evolution.trigger === 'level-up' &&
        evolution.minLevel
    ) {

        methodText =
            `Level ${evolution.minLevel}`

    }


    if (evolution.trigger === 'use-item') {

        methodText =
            evolution.item
                ? formatLocationName(evolution.item)
                : 'Evolution Item'

    }


    if (evolution.minHappiness) {

        methodText =
            `High Friendship (${evolution.minHappiness}+)`

    }


    container.innerHTML = `

        <h3>
            🎒 How to Obtain
        </h3>


        <div class="obtain-card">

            <span class="obtain-category">
                ⬆ EVOLUTION
            </span>


            <div class="evolution-path">

                <strong>
                    ${formatPokemonName(evolution.from)}
                </strong>

                <span class="evolution-arrow">
                    →
                </span>

                <strong>
                    ${formatPokemonName(evolution.to)}
                </strong>

            </div>


            <span class="evolution-method">
                ${methodText}
            </span>

        </div>
    `
}

function formatPokemonName(name) {

    return name
        .charAt(0)
        .toUpperCase()
        + name.slice(1)
}

function renderSpecialObtainMethod(
    container,
    pokemon
) {

    const specialMethods = {

        // =========================
        // STARTERS
        // =========================

        1: {
            category: '🎁 STARTER POKÉMON',
            title: 'Pallet Town',
            description:
                'Choose Bulbasaur from Professor Oak at the beginning of the game.'
        },

        4: {
            category: '🎁 STARTER POKÉMON',
            title: 'Pallet Town',
            description:
                'Choose Charmander from Professor Oak at the beginning of the game.'
        },

        7: {
            category: '🎁 STARTER POKÉMON',
            title: 'Pallet Town',
            description:
                'Choose Squirtle from Professor Oak at the beginning of the game.'
        },


        // =========================
        // FOSSILS
        // =========================

        138: {
            category: '🦴 FOSSIL',
            title: 'Helix Fossil',
            description:
                'Revive the Helix Fossil at the Pokémon Lab on Cinnabar Island.'
        },

        140: {
            category: '🦴 FOSSIL',
            title: 'Dome Fossil',
            description:
                'Revive the Dome Fossil at the Pokémon Lab on Cinnabar Island.'
        },

        142: {
            category: '🦴 FOSSIL',
            title: 'Old Amber',
            description:
                'Revive the Old Amber at the Pokémon Lab on Cinnabar Island.'
        },


        // =========================
        // GIFT / SPECIAL
        // =========================

        106: {
            category: '🎁 GIFT POKÉMON',
            title: 'Saffron City',
            description:
                'Choose Hitmonlee as your reward after defeating the Fighting Dojo.'
        },

        107: {
            category: '🎁 GIFT POKÉMON',
            title: 'Saffron City',
            description:
                'Choose Hitmonchan as your reward after defeating the Fighting Dojo.'
        },

        131: {
            category: '🎁 GIFT POKÉMON',
            title: 'Silph Co.',
            description:
                'Received as a gift from a Silph Co. employee in Saffron City.'
        },

        133: {
            category: '🎁 GIFT POKÉMON',
            title: 'Celadon City',
            description:
                'Received as a gift in the Celadon Mansion.'
        },


        // =========================
        // LEGENDARY / SPECIAL
        // =========================

        144: {
            category: '★ LEGENDARY',
            title: 'Seafoam Islands',
            description:
                'Encounter Articuno deep inside the Seafoam Islands.'
        },

        145: {
            category: '★ LEGENDARY',
            title: 'Power Plant',
            description:
                'Encounter Zapdos inside the Power Plant.'
        },

        146: {
            category: '★ LEGENDARY',
            title: 'Mt. Ember',
            description:
                'Encounter Moltres at Mt. Ember.'
        },

        150: {
            category: '★ LEGENDARY',
            title: 'Cerulean Cave',
            description:
                'Encounter Mewtwo deep inside Cerulean Cave after becoming Champion.'
        },

        151: {
            category: '★ EVENT POKÉMON',
            title: 'Mew',
            description:
                'Mew is not normally obtainable through standard gameplay in FireRed / LeafGreen.'
        }
    }


    const method =
        specialMethods[pokemon.number]


    if (method) {

        container.innerHTML = `

            <h3>
                🎒 How to Obtain
            </h3>

            <div class="obtain-card">

                <span class="obtain-category">
                    ${method.category}
                </span>

                <strong>
                    ${method.title}
                </strong>

                <p>
                    ${method.description}
                </p>

            </div>
        `

        return
    }


    container.innerHTML = `

        <h3>
            🎒 How to Obtain
        </h3>

        <div class="obtain-card">

            <span class="obtain-category">
                ★ SPECIAL
            </span>

            <p>
                No standard wild encounter
                information available.
            </p>

        </div>
    `
}

// ========================================
// FORMATA NOME DOS STATS
// ========================================

function formatStatName(statName) {

    const statNames = {

        hp: 'HP',

        attack: 'Attack',

        defense: 'Defense',

        'special-attack': 'Sp. Atk',

        'special-defense': 'Sp. Def',

        speed: 'Speed'

    }

    return statNames[statName] || statName
}


// ========================================
// CLIQUE NO CARD
// ========================================

pokemonList.addEventListener('click', (event) => {

    const pokemonCard =
        event.target.closest('.pokemon')

    if (!pokemonCard) {
        return
    }


    // Animação do card

    const pokemonImage =
    pokemonCard.querySelector('.detail img')


if (pokemonImage) {

    pokemonImage.classList.remove(
        'pokemon-action'
    )

    void pokemonImage.offsetWidth

    pokemonImage.classList.add(
        'pokemon-action'
    )


    pokemonImage.addEventListener(
        'animationend',
        () => {

            pokemonImage.classList.remove(
                'pokemon-action'
            )

        },
        {
            once: true
        }
    )

}


    // Descobre qual Pokémon foi clicado

    const pokemonId =
        Number(pokemonCard.dataset.pokemonId)


    const selectedPokemon =
        loadedPokemons.find(
            (pokemon) => pokemon.number === pokemonId
        )


    if (!selectedPokemon) {
        return
    }


    // Pequeno delay para vermos a animação do card

    setTimeout(() => {

        openPokemonModal(selectedPokemon)

    }, 250)

})
function renderPokemonLocations(locations) {

    const locationsContainer =
        document.querySelector('.pokemon-locations')


    if (!locationsContainer) {
        return
    }


    if (locations.length === 0) {

        locationsContainer.innerHTML = `
            <h3>
                📍 Kanto Locations
            </h3>

            <p>
                No wild encounters found in
                FireRed / LeafGreen.
            </p>
        `

        return
    }


    locationsContainer.innerHTML = `

        <h3>
            📍 Kanto Locations
        </h3>

        <div class="location-list">

            ${locations.map((location) => `

                <div class="location-item">

                    <strong>
                        ${formatLocationName(location.name)}
                    </strong>

                    ${location.versions.map((version) => `

                        <div class="location-version">

                            <span>
                                ${formatGameVersion(version.name)}
                            </span>

                            <span>
                                Encounter: ${version.chance}%
                            </span>

                        </div>

                    `).join('')}

                </div>

            `).join('')}

        </div>
    `
}

function formatLocationName(locationName) {

    return locationName

        .replace('kanto-', '')

        .replaceAll('-', ' ')

        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        )
}

function formatGameVersion(version) {

    const versions = {

        firered: 'FireRed',

        leafgreen: 'LeafGreen'

    }

    return versions[version] || version
}

// ========================================
// FECHAR PAINEL
// ========================================

function closeModal() {

    pokemonModal.classList.remove('active')

}


closePokemonModal.addEventListener(
    'click',
    closeModal
)


pokemonModal.addEventListener('click', (event) => {

    if (event.target === pokemonModal) {
        closeModal()
    }

})


// ESC fecha o painel

document.addEventListener('keydown', (event) => {

    if (
        event.key === 'Escape' &&
        pokemonModal.classList.contains('active')
    ) {

        closeModal()

    }

})
function saveCaughtPokemons() {

    localStorage.setItem(
        'caughtPokemons',
        JSON.stringify(caughtPokemons)
    )

}


function isPokemonCaught(pokemonId) {

    return caughtPokemons.includes(pokemonId)

}


function toggleCaughtPokemon(pokemonId) {

    if (isPokemonCaught(pokemonId)) {

        caughtPokemons =
            caughtPokemons.filter(
                (id) => id !== pokemonId
            )

    } else {

        caughtPokemons.push(pokemonId)

    }


    saveCaughtPokemons()

    updateCaughtCounter()
    if (
    pokedexCompleted &&
    viewCertificateButton
) {

    viewCertificateButton.hidden =
        false

}

    renderPokemonList()

    updateCaughtButton(pokemonId)

}
function updateCaughtCounter() {

    const caughtCount =
        document.getElementById('caughtCount')

    const progressBar =
        document.getElementById('progressBar')

    const progressPercentage =
        document.getElementById(
            'progressPercentage'
        )


    const totalCaught =
        caughtPokemons.length


    const percentage =
        Math.round(
            (totalCaught / maxRecords) * 100
        )


    if (caughtCount) {

        caughtCount.textContent =
            totalCaught

    }


    if (progressPercentage) {

        progressPercentage.textContent =
            `${percentage}%`

    }


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`

    }


    // Mostra o botão se o certificado
    // já tiver sido desbloqueado
    if (
        pokedexCompleted &&
        viewCertificateButton
    ) {

        viewCertificateButton.hidden =
            false

    }


    // Primeira vez que completa 151 / 151
    if (
        totalCaught === maxRecords &&
        !pokedexCompleted
    ) {

        unlockCertificate()

    }

}

viewCertificateButton.addEventListener(
    'click',
    () => {

        openCertificate()

    }
)


closeCertificate.addEventListener(
    'click',
    () => {

        closeCertificateModal()

    }
)


certificateModal.addEventListener(
    'click',
    (event) => {

        if (
            event.target ===
            certificateModal
        ) {

            closeCertificateModal()

        }

    }
)
document.addEventListener(
    'keydown',
    (event) => {

        if (
            event.key === 'Escape' &&
            certificateModal.classList.contains(
                'active'
            )
        ) {

            closeCertificateModal()

        }

    }
)

// ========================================
// PRIMEIRO CARREGAMENTO
// ========================================

loadPokemonItens(0, maxRecords)
updateCaughtCounter()