// const WORD = "MUSIC"; // The word to guess, can be changed to any 5-letter word
// document.title = `Vordle - ${WORD}`; // Set the document title dynamically
let WORD;

fetch("https://raw.githubusercontent.com/kritarthgupta/Vordle/main/generated_word.txt")
  .then(r => r.text())
  .then(text => {
    WORD = text.trim();
    // console.log(WORD);
  });
const board = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");
let currentGuess = "";
let currentRow = 0;
let isGameOver = false;

const createBoard = () => {
  for (let i = 0; i < 30; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.appendChild(tile);
  }
};

const keys = [
  ..."QWERTYUIOP",
  ..."ASDFGHJKL",
  "Enter",
  ..."ZXCVBNM",
  "Backspace"
];

const createKeyboard = () => {
  keys.forEach((key) => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.classList.add("key");
    btn.onclick = () => handleKey(key);
    keyboard.appendChild(btn);
  });
};

const handleKey = (key) => {
  if (isGameOver) return;

  if (key === "Enter") {
    if (currentGuess.length < 5) {
      showMessage("Not enough letters");
    } else {
      checkGuess();
    }
    return;
  }

  if (key === "Backspace") {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
      updateBoard();
    }
    return;
  }

  if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
    currentGuess += key;
    updateBoard();
  }
};
const showMessage = (msg) => {
  const existingMsg = document.getElementById("message");
  if (existingMsg) existingMsg.remove();

  const messageDiv = document.createElement("div");
  messageDiv.id = "message";
  messageDiv.textContent = msg;
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "50px";
//   messageDiv.style.backgroundColor = "#ffa07a";
  messageDiv.style.padding = "5px 10px";
  messageDiv.style.borderRadius = "5px";
  messageDiv.style.color = "white";
  messageDiv.style.fontWeight = "bold";
  messageDiv.style.zIndex = 1000;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 1500);
};

const updateBoard = () => {
  const rowStart = currentRow * 5;
  for (let i = 0; i < 5; i++) {
    const tile = board.children[rowStart + i];
    tile.textContent = currentGuess[i] || "";
  }
};

const checkGuess = () => {
  const rowStart = currentRow * 5;
  const guess = currentGuess;

  for (let i = 0; i < 5; i++) {
    const tile = board.children[rowStart + i];
    const letter = guess[i];
    tile.classList.add("flip");

    setTimeout(() => {
      if (WORD[i] === letter) {
        tile.classList.add("correct");
      } else if (WORD.includes(letter)) {
        tile.classList.add("present");
      } else {
        tile.classList.add("absent");
      }
    }, i * 300);
  }

  if (guess === WORD) {
    alert("Congratulations! You guessed it!");
    isGameOver = true;
    return;
  }

  currentRow++;
  currentGuess = "";
  if (currentRow === 6) {
    alert(`${WORD}`);
    isGameOver = true;
  }
};

createBoard();
createKeyboard();

document.addEventListener("keydown", (event) => {
  let key = event.key;

  if (key === "Backspace" || key === "Enter") {
    handleKey(key);
  } else if (/^[a-zA-Z]$/.test(key)) {
    handleKey(key.toUpperCase());
  }

});


