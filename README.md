# Jewelry Studio

A jewelry design application built with React and TypeScript.

## Recent Updates

### Standalone Pieces
- Pieces can now be created independently without being part of a collection
- When creating a piece within a collection, it will automatically suggest the collection's materials as defaults
- Navigate to `/design/:pieceType` to create standalone pieces

### Collection Creation Wizard
The collection creation flow has been redesigned as a 2-step wizard:

**Step 1: Vision & Inspiration**
- Collection name and description
- Moodboard image uploads
- Style keywords

**Step 2: Material Selection with AI**
- AI-powered material suggestions using Anthropic's Claude
- The AI analyzes your collection's name, description, and style keywords to suggest appropriate metals and gemstones
- You can apply suggestions automatically or make manual selections

### Empty State Improvements
- Empty states now display interactive skeleton previews
- Click on skeleton cards to immediately create new collections or pieces
- More intuitive onboarding experience

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Anthropic API (for AI material suggestions):
   - Copy `.env.example` to `.env`
   - Add your Anthropic API key: `REACT_APP_ANTHROPIC_API_KEY=your_key_here`
   - Get your API key from: https://console.anthropic.com/

3. Start the development server:
```bash
npm start
```

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
