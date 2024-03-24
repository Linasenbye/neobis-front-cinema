function currentMonth(date){
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    let monthIndex = date.getMonth();
    return months[monthIndex];
}
const MONTH = currentMonth(new Date());
const YEAR = new Date().getFullYear();

const API_KEY = "cf6d0653-e6b1-4e5b-bfd0-467ac374bf2b";
//премьеры месяца
const API_URL_PREMIERES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${YEAR}&month=${MONTH}`;
//цифровые релизы
const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${YEAR}&month=${MONTH}&page=1`;
//top фильмов
const API_URL_TOP = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1";
// ожидамые релизы
const API_URL_CLOSE_RELEASES = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=CLOSES_RELEASES&page=1";
//поиск по ключевому слову
const API_URL_KEYWORD = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${KEYWORD}&page=1";

document.addEventListener("DOMContentLoaded", () => {
    async function getMovies(url) {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY,
            },
        });
    const respData = await resp.json();
    console.log(respData); // Add this line to inspect the response data
  }

    //при выборе категории
    const URL = [API_URL_PREMIERES, API_URL_CLOSE_RELEASES, API_URL_RELEASES, API_URL_TOP];
    const category = document.querySelectorAll('.category')

    for (let i = 0; i < category.length; i++){
        category[i].addEventListener('click', ()=>{
            for (let i = 0; i < category.length; i++){
                category[i].classList.remove('chose');
            }
            getMovies(URL[i]);
            category[i].classList.add('chose');
        })
    }

    // const KEYWORD = document.querySelector(‘.header__search’).value.trim();
    //найти фильм по ключевому слову
    document.getElementById('searchInput').addEventListener('keypress', (e)=>{
        if (e.key === "Enter") {
            const KEYWORD = document.querySelector('searchInput').value;
            const API_URL_KEYWORD = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${KEYWORD}&page=1`;
            getMovies(API_URL_KEYWORD);
            searchInput.value = "";
            console.log(KEYWORD);
        }
    })
    //стартовая страница
    getMovies(API_URL_PREMIERES);
    category[0].classList.add('chose')
})

function getClassByRate(vote) {
    if (vote >= 7) {
        return "green";
    } 
    else if (vote > 5) {
        return "orange";
    } 
    else {
        return "red";
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML = "";

    data.items.map((movie) => {
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
              ${
                movie.ratingKinopoisk &&
                `
                <div class="movie-average movie-average-${getClassByRate(movie.ratingKinopoisk)}">${movie.ratingKinopoisk}</div>
              `
              }
            
            <div class="movie-year">${movie.year}</div>
        </div>
    `;
    moviesEl.appendChild(movieEl);
    });
}

