const WINS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const cells = [...document.querySelectorAll(".cell")];
const turnBanner = document.getElementById("turnBanner");
const turnTitle = document.getElementById("turnTitle");
const turnSubtitle = document.getElementById("turnSubtitle");
const playerScore = document.getElementById("playerScore");
const aiScore = document.getElementById("aiScore");
const drawScore = document.getElementById("drawScore");
const difficultyButtons = [...document.querySelectorAll("[data-level]")];

let board = Array(9).fill(".");
let gameOver = false;
let aiThinking = false;
let difficulty = "easy";
let scores = { player: 0, ai: 0, draw: 0 };

function winner(currentBoard) {
  for (const [a, b, c] of WINS) {
    if (currentBoard[a] !== "." &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]) {
      return { mark: currentBoard[a], line: [a, b, c] };
    }
  }
  return currentBoard.includes(".") ? null : { mark: "draw", line: [] };
}

function moves(currentBoard) {
  return currentBoard
    .map((value, index) => value === "." ? index : null)
    .filter(index => index !== null);
}

function play(currentBoard, position, mark) {
  const nextBoard = [...currentBoard];
  nextBoard[position] = mark;
  return nextBoard;
}

function setTurn(mark) {
  turnBanner.classList.toggle("o-turn", mark === "O");
  turnBanner.querySelector(".turn-dot").textContent = mark;

  if (gameOver) return;
  if (mark === "X") {
    turnTitle.textContent = "Your turn";
    turnSubtitle.textContent = "Choose a square";
  } else {
    turnTitle.textContent = "AI is thinking";
    turnSubtitle.textContent = "Making a move";
  }
}

function render() {
  cells.forEach((cell, index) => {
    const value = board[index];
    cell.textContent = value === "." ? "" : value;
    cell.className = "cell";
    if (value === "X") cell.classList.add("x");
    if (value === "O") cell.classList.add("o");
    cell.disabled = value !== "." || gameOver || aiThinking;
  });

  playerScore.textContent = scores.player;
  aiScore.textContent = scores.ai;
  drawScore.textContent = scores.draw;
}

function finishGame(result) {
  gameOver = true;
  aiThinking = false;

  if (result.mark === "X") {
    scores.player++;
    turnTitle.textContent = "You win!";
    turnSubtitle.textContent = "Nice move";
  } else if (result.mark === "O") {
    scores.ai++;
    turnTitle.textContent = "AI wins";
    turnSubtitle.textContent = "Try another round";
  } else {
    scores.draw++;
    turnTitle.textContent = "It's a draw";
    turnSubtitle.textContent = "Good game";
  }

  turnBanner.querySelector(".turn-dot").textContent = result.mark === "draw" ? "—" : result.mark;
  result.line.forEach(index => cells[index].classList.add("winner"));
  render();
}

function chooseRandomMove() {
  const available = moves(board);
  return available[Math.floor(Math.random() * available.length)];
}

function findImmediateMove(mark) {
  for (const position of moves(board)) {
    const nextBoard = play(board, position, mark);
    const result = winner(nextBoard);
    if (result?.mark === mark) return position;
  }
  return null;
}

function minimax(currentBoard, isMaximizing, depth = 0) {
  const result = winner(currentBoard);
  if (result) {
    if (result.mark === "O") return 10 - depth;
    if (result.mark === "X") return depth - 10;
    return 0;
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (const position of moves(currentBoard)) {
      best = Math.max(best, minimax(play(currentBoard, position, "O"), false, depth + 1));
    }
    return best;
  }

  let best = Infinity;
  for (const position of moves(currentBoard)) {
    best = Math.min(best, minimax(play(currentBoard, position, "X"), true, depth + 1));
  }
  return best;
}

function chooseHardMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (const position of moves(board)) {
    const nextBoard = play(board, position, "O");
    const score = minimax(nextBoard, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = position;
    }
  }
  return bestMove;
}

function chooseMediumMove() {
  const winningMove = findImmediateMove("O");
  if (winningMove !== null) return winningMove;

  const blockingMove = findImmediateMove("X");
  if (blockingMove !== null) return blockingMove;

  if (board[4] === ".") return 4;
  return chooseRandomMove();
}

function aiMove() {
  if (gameOver) return;

  let position;
  if (difficulty === "easy") {
    position = chooseRandomMove();
  } else if (difficulty === "medium") {
    position = chooseMediumMove();
  } else {
    position = chooseHardMove();
  }

  board = play(board, position, "O");
  aiThinking = false;

  const result = winner(board);
  if (result) {
    finishGame(result);
  } else {
    setTurn("X");
    render();
  }
}

function startAiTurn() {
  aiThinking = true;
  setTurn("O");
  render();
  window.setTimeout(aiMove, 480);
}

function resetGame() {
  board = Array(9).fill(".");
  gameOver = false;
  aiThinking = false;
  setTurn("X");
  render();
}

cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const position = Number(cell.dataset.index);
    if (board[position] !== "." || gameOver || aiThinking) return;

    board = play(board, position, "X");
    const result = winner(board);
    if (result) {
      finishGame(result);
    } else {
      startAiTurn();
    }
  });
});

difficultyButtons.forEach(button => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach(option => option.setAttribute("aria-checked", "false"));
    button.setAttribute("aria-checked", "true");
    difficulty = button.dataset.level;
  });
});

document.getElementById("newGame").addEventListener("click", resetGame);
document.getElementById("resetGame").addEventListener("click", resetGame);

resetGame();
