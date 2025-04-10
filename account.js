document.addEventListener("DOMContentLoaded", function () {
  // === Profile Picture Logic with localStorage ===
  const profilePictureInput = document.getElementById("profile-picture-input");
  const profilePicture = document.getElementById("profile-picture");
  const changePictureButton = document.getElementById("change-picture-button");
  const deletePictureButton = document.getElementById("delete-picture-button");

  // Load stored profile picture if it exists
  const storedPic = localStorage.getItem("profilePic");
  if (storedPic) {
    profilePicture.src = storedPic;
  }

  changePictureButton.addEventListener("click", function () {
    profilePictureInput.click();
  });

  profilePictureInput.addEventListener("change", function () {
    const file = profilePictureInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePicture.src = e.target.result;
        localStorage.setItem("profilePic", e.target.result); // ✅ Save to localStorage
      };
      reader.readAsDataURL(file);
    }
  });

  deletePictureButton.addEventListener("click", function () {
    profilePicture.src = "Images/default-profile.png";
    profilePictureInput.value = "";
    localStorage.removeItem("profilePic"); // ✅ Clear saved picture
  });

  // === Card Display Logic ===
  const cardData = {
    "Lamar": "Images/TradingCards/Lamar.png",
    "Kamara": "Images/TradingCards/Kamara_Card.png",
    "Saquon": "Images/TradingCards/Saquon_Card.png",
    "Bijan": "Images/TradingCards/Bijan_Card.png",
    "Pickens": "Images/TradingCards/Pickens_Card.png",
    "Brian Thomas": "Images/TradingCards/Brian_Thomas_Card.png",
    "Amon-Ra": "Images/TradingCards/AmonRa_Card.png",
    "Mahomes": "Images/TradingCards/Mahomes_card.png",
    "Ja'Marr": "Images/TradingCards/Jamarr_Card.png"
  };

  const savedCards = JSON.parse(localStorage.getItem("myCards")) || [];
  const container = document.querySelector(".account .div");

  const oldImages = container.querySelectorAll(".image-2, .image-3, .image-4, .image-5, .image-6");
  oldImages.forEach(img => img.remove());

  const cardPositions = [
    { top: "850px", left: "146px" },
    { top: "850px", left: "394px" },
    { top: "850px", left: "642px" },
    { top: "850px", left: "890px" },
    { top: "850px", left: "1138px" }
  ];

  for (let i = 0; i < 5; i++) {
    const pos = cardPositions[i];

    if (i < savedCards.length) {
      const name = savedCards[i];
      const src = cardData[name];
      if (!src) continue;

      const link = document.createElement("a");
      link.href = `mycards.html?showCard=${encodeURIComponent(name)}`;

      const img = document.createElement("img");
      img.src = src;
      img.alt = name;
      img.className = `image-${i + 2}`;
      img.style.position = "absolute";
      img.style.width = "220px";
      img.style.objectFit = "cover";
      img.style.left = pos.left;

      let top = parseInt(pos.top);
      if (name === "Mahomes") {
        img.style.height = "390px";
        top -= 15;
      } else if (name === "Ja'Marr") {
        img.style.height = "400px";
        top -= 25;
      } else {
        img.style.height = "365px";
      }

      img.style.top = `${top}px`;

      link.appendChild(img);
      container.appendChild(link);
    } else {
      const addLink = document.createElement("a");
      addLink.href = "mycards.html?openAdd=true";

      const addCard = document.createElement("div");
      addCard.textContent = "+";
      addCard.style.position = "absolute";
      addCard.style.top = pos.top;
      addCard.style.left = pos.left;
      addCard.style.width = "220px";
      addCard.style.height = "365px";
      addCard.style.display = "flex";
      addCard.style.alignItems = "center";
      addCard.style.justifyContent = "center";
      addCard.style.border = "2px dashed #ccc";
      addCard.style.backgroundColor = "#1b263c";
      addCard.style.color = "white";
      addCard.style.fontSize = "80px";
      addCard.style.cursor = "pointer";
      addCard.style.textDecoration = "none";

      addLink.appendChild(addCard);
      container.appendChild(addLink);
    }
  }

  // ✅ Add extra padding space at the bottom
  const spacer = document.createElement("div");
  spacer.style.height = "200px";
  container.appendChild(spacer);
});
