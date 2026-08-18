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

// Project description toggle (expand/collapse), stopPropagation so
// clicking it doesn't also trigger the card's image modal
document.querySelectorAll(".description-toggle-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const desc = btn.nextElementSibling;
    const isExpanded = desc.classList.toggle("expanded");
    btn.innerHTML = isExpanded ? "Description &laquo;&laquo;&laquo;" : "Description &raquo;&raquo;&raquo;";
  });
});

// Project image carousel (Instagram-style arrows). Reads the list
// of image paths from each card's data-images attribute. If a card
// only has one image, the arrows are hidden entirely — add more
// paths to data-images in the HTML to enable cycling for that card.
document.querySelectorAll(".project-card").forEach((card) => {
  let images = [];
  try {
    images = JSON.parse(card.dataset.images || "[]");
  } catch (err) {
    images = [];
  }

  const leftArrow = card.querySelector(".carousel-arrow-left");
  const rightArrow = card.querySelector(".carousel-arrow-right");
  if (!leftArrow || !rightArrow) return;

  if (images.length <= 1) {
    leftArrow.style.display = "none";
    rightArrow.style.display = "none";
    return;
  }

  let index = 0;
  const img = card.querySelector(".project-img");

  const showImage = (newIndex) => {
    index = (newIndex + images.length) % images.length;
    img.src = images[index];
  };

  leftArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(index - 1);
  });

  rightArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(index + 1);
  });

  // Touch swipe support (left/right finger swipe on mobile), in
  // addition to the arrow buttons
  const swipeTarget = card.querySelector(".article-container");
  let touchStartX = 0;

  swipeTarget.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  swipeTarget.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      const swipeThreshold = 50;

      if (Math.abs(deltaX) < swipeThreshold) return;

      if (deltaX < 0) {
        showImage(index + 1); // swiped left -> next image
      } else {
        showImage(index - 1); // swiped right -> previous image
      }
    },
    { passive: true }
  );
});

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