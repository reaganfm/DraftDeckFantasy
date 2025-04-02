document.addEventListener("DOMContentLoaded", function () {
  // Function to get URL parameters
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // Get the search term from the URL
  const searchTerm = getParameterByName("q");

  if (searchTerm) {
    // Example data for now, insert ESPN API?
    const data = [
      { name: "Player 1", team: "Team A", description: "This is player 1" },
      { name: "Player 2", team: "Team B", description: "This is player 2" },
      { name: "Team C", team: "Team C", description: "This is team C" },
      { name: "Card 1", team: "Team A", description: "This is card 1" },
      { name: "Another Player", team: "Team D", description: "This is another player" },
      // Add more data as needed
    ];

    // Filter the data based on the search term
    const results = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Display the results
    const resultsContainer = document.querySelector(".group"); // Select the .group div
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length > 0) {
      results.forEach((result) => {
        const resultDiv = document.createElement("div");
        resultDiv.innerHTML = `
          <h3>${result.name}</h3>
          <p>Team: ${result.team}</p>
          <p>Description: ${result.description}</p>
        `;
        resultsContainer.appendChild(resultDiv);
      });
    } else {
      resultsContainer.textContent = "No results found.";
      resultsContainer.style.color = "#333";
      resultsContainer.style.fontFamily = "Arial, sans-serif";
      resultsContainer.style.fontSize = "40px";
      resultsContainer.style.padding = "150px";
      resultsContainer.style.textAlign = "center"; 
    }
  } else {
    const resultsContainer = document.querySelector(".group");
    if(resultsContainer){ // check if resultsContainer exists.
      resultsContainer.textContent = "Please enter a search term.";
      resultsContainer.style.color = "#333";
      resultsContainer.style.fontFamily = "Arial, sans-serif";
      resultsContainer.style.fontSize = "40px";
      resultsContainer.style.padding = "150px";
      resultsContainer.style.textAlign = "center";
    }
  }

  // Search box and filter functionality from home.js
  const searchInput = document.querySelector(".component .overlap-5");
  const filterButton = document.querySelector(".filter");
  const filterMenu = document.getElementById("filter-menu");

  searchInput.addEventListener("click", function () {
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.placeholder = "Find teams, players, and more...";
    inputElement.style.position = "absolute";
    inputElement.style.top = "10px";
    inputElement.style.left = "110px";
    inputElement.style.width = "600px";
    inputElement.style.height = "80px";
    inputElement.style.fontSize = "40px";
    inputElement.style.borderRadius = "20px";
    inputElement.style.paddingLeft = "20px";
    inputElement.style.border = "2px solid #ccc";

    searchInput.appendChild(inputElement);
    inputElement.focus();

    inputElement.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        const searchTerm = inputElement.value;
        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
      }
    });
  });

  // Filter button functionality
  filterButton.addEventListener("click", function (event) {
    event.stopPropagation();
    filterMenu.style.display = filterMenu.style.display === "block" ? "none" : "block";
  });

  // Close filter menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!filterMenu.contains(event.target) && event.target !== filterButton) {
      filterMenu.style.display = "none";
    }
  });
});
