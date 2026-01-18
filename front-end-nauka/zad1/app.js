const loading = document.getElementById("loading");
const error = document.getElementById("error");
const list = document.getElementById("pokemon-list");
const details = document.getElementById("pokemon-details");
const search = document.getElementById("search");

<<<<<<< HEAD
=======
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=50";

let allPokemons = [];

>>>>>>> e9c8a83707b81d9289b381327306b12b3bf51877
async function loadPokemons() {
  try {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    list.innerHTML = "";

<<<<<<< HEAD
    const response = await fetch("https://pokeapi.co/api/v2/pokemon");

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych");
=======
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Błąd: Status: ${response.status}`);
>>>>>>> e9c8a83707b81d9289b381327306b12b3bf51877
    }

    const data = await response.json();

<<<<<<< HEAD
    loading.classList.add("hidden");

    // Tworzymy listę pokemonów z lewej strony
    console.log(data);
    data.results.forEach((pokemon, index) => {
      const item = document.createElement("div");

      const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        index + 1
      }.png`;
      item.classList.add("pokemon-item");
      item.innerHTML = `
        <img src="${sprite}" alt="${
        pokemon.name
      }" style="width: 100px; height: 100px;">
        <p>${index + 1}. ${pokemon.name}</p>
      `;

      // item.addEventListener("click", () => showDetails(pokemon));

      list.appendChild(item);
    });
  } catch (error) {
    loading.classList.add("hidden");
    error.textContent = error.message;
    error.classList.remove("hidden");
  }
}

=======
    allPokemons = data.results;
    renderPokemons(allPokemons);

    loading.classList.add("hidden");
  } catch (err) {
    error.classList.remove("hidden");
    loading.classList.add("hidden");

    console.error(`Błąd: ${err}`);
  }
}

async function renderPokemons(pokemons) {
  list.innerHTML = "";

  pokemons.forEach((pokemon, index) => {
    const id = pokemon.url.split("/")[6];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.innerHTML = `
        <img src="${imageUrl}" alt="${pokemon.name}">
        <p>#${id} ${pokemon.name.toUpperCase()}</p>
    `;

    card.addEventListener("click", () => {
      loadPokemonDetails(id);
    });

    list.appendChild(card);
  });
}

async function loadPokemonDetails(id) {
  details.innerHTML = `
    <div class="loading-info">
        <p>Pobieranie danych Pokemona...</p>
    </div>
  `;

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();

  details.innerHTML = ``;

  const pokemonTypes = pokemon.types.map((item) => item.type.name);

  const detailedCard = document.createElement("div");

  detailedCard.innerHTML = `
      <h2>${pokemon.name.toUpperCase()}</h2>
      <img src="${pokemon.sprites.front_default}" width="150">
      <p>Wzrost: ${pokemon.height / 10} m</p>
      <p>Waga: ${pokemon.weight / 10} kg</p>
      <p>Typy: ${pokemonTypes}</p>
    `;

  details.append(detailedCard);
}

search.addEventListener("input", (a) => {
  const res = a.target.value.toLowerCase();

  const filteredPokemons = allPokemons.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(res);
  });

  renderPokemons(filteredPokemons);
});

>>>>>>> e9c8a83707b81d9289b381327306b12b3bf51877
loadPokemons();
