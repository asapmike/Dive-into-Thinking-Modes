# Think Out Loud or Think Inside?

Interactive slide presentation for a CSE 151B communication-track project.

The deck teaches four reasoning modes for modern language models:

- Direct answering
- Visible chain-of-thought reasoning
- Hidden or private reasoning
- Latent reasoning as an emerging research direction

The presentation uses one small puzzle, original simplified architecture diagrams,
and a source map of representative papers. It does not call a live model or claim
to expose real model internals.

## How to present

- Open `index.html` in a browser.
- Use `Right Arrow`, `Space`, or the `Next` button to advance.
- Use `Left Arrow` or the `Previous` button to go back.
- Press `N` or click `Notes` to show speaker notes.
- On the interactive puzzle slide, click the reasoning mode tabs to compare
  outputs.

The narrative is designed for a 10-minute presentation:

1. Motivation and topic framing
2. Connection to first deep learning concepts
3. Transformer next-token baseline
4. Four reasoning modes through one puzzle
5. Interactive architecture diagram
6. Visible chain-of-thought
7. Multi-path reasoning extensions
8. Hidden versus latent reasoning
9. Tradeoffs
10. Source map and limitations

## Source material

The local paper PDFs are stored in `../papers/`. The slide deck links to public
arXiv pages so the source map still works after deployment.

## Deployment

This is a static site. It can be deployed with GitHub Pages from the repository
root.
