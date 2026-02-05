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
