// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Map Tailwind color names to your CSS variables
        bg: "rgb(var(--bg))",
        surface: "rgb(var(--surface))",
        surface2: "rgb(var(--surface-2))",
        ink: "rgb(var(--ink))",
        "ink-dim": "rgb(var(--ink-dim))",
        brand: "rgb(var(--primary))",
        "brand-fg": "rgb(var(--primary-fg))",
        accent: "rgb(var(--accent))",
        nav: "rgb(var(--nav-dark))",
        border: "rgb(var(--border))",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial"],
      },
      borderRadius: {
        xl2: "1rem",
      },
      boxShadow: {
        card: "0 6px 24px rgba(2,6,23,.06)",
      },
      transitionTimingFunction: {
        // motion language foundations (used later with framer or CSS)
        "brand-ease": "cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [],
};
