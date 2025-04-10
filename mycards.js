let enlargedCard = null;
let editMode = false;
const STORAGE_KEY = 'myCards';

function initializeCardEvents() {
  document.querySelectorAll('.card-container').forEach(cardContainer => {
    cardContainer.addEventListener('click', function (event) {
      if (this.id === 'add-card-button') return;

      event.stopPropagation();

      if (enlargedCard) closeCard();

      const overlay = document.getElementById("overlay");
      overlay.style.display = "block";

      const cardClone = this.cloneNode(true);
      const cardInner = cardClone.querySelector('.card-inner');
      if (!cardInner) return;

      cardInner.classList.remove('flipped');

      Object.assign(cardClone.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '1001',
        margin: '0',
        width: '400px',
        height: '600px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7)',
        backgroundColor: '#0d1b29',
        borderRadius: '12px',
        padding: '10px',
        animation: 'fadeZoomIn 0.25s ease-out forwards'
      });

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.classList.add('close-btn');
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeCard();
      });

      const rotateBtn = document.createElement('button');
      rotateBtn.classList.add('rotate-btn');
      const rotateIcon = document.createElement('img');
      rotateIcon.src = 'Images/rotateicon.svg';
      rotateIcon.alt = 'Rotate Card';
      rotateIcon.classList.add('rotate-icon');
      rotateBtn.appendChild(rotateIcon);
      rotateBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        cardInner.classList.toggle('flipped');
      });

      cardClone.appendChild(closeBtn);
      cardClone.appendChild(rotateBtn);

      document.body.appendChild(cardClone);
      enlargedCard = cardClone;
    });
  });
}

function closeCard() {
  if (enlargedCard) {
    enlargedCard.remove();
    document.getElementById("overlay").style.display = "none";
    enlargedCard = null;
  }
}

document.getElementById("overlay").addEventListener("click", closeCard);

const cardData = [
  { name: "Lamar", fullName: "Lamar Jackson", front: "Images/TradingCards/Lamar.png", back: "Images/TradingCards/Backside/Lamar_Back.png" },
  { name: "Kamara", fullName: "Alvin Kamara", front: "Images/TradingCards/Kamara_Card.png", back: "Images/TradingCards/Backside/Kamara_Back.png" },
  { name: "Saquon", fullName: "Saquon Barkley", front: "Images/TradingCards/Saquon_Card.png", back: "Images/TradingCards/Backside/Saquon_Back.png" },
  { name: "Bijan", fullName: "Bijan Robinson", front: "Images/TradingCards/Bijan_Card.png", back: "Images/TradingCards/Backside/Bijan_Back.png" },
  { name: "Pickens", fullName: "George Pickens", front: "Images/TradingCards/Pickens_Card.png", back: "Images/TradingCards/Backside/Pickens_Back.png" },
  { name: "Brian Thomas", fullName: "Brian Thomas Jr.", front: "Images/TradingCards/Brian_Thomas_Card.png", back: "Images/TradingCards/Backside/Thomas_Back.png" },
  { name: "Amon-Ra", fullName: "Amon-Ra St. Brown", front: "Images/TradingCards/AmonRa_Card.png", back: "Images/TradingCards/Backside/Amonra_Back.png" },
  { name: "Mahomes", fullName: "Patrick Mahomes", front: "Images/TradingCards/Mahomes_card.png", back: "Images/TradingCards/Backside/MAHOMES_Back.png" },
  { name: "Ja'Marr", fullName: "Ja'Marr Chase", front: "Images/TradingCards/Jamarr_Card.png", back: "Images/TradingCards/Backside/JAMARR_Back.png" }
];

function saveCardsToStorage(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function getSavedCards() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function addCard(index) {
  if (index < 0 || index >= cardData.length) return;

  const cardInfo = cardData[index];
  const cardGrid = document.querySelector('.card-grid');

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');
  cardContainer.setAttribute('data-name', cardInfo.name);

  cardContainer.innerHTML = `
    <div class="card">
      <div class="card-inner">
        <div class="card-face front">
          <img src="${cardInfo.front}" alt="${cardInfo.name} Front">
        </div>
        <div class="card-face back">
          <img src="${cardInfo.back}" alt="${cardInfo.name} Back">
        </div>
      </div>
    </div>
  `;

  cardGrid.appendChild(cardContainer);
  initializeCardEvents();

  // Save to localStorage
  const current = getSavedCards();
  if (!current.includes(cardInfo.name)) {
    current.push(cardInfo.name);
    saveCardsToStorage(current);
  }

  updateAddButton();
}

function removeCardByName(name) {
  const cardGrid = document.querySelector('.card-grid');
  const cards = cardGrid.querySelectorAll('.card-container');

  for (let card of cards) {
    if (card.getAttribute('data-name') === name) {
      cardGrid.removeChild(card);
      break;
    }
  }

  // Update localStorage
  const updated = getSavedCards().filter(cardName => cardName !== name);
  saveCardsToStorage(updated);

  updateAddButton();
}

const editButton = document.getElementById("toggle-edit-btn");
editButton.addEventListener("click", () => {
  editMode = !editMode;
  editButton.textContent = editMode ? "Done" : "Edit";
  updateEditModeUI();
});

function updateEditModeUI() {
  const cardGrid = document.querySelector('.card-grid');
  const cards = cardGrid.querySelectorAll('.card-container');

  cards.forEach(card => {
    const existingBtn = card.querySelector('.remove-btn');
    if (existingBtn) existingBtn.remove();

    if (editMode) {
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✕';
      removeBtn.classList.add('remove-btn');
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const targetCard = this.closest('.card-container');
        const name = targetCard.getAttribute('data-name');
        targetCard.remove();
        removeCardByName(name);
        updateEditModeUI();
      });
      card.style.position = 'relative';
      card.appendChild(removeBtn);
    }
  });

  updateAddButton();
}

