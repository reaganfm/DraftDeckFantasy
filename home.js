document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("playerSearch");

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    }
  });
});
