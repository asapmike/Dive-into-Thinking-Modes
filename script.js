const modes = {
  direct: {
    title: "Direct answer",
    items: ["Answer: 693"],
    note:
      "The assistant gives the final code immediately. This is fast, but the user cannot inspect the intermediate computation.",
    diagram:
      "Direct answering generates the final answer without showing intermediate steps.",
    activeArc: null
  },
  cot: {
    title: "Visible chain-of-thought",
    items: [
      "Blue = 3.",
      "Red = 2 * blue = 6.",
      "Green = red + blue = 9.",
      "Code in red, green, blue order = 693."
    ],
    note:
      "The reasoning is written as visible tokens. Later answer tokens can use those earlier reasoning tokens as context.",
    diagram:
      "Visible CoT turns intermediate reasoning into generated tokens that remain in the context window.",
    activeArc: "cot"
  },
  hidden: {
    title: "Hidden reasoning",
    items: [
      "Private reasoning used.",
      "Summary: I mapped each color clue to a value, then assembled the code in the requested order.",
      "Answer: 693"
    ],
    note:
      "The interface shows only a summary and answer. This resembles deployed reasoning systems more closely than raw visible CoT.",
    diagram:
      "Hidden reasoning keeps intermediate thinking private while exposing only a summary or final answer.",
    activeArc: "hidden"
  },
  latent: {
    title: "Latent reasoning preview",
    items: [
      "Puzzle tokens update an internal state.",
      "Extra internal computation refines that state before output.",
      "Answer: 693"
    ],
    note:
      "This is a research preview, not a claim about a deployed model. The visual stands in for pause-token or continuous-state reasoning ideas.",
    diagram:
      "Latent reasoning research explores extra computation in hidden states rather than fully written natural-language steps.",
    activeArc: "latent"
  }
};

const output = document.getElementById("solver-output");
const note = document.getElementById("diagram-note");
const buttons = Array.from(document.querySelectorAll(".mode-button"));
const lanes = Array.from(document.querySelectorAll("[data-arc]"));
const rows = Array.from(document.querySelectorAll("[data-row]"));

function renderOutput(modeKey) {
  const mode = modes[modeKey];
  const listItems = mode.items.map((item) => `<li>${item}</li>`).join("");

  output.innerHTML = `
    <p class="output-title">${mode.title}</p>
    <ul class="output-list">${listItems}</ul>
    <p class="mode-note">${mode.note}</p>
  `;
}

function setActiveMode(modeKey) {
  const mode = modes[modeKey];

  buttons.forEach((button) => {
    const isActive = button.dataset.mode === modeKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  lanes.forEach((lane) => {
    lane.classList.toggle("is-active", lane.dataset.arc === mode.activeArc);
  });

  rows.forEach((row) => {
    row.classList.toggle("is-active", row.dataset.row === modeKey);
  });

  note.textContent = mode.diagram;
  renderOutput(modeKey);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveMode(button.dataset.mode);
  });
});

setActiveMode("direct");
