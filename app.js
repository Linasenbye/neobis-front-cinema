function currentMonth(date){
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    let monthIndex = date.getMonth();
    return months[monthIndex];
}
const MONTH = currentMonth(new Date());
const YEAR = new Date().getFullYear();

const API_KEY = "cf6d0653-e6b1-4e5b-bfd0-467ac374bf2b";
//premieres of the month
const API_URL_PREMIERES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${YEAR}&month=${MONTH}`;
//releases
const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${YEAR}&month=${MONTH}&page=1`;
//top movies
const API_URL_TOP = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1";
//waiting movies
const API_URL_CLOSE_RELEASES = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=CLOSES_RELEASES&page=1";
//search 
const API_URL_KEYWORD = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${KEYWORD}&page=1";

document.addEventListener("DOMContentLoaded", () => {
    async function getMovies(url) {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY,
            },
        });
    const respData = await resp.json();
    console.log(respData); // inspect the response data
    typicalData(respData)
  }

    //choose the categories
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
    //seach by the keyword
    document.getElementById('searchInput').addEventListener('keypress', (e)=>{
        if (e.key === "Enter") {
            const KEYWORD = document.getElementById('searchInput').value.trim();
            const API_URL_KEYWORD = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${KEYWORD}&page=1`;
            getMovies(API_URL_KEYWORD);
            searchInput.value = "";
            console.log(KEYWORD);
        }
    })
    //main page
    getMovies(API_URL_TOP);
    category[0].classList.add('chose')

    //data format
    function typicalData(data){
        if (data.releases){
            data.items = data.releases
            delete data.releases
        }else if(data.films){
            data.items = data.films
            delete data.films
        }
        let selectedMovies = data.items.map(movie => {
            if (movie.filmId && movie.rating){
                return {
                    id: movie.filmId,
                    movieName: movie.nameRu,
                    year: movie.year,
                    movieUrl : movie.posterUrl,
                    genre: movie.genres.map(item => item.genre).join(', '),
                    rating: movie.ratingKinopoisk,
                };
            } else if (!movie.rating && !movie.ratingKinopoisk){
                return {
                    id: movie.kinopoiskId,
                    movieName: movie.nameRu,
                    year: movie.year,
                    movieUrl : movie.posterUrl,
                    genre: movie.genres.map(item => item.genre).join(', '),
                };
            }
            else {
                return {
                    id: movie.kinopoiskId,
                    movieName: movie.nameRu,
                    year: movie.year,
                    movieUrl : movie.posterUrl,
                    genre: movie.genres.map(item => item.genre).join(', '),
                    rating: movie.ratingKinopoisk,
                };
            }
        });
        console.log(category)
        showMovies(selectedMovies);
        checkLiked(selectedMovies);
        console.log(selectedMovies);
    }
    //displaying movies on the page
    function showMovies(data){
        const moviesEl = document.querySelector(".movies");
        document.querySelector(".movies").innerHTML = "";
        
        data.forEach(item =>{
            const movieEl = document.createElement("div");
            movieEl.classList.add("item");
            movieEl.id = item.id;
            movieEl.innerHTML = `
                <div class="movie-cover-inner">
                    <img class="movie-cover" name="movieUrl" src="${item.movieUrl}" alt=“”>
                </div>
                <div class="movie-info">
                    <div class=“movie-text”>
                        <div class="movie-title" name="movieName">${item.movieName}</div>
                        <div class="movie-category" name="genre">${item.genre}</div>
                        <div class="movie-year" name="year">${item.year}</div>
                    </div>
                    <div class="movie-average movie-average-${getClassByRate(item.rating)}">${item.rating}</div>
                    <button class="favorite"></button>
                </div>
            `;
            moviesEl.appendChild(movieEl);
        })
        like();
    }
    //clicking the like button and sending data to localStorage
    const LS = localStorage;
    let movieData = {};
    let movieDataArray = [];
    function like(){
        const hearts = document.querySelectorAll('.favorite');
        const movieTitle = document.querySelectorAll('.movie-title');
        const movieUrl = document.querySelectorAll('.movie-cover')
        const genres = document.querySelectorAll('.movie-category');
        const year = document.querySelectorAll('.movie-year');
        const rating = document.querySelectorAll('.movie-average');
        const movie = document.querySelectorAll('.item');
        
        for (let i = 0; i < hearts.length; i++){
            //when clicking the heart
            hearts[i].addEventListener('click', ()=>{
                if (hearts[i].classList.contains('liked')){
                    hearts[i].classList.remove('liked');
                    movieDataArray = movieDataArray.filter(movie => movie.movieName !== movieTitle[i].textContent);
                    console.log(movieDataArray)
                    LS.setItem('movieData', JSON.stringify(movieDataArray))
                }else{
                    movieData = {};
                    hearts[i].classList.add('liked');
                    movieData['id'] = movie[i].id;
                    movieData[movieTitle[i].getAttribute('name')] = movieTitle[i].textContent;
                    movieData[movieUrl[i].getAttribute('name')] = movieUrl[i].src;
                    movieData[genres[i].getAttribute('name')] = genres[i].textContent;
                    movieData[year[i].getAttribute('name')] = year[i].textContent;
                    movieData[rating[i].getAttribute('name')] = rating[i].textContent;
                    movieData['status'] = 'liked';
                    movieDataArray.push(movieData);
                    LS.setItem('movieData', JSON.stringify(movieDataArray))
                }
            });
        }
    }
    //checking after updates
    function checkLiked(data){
        if (LS.getItem('movieData')){
            const movieDataArray = JSON.parse(LS.getItem('movieData'));
            const hearts = document.querySelectorAll('.favorite');
            for (let i = 0; i < movieDataArray.length; i++){
                for (let j = 0; j < data.length; j++){
                    if (+movieDataArray[i].id === +data[j].id){
                        hearts[j].classList.add('liked');
                    }
                }
            }
        }
    }
    //clicking to the favorite category
    function favoriteMovies(event){
        event.preventDefault()
        movieDataArray = JSON.parse(LS.getItem('movieData'));
        showMovies(movieDataArray);
        checkLiked(movieDataArray)
    }
    document.querySelector('.favorites').addEventListener('click', favoriteMovies)
})

function getClassByRate(vote) {
    if (vote >= 7) {
        return "green";
    } 
    else if (vote > 5) {
        return "orange";
    }
    else if (vote < 5){
        return "red";
    }
    else {
        return "nothing";
    }
}
