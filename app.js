let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#newGame-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let humanBtn = document.querySelector("#human-btn");
let computerBtn = document.querySelector("#computer-btn");
let frontPage = document.querySelector("#front-page");
let gamePage = document.querySelector("#game-page");

// Game variables
let turnX = true; // To track the current turn: true if it's X's turn, false if it's O's turn
let count = 0; // To track the number of moves made
let origBoard = Array.from(Array(9).keys()); // Initial game board setup

let gameMode = "computer"; // Default game mode: "computer" or "human"

const huPlayerX = "X";
const huPlayerO = "O";
const aiPlayer = "O";

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Function to reset the game
const resetGame = () => {
  turnX = true;
  count = 0;
  origBoard = Array.from(Array(9).keys());
  enableBoxes();
  msgContainer.classList.add("hide");

  // Remove all winning-box classes
  boxes.forEach((box) => {
    box.classList.remove("winning-box");
  });
};

// Function to handle a draw game
const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Function to disable all game board boxes
const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

// Function to enable all game board boxes
const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

// Function to display the winner and highlight winning pattern
const showWinner = (winner, pattern) => {
  msg.innerText = `Congratulations! Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();

  // Highlight the winning combination
  pattern.forEach((index) => {
    boxes[index].classList.add("winning-box");
  });
};

// Function to check if there's a winner based on the current board state
const checkWinner = (board, player) => {
  for (let pattern of winPatterns) {
    let pos1Val = board[pattern[0]];
    let pos2Val = board[pattern[1]];
    let pos3Val = board[pattern[2]];

    if (pos1Val === player && pos2Val === player && pos3Val === player) {
      return true;
    }
  }
  return false;
};

// Function to handle player's turn
const turn = (boxIndex, player) => {
  origBoard[boxIndex] = player;
  boxes[boxIndex].innerText = player;
  boxes[boxIndex].disabled = true;
  count++;

  // Check for a winner after every move
  if (checkWinner(origBoard, player)) {
    showWinner(player, findWinningPattern(origBoard, player));
    return true;
  }

  // Check for draw
  if (count === 9) {
    gameDraw();
    return true;
  }

  return false;
};

// Function to find the winning pattern
const findWinningPattern = (board, player) => {
  for (let pattern of winPatterns) {
    let pos1Val = board[pattern[0]];
    let pos2Val = board[pattern[1]];
    let pos3Val = board[pattern[2]];

    if (pos1Val === player && pos2Val === player && pos3Val === player) {
      return pattern;
    }
  }
  return [];
};

// Function to find empty spots on the board
const emptySpot = () => {
  return origBoard.filter((s) => typeof s === "number");
};

// Function to find the best spot for the AI player (using Minimax algorithm)
const bestSpot = () => {
  return minimax(origBoard, aiPlayer).index;
};

// Minimax algorithm implementation
const minimax = (newBoard, player) => {
  let availSpots = emptySpot();

  // Base cases for recursion
  if (checkWinner(newBoard, huPlayerX)) {
    return { score: -10 };
  } else if (checkWinner(newBoard, aiPlayer)) {
    return { score: 20 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) {
      let result = minimax(newBoard, huPlayerX);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    // Reset the spot to empty after recursive call
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  // Choose the best move based on player
  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
};

// Function to set game mode
const setGameMode = (mode) => {
  gameMode = mode;
  frontPage.classList.add("hide");
  gamePage.classList.remove("hide");
  resetGame(); // Reset game when mode changes
};

// Event listeners for mode selection buttons
humanBtn.addEventListener("click", () => {
  setGameMode("human");
});

computerBtn.addEventListener("click", () => {
  setGameMode("computer");
});

// Event listeners for game board boxes
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (typeof origBoard[index] === "number" && msgContainer.classList.contains("hide")) {
      if (gameMode === "human") {
        if (turnX) {
          if (turn(index, huPlayerX)) return;
          turnX = false;
        } else {
          if (turn(index, huPlayerO)) return;
          turnX = true;
        }
      } else if (gameMode === "computer") {
        if (turnX) {
          if (turn(index, huPlayerX)) return;
          turnX = false;

          // AI makes a move
          setTimeout(() => {
            let bestMove = bestSpot();
            if (turn(bestMove, aiPlayer)) return;
            turnX = true;
          }, 500); // Delay AI move for better user experience
        }
      }
    }
  });
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

let backBtn = document.querySelector("#back-btn");

backBtn.addEventListener("click", () => {
    frontPage.classList.remove("hide");
    gamePage.classList.add("hide");
    resetGame(); // Reset the game when going back to back
});