function updateAddButton() {
  const cardGrid = document.querySelector('.card-grid');
  const existingAddBtn = document.getElementById('add-card-button');
  const cardCount = cardGrid.querySelectorAll('.card-container:not(#add-card-button)').length;

  if (existingAddBtn) existingAddBtn.remove();

  if (cardCount < 9) {
    const addBtn = createAddCardButton();
    cardGrid.appendChild(addBtn);
  }
}

function createAddCardButton() {
  const addBtn = document.createElement('div');
  addBtn.id = 'add-card-button';
  addBtn.classList.add('card-container');
  Object.assign(addBtn.style, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '80px',
    color: 'white',
    position: 'relative',
    border: '2px dashed #ccc',
    backgroundColor: '#1b263c'
  });
  addBtn.textContent = '+';
  addBtn.onclick = showAddCardDropdown;
  return addBtn;
}

function showAddCardDropdown() {
  const existingAddSection = document.getElementById('add-card-overlay');
  if (existingAddSection) existingAddSection.remove();

  const shownNames = getSavedCards();
  const available = cardData.filter(c => !shownNames.includes(c.name));
  if (available.length === 0) return;

  const overlay = document.createElement('div');
  overlay.id = 'add-card-overlay';
  overlay.className = 'card-overlay';

  const modal = document.createElement('div');
  modal.className = 'card-modal';

  const title = document.createElement('h2');
  title.textContent = 'Add a Card';
  title.className = 'modal-title';

  const select = document.createElement('select');
  select.id = 'card-select';
  select.className = 'modal-select';

  available.sort((a, b) => a.name.localeCompare(b.name)).forEach(card => {
    const option = document.createElement('option');
    option.value = card.name;
    option.innerHTML = card.fullName;
    select.appendChild(option);
  });

  const previewImg = document.createElement('img');
  previewImg.src = available[0].front;
  previewImg.alt = available[0].fullName + ' preview';
  previewImg.className = 'modal-preview';

  select.addEventListener('change', () => {
    const selected = cardData.find(c => c.name === select.value);
    previewImg.src = selected.front;
    previewImg.alt = selected.fullName + ' preview';
  });

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Card';
  addButton.className = 'modal-button';
  addButton.onclick = () => {
    const selectedName = select.value;
    const index = cardData.findIndex(c => c.name === selectedName);
    if (index !== -1) {
      addCard(index);
      updateEditModeUI();
      overlay.remove();
    }
  };

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'modal-button cancel';
  cancelButton.onclick = () => overlay.remove();

  modal.appendChild(title);
  modal.appendChild(select);
  modal.appendChild(previewImg);
  modal.appendChild(addButton);
  modal.appendChild(cancelButton);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

document.addEventListener("DOMContentLoaded", () => {
  const cardGrid = document.querySelector('.card-grid');
  if (cardGrid) cardGrid.innerHTML = "";

  const savedCards = getSavedCards();
  savedCards.forEach(name => {
    const index = cardData.findIndex(c => c.name === name);
    if (index !== -1) addCard(index);
  });

  initializeCardEvents();
  updateAddButton();

  const urlParams = new URLSearchParams(window.location.search);

  // ✅ Auto-open Add Modal if redirected from Team List
  if (urlParams.get("openAdd") === "true") {
    editMode = true;
    editButton.textContent = "Done";
    updateEditModeUI();

    setTimeout(() => {
      showAddCardDropdown();
    }, 100);
  }

  // ✅ Auto-enlarge specific card (e.g. ?showCard=Mahomes)
  const showCardName = urlParams.get("showCard");
  if (showCardName) {
    setTimeout(() => {
      const card = document.querySelector(`.card-container[data-name="${showCardName}"]`);
      if (card) {
        enlargeCard(card);
      }
    }, 300);
  }
});

// 🔍 New helper: simulate card click/enlargement
function enlargeCard(cardContainer) {
  if (enlargedCard) closeCard();

  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";

  const cardClone = cardContainer.cloneNode(true);
  const cardInner = cardClone.querySelector('.card-inner');
  if (!cardInner) return;

  cardInner.classList.remove('flipped');

  Object.assign(cardClone.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1001',
    margin: '0',
    width: '400px',
    height: '600px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7)',
    backgroundColor: '#0d1b29',
    borderRadius: '12px',
    padding: '10px',
    animation: 'fadeZoomIn 0.25s ease-out forwards'
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.classList.add('close-btn');
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeCard();
  });

  const rotateBtn = document.createElement('button');
  rotateBtn.classList.add('rotate-btn');
  const rotateIcon = document.createElement('img');
  rotateIcon.src = 'Images/rotateicon.svg';
  rotateIcon.alt = 'Rotate Card';
  rotateIcon.classList.add('rotate-icon');
  rotateBtn.appendChild(rotateIcon);
  rotateBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    cardInner.classList.toggle('flipped');
  });

  cardClone.appendChild(closeBtn);
  cardClone.appendChild(rotateBtn);

  document.body.appendChild(cardClone);
  enlargedCard = cardClone;
}
