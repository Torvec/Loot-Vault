const apiKey = 'cb7fd697d0f04be5879ce9e0eb0c1473';
const searchBtn = document.getElementById('search-button')
const bestDealBtn = document.getElementById('best-deals')
const highestRatedBtn = document.getElementById('highest-rated')
const gamesContainer = document.getElementById('games-container')
const freeGamesBtn = document.getElementById('fg-button')

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

// ORIGINAL CODE TAKEN FROM https://rapidapi.com/digiwalls/api/gamerpower AND MODIFIED TO WORK WITH FETCH API
function fetchFreeGames() {
  const url = 'https://gamerpower.p.rapidapi.com/api/filter?platform=epic-games-store.steam.android&type=game.loot';
  const options = {
      method: 'GET',
      headers: {
      'X-RapidAPI-Key': 'b376f2e9e7msh1e177bc5d80ec31p1c15f4jsn146ea5790a77',
      'X-RapidAPI-Host': 'gamerpower.p.rapidapi.com'
      }
  };

  fetch(url, options)
      .then(function(response) {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
      })
      .then(function(result) {
          console.log(result);
          var gameList = document.createElement('div');
          gameList.setAttribute('id', 'gameList');
          document.body.appendChild(gameList);
          gamesContainer.innerHTML = '';
          
          for (let i = 0; i < result.length; i++) {
              var gameTitle = result[i].title;
              var gameDescription = result[i].description;
              var endDate = result[i].end_date;
              var status = result[i].status;
              var platforms = result[i].platforms;
              var worth = result[i].worth;
              gamesContainer.innerHTML += `
              <h2>Game: ${gameTitle}</h2>
              <p>End Date: ${endDate}</p>
              <p>Status: ${status}</p>
              <p>Platforms: ${platforms}</p>
              <p>Worth: ${worth}</p>
              <p>-----------------------------</p>
              `
          }
      })
      .catch(function(error) {
          console.error(error);
      });
  }


  freeGamesBtn.addEventListener('click', function(event) {
    event.preventDefault()
    fetchFreeGames(event)
    })


  // This should be called when the Free Games button is clicked
  // fetchFreeGames(); 





/*searchBtn.addEventListener('click', function(event) {
  event.preventDefault()
  fetchGames(event)
 }) */