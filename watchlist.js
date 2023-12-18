const watchListContainer = document.querySelector('.watch-list-container')
const movieWatchList = JSON.parse(localStorage.getItem('watchList'))

renderPage()

function renderPage() {
    if(movieWatchList.length === 0){
        watchListContainer.innerHTML = `
        <h3>Your watchlist is looking a little empty...</h3>
        <div class="go-to-watchlist">
            <a href="/index.html"><i class="fa-solid fa-circle-plus add-movie-btn"></i></a>
            <a href="/index.html"><p class="go-to-watchlist-text">Let’s add some movies!</p></a>
        </div>
`
        watchListContainer.style.justifyContent = 'center'

    }
    else {
        watchListContainer.innerHTML = ""
    
        movieWatchList.forEach((movie, index) => {
            let watchlistDiv = `
                <div class="movie-container">
                    <img class="poster" src="${movie.poster}" alt="${movie.title} poster">

                    <div class="movie-details">
                       <div class="movie-title-container">
                           <h2 class='movie-title' data-title='${movie.title}'>${movie.title}</h2>
                           <i class="fa-solid fa-star ratings-icon"></i>
                           <p class="movie-rating">${movie.rating}</p>
                       </div> 

                       <div class="movie-details-container">
                           <p class="runtime">${movie.runtime}</p>
                           <p class="genre">${movie.genre}</p>
                           <div class="watchlist-container">
                               <i class="fa-solid fa-circle-minus add-movie-btn" onclick="removeFromWatchList(${index})"></i>
                               <p class="watchlist-text">Remove</p>
                           </div>
                       </div>

                       <div class="movie-plot-container">
                           <p class="plot">${handlePlot(movie.plot, index)}</p>
                       </div>

                    </div>
                </div>
                
        `
            watchListContainer.innerHTML += watchlistDiv
            watchListContainer.style.justifyContent = 'flex-start'

        })
    }
}

function removeFromWatchList(index) {
    if (index !== -1) {
        movieWatchList.splice(index, 1)
        localStorage.setItem('watchList', JSON.stringify(movieWatchList))
        renderPage()
    }
}

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

// localStorage.clear()
