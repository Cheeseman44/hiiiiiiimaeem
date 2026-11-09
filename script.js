// =============================
// EASY CUSTOM SETTINGS
// =============================
const SECRET_CODE = "0302"; // Change this to your own code.
const HINT = "something only we would know ♡"; // Change the hint.

// =============================
// PAGE LOGIC
// =============================
const pages = {
  lock: document.getElementById("lockPage"),
  mail: document.getElementById("mailPage"),
  memories: document.getElementById("memoriesPage"),
  music: document.getElementById("musicPage"),
  final: document.getElementById("finalPage"),
};

const codeDisplay = document.getElementById("codeDisplay");
const errorText = document.getElementById("errorText");
const accessModal = document.getElementById("accessModal");
const letterModal = document.getElementById("letterModal");
const envelope = document.getElementById("envelopeBtn");

let entered = "";

document.getElementById("hintText").textContent = HINT;

function showPage(page) {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  page.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCode() {
  codeDisplay.innerHTML = "";
  for (let i = 0; i < SECRET_CODE.length; i++) {
    const slot = document.createElement("div");
    slot.className = "code-slot" + (entered[i] ? "" : " empty");
    slot.textContent = entered[i] || "";
    codeDisplay.appendChild(slot);
  }
}

function checkCode() {
  if (entered.length !== SECRET_CODE.length) return;

  if (entered === SECRET_CODE) {
    errorText.textContent = "";
    burstHearts(18);
    accessModal.classList.remove("hidden");
  } else {
    errorText.textContent = "Not quite... try again ♡";
    errorText.style.color = "#fff";
    codeDisplay.animate(
      [{ transform: "translateX(-7px)" }, { transform: "translateX(7px)" }, { transform: "translateX(0)" }],
      { duration: 260 }
    );
    entered = "";
    renderCode();
  }
}

document.querySelectorAll(".keypad button").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.key;

    if (key === "DEL") {
      entered = entered.slice(0, -1);
    } else if (key !== "." && entered.length < SECRET_CODE.length) {
      entered += key;
    }

    renderCode();
    checkCode();
  });
});

document.getElementById("proceedBtn").addEventListener("click", () => {
  accessModal.classList.add("hidden");
  showPage(pages.mail);
});

envelope.addEventListener("click", () => {
  envelope.classList.toggle("open");
  if (envelope.classList.contains("open")) {
    setTimeout(() => letterModal.classList.remove("hidden"), 650);
    burstHearts(12);
  }
});

document.getElementById("closeLetter").addEventListener("click", () => {
  letterModal.classList.add("hidden");
});

document.getElementById("memoriesBtn").addEventListener("click", () => {
  letterModal.classList.add("hidden");
  showPage(pages.memories);
});

function goToMusic() {
  showPage(pages.music);
}

// =============================
// EIGHT-PHOTO MEMORY GALLERY
// =============================
const photoCards = [...document.querySelectorAll(".photo-card")];
const dots = [...document.querySelectorAll(".gallery-dot")];
let photoIndex = 0;

function updateGallery() {
  const n = photoCards.length;
  photoCards.forEach((card, i) => {
    card.classList.remove("active", "prev", "next");
    if (i === photoIndex) card.classList.add("active");
    if (i === (photoIndex - 1 + n) % n) card.classList.add("prev");
    if (i === (photoIndex + 1) % n) card.classList.add("next");
  });
  dots.forEach((dot, i) => dot.classList.toggle("active", i === photoIndex));
}

function movePhoto(step) {
  photoIndex = (photoIndex + step + photoCards.length) % photoCards.length;
  updateGallery();
}

document.querySelector(".gallery-prev").addEventListener("click", () => movePhoto(-1));
document.querySelector(".gallery-next").addEventListener("click", () => movePhoto(1));
dots.forEach(dot => dot.addEventListener("click", () => {
  photoIndex = Number(dot.dataset.index);
  updateGallery();
}));

// Swipe support for phones.
let touchStartX = 0;
const track = document.getElementById("memoryTrack");
track.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
track.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 45) movePhoto(dx < 0 ? 1 : -1);
}, { passive: true });

// Tap the active photo to open it full-screen.
const lightbox = document.getElementById("photoLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

function openPhoto(i) {
  photoIndex = i;
  const card = photoCards[photoIndex];
  lightboxImage.src = card.querySelector("img").src;
  lightboxCaption.textContent = card.querySelector("figcaption").textContent;
  lightbox.classList.remove("hidden");
}

photoCards.forEach(card => {
  card.addEventListener("click", () => {
    if (card.classList.contains("active")) openPhoto(Number(card.dataset.index));
  });
});

document.getElementById("closePhoto").addEventListener("click", () => lightbox.classList.add("hidden"));
document.getElementById("lightboxPrev").addEventListener("click", () => {
  movePhoto(-1);
  openPhoto(photoIndex);
});
document.getElementById("lightboxNext").addEventListener("click", () => {
  movePhoto(1);
  openPhoto(photoIndex);
});
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.classList.add("hidden");
});

document.getElementById("musicBtn").addEventListener("click", () => showPage(pages.music));
updateGallery();

document.getElementById("finalBtn").addEventListener("click", () => {
  showPage(pages.final);
  burstHearts(35);
});

document.getElementById("restartBtn").addEventListener("click", () => {
  entered = "";
  renderCode();
  showPage(pages.lock);
});

function burstHearts(count = 12) {
  const container = document.getElementById("hearts");
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > .3 ? "♡" : "♥";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${14 + Math.random() * 24}px`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6500);
  }
}

renderCode();
