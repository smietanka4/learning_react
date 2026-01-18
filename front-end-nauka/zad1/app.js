const loading = document.getElementById("loading");
const error = document.getElementById("error");
const list = document.getElementById("pokemon-list");
const details = document.getElementById("pokemon-details");
const search = document.getElementById("search");

async function loadPokemons() {
  try {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    list.innerHTML = "";

    const response = await fetch("https://pokeapi.co/api/v2/pokemon");

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych");
    }

    const data = await response.json();

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

loadPokemons();
