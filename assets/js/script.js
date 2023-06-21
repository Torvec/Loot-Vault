// LOOT VAULT V1.0 - JUNE 20, 2023    
    
    // Bulma's Navbar Burger Menu implementation from https://bulma.io/documentation/components/navbar/
    document.addEventListener('DOMContentLoaded', () => {
      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {
              // Get the target from the "data-target" attribute
              const target = el.dataset.target;
              const $target = document.getElementById(target);
              // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
              el.classList.toggle('is-active');
              $target.classList.toggle('is-active');
          });
      });
  });

  // VARIABLES
  
  const rawgAPIKey = "cb7fd697d0f04be5879ce9e0eb0c1473";
  const searchBtn = document.getElementById("search-button");
  const bestDealBtn = document.getElementById("best-deals");
  const highestRatedBtn = document.getElementById("highest-rated");
  const freeGamesBtn = document.getElementById("free-games");
  const myWishlistBtn = document.getElementById("my-wishlist");

  let ratedStartDate = dayjs().format("YYYY-MM-DD");
  let ratedEndDate = dayjs().subtract(1, "year").format("YYYY-MM-DD");
      
  const main = document.querySelector("main");

  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // FUNCTION DECLARATIONS

  function createPageTitle(text) {
      let hero = document.createElement("section");
      hero.setAttribute("class", "hero is-large bg-clr-1 page-hero-bg");
      hero.innerHTML = 
      `
      <div class = "hero-body">
          <h1 class = "is-size-1 has-text-centered has-text-weight-bold">${text}</h1>
      </div>
      `;
      main.appendChild(hero);
  }
  
  // Uses the RAWG API to search for a game and displays relevant results on the page
  function searchGames() {
      createPageTitle("Search Results");
      var search = document.getElementById("search-input").value;
      let slug = search.split(" ").join("-").toLowerCase();
      const searchGamesURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&search=${slug}&platforms=18,1,7`;
      fetch(searchGamesURL)
          .then(response => {
              if (!response.ok) {
                  throw new Error("Network response was not ok");
              }
              return response.json();
              })
          .then((data) => {            
              if (data.results.length === 0) {
                  const gameContainer = document.createElement("div");
                  gameContainer.setAttribute("class", "container is-widescreen p-5");
                  gameContainer.innerHTML = 
                  `
                  <p class="is-size-4">No results found</p>
                  `;
                  main.appendChild(gameContainer);
              }
              const container = document.createElement("div");
              container.setAttribute("class", "container is-widescreen p-5");
              const gameContainer = document.createElement("div");
              gameContainer.setAttribute("class", "columns is-multiline");
              data.results.forEach((game) => {
                  const gameName = game.name;
                  const metacritic = game.metacritic;
                  let platforms = game.platforms.map((platform) => platform.platform.name).join(", ");
                  if(!metacritic) {
                      metacritic = "N/A";
                  }
                  let screenshots = "";
                      if (game.short_screenshots.length > 0) {
                          screenshots = game.short_screenshots[0].image;
                      }
                      const columnElement = document.createElement("div");
                      columnElement.setAttribute("class", "column is-one-third");
                      columnElement.innerHTML = `
                          <div class="card has-background-grey-lighter">
                              <header class="card-header">
                                  <h2 class="card-header-title is-size-3">${gameName}</h2>
                              </header>
                              <div class="card-image">
                                  <figure class="image">
                                      <img src="${screenshots}" alt="${gameName} screenshot">
                                  </figure>
                              </div>
                              <div class="card-content">
                                  <div class="content">
                                      <p class="subtitle has-text-centered">Metacritic Score<br>${metacritic}</p>
                                  </div>
                              </div>
                              <footer class="card-footer">
                                  <p class="card-footer-item">Platforms<br>${platforms}</p>
                              </footer>
                              <footer class="card-footer">
                                  <p class="card-footer-item"><button class="wishlist-button button">Add to Wishlist</button></p>
                              </footer>
                          </div>`;
                          const wishlistButton = columnElement.querySelector(".wishlist-button");
                          const isGameInWishlist = wishlist.some(item => item.gameName === gameName);
                          if (isGameInWishlist) {
                              wishlistButton.disabled = true;
                              wishlistButton.textContent = "Game Added!";
                          } else {
                              wishlistButton.addEventListener("click", function () {
                                  // Save game details to local storage
                                  const wishlistItem = {
                                      gameName: gameName,
                                      screenshots: screenshots,
                                      metacritic: metacritic
                                  };
                                  wishlist.push(wishlistItem);
                                  localStorage.setItem("wishlist", JSON.stringify(wishlist));
                                  wishlistButton.disabled = true;
                                  wishlistButton.textContent = "Game Added!";
                              });
                          }
                  gameContainer.appendChild(columnElement);
                  container.appendChild(gameContainer);
                  main.appendChild(container);
              });
          })
          .catch((error) => {
              console.error("Error:", error);
      });
  };

  // Uses the Cheapshark API to fetch the best deals and display them on the page
  function fetchBestDeals() {
      createPageTitle("Best Deals");
      const cheapsharkURL = `https://www.cheapshark.com/api/1.0/deals?storeID=1&onSale=1&pageSize=20`;
      fetch(cheapsharkURL)
          .then(response => {
              if (!response.ok) {
                  throw new Error("Network response was not ok");
              }
              return response.json();
              })
          .then((data) => {
              const container = document.createElement("div");
              container.setAttribute("class", "container is-widescreen p-5");
              const gameContainer = document.createElement("div");
              gameContainer.setAttribute("class", "columns is-multiline");
              data.slice(0, 20).forEach((game) => {
                  const gameName = game.title;
                  const screenshots = game.thumb;
                  const normalPrice = game.normalPrice;
                  const salePrice = game.salePrice;
                  const dealRating = game.dealRating;
                  const metacritic = game.metacriticScore;
                  const id = game.dealID;
                  const columnElement = document.createElement("div");
                  columnElement.setAttribute("class", "column is-one-third");
                  columnElement.innerHTML = `
                      <div id="${id}" class="card has-background-grey-lighter">
                          <header class="card-header">
                              <h2 class="card-header-title is-size-3">${gameName}</h2>
                          </header>
                          <div class="card-image">
                              <figure class="image">
                                  <img src="${screenshots}" alt="${gameName} screenshot">
                              </figure>
                          </div>
                          <div class="card-content">
                              <div class="content">
                                  <p class="subtitle has-text-centered">Metacrictic Score<br> ${metacritic}</p>
                              </div>
                          </div>
                          <footer class="card-footer">
                              <p class="card-footer-item">Sale Price:<br> ${salePrice}</p>
                              <p class="card-footer-item">Normal Price:<br> ${normalPrice}</p>
                              <p class="card-footer-item">Deal Rating:<br> ${dealRating}</p>
                          </footer>
                          <footer class="card-footer">
                              <p class="card-footer-item"><button class="button is-warning"><a href="https://www.cheapshark.com/redirect?dealID=${id}" target="_blank">Buy Now</a></button></p>
                              <p class="card-footer-item"><button class="wishlist-button button">Add to Wishlist</button></p>
                          </footer>
                      </div>`;
                  const wishlistButton = columnElement.querySelector(".wishlist-button");
                  const isGameInWishlist = wishlist.some(item => item.gameName === gameName);
                  if (isGameInWishlist) {
                      wishlistButton.disabled = true;
                      wishlistButton.textContent = "Game Added!";
                  } else {
                      wishlistButton.addEventListener("click", function () {
                          // Save game details to local storage
                          const wishlistItem = {
                              gameName: gameName,
                              screenshots: screenshots,
                              metacritic: metacritic
                          };
                          wishlist.push(wishlistItem);
                          localStorage.setItem("wishlist", JSON.stringify(wishlist));
                          wishlistButton.disabled = true;
                          wishlistButton.textContent = "Game Added!";
                      });
                  }
                  gameContainer.appendChild(columnElement);
                  container.appendChild(gameContainer);
                  main.appendChild(container);
              });
          })
      .catch((error) => {
          console.error("Error:", error);
      });
  };

  // Uses the RAWG API to fetch the highest rated games and display them on the page
  function fetchHighestRated() {
      createPageTitle("Highest Rated");
      var rawgURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&metacritic&platforms=18,1,7&ordering=-metacritic`;
      fetch(rawgURL)
          .then(response => {
              if (!response.ok) {
                  throw new Error("Network response was not ok");
              }
              return response.json();
              })
          .then((data) => {
              const container = document.createElement("div");
              container.setAttribute("class", "container is-widescreen p-5");
              const gameContainer = document.createElement("div");
              gameContainer.setAttribute("class", "columns is-multiline");
              var games = data.results.slice(0, 20);
              games.forEach((game) => {
                  const gameName = game.name;
                  const metacritic = game.metacritic;
                  let platforms = game.platforms.map((platform) => platform.platform.name).join(", ");
                  let screenshots = "";
                      if (game.short_screenshots.length > 0) {
                          screenshots = game.short_screenshots[0].image;
                      }
                      const columnElement = document.createElement("div");
                      columnElement.setAttribute("class", "column is-one-third");
                      columnElement.innerHTML = ` 
                      <div class="card has-background-grey-lighter">
                          <header class="card-header">
                              <h2 class="card-header-title is-size-3">${gameName}</h2>
                          </header>
                          <div class="card-image">
                              <figure class="image">
                                  <img src="${screenshots}" alt="${gameName} screenshot">
                              </figure>
                          </div>
                          <div class="card-content">
                              <div class="content">
                                  <p class="subtitle has-text-centered">Metacritic Score<br>${metacritic}</p>
                              </div>
                          </div>
                          <footer class="card-footer">
                              <p class="card-footer-item">Platforms<br>${platforms}</p>
                          </footer>
                          <footer class="card-footer">
                              <p class="card-footer-item"><button class="wishlist-button button">Add to Wishlist</button></p>
                          </footer>
                      </div>`;
                      const wishlistButton = columnElement.querySelector(".wishlist-button");
                      const isGameInWishlist = wishlist.some(item => item.gameName === gameName);
                      if (isGameInWishlist) {
                          wishlistButton.disabled = true;
                          wishlistButton.textContent = "Game Added!";
                      } else {
                          wishlistButton.addEventListener("click", function () {
                              // Save game details to local storage
                              const wishlistItem = {
                                  gameName: gameName,
                                  screenshots: screenshots,
                                  metacritic: metacritic
                              };
                              wishlist.push(wishlistItem);
                              localStorage.setItem("wishlist", JSON.stringify(wishlist));
                              wishlistButton.disabled = true;
                              wishlistButton.textContent = "Game Added!";
                          });
                      }
                  gameContainer.appendChild(columnElement);
                  container.appendChild(gameContainer);
                  main.appendChild(container);
              });
          })
      .catch((error) => {
          console.error("Error:", error);
      });
  }

  // Uses the Gamerpower API to fetch free games and display them on the page
  function fetchFreeGames() {
      createPageTitle("Free Games");
      // Original code taken from https://rapidapi.com/digiwalls/api/gamerpower and modified to work with the fetch method
      const url = "https://gamerpower.p.rapidapi.com/api/giveaways";
      const options = {
          method: "GET",
          headers: {
              "X-RapidAPI-Key": "b376f2e9e7msh1e177bc5d80ec31p1c15f4jsn146ea5790a77",
              "X-RapidAPI-Host": "gamerpower.p.rapidapi.com",
          }
      };
      fetch(url, options)
      .then(function (response) {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json();
          })
          .then(function (result) {
              const container = document.createElement("div");
              container.setAttribute("class", "container is-widescreen p-5");
              const gameContainer = document.createElement("div");
              gameContainer.setAttribute("class", "columns is-multiline");
              for (let i = 0; i < result.length; i++) {
                  var gameName = result[i].title;
                  var screenshots = result[i].thumbnail;
                  var giveawayURL = result[i].open_giveaway_url;
                  var endDate = result[i].end_date;
                  var formatEndDate = dayjs(endDate).format("MMMM D, YYYY");
                  if (formatEndDate === "Invalid Date") {
                      formatEndDate = "N/A";
                  }
                  var status = result[i].status;
                  var platforms = result[i].platforms;
                  var worth = result[i].worth;
                  gameContainer.innerHTML += 
                  `
                  <div class="column is-one-third">
                      <div class="card has-background-grey-lighter">
                          <header class="card-header">
                              <h2 class="card-header-title is-size-3">${gameName}</h2>
                          </header>
                          <div class="card-image">
                              <figure class="image">
                                  <img src="${screenshots}" alt="${gameName} screenshot">
                              </figure>
                          </div>
                          <div class="card-content">
                              <div class="content">
                                  <p class="subtitle has-text-centered">Platforms:<br>${platforms}</p>
                              </div>
                          </div>
                          <footer class="card-footer">
                              <p class="card-footer-item">Worth<br>${worth}</p>
                              <p class="card-footer-item">End Date<br>${formatEndDate}</p>
                              <p class="card-footer-item">Status<br>${status}</p>
                          </footer>
                          <footer class="card-footer">
                              <p class="card-footer-item"><button class="button is-warning"><a href="${giveawayURL}" target="_blank">Get Giveaway!</a></button></p>
                          </footer>
                      </div>
                  </div>
                  `;
              }
              container.appendChild(gameContainer);
              main.appendChild(container);
          })
      .catch(function (error){
          console.error(error)
      });
  };

  // Display's the user's wishlist that is saved in local storage
  function myWishlist() {
      createPageTitle("My Wishlist");
      if (wishlist.length === 0) {
          const gameContainer = document.createElement("div");
          gameContainer.setAttribute("class", "container is-widescreen p-5");
          gameContainer.innerHTML = 
          `
          <h2 class="is-size-3 has-text-weight-bold">Your wishlist is empty</h2>
          <p class="is-size-4">Search for games and add them to your wishlist</p>
          `;
          main.appendChild(gameContainer);
      } else {
          const container = document.createElement("div");
          container.setAttribute("class", "container is-widescreen p-5");
          const gameContainer = document.createElement("div");
          gameContainer.setAttribute("class", "columns is-multiline");
          for (let i = 0; i < wishlist.length; i++) {
              const game = wishlist[i];
              const gameName = game.gameName;
              const screenshots = game.screenshots;
              const metacritic = game.metacritic;
              const columnElement = document.createElement("div");
              columnElement.setAttribute("class", "column is-one-third");
              columnElement.innerHTML = `
                  <div class="card has-background-grey-lighter">
                      <header class="card-header">
                          <h2 class="card-header-title is-size-3">${gameName}</h2>
                      </header>
                      <div class="card-image">
                          <figure class="image">
                              <img src="${screenshots}" alt="${gameName} screenshot">
                          </figure>
                      </div>
                      <div class="card-content">
                          <div class="content">
                              <p class="subtitle has-text-centered">Metacritic Score<br>${metacritic}</p>
                          </div>
                      </div>
                      <footer class="card-footer">
                          <p class="card-footer-item"><button class="remove-button button is-danger">Remove</button></p>
                      </footer>
                  </div>`;
              gameContainer.appendChild(columnElement);
              container.appendChild(gameContainer);
              main.appendChild(container);

              // Add event listener to the "Remove" button
              const removeButton = columnElement.querySelector(".remove-button");
              removeButton.addEventListener("click", function() {
                  // Remove game from wishlist array
                  wishlist.splice(i, 1);
                  // Update localStorage
                  localStorage.setItem('wishlist', JSON.stringify(wishlist));
                  // Remove game card from the page
                  columnElement.parentElement.remove();
                  main.innerHTML = "";
                  myWishlist();
              });
          }
      }
  };


  // EVENT LISTENERS


  // Is used to search for games when the search button is clicked
  searchBtn.addEventListener('click', function(event) {
      event.preventDefault()
      main.innerHTML = "";
      searchGames(event)
  });

  // Is used to populate the page with the best deals when the best deals button is clicked
  bestDealBtn.addEventListener("click", function (event) {
      event.preventDefault();
      main.innerHTML = "";
      fetchBestDeals(event);
  });

  // Is used to populate the page with the highest rated games when the highest rated button is clicked
  highestRatedBtn.addEventListener("click", function (event) {
      event.preventDefault();
      main.innerHTML = "";
      fetchHighestRated(event);
  });

  // Is used to populate the page with a list of free games when the free games button is clicked
  freeGamesBtn.addEventListener("click", function (event) {
      event.preventDefault();
      main.innerHTML = "";
      fetchFreeGames(event);
  });

  // Is used to display the user's wishlist when the wishlist button is clicked
  myWishlistBtn.addEventListener("click", function (event) {
      event.preventDefault();
      main.innerHTML = "";
      myWishlist(event);
  });


  // FUNCTION CALLS


  fetchBestDeals(); // Show best deals on page load


// THE END