let row;
let col;
const urlParams = new URLSearchParams(window.location.search);
const functionality = urlParams.get("functionality");
let message = document.getElementById("message");
const overlay = document.getElementById("overlay");

if (functionality === "option1") {
  row = 4;
  col = 4;
} else if (functionality === "option2") {
  row = 5;
  col = 5;
} else if (functionality === "option3") {
  row = 5;
  col = 3;
} else if (functionality === "option4") {
  row = 5;
  col = 4;
}

let score = 0;
let board = [];
let generate = [];
generate.push(2);
let gameboard = document.getElementById("game-board");
let footer = document.getElementById("footer");
let container = document.getElementById("container");
container.style.height = 100 * row + 300 + "px";
footer.style.width = "600px";
gameboard.style.width = col * 100 + "px";
gameboard.style.height = row * 100 + "px";

let player_score = document.getElementById("score");

function playMoveSound() {
  let moveSound = document.getElementById("move-sound");

  document.addEventListener("keyup", function (e) {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      moveSound.play();
    }
  });
}

function changeButtonAndSound() {
  let button = document.getElementById("button");
  let sound = document.getElementById("game-sound");
  let isMuted = true;

  button.addEventListener("click", function () {
    if (isMuted) {
      button.querySelector("img").src = "icons/unmute.png";
      sound.play();
      isMuted = false;
    } else {
      button.querySelector("img").src = "icons/no-sound.png";
      sound.pause();
      isMuted = true;
    }
  });
}

function regenerate() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (board[i][j] !== generate[0] && board[i][j] !== 0) {
        generate.unshift(board[i][j]);
      }
    }
  }
}

function SetTwo(board) {
  let x, y, rand;
  rand = Math.floor(Math.random() * generate.length);
  x = Math.floor(Math.random() * row);
  y = Math.floor(Math.random() * col);
  while (board[x][y] !== 0) {
    x = Math.floor(Math.random() * row);
    y = Math.floor(Math.random() * col);
  }
  board[x][y] = generate[rand];
}

function SetBoard(board) {
  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < col; j++) {
      board[i][j] = 0;
    }
  }
}

function display_board(board) {
  gameboard.innerHTML = "";

  player_score.innerHTML = "Кількість очок: " + score;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      let num = board[i][j];
      let tile = document.createElement("div");
      tile.classList.add("tile");
      if (num !== 0) {
        tile.classList.add("x" + num);
        tile.innerHTML = num;
      }
      gameboard.appendChild(tile);
    }
  }
}

function CountSpaces(board) {
  let count = 0;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (board[i][j] === 0) {
        count++;
      }
    }
  }
  return count;
}

function GameOver(board) {
  let text = document.getElementById("change");
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (board[i][j] === 2048) {
        document.addEventListener("keydown", function (event) {
          const forbiddenKeys = [
            "ArrowUp",
            "ArrowLeft",
            "ArrowRight",
            "ArrowDown",
          ];
          if (forbiddenKeys.includes(event.key)) {
            event.preventDefault();
          }
        });
        message.style.visibility = "visible";
        overlay.style.visibility = "visible";
        while (generate.length !== 1) {
          generate.shift();
        }
        score = 0;
      }
    }
  }

  let count = CountSpaces(board);
  if (count < 2) {
    document.addEventListener("keydown", function (event) {
      const forbiddenKeys = ["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"];
      if (forbiddenKeys.includes(event.key)) {
        event.preventDefault();
      }
    });
    while (generate.length !== 1) {
      generate.shift();
    }
    score = 0;
    text.textContent = "На жаль ви програли! Гра завершена.";
    message.style.visibility = "visible";
    overlay.style.visibility = "visible";
  }
}

function moveLeft(board) {
  for (let i = 0; i < row; i++) {
    let newboard = board[i].filter((num) => num !== 0);
    for (let j = 0; j < newboard.length - 1; j++) {
      if (newboard[j] === newboard[j + 1]) {
        newboard[j] *= 2;
        score += newboard[j];
        newboard[j + 1] = 0;
      }
    }
    newboard = newboard.filter((num) => num !== 0);
    for (let k = newboard.length; k < col; k++) {
      newboard.push(0);
    }
    board[i] = newboard;
  }
}

function moveRight(board) {
  for (let i = 0; i < row; i++) {
    let newboard = board[i].filter((num) => num !== 0);
    for (let j = 0; j < newboard.length - 1; j++) {
      if (newboard[j] === newboard[j + 1]) {
        newboard[j + 1] *= 2;
        score += newboard[j + 1];
        newboard[j] = 0;
      }
    }
    newboard = newboard.filter((num) => num !== 0);
    for (let k = newboard.length; k < col; k++) {
      newboard.unshift(0);
    }
    board[i] = newboard;
  }
}

function moveUp(board) {
  for (let i = 0; i < col; i++) {
    let newboard = [];

    for (let j = 0; j < row; j++) {
      if (board[j][i] !== 0) {
        newboard.push(board[j][i]);
      }
    }

    for (let j = 0; j < newboard.length - 1; j++) {
      if (newboard[j] === newboard[j + 1]) {
        newboard[j] *= 2;
        score += newboard[j];
        newboard.splice(j + 1, 1);
      }
    }

    for (let j = 0; j < row; j++) {
      if (j < newboard.length) {
        board[j][i] = newboard[j];
      } else {
        board[j][i] = 0;
      }
    }
  }
}

function moveDown(board) {
  for (let i = 0; i < col; i++) {
    let newboard = [];

    for (let j = row - 1; j >= 0; j--) {
      if (board[j][i] !== 0) {
        newboard.push(board[j][i]);
      }
    }

    for (let j = 0; j < newboard.length - 1; j++) {
      if (newboard[j] === newboard[j + 1]) {
        newboard[j] *= 2;
        score += newboard[j];
        newboard.splice(j + 1, 1);
      }
    }

    for (let j = 0; j < row; j++) {
      if (j < newboard.length) {
        board[row - 1 - j][i] = newboard[j];
      } else {
        board[row - 1 - j][i] = 0;
      }
    }
  }
}

function resetGame() {
  score = 0;
  generate = [];
  generate.push(2);
  message.style.visibility = "hidden";
  SetBoard(board);
  for (let i = 0; i < 2; i++) {
    SetTwo(board);
  }
  display_board(board);
}

function move() {
  document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowUp") {
      moveUp(board);
    } else if (e.key === "ArrowDown") {
      moveDown(board);
    } else if (e.key === "ArrowLeft") {
      moveLeft(board);
    } else if (e.key === "ArrowRight") {
      moveRight(board);
    }
    GameOver(board);
    if (CountSpaces(board) >= 2) {
      regenerate();
      for (let i = 0; i < 2; i++) {
        SetTwo(board);
      }
    }

    display_board(board);
  });
}

document.getElementById("yes").addEventListener("click", function () {
  resetGame();
  overlay.style.visibility = "hidden";
});

document.getElementById("no").addEventListener("click", function () {
  window.location.href = "index.html";
  overlay.style.visibility = "hidden";
});

function Game(board) {
  display_board(board);
  move();
}

window.onload = function () {
  changeButtonAndSound();
  playMoveSound();
  SetBoard(board);
  for (let i = 0; i < 2; i++) {
    SetTwo(board);
  }
  Game(board);
};
