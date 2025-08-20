// Inicio
const gato = document.getElementById("gato");
const folderSpan = document.querySelector("#folder span");
const folderDiv = document.getElementById("folder");
const comicBubble = document.getElementById("comicBubble");
const bubbleText = document.getElementById("bubbleText");

let duration = 7000; 
let startTime = null;
let lastMoveTime = 0;         
const moveInterval = 500;      

function animateIntro(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / duration, 1);

  gato.style.width = (40 + 160 * progress) + "px";  
  gato.style.top = (50 + 40 * progress) + "%";      

  if (timestamp - lastMoveTime > moveInterval) {
    const x = Math.random() * (window.innerWidth - 70);
    const y = Math.random() * (window.innerHeight - 70);
    folderDiv.style.left = x + "px";
    folderDiv.style.top = y + "px";
    lastMoveTime = timestamp;
  }

  if (progress < 1) {
    requestAnimationFrame(animateIntro);
  } else {
    gato.src = "iconos/gato_chico.png";   
    folderSpan.style.display = "block";   
    folderDiv.style.cursor = "pointer";  
    comicBubble.style.display = "block";
    comicBubble.style.left = (window.innerWidth/2 ) - 9 + "px"; 
    comicBubble.style.top = "61%";
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

const folder = document.getElementById("folder");
const balanzaWindow = document.getElementById("balanzaWindow");

folder.addEventListener("click", () => {
  balanzaWindow.classList.remove("hidden");
  bubbleText.textContent = "Prueba mover la balanza apretando ambos botones";
});

// Variables
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const userSection     = document.getElementById("userSection");
const passwordSection = document.getElementById("passwordSection");
const balanzaImg      = document.getElementById("balanzaImg");
const tictactoeSection = document.getElementById("tictactoeSection");
tictactoeSection.style.display = "none";


function increaseOpacity(section, clicks, clicksNeeded) {
  let newOpacity = clicks / clicksNeeded;
  if (newOpacity > 1) newOpacity = 1;
  section.style.opacity = newOpacity;
  return newOpacity;
}

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
        bubbleText.textContent = "Para ver lo que hay dentro tienes que ganar el tictactoe y rellenar las casillas";
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

function checkWin(player) {
  const b = [...cells].map(c => c.textContent);
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(comb => comb.every(i => b[i] === player));
}

function checkTie() {
  return [...cells].every(c => c.textContent !== "") &&
         !checkWin("X") &&
         !checkWin("O");
}

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

// ---------- sección poner fecha para desbloquear espacio usuario -------
const modalOverlay = document.createElement("div");
modalOverlay.id = "modalOverlay";
modalOverlay.style.position = "fixed";
modalOverlay.style.top = 0;
modalOverlay.style.left = 0;
modalOverlay.style.width = "100vw";
modalOverlay.style.height = "100vh";
modalOverlay.style.background = "rgba(0,0,0,0.4)";
modalOverlay.style.display = "none";
modalOverlay.style.justifyContent = "center";
modalOverlay.style.alignItems = "center";
modalOverlay.style.zIndex = 999;

const modalBox = document.createElement("div");
modalBox.style.background  = "white";
modalBox.style.padding     = "20px";
modalBox.style.borderRadius = "8px";
modalBox.style.textAlign   = "center";

const modalTitle = document.createElement("h3");
modalTitle.innerText = "Pon la fecha de hoy para desbloquear al usuario";

const selectEl = document.createElement("select");
selectEl.style.marginTop = "10px";
selectEl.style.marginBottom = "15px";
selectEl.style.padding = "5px";

const acceptBtn = document.createElement("button");
acceptBtn.innerText = "Aceptar";

modalBox.appendChild(modalTitle);
modalBox.appendChild(selectEl);
modalBox.appendChild(acceptBtn);
modalOverlay.appendChild(modalBox);
document.body.appendChild(modalOverlay);

function getDaysFromStart() {
  const start = new Date("2025-01-01");
  const today = new Date();
  const diff = today - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getFormattedDate() {
  const today = new Date();
  const day = today.getDate();
  const year = today.getFullYear();
  const months = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"
  ];
  return `${day} de ${months[today.getMonth()]} del ${year}`;
}

const totalDays = getDaysFromStart();
for (let i = 0; i <= totalDays + 14; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.innerText = `1 de enero del 2025 + ${i} días`;
  selectEl.appendChild(option);
}

const correctPasswordText = `1 de enero del 2025 + ${totalDays} días`.toLowerCase();

userInput.disabled = true;
let passwordUnlocked = false;

userInput.addEventListener("focus", () => {
  if (!passwordUnlocked) {
    modalOverlay.style.display = "flex";
    setTimeout(() => {
      if (!passwordUnlocked) {
        bubbleText.textContent = `Pista: la contraseña correcta es "1 de enero del 2025 + ${totalDays} días"`;
      }
    }, 10000);
  }
});


acceptBtn.addEventListener("click", () => {
  const selectedDays = selectEl.value;
  const selectedText = `1 de enero del 2025 + ${selectedDays} días`;
  const decodedText = selectedText.toLowerCase();

  if (decodedText === correctPasswordText) {
    modalOverlay.style.display = "none";
    passwordUnlocked = true;
    passCompleted = true;
    userInput.disabled = false;
    bubbleText.textContent = "Correcto 😺";
    checkShowTictactoe();
  } else {
    bubbleText.textContent = "Mmm… eso no parece correcto 😾";
  }
});

userInput.addEventListener("focus", () => {
  if (!passwordUnlocked) {
    userInput.blur();
    bubbleText.textContent = "tienes que poner la fecha para desbloquear este campo";
  }
});


/************* laberinto para desbloquear contraseña *************/
let mazeCompleted = false;
const mazeOverlay = document.createElement("div");
mazeOverlay.id = "mazeOverlay";
Object.assign(mazeOverlay.style, {
  position: "fixed",
  inset: "0",
  background: "rgba(0,0,0,0.6)",
  display: "none",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000
});

const mazeCard = document.createElement("div");
Object.assign(mazeCard.style, {
  background: "white",
  padding: "16px",
  borderRadius: "10px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  textAlign: "center"
});

const mazeTitle = document.createElement("h3");
mazeTitle.textContent = "Guía al gato hasta la esquina inferior derecha 🐱➡️";
mazeTitle.style.margin = "0 0 6px 0";
mazeTitle.style.fontFamily = "system-ui, sans-serif";

const mazeHint = document.createElement("div");
mazeHint.textContent = "Usa las flechas del teclado. Si tocas una figura, vuelves al inicio.";
mazeHint.style.fontSize = "0.9rem";
mazeHint.style.opacity = "0.8";

const canvas = document.createElement("canvas");
canvas.width = 640;
canvas.height = 420;
canvas.style.borderRadius = "10px";
canvas.style.background = "#f7f7ff";
canvas.style.outline = "1px solid #e5e5ef";

mazeCard.appendChild(mazeTitle);
mazeCard.appendChild(mazeHint);
mazeCard.appendChild(canvas);
mazeOverlay.appendChild(mazeCard);
document.body.appendChild(mazeOverlay);


const ctx = canvas.getContext("2d");
const catImg = new Image();
catImg.src = "iconos/gato_chico.png"; 

const cat = { x: 10, y: 10, size: 26, speed: 2.4 };
const startPos = { x: 10, y: 10 };
const goal = { x: canvas.width - 42, y: canvas.height - 42, w: 32, h: 32 };

const obstacles = [
  { type: "rect", x: 90,  y: 0,   w: 24,  h: 310 },
  { type: "rect", x: 180, y: 110, w: 250, h: 24  },
  { type: "rect", x: 350, y: 0,   w: 24,  h: 210 },
  { type: "rect", x: 260, y: 220, w: 24,  h: 180 },
  { type: "rect", x: 0,   y: 360, w: 300, h: 24  },
  { type: "rect", x: 420, y: 300, w: 24,  h: 120 },
  { type: "circle", x: 210, y: 280, r: 30 },
  { type: "circle", x: 420, y: 90,  r: 22 },
];

const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
function onKey(e, down) {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    keys[e.key] = down;
    e.preventDefault();
  }
}
window.addEventListener("keydown", e => onKey(e, true));
window.addEventListener("keyup",   e => onKey(e, false));

