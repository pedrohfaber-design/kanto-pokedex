
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.height = pokeDetail.height / 10

pokemon.weight = pokeDetail.weight / 10

pokemon.abilities = pokeDetail.abilities.map(
    (abilitySlot) => abilitySlot.ability.name
)

pokemon.stats = pokeDetail.stats.map((statSlot) => ({
    name: statSlot.stat.name,
    value: statSlot.base_stat
}))

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
// ========================================
// LOCALIZAÇÕES DO POKÉMON
// ========================================

pokeApi.getPokemonEncounters = async (pokemonId) => {

    const url =
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`

    try {

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Erro ao buscar localizações')
        }

        const encounters = await response.json()

        return encounters

    } catch (error) {

        console.error(
            'Erro ao buscar encounters:',
            error
        )

        return []
    }
}
pokeApi.getKantoLocations = async (pokemonId) => {

    const encounters =
        await pokeApi.getPokemonEncounters(pokemonId)


    const kantoLocations = encounters
        .map((encounter) => {

            const versions =
                encounter.version_details.filter((versionDetail) => {

                    const version =
                        versionDetail.version.name

                    return (
                        version === 'firered' ||
                        version === 'leafgreen'
                    )

                })


            if (versions.length === 0) {
                return null
            }


            return {

                name: encounter.location_area.name,

                versions: versions.map((version) => ({
                    name: version.version.name,
                    chance: version.max_chance,

                    methods:
                        version.encounter_details.map(
                            (detail) => ({
                                method: detail.method.name,
                                minLevel: detail.min_level,
                                maxLevel: detail.max_level,
                                chance: detail.chance
                            })
                        )
                }))

            }

        })

        .filter((location) => location !== null)


    return kantoLocations
}
// ========================================
// ESPÉCIE DO POKÉMON
// ========================================

pokeApi.getPokemonSpecies = async (pokemonId) => {

    const url =
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`

    try {

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Erro ao buscar espécie')
        }

        return await response.json()

    } catch (error) {

        console.error(
            'Erro ao buscar espécie:',
            error
        )

        return null
    }
}

pokeApi.getEvolutionChain = async (pokemonId) => {

    try {

        const species =
            await pokeApi.getPokemonSpecies(pokemonId)

        if (!species) {
            return null
        }

        const evolutionChainUrl =
            species.evolution_chain.url

        const response =
            await fetch(evolutionChainUrl)

        if (!response.ok) {
            throw new Error(
                'Erro ao buscar cadeia evolutiva'
            )
        }

        return await response.json()

    } catch (error) {

        console.error(
            'Erro ao buscar cadeia evolutiva:',
            error
        )

        return null
    }
}

// ========================================
// CADEIA EVOLUTIVA
// ========================================

pokeApi.getEvolutionMethod = async (pokemonId) => {

    const evolutionChain =
        await pokeApi.getEvolutionChain(pokemonId)


    if (!evolutionChain) {
        return null
    }


    const pokemonIdNumber =
        Number(pokemonId)


    function searchEvolution(chain) {

        for (const evolution of chain.evolves_to) {

            const speciesUrl =
                evolution.species.url


            const speciesId =
                Number(
                    speciesUrl
                        .split('/')
                        .filter(Boolean)
                        .pop()
                )


            if (speciesId === pokemonIdNumber) {

                const detail =
                    evolution.evolution_details[0]

                return {

                    from:
                        chain.species.name,

                    to:
                        evolution.species.name,

                    trigger:
                        detail?.trigger?.name || null,

                    minLevel:
                        detail?.min_level || null,

                    item:
                        detail?.item?.name || null,

                    heldItem:
                        detail?.held_item?.name || null,

                    minHappiness:
                        detail?.min_happiness || null,

                    timeOfDay:
                        detail?.time_of_day || null

                }
            }


            const nestedEvolution =
                searchEvolution(evolution)


            if (nestedEvolution) {
                return nestedEvolution
            }

        }


        return null
    }


    return searchEvolution(
        evolutionChain.chain
    )
}