const apiKey = 'cb7fd697d0f04be5879ce9e0eb0c1473';
const searchBtn = document.getElementById('search-button')
const bestDealBtn = document.getElementById('best-deals')
const highestRatedBtn = document.getElementById('highest-rated')
var gamesContainer = document.getElementById('games-container')

// populates landing page
fetchDiscounts();

function fetchGames() {
  gamesContainer.innerHTML = ''
    var search = document.getElementById('searchInput').value
    let slug = search.split(' ').join('-').toLowerCase()
    const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${slug}&platforms=18,1,7`;
    fetch(gamesUrl)
      .then(response => response.json()) 
      .then(data => { 
        console.log(data.results)
        if (data.results.length === 0) {
            const gameName = document.createElement('p');
            gameName.textContent = 'No results found';
            gamesContainer.appendChild(gameName);
          }
        // Loop through the games and display their names
          data.results.forEach(game => {
            const gameContainer = document.createElement('div');
            gameContainer.classList.add('game-container');
            let screenshots = '';
            if (game.short_screenshots.length > 0) {
               screenshots = game.short_screenshots[0].image
            }
        gameContainer.classList.add('game-container');
        gameContainer.innerHTML = `
          <h3>${game.name}</h3>
          <p>Rating: ${game.rating}</p>
          <p>Release Date: ${game.released}</p>
          <img src="${screenshots}" alt="">
          <!-- Add more properties as needed -->
          <p>-----------------------------</p>
        `;

        gamesContainer.appendChild(gameContainer);
      });
    })
      .catch(error => {
        console.error('Error:', error);
      });
      
  }
  
//  fetchGames();
  
  searchBtn.addEventListener('click', function(event) {
  event.preventDefault()
  fetchGames(event)
   }) 



// populates the page when the bestdDealBtn is clicked
bestDealBtn.addEventListener('click', function(event) {
  event.preventDefault()
  gamesContainer.innerHTML = ""
  fetchDiscounts(event)
  })

function fetchDiscounts() {
  const gamesUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=1&onSale=1&pageSize=10`;

  // Get the parent container where games will be displayed
  const parentContainer = document.getElementById("games-container");

  fetch(gamesUrl)
    .then(response => response.json())
    .then(data => {
      data.slice(0, 10).forEach((game) => {
        const gameName = game.title;
        const normalPrice = game.normalPrice;
        const salePrice = game.salePrice;
        const dealRating = game.dealRating;
        const id = game.dealID;

        // Create a new container element for the game
        const gameContainer = document.createElement("div");
        gameContainer.classList.add("individual-container");
             
        // Create the HTML content for the game container
        gameContainer.innerHTML = `
          <h3>${gameName}</h3>
          <p>Normal Price: $${normalPrice}</p>
          <p>Sale Price: $${salePrice}</p>
          <p>Deal Rating: ${dealRating}</p>
          <a href="https://www.cheapshark.com/redirect?dealID=${id}" target="_blank">Buy Now</a>
          <button> test </button>
          <p>-----------------------------</p>
        `;

        // Append the game container to the parent container
        parentContainer.appendChild(gameContainer);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}










/*searchBtn.addEventListener('click', function(event) {
  event.preventDefault()
  fetchGames(event)
 }) */