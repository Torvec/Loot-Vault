const apiKey = 'cb7fd697d0f04be5879ce9e0eb0c1473';
const gamesDiv = document.getElementById('games-container');
const searchBtn = document.getElementById('search-button')
function clearSearch() {
    gamesDiv.innerHTML = ''
}  
function fetchGames() {
    clearSearch()
    var search = document.getElementById('searchInput').value
    let slug = search.split(' ').join('-').toLowerCase()
    const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${slug}&dates=2019-09-01,2019-09-30&platforms=18,1,7`;
    fetch(gamesUrl)
      .then(response => response.json()) 
      .then(data => { 
        console.log(data.results)
        if (data.results === []) {
            const gameName = document.createElement('p');
            gameName.textContent = 'No results found';
            gamesDiv.appendChild(gameName);
          }
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
   searchBtn.addEventListener('click', function(event) {
    event.preventDefault()
    fetchGames(event)
   }) 

   