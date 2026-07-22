# From Direct Answers to Hidden and Latent Reasoning

Interactive seven-slide presentation for a 10-minute CSE 151B classroom talk.

The deck follows one question: how did LLMs move from producing an answer directly
to using more computation between the question and the answer?

## Storyline

1. Why can extra intermediate words improve an answer?
2. Direct answering compresses computation into a fixed Transformer depth.
3. Language tokens create a reusable reasoning workspace.
4. Prompting activates reasoning, while training changes default behavior.
5. Hidden reasoning concerns visibility, not representation.
6. Latent reasoning performs intermediate computation in continuous states.
7. The broader development is flexible test-time computation.

The slides use figures extracted from the project literature collection, including
Wei et al., Nye et al., Kojima et al., Quiet-STaR, Coconut, Pause Tokens, and the
original Transformer paper. Each figure is labeled with its source and linked to
the corresponding public arXiv PDF.

## Presenting

- Open `index.html` in a browser.
- Use `Right Arrow`, `Space`, or `Next` to advance.
- Use `Left Arrow` or `Previous` to go back.
- Press `N` or select `Notes` to show the timed speaker notes.
- Press `F` or select `Fullscreen` for presentation mode.
- On slide 3, switch between Zero-shot CoT and Scratchpads to compare two ways of
  creating a language-token workspace.

## Files

- `index.html`: slide content and source citations
- `style.css`: responsive light and dark presentation design
- `script.js`: navigation, notes, fullscreen, and figure switching
- `assets/literature-figures/`: extracted paper figures and source map

The deck is fully static and can be presented locally or deployed with GitHub
Pages.
