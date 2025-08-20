// ----------------------------------
// Sonidos
// ----------------------------------
function playClick() {
  document.getElementById("clickSound").play();
}

function playOpen() {
  document.getElementById("openSound").play();
}

// ----------------------------------
// Abrir carpeta
// ----------------------------------
const folder = document.getElementById("folder");
const balanzaWindow = document.getElementById("balanzaWindow");

folder.addEventListener("click", () => {
  playOpen();
  balanzaWindow.classList.remove("hidden");
});

// ----------------------------------
// Variables de animación
// ----------------------------------
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const userSection     = document.getElementById("userSection");
const passwordSection = document.getElementById("passwordSection");
const balanzaImg      = document.getElementById("balanzaImg");
const tictactoeSection = document.getElementById("tictactoeSection");

let userClicks = 0;
let passClicks = 0;
let userCompleted = false;
let passCompleted = false;

// Inicializamos opacidad 0 y display block
[userSection, passwordSection].forEach(section => {
  section.style.opacity = 0;
  section.style.display = "block";
  section.querySelector("input").disabled = true;
});

// ----------------------------------
// Función para incrementar opacidad
// ----------------------------------
function increaseOpacity(section, clicks, clicksNeeded) {
  let newOpacity = clicks / clicksNeeded;
  if (newOpacity > 1) newOpacity = 1;
  section.style.opacity = newOpacity;
  return newOpacity;
}

// ----------------------------------
// Botón izquierdo
// ----------------------------------
leftBtn.addEventListener("click", () => {
  playClick();
  balanzaImg.src = "iconos/balanza-izquierda.png";

  if (!userCompleted) {
    userClicks++;
    const op = increaseOpacity(userSection, userClicks, 28);
    if (op >= 1) {
      userCompleted = true;
      userSection.querySelector("input").disabled = false;
    }
  } else if (!passCompleted) {
    passClicks++;
    const op = increaseOpacity(passwordSection, passClicks, 28);
    if (op >= 1) {
      passCompleted = true;
      passwordSection.querySelector("input").disabled = false;
      tictactoeSection.classList.remove("hidden");
    }
  }
});

// ----------------------------------
// Botón derecho
// ----------------------------------
rightBtn.addEventListener("click", () => {
  playClick();
  balanzaImg.src = "iconos/balanza-derecha.png";

  if (!userCompleted) {
    userClicks++;
    const op = increaseOpacity(userSection, userClicks, 14);
    if (op >= 1) {
      userCompleted = true;
      userSection.querySelector("input").disabled = false;
    }
  } else if (!passCompleted) {
    passClicks++;
    const op = increaseOpacity(passwordSection, passClicks, 14);
    if (op >= 1) {
      passCompleted = true;
      passwordSection.querySelector("input").disabled = false;
      tictactoeSection.classList.remove("hidden");
    }
  }
});

// ----------------------------------
// Tictactoe
// ----------------------------------
const cells = document.querySelectorAll(".cell");
const ingresarBtn = document.getElementById("ingresarBtn");
const perdisteDiv = document.getElementById("perdiste");
const felicitacionesDiv = document.getElementById("felicitaciones");

function resetBoard() {
  cells.forEach(c => c.textContent = "");
  ingresarBtn.classList.add("hidden");
  perdisteDiv.classList.add("hidden");
  turn = "X";
}

let turn = "X";

cells.forEach(cell => {
  cell.addEventListener("click", () => {
    if (cell.textContent === "" && turn === "X") {
      cell.textContent = "X";
      playClick();
      if (checkWin("X")) {
        ingresarBtn.classList.remove("hidden");
        return;
      }
      if (checkTie()) {
        perdisteDiv.classList.remove("hidden");
        setTimeout(resetBoard, 1000);
        return;
      }
      turn = "O";
      setTimeout(computerMove, 400);
    }
  });
});

function computerMove() {
  const empty = [...cells].filter(c => c.textContent === "");
  if (empty.length > 0) {
    const rand = empty[Math.floor(Math.random() * empty.length)];
    rand.textContent = "O";
    if (checkWin("O") || checkTie()) {
      perdisteDiv.classList.remove("hidden");
      setTimeout(resetBoard, 1000);
      return;
    }
  }
  turn = "X";
}

// Verificar ganador
function checkWin(player) {
  const b = [...cells].map(c => c.textContent);
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(comb => comb.every(i => b[i] === player));
}

// Verificar empate
function checkTie() {
  return [...cells].every(c => c.textContent !== "") &&
         !checkWin("X") &&
         !checkWin("O");
}

// Botón ingresar
ingresarBtn.addEventListener("click", () => {
  playClick();
  felicitacionesDiv.classList.remove("hidden");
  balanzaWindow.style.display = "none";
});
