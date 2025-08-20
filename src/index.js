// Inicio
const gato = document.getElementById("gato");
const folderSpan = document.querySelector("#folder span");
const folderDiv = document.getElementById("folder");
const comicBubble = document.getElementById("comicBubble");
const bubbleText = document.getElementById("bubbleText");

let duration = 7000; 
let startTime = null;

function animateIntro(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / duration, 1);

  // Gatito: se acerca y aumenta de tamaño
  gato.style.width = (40 + 160 * progress) + "px";  // 40px → 200px
  gato.style.top = (50 + 40 * progress) + "%";      // de 50% → 90%

  // Carpeta se mueve aleatoriamente
  const x = Math.random() * (window.innerWidth - 70);
  const y = Math.random() * (window.innerHeight - 70);
  folderDiv.style.left = x + "px";
  folderDiv.style.top = y + "px";

  if (progress < 1) {
    requestAnimationFrame(animateIntro);
  } else {
    gato.src = "iconos/gato_chico.png";   
    folderSpan.style.display = "block";   
    folderDiv.style.cursor = "pointer";  
    comicBubble.style.display = "block";
    comicBubble.style.left = (window.innerWidth/2 ) + "px"; 
    comicBubble.style.top = "68%";
    bubbleText.textContent = "Hola! abre la carpeta";
  }
}

window.addEventListener("load", () => {
  requestAnimationFrame(animateIntro);

});

// Sonido
function playClick() {
  document.getElementById("clickSound").play();
}

// Abrir carpeta
const folder = document.getElementById("folder");
const balanzaWindow = document.getElementById("balanzaWindow");

folder.addEventListener("click", () => {
  balanzaWindow.classList.remove("hidden");
  bubbleText.textContent = "Prueba mover la balanza";
});

// Variables de animación
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const userSection     = document.getElementById("userSection");
const passwordSection = document.getElementById("passwordSection");
const balanzaImg      = document.getElementById("balanzaImg");
const tictactoeSection = document.getElementById("tictactoeSection");
tictactoeSection.style.display = "none";


// Función para incrementar opacidad
function increaseOpacity(section, clicks, clicksNeeded) {
  let newOpacity = clicks / clicksNeeded;
  if (newOpacity > 1) newOpacity = 1;
  section.style.opacity = newOpacity;
  return newOpacity;
}

// Variables de animación independientes
let userClicks = 0;
let passClicks = 0;
let userCompleted = false;
let passCompleted = false;

// Inicializar opacidad y display
userSection.style.opacity = 0;
userSection.style.display = "block";
userSection.querySelector("input").disabled = true;

passwordSection.style.opacity = 0;
passwordSection.style.display = "block";
passwordSection.querySelector("input").disabled = true;

function checkShowTictactoe() {
  if (userCompleted && passCompleted) {
    tictactoeSection.style.display = "flex";
    bubbleText.textContent = "Rellénalas y juega gato jajaja";
  }
}

leftBtn.addEventListener("click", () => {
  playClick();
  balanzaImg.src = "iconos/balanza-izquierda.png";

  if (!userCompleted) {
    userClicks++;
    const op = increaseOpacity(userSection, userClicks, 28);
    if (op >= 1) {
      userCompleted = true;
      userSection.querySelector("input").disabled = false;
      // mostrar tictactoe si Contraseña ya completada
      if (passCompleted) {
        tictactoeSection.style.display = "flex";
      }
    }
  }
  if (userCompleted) checkShowTictactoe();
});


rightBtn.addEventListener("click", () => {
  playClick();
  balanzaImg.src = "iconos/balanza-derecha.png";

  if (!passCompleted) {
    passClicks++;
    const op = increaseOpacity(passwordSection, passClicks, 14);
    if (op >= 1) {
      passCompleted = true;
      passwordSection.querySelector("input").disabled = false;
      // mostrar tictactoe si Usuario ya completado
      if (userCompleted) {
        tictactoeSection.style.display = "flex";
      }
    }
  }
  if (passCompleted) checkShowTictactoe();
});



// Tictactoe
const cells = document.querySelectorAll(".cell");
const perdisteDiv = document.getElementById("perdiste");
const empateDiv = document.getElementById("empataste");
const felicitacionesDiv = document.getElementById("felicitaciones");

function resetBoard() {
  cells.forEach(c => c.textContent = "");
  ingresarBtn.classList.add("hidden");
  perdisteDiv.classList.add("hidden");
  empateDiv.classList.add("hidden");
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
        bubbleText.textContent = "Por fin verás que hay adentro";
        return;
      }
      if (checkTie()) {
        empateDiv.classList.remove("hidden");
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
const ingresarBtn = document.getElementById("ingresarBtn");
const userInput = userSection.querySelector("input");
const passInput = passwordSection.querySelector("input");

ingresarBtn.disabled = true;

function checkInputs() {
  if (userInput.value.trim() !== "" && passInput.value.trim() !== "") {
    ingresarBtn.disabled = false;
  } else {
    ingresarBtn.disabled = true;
  }
}

userInput.addEventListener("input", checkInputs);
passInput.addEventListener("input", checkInputs);

ingresarBtn.addEventListener("click", () => {
  playClick();
  felicitacionesDiv.classList.remove("hidden");
  balanzaWindow.style.display = "none";
  bubbleText.textContent = "Chaooo nos vemos";
});
