# Environmental Impact Calculator

A React application for calculating and visualizing the environmental impact of daily actions.

## Project Structure

```
final/
├── src/
│   ├── components/          # React components
│   ├── styles/              # CSS files
│   │   ├── index.css        # Global styles with dark theme
│   │   └── App.css          # App component styles
│   ├── data/                # JSON data files
│   │   └── azioni_impatto_ambientale.json  # Environmental actions data
│   ├── utils/               # Utility functions
│   ├── App.js               # Main App component
│   └── index.js             # React entry point
├── public/
│   └── index.html           # HTML template
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Data

The application uses real environmental impact data from `azioni_impatto_ambientale.json` containing:
- 14 different daily actions
- Environmental metrics (CO2e, water usage, energy consumption)
- Educational examples for each action

## Features

- Dark mode theme
- Responsive design
- Real environmental impact calculations
- Three-column layout ready for implementation:
  - Drawer for actions
  - Central grid canvas
  - Metrics panel

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Removes the single build dependency

## Dependencies

- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1