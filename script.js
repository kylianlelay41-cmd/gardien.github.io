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

