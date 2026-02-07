function openModal(image, title, desc, gif) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modal-img").src = image;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-desc").textContent = desc;

  const gifEl = document.getElementById("modal-gif");

  if (gif) {
    gifEl.src = gif;
    gifEl.style.display = "block";
  } else {
    gifEl.style.display = "none";
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* ===== Couleurs aléatoires douces pour poésies ===== */

function randomPastelColor() {
  const hues = [160, 170, 180, 190, 200]; // vert → bleu (ton thème)
  const hue = hues[Math.floor(Math.random() * hues.length)];
  return `hsl(${hue}, 60%, 85%)`; // clair pour lecture
}

document.querySelectorAll(".poesie-card").forEach(card => {
  card.style.background = randomPastelColor();
});








/* =========================
   RÉFÉRENCES
========================= */
const ghostContainer = document.getElementById("ghost-container");
const ghostWrapper   = document.getElementById("ghost-wrapper");
const ghost          = document.getElementById("ghost");

/* =========================
   ANIMATION DES IMAGES
========================= */
const frames = [
  "images/f/1.png",
  "images/f/2.png",
  "images/f/3.png"
];

let frameIndex = 0;
setInterval(() => {
  frameIndex = (frameIndex + 1) % frames.length;
  ghost.src = frames[frameIndex];
}, 250);

/* =========================
   POSITION INITIALE
========================= */
let x = 300;
let y = 600;
let lastX = x;

/* =========================
   CONSTANTES DE MOUVEMENT
========================= */
const SPEED = 0.6;
const STOP_DISTANCE = 75;
const WAIT_TIME = 15000;

/* =========================
   ÉTAT
========================= */
let state = "moving";
let waitStart = 0;

/* =========================
   CHEMIN
========================= */
let pathPoints = [];
let currentPointIndex = 0;

/* =========================
   GÉNÉRATION DU CHEMIN
========================= */
function generatePathPoints(startX, startY, endX, endY) {
  let points = [];
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.hypot(dx, dy);

  if (distance > 1000) {
    const count = Math.floor(Math.random() * 3) + 1;

    for (let i = 1; i <= count; i++) {
      const ratio = i / (count + 1);
      points.push({
        x: startX + dx * ratio + (Math.random() - 0.5) * 200,
        y: startY + dy * ratio + (Math.random() - 0.5) * 200
      });
    }
  }

  points.push({ x: endX, y: endY });

  /* PATCH : suppression points trop proches */
  points = points.filter((p, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1];
    return Math.hypot(p.x - prev.x, p.y - prev.y) > 120;
  });

  return points;
}

/* =========================
   CHOIX DE LA DESTINATION
========================= */
function chooseTarget() {
  const arts = document.querySelectorAll(".art-item img");
  if (!arts.length) return;

  const art = arts[Math.floor(Math.random() * arts.length)];
  const rect = art.getBoundingClientRect();

  const targetX = rect.left + window.scrollX + rect.width / 2;
  const targetY = rect.top + window.scrollY + rect.height / 2;

  pathPoints = generatePathPoints(x, y, targetX, targetY);
  currentPointIndex = 0;
}

/* =========================
   ORIENTATION (BASÉE SUR LE DÉPLACEMENT RÉEL)
========================= */
function updateGhostDirection() {
  if (x > lastX + 0.3) {
    ghostWrapper.classList.add("face-right");
    ghostWrapper.classList.remove("face-left");
  } else if (x < lastX - 0.3) {
    ghostWrapper.classList.add("face-left");
    ghostWrapper.classList.remove("face-right");
  }
  lastX = x;
}

/* =========================
   MOUVEMENT AVEC VAGUE
========================= */
let waveTime = 0;

function moveGhost(timestamp) {

  /* ÉTAT : ATTENTE */
  if (state === "waiting") {
    if (timestamp - waitStart > WAIT_TIME) {
      chooseTarget();
      state = "moving";
    }
  }

  /* ÉTAT : DÉPLACEMENT */
  if (state === "moving" && pathPoints.length) {

    const target = pathPoints[currentPointIndex];
    if (!target) {
      chooseTarget();
      requestAnimationFrame(moveGhost);
      return;
    }

    const dx = target.x - x;
    const dy = target.y - y;
    const distance = Math.hypot(dx, dy);

    if (distance > STOP_DISTANCE) {

      const dirX = dx / distance;
      const dirY = dy / distance;

      /* vague douce (n’influence PAS le regard) */
      waveTime += 0.02;
      const waveAmplitude = 0.3;
      const perpX = -dirY;
      const perpY = dirX;
      const waveOffset = Math.sin(waveTime) * waveAmplitude;

      x += dirX * SPEED + perpX * waveOffset;
      y += dirY * SPEED + perpY * waveOffset;

    } else {
      currentPointIndex++;
      if (currentPointIndex >= pathPoints.length) {
        state = "waiting";
        waitStart = timestamp;
      }
    }
  }

  ghostContainer.style.left = x + "px";
  ghostContainer.style.top  = y + "px";

  updateGhostDirection();

  requestAnimationFrame(moveGhost);
}

/* =========================
   LANCEMENT
========================= */
chooseTarget();
requestAnimationFrame(moveGhost);


