import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// IMPORTANT: Tailwind & brand CSS is imported inside App via ./styles/globals.css

const root = createRoot(document.getElementById('root'));
root.render(<App />);

