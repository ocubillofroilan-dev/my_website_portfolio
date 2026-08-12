function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
const showMoreBtn = document.getElementById("show-more-btn");
if (showMoreBtn) {
  showMoreBtn.addEventListener("click", () => {
    const hiddenCards = document.querySelectorAll(".certificate-hidden");
    const isExpanded = showMoreBtn.dataset.expanded === "true";

    hiddenCards.forEach((card) => {
      card.style.display = isExpanded ? "none" : "flex";
    });

    showMoreBtn.textContent = isExpanded ? "Show More" : "Show Less";
    showMoreBtn.dataset.expanded = isExpanded ? "false" : "true";
  });
}

// Certificate modal (lightbox)
const certModal = document.getElementById("cert-modal");
const certModalImg = document.getElementById("cert-modal-img");
const certModalTitle = document.getElementById("cert-modal-title");
const certModalClose = document.getElementById("cert-modal-close");

document.querySelectorAll(".certificate-card").forEach((card) => {
  card.addEventListener("click", () => {
    const img = card.querySelector("img");
    certModalImg.src = img.src;
    certModalTitle.textContent = card.dataset.name;
    certModal.classList.add("cert-modal-open");
  });
});

function closeCertModal() {
  certModal.classList.remove("cert-modal-open");
}

certModalClose.addEventListener("click", closeCertModal);
certModal.addEventListener("click", (e) => {
  if (e.target === certModal) closeCertModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCertModal();
});