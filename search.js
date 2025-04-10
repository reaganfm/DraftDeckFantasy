document.addEventListener("DOMContentLoaded", function () {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function styleNoResults(container) {
    container.style.color = "#333";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "40px";
    container.style.padding = "150px";
    container.style.textAlign = "center";
  }

  const searchTerm = getParameterByName("q");
  const resultsContainer = document.querySelector(".group");
  resultsContainer.innerHTML = "";

  if (searchTerm) {
    fetch(`http://localhost:5001/api/search-player?q=${encodeURIComponent(searchTerm)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.results || data.results.length === 0) {
          resultsContainer.textContent = "No results found.";
          styleNoResults(resultsContainer);
          return;
        }

        data.results.forEach((player) => {
          const resultDiv = document.createElement("div");
          resultDiv.innerHTML = `
            <h3>${player.name}</h3>
            <p><strong>Player ID:</strong> ${player.id}</p>
            <p><strong>Team ID:</strong> ${player.team_id}</p>
            <p><strong>Stats:</strong></p>
            <ul>
              ${Object.entries(player.stats).map(([key, value]) => `<li>${key}: ${value}</li>`).join("")}
            </ul>
          `;
          resultDiv.style.background = "#fff";
          resultDiv.style.padding = "20px";
          resultDiv.style.margin = "20px";
          resultDiv.style.borderRadius = "12px";
          resultDiv.style.border = "2px solid #fda311";
          resultDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          resultsContainer.appendChild(resultDiv);
        });
      })
      .catch((err) => {
        console.error("API error:", err);
        resultsContainer.innerHTML = `
          <div style="
            background-color: #ffe0e0;
            border: 2px solid #ff4d4d;
            padding: 30px;
            font-size: 24px;
            color: #990000;
            border-radius: 12px;
            margin: 50px auto;
            text-align: center;
            font-family: Arial, sans-serif;
            max-width: 700px;
          ">
            🔥 An error occurred while fetching player data.<br/>
            ${err.message || "Please try again later."}
          </div>
        `;
      });
  } else {
    resultsContainer.textContent = "Please enter a search term.";
    styleNoResults(resultsContainer);
  }

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

  filterButton.addEventListener("click", function (event) {
    event.stopPropagation();
    filterMenu.style.display = filterMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function (event) {
    if (!filterMenu.contains(event.target) && event.target !== filterButton) {
      filterMenu.style.display = "none";
    }
  });
});
