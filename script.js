let targetArtItem = null;

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
   RÉFÉRENCES DOM
========================= */
const ghostContainer = document.getElementById("ghost-container");
const ghostWrapper   = document.getElementById("ghost-wrapper");
const ghost          = document.getElementById("ghost");
const bubble         = document.getElementById("ghost-bubble");
const artItems       = document.querySelectorAll(".art-item");

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
   CONSTANTES
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
    const count = Math.floor(Math.random() * 8) + 1;
    for (let i = 1; i <= count; i++) {
      const ratio = i / (count + 1);
      points.push({
        x: startX + dx * ratio + (Math.random() - 0.5) * 200,
        y: startY + dy * ratio + (Math.random() - 0.5) * 200
      });
    }
  }

  /* PATCH : suppression points trop proches */
  points = points.filter((p, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1];
    return Math.hypot(p.x - prev.x, p.y - prev.y) > 120;
  });

  return points;
}
/* =========================
   CIBLE
========================= */
function chooseTarget() {
  const arts = document.querySelectorAll(".art-item");
  if (!arts.length) return;

  targetArtItem = arts[Math.floor(Math.random() * arts.length)];

  const img = targetArtItem.querySelector("img");
  const rect = img.getBoundingClientRect();

  const targetX = rect.left + window.scrollX + rect.width / 2;
  const targetY = rect.top + window.scrollY + rect.height / 2;

  pathPoints = generatePathPoints(x, y, targetX, targetY);

  // ✅ GARANTIE : dernier point = centre exact
  pathPoints.push({ x: targetX, y: targetY });

  currentPointIndex = 0;
}



/* =========================
   ORIENTATION
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
   MOUVEMENT
========================= */
let waveTime = 0;

function moveGhost(timestamp) {

  if (state === "waiting") {
    if (timestamp - waitStart > WAIT_TIME) {
      chooseTarget();
      state = "moving";
    }
  }

  if (state === "moving" && pathPoints.length) {
    const target = pathPoints[currentPointIndex];
    if (!target) return;

    const dx = target.x - x;
    const dy = target.y - y;
    const distance = Math.hypot(dx, dy);

    if (distance > STOP_DISTANCE) {
      const dirX = dx / distance;
      const dirY = dy / distance;

      waveTime += 0.02;
      const perpX = -dirY;
      const perpY = dirX;
      const waveOffset = Math.sin(waveTime) * 0.3;

      x += dirX * SPEED + perpX * waveOffset;
      y += dirY * SPEED + perpY * waveOffset;
    } else {
      currentPointIndex++;
      
        if (currentPointIndex >= pathPoints.length) {

          // 🛑 on s’arrête UNIQUEMENT si on est sur l’image cible
          if (targetArtItem && isOverlapping(ghostContainer, targetArtItem)) {
            state = "waiting";
            waitStart = timestamp;
          } else {
              // ❌ sinon on recalcule une trajectoire vers la même image
           chooseTarget();
          }
        }




    }
  }

  ghostContainer.style.left = x + "px";
  ghostContainer.style.top  = y + "px";

  updateGhostDirection();
  requestAnimationFrame(moveGhost);
}

/* =========================
   RÉACTIONS
========================= */
const reactions = {
  "moment de détente": ["🍓🍓🍓", "😮"],
  "une douce lumière": ["💙🌃"],
  "la mer": ["c'est beau la mer"],
  "la vue est belle": ["😮", "😸"],
  "des jolis fleurs": ["🌸🌼🌺🌷💐🏵️🌹"],
  "une nuit en couleur": ["💜🌃"],
  "le phare de la lune": ["elle est belle la lune", "🩷🌛"],
  "point de vue": ["🤯", "🙃"],
  "centre ville de Quimper": ["🏵️🌼🏵️"],
  "vacance à Palma": ["😮😮😮"],
  "à la plage": ["🤩"],
  "une belle journée": ["😍🌈"],
  "Au-delà de la réalité": [" ... "],
  "Mon premier photomontage": ["😮"],
  "séance photo": ["🤔"],
  "Le sauvageon oublié qui patiente": ["💚"],
  "l’ultime confiture jaune": ["😋🍯🍊🍋🥝🟡", "ça donne faim"],
  "épée nul": ["🤣"],
  "trident en inox": ["💥"],
  "LA BIG BERTAAAA": ["🪓🪓🪓"],
  "Le P.2.C.": ["❤️‍🔥"],
  "ELYT": ["🔪"],
  "Mon collier": ["..."],
  "Le damné remake": ["🫥^2"],
  "Le damné": ["🫥", "rip"],
  "L’éveil du GARDIEN": ["..."],
  "couture folle": ["😬"],
  "my mind": ["🤯😝"],
  "Me in mii": ["🤣"],
  "Illuminati": ["🤨"],
  "le monde est si...": ["🌍🤏"],
  "La complexité du coeur": ["💔"],
  "Le demon de l’égocentrisme": ["😈"],
  "Mon emblème": ["🛡️"],
  "happy ghast": ["🥹"],
  "une ame prismatique": ["❤️🧡💛💚🩵💙💜"],
  "La véritable sérénité": ["🤔"],
  "Un petit paradis": ["❤️📕"],
  "Charon Somnium": ["😮"],
  "L’arbre monde de « Charon et R.M.S »": ["🌳💚"]
};

/* =========================
   BULLES / COLLISIONS
========================= */
let hoverTimer = null;
let hideTimer = null;
let currentItem = null;

function isOverlapping(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}

setInterval(() => {

  // ❌ si le fantôme bouge → aucune réaction possible
  if (state !== "waiting") {
    clearTimeout(hoverTimer);
    bubble.classList.remove("show");
    currentItem = null;
    return;
  }

  let found = false;

  artItems.forEach(item => {
    if (isOverlapping(ghostContainer, item)) {
      found = true;

      if (currentItem !== item) {
        currentItem = item;
        clearTimeout(hoverTimer);

        hoverTimer = setTimeout(() => {
          // sécurité : toujours arrêté ?
          if (state !== "waiting") return;

          const title = item.querySelector("h3")?.innerText.trim();
          const list = reactions[title];
          if (!list) return;

          bubble.textContent =
            list[Math.floor(Math.random() * list.length)];
          bubble.classList.add("show");

          hideTimer = setTimeout(() => {
            bubble.classList.remove("show");
            currentItem = null;
          }, 12000);

        }, 2000);
      }
    }
  });

  if (!found && currentItem) {
    clearTimeout(hoverTimer);
    bubble.classList.remove("show");
    currentItem = null;
  }

}, 100);




/* =========================
   LANCEMENT
========================= */
chooseTarget();
requestAnimationFrame(moveGhost);



