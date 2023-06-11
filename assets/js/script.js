const apiKey = 'cb7fd697d0f04be5879ce9e0eb0c1473';

  function fetchGames() {
    const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2019-09-01,2019-09-30&platforms=18,1,7`;

    fetch(gamesUrl)
      .then(response => response.json())
      .then(data => {
        const gamesDiv = document.getElementById('games');

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

    fetchGames();