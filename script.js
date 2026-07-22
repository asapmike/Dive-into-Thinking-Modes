const slides = Array.from(document.querySelectorAll(".slide"));
const prevButton = document.getElementById("prev-slide");
const nextButton = document.getElementById("next-slide");
const currentSlideLabel = document.getElementById("current-slide");
const totalSlidesLabel = document.getElementById("total-slides");
const progressFill = document.getElementById("progress-fill");
const dotsContainer = document.getElementById("slide-dots");
const notesToggle = document.getElementById("notes-toggle");
const fullscreenToggle = document.getElementById("fullscreen-toggle");
const deckShell = document.getElementById("deck");
const workspaceFigure = document.getElementById("workspace-figure");
const workspaceSourceLink = document.getElementById("workspace-source-link");
const workspaceCaption = document.getElementById("workspace-caption");
const figureTabs = Array.from(document.querySelectorAll(".figure-tab"));

let activeSlide = 0;
let activeFigure = "zero-shot";

const figureVariants = {
  "zero-shot": {
    src: "assets/literature-figures/03_kojima_fig2_zero_shot_cot.png",
    alt: "The two-stage Zero-shot-CoT pipeline first extracts reasoning and then extracts the final answer.",
    width: "1341",
    height: "531",
    href: "../papers/2205.11916-zero-shot-reasoners.pdf#page=4",
    source: "Kojima et al. (2022), Figure 2",
    caption: "‘Let’s think step by step’ belongs to Zero-shot-CoT."
  },
  scratchpad: {
    src: "assets/literature-figures/02_nye_fig1_direct_vs_scratchpad.png",
    alt: "Direct code execution prediction compared with a language-model scratchpad that writes a line-by-line execution trace.",
    width: "1357",
    height: "968",
    href: "../papers/2112.00114-scratchpads.pdf#page=2",
    source: "Nye et al. (2021), Figure 1",
    caption: "A trained scratchpad turns intermediate computation into text."
  }
};

Object.values(figureVariants).forEach((variant) => {
  const preload = new Image();
  preload.src = variant.src;
});

function setSlide(index) {
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
}

function renderDots() {
  dotsContainer.replaceChildren();

  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.className = "dot-button";
    button.type = "button";
    button.textContent = String(index + 1);
    button.title = slide.dataset.title;
    button.setAttribute("aria-label", `Go to slide ${index + 1}: ${slide.dataset.title}`);
    button.addEventListener("click", () => setSlide(index));
    dotsContainer.appendChild(button);
  });
}

function setFigureVariant(key) {
  const variant = figureVariants[key];
  if (!variant || !workspaceFigure || !workspaceSourceLink || !workspaceCaption) {
    return;
  }

  activeFigure = key;
  workspaceFigure.classList.add("is-changing");

  window.setTimeout(() => {
    workspaceFigure.src = variant.src;
    workspaceFigure.alt = variant.alt;
    workspaceFigure.width = Number(variant.width);
    workspaceFigure.height = Number(variant.height);
    workspaceSourceLink.href = variant.href;
    workspaceSourceLink.textContent = variant.source;
    workspaceCaption.textContent = variant.caption;
    workspaceFigure.classList.remove("is-changing");
  }, 120);

  figureTabs.forEach((button) => {
    const isActive = button.dataset.figure === activeFigure;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function toggleNotes() {
  const shouldShow = !deckShell.classList.contains("show-notes");
  deckShell.classList.toggle("show-notes", shouldShow);
  notesToggle.setAttribute("aria-pressed", String(shouldShow));
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.warn("Fullscreen is unavailable in this browser.", error);
  }
}

function syncFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement);
  fullscreenToggle.setAttribute("aria-pressed", String(isFullscreen));
  fullscreenToggle.textContent = isFullscreen ? "Exit fullscreen" : "Fullscreen";
}

prevButton.addEventListener("click", () => setSlide(activeSlide - 1));
nextButton.addEventListener("click", () => setSlide(activeSlide + 1));
notesToggle.addEventListener("click", toggleNotes);
fullscreenToggle.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", syncFullscreenButton);

figureTabs.forEach((button) => {
  button.addEventListener("click", () => setFigureVariant(button.dataset.figure));
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
    event.preventDefault();
    toggleNotes();
  }

  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    toggleFullscreen();
  }
});

totalSlidesLabel.textContent = String(slides.length);
renderDots();
setFigureVariant(activeFigure);
setSlide(activeSlide);
