# Jewelry Studio

A jewelry design application that enables 0->1 exploration of ideas and rapid low-fi prototyping of pieces. Most jewelry design software has a steep learning curve (i.e. Rhino 3D) - the goal of this app is to provide a scaffolding for the creative / conceptual step of coming up with a design collection idea and pieces of jewelry within it.

### Collection

The first step is coming up with the idea for a collection. The user can upload a few photos that capture the vibe of the collection, and input a few descriptors (e.g. bold, melted, warm tones). They will get AI-powered material suggestions (metals, gemstones) using Claude.

<img width="2930" height="1614" alt="CleanShot 2026-01-15 at 15 07 08@2x" src="https://github.com/user-attachments/assets/e9014146-aa2b-4f56-b426-706a26057ab1" />


### Pieces

Pieces are individual jewelry items such as rings, necklaces, bracelets and earrings. Claude will automatically 'draft' a few pieces for the collection based on the vibe. The user can edit each of these pieces (or start from scratch) in the interactive editor, and see an auto-updated 3D rendering of their image as they work.

<img width="2922" height="1614" alt="CleanShot 2026-01-15 at 15 09 01@2x" src="https://github.com/user-attachments/assets/8a03efd0-7a7c-43b6-bd7d-712511609da1" />

All work is saved locally for now.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure Anthropic API (for AI material suggestions):

   - Create `.env`
   - Add your Anthropic API key: `REACT_APP_ANTHROPIC_API_KEY=your_key_here`
   - Get your API key from: https://console.anthropic.com/

3. Start the development server:

```bash
npm start
```
