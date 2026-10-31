/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Matching the original Spendly colour palette from style.css
      colors: {
        ink: "#0f0f0f",
        "ink-soft": "#2d2d2d",
        "ink-muted": "#6b6b6b",
        "ink-faint": "#a0a0a0",
        paper: "#f7f6f3",
        "paper-warm": "#f0ede6",
        "paper-card": "#ffffff",
        accent: "#1a472a",
        "accent-light": "#e8f0eb",
        "accent-2": "#c17f24",
        "accent-2-light": "#fdf3e3",
        danger: "#c0392b",
        "danger-light": "#fdecea",
        border: "#e4e1da",
        "border-soft": "#eeebe4",
      },
      fontFamily: {
        display: ["DM Serif Display", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
        auth: "440px",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
      },
    },
  },
  plugins: [],
};

