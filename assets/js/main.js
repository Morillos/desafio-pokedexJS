const pokemonHtmlList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const modal = document.getElementById("pokemonModal");
const modalContent = document.getElementById("modal-content");
const titlteHTML = document.getElementById("cardTitle");
const cardImgAtributes = document.getElementById("cardImg");
const statHtml = document.getElementById("stats");
const aboutHTML = document.getElementById("about");
const closeButton = document.getElementById("close");

let htmlPokemons;
const maxPokemonLoad = 251;
const limit = 40;
let offset = 0;

function loadPokemonItems(offset, limit) {
  function convertPokemonToLi(pokemon) {
    return `
      <li class="pokemon ${pokemon.mainType}" >
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>
  
          <div class="detail">
               <ol class="types">
                  ${pokemon.types
                    .map((type) => `<li class="type ${type}">${type}</li>`)
                    .join("")}
              </ol>
  
              <img src="${pokemon.sprite}" alt="${pokemon.name}">
          </div>
       </li>
      `;
  }

  pokeApi.getPokemons(offset, limit).then((pokemonList = []) => {
    htmlPokemons = pokemonList.map(convertPokemonToLi).join("");
    pokemonHtmlList.innerHTML += htmlPokemons;
  });
}

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdPokemonLoaded = offset + limit;
  if (qtdPokemonLoaded >= maxPokemonLoad) {
    const newLimit = maxPokemonLoad - offset;
    loadPokemonItems(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItems(offset, limit);
  }
});

pokemonList.addEventListener("click", (event) => {
  // Encontra o pokemon mais próximo que foi clicado
  const pokemonItem = event.target.closest(".pokemon");

  if (pokemonItem) {
    // Extrair informações do HTML <li> do Pokémon
    const name = pokemonItem.querySelector(".name").textContent;
    const pokemon_URL = {
      url: `${BASE_API_URL}/${name}`,
    };
    pokeApi.getPokemonsDetail(pokemon_URL).then((pokemonInfo) => {
      // Criar o conteúdo do modal
      const modalTitleHTML = `
      <div class="cardTitle detail">
        <span class="name">${pokemonInfo.name}</span>
          <ol class="types">
              ${pokemonInfo.types
                .map((type) => `<li class="type ${type}">${type}</li>`)
                .join("")}
          </ol>     
      </div>
      <span class="number">#${pokemonInfo.number}</span>
      `;

      const modalStatHTML = `
                <div class="infos">
                  <ul class="infoContent">
                    <li>
                      <div class="infoItem infoStat">
                        <span class="infoName">HP</span>
                        <span class="infoValue">${pokemonInfo.stats[0]}</span>
                        <progress class="statBar" value="${pokemonInfo.stats[0]}" max="255"></progress>
                      </div>
                    </li>
                    <li>
                      <div class="infoItem infoStat">
                        <span class="infoName">atk</span>
                        <span class="infoValue">${pokemonInfo.stats[1]}</span>
                        <progress class="statBar" value="${pokemonInfo.stats[1]}" max="255"></progress>
                      </div>
                    </li>
                    <li>
                      <div class="infoItem infoStat">
                        <span class="infoName">def</span>
                        <span class="infoValue">${pokemonInfo.stats[2]}</span>
                        <progress class="statBar" value="${pokemonInfo.stats[2]}" max="255"></progress>
                      </div>
                    </li>
                    <li>
                      <div class="infoItem infoStat">
                        <span class="infoName">spAtk</span>
                        <span class="infoValue">${pokemonInfo.stats[3]}</span>
                        <progress class="statBar" value="${pokemonInfo.stats[3]}" max="255"></progress>
                      </div>
                    </li>
                    <li>
                      <div class="infoItem infoStat">
                        <span class="infoName">spDef</span>
                        <span class="infoValue">${pokemonInfo.stats[4]}</span>
                        <progress class="statBar" value="${pokemonInfo.stats[4]}" max="255"></progress>
                      </div>
                    </li>
                    <li>
                      <div class="infoItem infoStat">
                        <span class="infoName">speed</span>
                        <span class="infoValue">${pokemonInfo.stats[5]}</span>
                        <progress class="statBar" value="${pokemonInfo.stats[5]}" max="255"></progress>
                      </div>
                    </li>
                  </ul>
                </div>`;

      const modalAboutHTML = `
                <div class="infos">
                  <ul class="infoContent">
                    <li>
                      <div class="infoItem">
                        <span class="infoName">height</span>
                        <span class="infoValue">${pokemonInfo.height} ft.</span>
                      </div>
                    </li>
                    <li>
                      <div class="infoItem">
                        <span class="infoName">weight</span>
                        <span class="infoValue">${pokemonInfo.weight} lb.</span>
                      </div>
                    </li>
                  </ul>
                </div>`;

      // Inserir o conteúdo no modal
      titlteHTML.innerHTML = modalTitleHTML;
      cardImgAtributes.src = pokemonInfo.sprite;
      cardImgAtributes.alt = `${pokemonInfo.name}`;
      statHtml.innerHTML = modalStatHTML;
      modalContent.classList.add(`${pokemonInfo.mainType}`);
      aboutHTML.innerHTML = modalAboutHTML;

      // Exibir o modal
      modal.style.display = "flex";
    });
  }
});

// Fechar o modal quando clicar no X
closeButton.onclick = function () {
  modal.style.display = "none";
  const modalContentClasses = modalContent.classList;
  const item = modalContentClasses.item(modalContentClasses.length - 1);
  modalContent.classList.remove(item);
};

// Fechar o modal quando clicar fora dele
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    const modalContentClasses = modalContent.classList;
    const item = modalContentClasses.item(modalContentClasses.length - 1);
    modalContent.classList.remove(item);
  }
};

const tabs = document.querySelectorAll(".tab-btn");
tabs.forEach((tab) => tab.addEventListener("click", () => tabClicked(tab)));

const tabClicked = (tab) => {
  tabs.forEach((tab) => tab.classList.remove("active"));
  tab.classList.add("active");

  const contents = document.querySelectorAll(".cardContent");
  contents.forEach((content) => content.classList.remove("show"));

  const contentId = tab.getAttribute("content-id");
  const content = document.getElementById(contentId);

  content.classList.add("show");
};

const currentActiveTab = document.querySelector(".tab-btn.active");
tabClicked(currentActiveTab);

function main() {
  loadPokemonItems(offset, limit);
}
main();
