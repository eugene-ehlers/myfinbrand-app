# OCR & Analysis Service — Frontend Foundation

This repository contains a minimal **3-page React (Vite) app** to establish a stable base:
- Landing (Home)
- Page Two
- Page Three

It includes a shared header, footer, and routing. We’ll add OCR features and AWS integrations later.

## Tech
- React 18 + Vite
- React Router
- Tailwind CSS

## Quick start
- Install dependencies
- Run the local dev server
- Open the printed localhost URL

## Build
- Create a production build
- Preview the static build locally

## Structure (target)
index.html
package.json
postcss.config.js
tailwind.config.js
vite.config.js
/src
  main.jsx
  App.jsx
  index.css
  /components
    Header.jsx
    Footer.jsx
  /pages
    Landing.jsx
    PageTwo.jsx
    PageThree.jsx

## Infrastructure docs
See infra/README.md for Terraform/AWS/API details.
