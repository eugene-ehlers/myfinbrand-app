// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Corporate palette (from your globals)
        bg: 'rgb(var(--bg))',
        surface: 'rgb(var(--surface))',
        surface2: 'rgb(var(--surface-2))',
        navdark: 'rgb(var(--nav-dark))',
        border: 'rgb(var(--border))',
        ink: 'rgb(var(--ink))',
        'ink-dim': 'rgb(var(--ink-dim))',
        brand: {
          DEFAULT: 'rgb(var(--primary))', // #B3532D (rust)
          fg: 'rgb(var(--primary-fg))',
          accent: 'rgb(var(--accent))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
      },
    },
  },
  plugins: [],
};
