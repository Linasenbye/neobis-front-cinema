const API_KEY = "cf6d0653-e6b1-4e5b-bfd0-467ac374bf2b";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1";

getMovies(API_URL_POPULAR);

async function getMovies(url) {
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });
    const respData = await resp.json();
    console.log(respData); // Add this line to inspect the response data
    showMovies(respData);
  }

function showMovies(data) {
    const moviesEl = document.querySelector(".movies");

    data.items.forEach((movie) => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
            <div class="movie-cover-inner">
            <img
                src="${movie.posterUrlPreview}"
                class="movie-cover"
                alt="${movie.nameRu}"
            />
            <div class="movie-cover--darkened"></div>
        </div>
        <div class="movie-info">
            <div class="movie-title">${movie.nameRu}</div>
            <div class="movie-category">${movie.genres.map(
                (genre) => ` ${genre.genre}`
              )}</div>
            <div class="movie-average movie-average-green">${movie.ratingKinopoisk}</div>
            <div class="movie-year">${movie.year}</div>
        </div>
    `;
    moviesEl.appendChild(movieEl);
    });
}