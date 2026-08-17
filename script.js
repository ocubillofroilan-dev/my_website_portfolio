function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Builds the pixel-dissolve tile grid over the hero photo. Each
// tile shows one slice of the Spider-Man image (via background
// position/size), and gets a small random transition-delay so the
// tiles fade out at slightly different times on hover, instead of
// all at once.
const pixelGrid = document.getElementById("pixel-grid");
if (pixelGrid) {
  const cols = 8;
  const rows = 8;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement("div");
      tile.className = "pixel-tile";
      tile.style.backgroundPosition = `${(c * 100) / (cols - 1)}% ${(r * 100) / (rows - 1)}%`;
      tile.style.transitionDelay = `${Math.random() * 250}ms`;
      pixelGrid.appendChild(tile);
    }
  }
}

// Show More / Show Less toggle for certificates
const showMoreBtn = document.getElementById("show-more-btn");
if (showMoreBtn) {
  showMoreBtn.addEventListener("click", () => {
    const hiddenCards = document.querySelectorAll(".certificate-hidden");
    const isExpanded = showMoreBtn.dataset.expanded === "true";

    hiddenCards.forEach((card) => {
      card.style.display = isExpanded ? "none" : "block";
    });

    showMoreBtn.textContent = isExpanded ? "Show More" : "Show Less";
    showMoreBtn.dataset.expanded = isExpanded ? "false" : "true";
  });
}

// Show More / Show Less toggle for projects (same pattern as certificates)
const showMoreProjectsBtn = document.getElementById("show-more-projects-btn");
if (showMoreProjectsBtn) {
  showMoreProjectsBtn.addEventListener("click", () => {
    const hiddenProjectCards = document.querySelectorAll(".project-hidden");
    const isExpanded = showMoreProjectsBtn.dataset.expanded === "true";

    hiddenProjectCards.forEach((card) => {
      card.style.display = isExpanded ? "none" : "block";
    });

    showMoreProjectsBtn.textContent = isExpanded ? "Show More" : "Show Less";
    showMoreProjectsBtn.dataset.expanded = isExpanded ? "false" : "true";
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

// Project modal (lightbox) - same pattern as the certificate modal
const projectModal = document.getElementById("project-modal");
const projectModalImg = document.getElementById("project-modal-img");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalClose = document.getElementById("project-modal-close");

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    const img = card.querySelector("img");
    projectModalImg.src = img.src;
    projectModalTitle.textContent = card.dataset.name;
    projectModal.classList.add("project-modal-open");
  });
});

function closeProjectModal() {
  projectModal.classList.remove("project-modal-open");
}

projectModalClose.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) closeProjectModal();
});

// Shared Escape-key handler closes whichever modal is open
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCertModal();
    closeProjectModal();
  }
});