function openModal(image, title, desc) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modal-img").src = image;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-desc").textContent = desc;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
