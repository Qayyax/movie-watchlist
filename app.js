const movieListContainer = document.querySelector('.movie-list-container')
const movieTitleInputEl = document.getElementById('search-input')
const movieSearchForm = document.getElementById('form-container')

// Event listener to submit movie search input
movieSearchForm.addEventListener('submit', function(e){
    e.preventDefault()
    if (movieTitleInputEl.value) {
        searchTitle(movieTitleInputEl.value)
        movieTitleInputEl.value = ''
    } else {
        return
    }
})

// Function to get the title in the search
// This title would then be fed to the getMovies function
async function searchTitle (title) {
    let normalTitle = formatTitle(title)
    const response = await fetch(`https://www.omdbapi.com/?apikey=537849f9&s=${normalTitle}`)
    const data = await response.json()

    // if the movie does not exist
    if (data.Error == "Movie not found!"){
        movieListContainer.innerHTML = `
        <p class="error-title">Unable to find what you’re looking for. Please try another search.</p>
`
    } 
    // if the movie exist
    else {
        let movieTitles = data.Search.map(e => e.Title)

        let movieFinal = await Promise.all(movieTitles.map(async e => {
            let query = formatTitle(e);
            let movie = await getMovies(query);
            return movie;
        }));
        renderMovies(movieFinal)
    }
}

// Fucntion to render the html to page
function renderMovies(movieList) {
    let movieArray = movieList.map((movie, index) => {
        let movieDiv = `
        <div class="movie-container">
            <img class="poster" src="${movie.poster}" alt="${movie.title} poster">

            <div class="movie-details">
               <div class="movie-title-container">
                   <h2>${movie.title}</h2>
                   <i class="fa-solid fa-star ratings-icon"></i>
                   <p class="movie-rating">${movie.rating}</p>
               </div> 

               <div class="movie-details-container">
                   <p class="runtime">${movie.runtime}</p>
                   <p class="genre">${movie.genre}</p>
                   <div class="watchlist-container">
                       <i class="fa-solid fa-circle-plus add-movie-btn" onclick="addToWatchlist(${index})"></i>
                       <p class="watchlist-text">Watchlist</p>
                   </div>
               </div>

               <div class="movie-plot-container">
                   <p class="plot">${handlePlot(movie.plot, index)}</p>
               </div>

            </div>
        </div>
`
         return movieDiv
    })
    
    let movieExport = movieList
    window.exportMovie = function() {
        return movieExport
    }
    
    movieListContainer.style.justifyContent = 'flex-start'
    movieListContainer.innerHTML = movieArray.join(" ")
}

// This function gets the movies based on the title received 
// from searchTitle 
async function getMovies (title) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=537849f9&t=${title}&plot=full`)
    const data = await response.json()
    const movieData = {
        title: data.Title != 'N/A'? data.Title : 'No information',
        runtime: data.Runtime != 'N/A'? data.Runtime : 'unknown',
        genre: data.Genre != 'N/A'? data.Genre : 'unknown',
        rating: data.imdbRating != 'N/A'? data.imdbRating : 'unknown',
        poster: data.Poster != 'N/A'? data.Poster : 'https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        plot: data.Plot != 'N/A'? data.Plot : 'No information',
        isClicked : false
    }
    return movieData
}

// Function to change search text to REST API format
function formatTitle (title) {
    let newText = title.replace(/ /g, '+')
    return newText
}

// Function to reduce long plot and add readmore button
function handlePlot(text, index) {
    if (text.length > 120) {
        let trunc = text.slice(0, 120)
        let remainingText = text.slice(120)
        let plot = `${trunc}<span class="trunc">...</span> <span class="remaining-text close">${remainingText}</span><span class="read-more" onclick="showMore(${index})">Read more</span>`
        return plot
    }
    else {
        let plot = `${text}<span class="trunc close">...</span> <span class="remaining-text close"><span class="read-more close"></span`
        return plot
    }
}

// Function to expand plot text when readMore is clicked
function showMore(index) {
    const textSpan = document.querySelectorAll('.remaining-text')
    const readMoreEl = document.querySelectorAll('.read-more')
    const truncEl = document.querySelectorAll('.trunc')
    textSpan[index].classList.toggle('close')
    truncEl[index].classList.toggle('close')

    if (textSpan[index].classList.contains('close')) {
        readMoreEl[index].textContent = 'Read more';
    } else {
        readMoreEl[index].textContent = ' Read less';
    }

}

const movieWatchList = JSON.parse(localStorage.getItem('watchList')) || [];

// Function to add and remove watchlist 
function addToWatchlist(index) {
    let movieData = exportMovie()
    const addMovieIcon = document.querySelectorAll('.add-movie-btn')
    const watchlistText = document.querySelectorAll('.watchlist-text')
    movieData[index].isClicked = !movieData[index].isClicked;

    if (movieData[index].isClicked) {
        movieWatchList.push(movieData[index])
        localStorage.setItem('watchList', JSON.stringify(movieWatchList))
        addMovieIcon[index].classList.remove('fa-circle-plus')
        addMovieIcon[index].classList.add('fa-circle-minus')
        watchlistText[index].innerText = 'Remove'
    } 
    else {
        let movieIndex = movieWatchList.indexOf(movieData[index])

        if (movieIndex !== -1) {
            movieWatchList.splice(movieIndex, 1)
            localStorage.setItem('watchList', JSON.stringify(movieWatchList))
            addMovieIcon[index].classList.remove('fa-circle-minus')
            addMovieIcon[index].classList.add('fa-circle-plus')
            watchlistText[index].innerText = 'Watchlist'
        }
    }
}


// localStorage.clear()
