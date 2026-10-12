/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D1726", // blueprint navy, page background
        panel: "#122036", // raised surfaces
        line: "#22344B", // drawing lines, borders
        fg: "#DDE6EF", // primary text
        muted: "#8EA1B6", // secondary text
        live: "#3CCFB4", // only for live / ongoing values
        amber: "#F2A93B", // primary action
      },
      fontFamily: {
        sans: ['"Archivo Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "76rem",
      },
    },
  },
  plugins: [],
};