function drawObstacles() {
  ctx.fillStyle = "#2d2f90";
  obstacles.forEach(o => {
    if (o.type === "rect") ctx.fillRect(o.x, o.y, o.w, o.h);
    else if (o.type === "circle") {
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
      ctx.fill();
    }
  });
}

function drawGoal() {
  ctx.fillStyle = "#1aa34a";
  ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
}

function drawCat() {
  if (catImg.complete) ctx.drawImage(catImg, cat.x, cat.y, cat.size, cat.size);
  else {
    ctx.fillStyle = "#333";
    ctx.fillRect(cat.x, cat.y, cat.size, cat.size);
  }
}

// Colisiones
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function circleRectCollides(cx, cy, r, rx, ry, rw, rh) {
  const nearestX = Math.max(rx, Math.min(cx, rx + rw));
  const nearestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return (dx*dx + dy*dy) <= r*r;
}

function hitsObstacle(nx, ny) {
  const s = cat.size;
  return obstacles.some(o => {
    if (o.type === "rect") return rectsOverlap(nx, ny, s, s, o.x, o.y, o.w, o.h);
    if (o.type === "circle") return circleRectCollides(o.x,o.y,o.r,nx,ny,s,s);
  });
}

let rafId = null;
function loop() {
  let nx = cat.x, ny = cat.y;
  if (keys.ArrowUp) ny -= cat.speed;
  if (keys.ArrowDown) ny += cat.speed;
  if (keys.ArrowLeft) nx -= cat.speed;
  if (keys.ArrowRight) nx += cat.speed;

  nx = Math.max(0, Math.min(nx, canvas.width  - cat.size));
  ny = Math.max(0, Math.min(ny, canvas.height - cat.size));

  if (hitsObstacle(nx, ny)) {
    nx = startPos.x; ny = startPos.y;
    bubbleText.textContent = "¡Ups! Tocaste una figura. Inténtalo de nuevo";
  }

  cat.x = nx; cat.y = ny;

  if (rectsOverlap(cat.x, cat.y, cat.size, cat.size, goal.x, goal.y, goal.w, goal.h)) {
    stopMaze(true);
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGoal();
  drawObstacles();
  drawCat();

  rafId = requestAnimationFrame(loop);
}

function startMaze() {
  cat.x = startPos.x; cat.y = startPos.y;
  mazeOverlay.style.display = "flex";
  if (!rafId) rafId = requestAnimationFrame(loop);
}

function stopMaze(success) {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  mazeOverlay.style.display = "none";
  if (success) {
    mazeCompleted = true;
    passwordUnlocked = true;
    passInput.disabled = false;
    bubbleText.textContent = "¡Bien! Ahora puedes escribir tu contraseña 😺";
  }
}

passInput.disabled = true;
passInput.addEventListener("focus", () => {
  if (!passwordUnlocked) {
    startMaze();
    passInput.blur();
  }
});
