// sister-script.js
const options = {
    "option-fruits": ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🥭", "🍒"],
    "option-emojis": ["😀", "😎", "🤩", "😍", "🥳", "😜", "🤪", "😇"],
    "option-animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    "option-planets": ["🌍", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓"],
    "option-flags": ["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇯🇵", "🇩🇪", "🇫🇷", "🇮🇳"]
  };
  
  let selectedOption = [];
  let flippedCards = [];
  let matchesFound = 0;
  let currentScore = 0;
  let gameClock;
  let countdown = 30;
  
  const homeScreen = document.querySelector(".home-screen");
  const playScreen = document.querySelector(".play-screen");
  const cardArea = document.querySelector(".card-area");
  const currentScoreDisplay = document.getElementById("current-score");
  const countdownDisplay = document.getElementById("countdown");
  const resultScreen = document.querySelector(".result-screen");
  const finalScoreDisplay = document.getElementById("final-score");
  const resetButton = document.getElementById("reset");
  
  document.querySelectorAll(".options button").forEach(button => {
    button.addEventListener("click", () => {
      selectedOption = options[button.id];
      startGame();
    });
  });
  
  function startGame() {
    homeScreen.classList.add("hidden");
    playScreen.classList.remove("hidden");
    createCards();
    startTimer();
    saveGame();
  }
  
  function createCards() {
    const cards = [...selectedOption, ...selectedOption];
    cards.sort(() => Math.random() - 0.5);
    cardArea.innerHTML = "";
    cards.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = item;
      card.addEventListener("click", flipCard);
      cardArea.appendChild(card);
    });
  
    const savedGame = JSON.parse(localStorage.getItem("matchItUpGame"));
    if (savedGame && savedGame.flippedCards) {
      savedGame.flippedCards.forEach(value => {
        const card = Array.from(cardArea.children).find(card => card.dataset.value === value);
        if (card) {
          card.classList.add("flipped");
          card.textContent = value;
          flippedCards.push(card);
        }
      });
    }
  }
  
  function flipCard(event) {
    const card = event.target;
    if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
      card.classList.add("flipped");
      card.textContent = card.dataset.value;
      flippedCards.push(card);
      playSound("flip-audio");
      saveGame();
  
      if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
      }
    }
  }
  
  function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchesFound++;
      currentScore += 10;
      currentScoreDisplay.textContent = currentScore;
      playSound("match-audio");
      saveGame();
  
      if (matchesFound === selectedOption.length) {
        endGame(true);
      }
    } else {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.textContent = "";
      card2.textContent = "";
    }
    flippedCards = [];
  }
  
  function startTimer() {
    gameClock = setInterval(() => {
      countdown--;
      countdownDisplay.textContent = countdown;
      saveGame();
      if (countdown === 0) {
        endGame(false);
      }
    }, 1000);
  }
  
  function endGame(isWin) {
    clearInterval(gameClock);
    resultScreen.classList.remove("hidden");
    finalScoreDisplay.textContent = currentScore;
    playSound(isWin ? "match-audio" : "end-audio");
    clearGame();
  }
  
  function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
  }
  
  function saveGame() {
    const gameState = {
      currentScore: currentScore,
      countdown: countdown,
      matchesFound: matchesFound,
      flippedCards: flippedCards.map(card => card.dataset.value),
      selectedOption: selectedOption
    };
    localStorage.setItem("matchItUpGame", JSON.stringify(gameState));
  }
  
  function clearGame() {
    localStorage.removeItem("matchItUpGame");
  }
  
  window.addEventListener("load", () => {
    const savedGame = JSON.parse(localStorage.getItem("matchItUpGame"));
    if (savedGame) {
      selectedOption = savedGame.selectedOption;
      currentScore = savedGame.currentScore;
      countdown = savedGame.countdown;
      matchesFound = savedGame.matchesFound;
      currentScoreDisplay.textContent = currentScore;
      countdownDisplay.textContent = countdown;
      startGame();
    }
  });
  
  resetButton.addEventListener("click", () => {
    clearGame();
    location.reload();
  });