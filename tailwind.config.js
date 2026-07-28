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
        music: { DEFAULT: "#7B6BD6", soft: "#EFEBFB" },
        film: { DEFAULT: "#E07A54", soft: "#FBEEE7" },
        games: { DEFAULT: "#3CA68B", soft: "#E7F4EF" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
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
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}