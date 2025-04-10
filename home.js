document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const menu = document.getElementById("menu");
  const searchInput = document.querySelector(".component .overlap-5");
  const filterButton = document.querySelector(".filter");
  const filterMenu = document.getElementById("filter-menu");

  menuIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target) && event.target !== menuIcon) {
      menu.style.display = "none";
    }
  });

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

  document.querySelectorAll("#menu a").forEach(link => {
    link.addEventListener("click", function () {
      menu.style.display = "none";
    });
  });
});
