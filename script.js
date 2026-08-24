function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Split the hero name into one <span class="letter"> per character
// (keeping the space between words as a plain space, not a span) so
// each letter can pop/color-shift on its own hover, independently
// of the letters around it — see the #hero-name rules in styles.css.
(function splitHeroNameIntoLetters() {
  const heroName = document.getElementById("hero-name");
  if (!heroName) return;

  const words = heroName.textContent.split(" ");
  heroName.innerHTML = "";

  words.forEach((word, wordIndex) => {
    word.split("").forEach((char) => {
      const letterSpan = document.createElement("span");
      letterSpan.className = "letter";
      letterSpan.textContent = char;
      heroName.appendChild(letterSpan);
    });
    if (wordIndex < words.length - 1) {
      heroName.appendChild(document.createTextNode(" "));
    }
  });
})();

// Dark mode toggle — persists the choice in localStorage and keeps
// both the desktop and mobile toggle buttons' icons in sync.
const THEME_KEY = "portfolio-theme";
const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  themeToggleBtns.forEach((btn) => {
    const icon = btn.querySelector("i");
    if (icon) {
      icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  });
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark-mode");
  const nextTheme = isDark ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch (err) {
    // localStorage unavailable (e.g. private browsing) — theme just
    // won't persist across visits.
  }
}

// Restore saved preference on load, falling back to the visitor's
// OS-level preference if they haven't chosen one on this site yet.
(function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (err) {
    saved = null;
  }
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
})();

// Resume viewer modal
const resumeModal = document.getElementById("resume-modal");
const resumeModalClose = document.getElementById("resume-modal-close");

function openResumeModal() {
  resumeModal.classList.add("resume-modal-open");
}

function closeResumeModal() {
  resumeModal.classList.remove("resume-modal-open");
}

resumeModalClose.addEventListener("click", closeResumeModal);
resumeModal.addEventListener("click", (e) => {
  if (e.target === resumeModal) closeResumeModal();
});

// Contact form -> submits to Formspree via fetch, so the visitor
// stays on the page and sees an inline confirmation instead of
// being redirected away after sending.
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    contactStatus.textContent = "Sending...";
    contactStatus.className = "contact-form-status";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        contactStatus.textContent = "Message sent! I'll get back to you soon.";
        contactStatus.className = "contact-form-status success";
        contactForm.reset();
      } else {
        contactStatus.textContent = "Something went wrong. Please try again.";
        contactStatus.className = "contact-form-status error";
      }
    } catch (err) {
      contactStatus.textContent = "Something went wrong. Please try again.";
      contactStatus.className = "contact-form-status error";
    }
  });
}

// Show More / Show Less toggle for certificates. Toggling the
// certificate-hidden class itself (instead of setting an inline
// display style) means the stylesheet always stays in control of
// how a revealed card is displayed — no risk of an inline style
// silently overriding the card's flex layout.
const showMoreBtn = document.getElementById("show-more-btn");
const hiddenCertCards = document.querySelectorAll(".certificate-hidden");
if (showMoreBtn) {
  showMoreBtn.addEventListener("click", () => {
    const isExpanded = showMoreBtn.dataset.expanded === "true";

    hiddenCertCards.forEach((card) => {
      card.classList.toggle("certificate-hidden", isExpanded);
    });

    showMoreBtn.textContent = isExpanded ? "Show More" : "Show Less";
    showMoreBtn.dataset.expanded = isExpanded ? "false" : "true";
  });
}

// Show More / Show Less toggle for projects (same pattern as certificates)
const showMoreProjectsBtn = document.getElementById("show-more-projects-btn");
const hiddenProjectCards = document.querySelectorAll(".project-hidden");
if (showMoreProjectsBtn) {
  showMoreProjectsBtn.addEventListener("click", () => {
    const isExpanded = showMoreProjectsBtn.dataset.expanded === "true";

    hiddenProjectCards.forEach((card) => {
      card.classList.toggle("project-hidden", isExpanded);
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
    closeResumeModal();
  }
});