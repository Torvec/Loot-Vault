const apiKey = 'cb7fd697d0f04be5879ce9e0eb0c1473';
const gamesDiv = document.getElementById('games');
const searchBtn = document.getElementById('search-btn')
const bestDealBtn = document.getElementById('best-deals')
var gamesContainer = document.getElementById('games-container')


  function fetchGames() {
    var search = document.getElementById('searchInput').value
    let slug = search.split(' ').join('-').toLowerCase()
    const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${slug}&dates=2019-09-01,2019-09-30&platforms=18,1,7`;
    
    console.log(slug)
    fetch(gamesUrl)
      .then(response => response.json()) 
      .then(data => { 
        console.log(data.results)


        // Loop through the games and display their names
          data.results.forEach(game => {
          const gameName = document.createElement('p');
          gameName.textContent = game.name;
          gamesDiv.appendChild(gameName);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  //fetchGames();
  
  // searchBtn.addEventListener('click', function(event) {
  // event.preventDefault()
  //  fetchGames(event)
  // }) 



// populates the page when the bestdDealBtn is clicked
bestDealBtn.addEventListener('click', function(event) {
  event.preventDefault()
  gamesContainer.innerHTML = ""
  fetchDiscounts(event)
  })

function fetchDiscounts() {
const gamesUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=1&onSale=1&pageSize=10`;

fetch(gamesUrl)
  .then(response => response.json()) // converts the response to JSON format
  .then(data => { // handles the JSON data
    data.slice(0, 10).forEach((game) => { //itterates through the data and displays the first 10 games

      // Get the game name, normal price, sale price, and purchase link
      const gameName = game.title;
      const normalPrice = game.normalPrice;
      const salePrice = game.salePrice;
      const id = game.dealID
    
      // Get the parent container
      var gamesContainer = document.getElementById("games-container");

      // Create a new container element for the game
      var gameContainer = document.createElement("div");

      // Set the class or any other attributes for the game container if needed
      gameContainer.classList.add("game-container");

      // Create the HTML content for the game container
      gameContainer.innerHTML = `
        <h3>${game.title}</h3>
        <p>Normal Price: $${game.normalPrice}</p>
        <p>Sale Price: $${game.salePrice}</p>
        <a href= https://www.cheapshark.com/redirect?dealID=${id} target="_blank">Buy Now</a>
        <p>-----------------------------</p>
      `;

      // Append the game container to the parent container
      gamesContainer.appendChild(gameContainer);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

  

function fetchHighestRated(){
const gamesUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=1&onSale=1&pageSize=10`;

fetch(gamesUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
}




/*searchBtn.addEventListener('click', function(event) {
  event.preventDefault()
  fetchGames(event)
 }) */