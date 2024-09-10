const BASE_API_URL = "https://pokeapi.co/api/v2/pokemon";
const pokeApi = {};

function convertPokeApiToPokemonModel(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;
  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  pokemon.types = types;
  pokemon.stats = pokeDetail.stats.map((stat) => stat.base_stat);
  const [mainType] = types;
  pokemon.mainType = mainType;
  pokemon.sprite = pokeDetail.sprites.other.dream_world.front_default;
  pokemon.height = pokeDetail.height;
  pokemon.weight = pokeDetail.weight;
  return pokemon;
}

pokeApi.getPokemonsDetail = (pokemon_URLs) => {
  return fetch(pokemon_URLs.url)
    .then((response) => response.json())
    .then(convertPokeApiToPokemonModel);
};
pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  //   Esse primeiro fetch está fazendo a requisição da lista da API.
  return (
    fetch(url)
      // tratanto o primeira resposta e a transformando em json
      .then((response) => response.json())

      // pegando o contúedo do json e separabdo o corpo do resultado, com o nome e url dos pokemons
      .then((jsonBody) => jsonBody.results)

      //cria uma lista mapeando a url do tratamento anterior em uma lista de pokemons porém agora com todos os detalhes sobre.
      .then((pokemonsResults) => pokemonsResults.map(pokeApi.getPokemonsDetail))

      // fazendo a requisição de todas as informações de todos os pokemons para poder acessar por JS
      .then((detailRequests) => Promise.all(detailRequests))

      // depois de ter todos os pokemons "processados" retorna lista dos pokemons detalhada
      .then((pokemonDetailsList) => pokemonDetailsList)
  );
};
