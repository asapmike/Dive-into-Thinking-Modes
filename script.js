const slides = Array.from(document.querySelectorAll(".slide"));
const prevButton = document.getElementById("prev-slide");
const nextButton = document.getElementById("next-slide");
const currentSlideLabel = document.getElementById("current-slide");
const totalSlidesLabel = document.getElementById("total-slides");
const progressFill = document.getElementById("progress-fill");
const dotsContainer = document.getElementById("slide-dots");
const notesToggle = document.getElementById("notes-toggle");
const deckShell = document.querySelector(".deck-shell");

const output = document.getElementById("solver-output");
const diagramCaption = document.getElementById("diagram-caption");
const modeTabs = Array.from(document.querySelectorAll(".mode-tab"));
const modeChips = Array.from(document.querySelectorAll(".mode-chip"));
const diagramPaths = Array.from(document.querySelectorAll("[data-path]"));
const tableRows = Array.from(document.querySelectorAll("[data-row]"));

let activeSlide = 0;
let activeMode = "direct";

const modes = {
  direct: {
    title: "Direct answer",
    items: ["Answer: 693"],
    note:
      "Fast and compact, but the student cannot inspect the intermediate computation.",
    caption:
      "Direct answering uses the same Transformer machinery, but the interface shows only the final generated answer.",
    path: null
  },
  cot: {
    title: "Visible chain-of-thought",
    items: [
      "Blue = 3.",
      "Red = 2 times blue = 6.",
      "Green = red plus blue = 9.",
      "Code in red, green, blue order = 693."
    ],
    note:
      "The reasoning becomes text tokens. Later answer tokens can attend to those earlier generated steps.",
    caption:
      "Visible CoT stores intermediate computation as generated language tokens that remain in the context.",
    path: "cot"
  },
  hidden: {
    title: "Hidden reasoning",
    items: [
      "Private reasoning used.",
      "Summary: The color values were computed first, then placed in the requested order.",
      "Answer: 693"
    ],
    note:
      "The user sees a summary or answer, not the full private scratchpad. This is an interface pattern, not direct access to internals.",
    caption:
      "Hidden reasoning keeps intermediate text private and exposes only a summary or final answer.",
    path: "hidden"
  },
  latent: {
    title: "Latent reasoning preview",
    items: [
      "Puzzle tokens update internal hidden states.",
      "Extra computation refines those states before any final text is emitted.",
      "Answer: 693"
    ],
    note:
      "This is a research preview inspired by pause-token and continuous-latent reasoning work, not a claim about a specific deployed model.",
    caption:
      "Latent reasoning research asks whether some reasoning can happen through hidden-state updates instead of natural-language steps.",
    path: "latent"
  }
};

function setSlide(index) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  activeSlide = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  currentSlideLabel.textContent = String(activeSlide + 1);
  progressFill.style.width = `${((activeSlide + 1) / slides.length) * 100}%`;

  prevButton.disabled = activeSlide === 0;
  nextButton.disabled = activeSlide === slides.length - 1;
  nextButton.textContent = activeSlide === slides.length - 1 ? "End" : "Next";

  Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "step" : "false");
  });

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

function renderDots() {
  dotsContainer.innerHTML = "";
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.className = "dot-button";
    button.type = "button";
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `Go to slide ${index + 1}: ${slide.dataset.title}`);
    button.addEventListener("click", () => setSlide(index));
    dotsContainer.appendChild(button);
  });
}

function renderMode(modeKey) {
  const mode = modes[modeKey];
  if (!mode || !output) {
    return;
  }

  activeMode = modeKey;

  output.innerHTML = `
    <p class="solver-title">${mode.title}</p>
    <ul class="solver-list">
      ${mode.items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <p class="solver-note">${mode.note}</p>
  `;

  modeTabs.forEach((button) => {
    const isActive = button.dataset.mode === modeKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  modeChips.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.jumpMode === modeKey);
  });

  diagramPaths.forEach((path) => {
    path.classList.toggle("is-active", path.dataset.path === mode.path);
  });

  tableRows.forEach((row) => {
    row.classList.toggle("is-active", row.dataset.row === modeKey);
  });

  if (diagramCaption) {
    diagramCaption.textContent = mode.caption;
  }

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

function jumpToMode(modeKey) {
  renderMode(modeKey);
  setSlide(3);
}

prevButton.addEventListener("click", () => setSlide(activeSlide - 1));
nextButton.addEventListener("click", () => setSlide(activeSlide + 1));

modeTabs.forEach((button) => {
  button.addEventListener("click", () => renderMode(button.dataset.mode));
});

modeChips.forEach((button) => {
  button.addEventListener("click", () => jumpToMode(button.dataset.jumpMode));
});

notesToggle.addEventListener("click", () => {
  const shouldShow = !deckShell.classList.contains("show-notes");
  deckShell.classList.toggle("show-notes", shouldShow);
  notesToggle.setAttribute("aria-pressed", String(shouldShow));
});

document.addEventListener("keydown", (event) => {
  const tagName = document.activeElement?.tagName;
  const isTyping = tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";

  if (isTyping) {
    return;
  }

  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    setSlide(activeSlide + 1);
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    setSlide(activeSlide - 1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    setSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    setSlide(slides.length - 1);
  }

  if (event.key.toLowerCase() === "n") {
    notesToggle.click();
  }
});

totalSlidesLabel.textContent = String(slides.length);
renderDots();
renderMode(activeMode);
setSlide(activeSlide);
