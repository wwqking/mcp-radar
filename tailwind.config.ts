import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 品牌墨绿（设计文档 §0）
        brand: {
          DEFAULT: "#0d6b50",
          50: "#eef7f3",
          100: "#d7ece2",
          200: "#b0d9c7",
          300: "#7fbfa4",
          400: "#4da07f",
          500: "#268264",
          600: "#0d6b50",
          700: "#0b5742",
          800: "#094636",
          900: "#073a2d",
          950: "#03211a",
        },
        // 暖灰底
        canvas: {
          light: "#f4f5f2",
          dark: "#0e1210",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      maxWidth: {
        // 站点内容区最大宽度。站点 min-width 为 1400px，内容区留出左右边距，取 82.5rem(1320px)。
        site: "82.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
