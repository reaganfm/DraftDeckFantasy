document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("playerSearch");
  const container = document.getElementById("searchResults");

  async function fetchPlayer(q) {
    if (!q) {
      container.innerHTML = "";
      return;
    }

    try {
      const res = await fetch(`/api/search-player?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      renderResults(data.results || []);
    } catch (err) {
      console.error("Fetch error:", err);
      container.innerHTML = "<p style='color:white; text-align:center;'>Error loading data.</p>";
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");
  if (query) {
    input.value = query;
    fetchPlayer(query);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const newQuery = input.value.trim();
      if (newQuery) {
        fetchPlayer(newQuery);
        history.replaceState(null, "", `?q=${encodeURIComponent(newQuery)}`);
      }
    }
  });
});

function renderResults(players) {
  const container = document.getElementById("searchResults");
  container.innerHTML = "";

  if (!players.length) {
    container.innerHTML = "<p style='color:white;text-align:center;'>No players found.</p>";
    return;
  }

  players.forEach(player => {
    const name = player.name || player.Name || `${player.FirstName ?? ""} ${player.LastName ?? ""}`;
    const team = player.team_id || player.Team || "N/A";
    const position = player.Position || "N/A";
    const status = player.Status || "N/A";

    const div = document.createElement("div");
    div.className = "player-card";
    div.innerHTML = `
      <h3>${name}</h3>
      <p><strong>Team:</strong> ${team}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Status:</strong> ${status}</p>
    `;
    container.appendChild(div);
  });
}
