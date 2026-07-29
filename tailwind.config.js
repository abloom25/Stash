/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ── 「私藏 · Stash」design tokens (design.md §3) ──────────────
      colors: {
        paper: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)", // 页面底色（CSS 变量驱动，支持暗色）
          2: "rgb(var(--paper-2) / <alpha-value>)", // 交替区块底
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)", // 主文字
          2: "rgb(var(--ink-2) / <alpha-value>)", // 次要文字 / 卡片元信息
          3: "rgb(var(--ink-3) / <alpha-value>)", // 装饰文字 / 编号
        },
        blob: {
          peach: "#FFD9C2",
          lavender: "#DCD3F7",
          mint: "#CBEBDC",
          sky: "#CBE0F6",
          rose: "#F7CCDA",
        },
        // 板块主题色（accent 仅作点缀 ≤10% 面积）
        film: { DEFAULT: "#E07A54", soft: "#FBEEE7" },
        games: { DEFAULT: "#8B7EC8", soft: "#EEEBF8" },
      },
      fontFamily: {
        // 中英混排自动落到 Fraunces/Noto Serif SC 与 Manrope/Noto Sans SC
        serif: ['"Fraunces"', '"Noto Serif SC"', "serif"],
        sans: ['"Manrope"', '"Noto Sans SC"', "sans-serif"],
      },
      borderRadius: {
        card: "24px", // 卡片
        cover: "18px", // 封面图
        score: "16px", // 评分块
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
}
