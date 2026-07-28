<div align="center">

# 私藏 · Stash

**把热爱的事物装订成册 —— 个人收藏精选集网站**

[![CI](https://github.com/abloom25/Stash/actions/workflows/ci.yml/badge.svg)](https://github.com/abloom25/Stash/actions/workflows/ci.yml)
[![Deploy](https://github.com/abloom25/Stash/actions/workflows/deploy.yml/badge.svg)](https://github.com/abloom25/Stash/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[在线预览](http://collection.abloom.site/) · [配置指南](#-配置) · [贡献指南](CONTRIBUTING.md)

</div>

---

## ✨ 特性

- **FLIP 封面转场** — 点击卡片，封面以弹簧动画「飞」入详情页，返回时同步飞回原卡位（framer-motion `layoutId`）
- **整页翻页滚动** — 每个板块独占一屏（100dvh），滚动时逐屏吸附翻页（Lenis Snap），板块间可配置分隔文本
- **同步退场动画** — 关闭详情时，文字模糊 + 淡出、背景模糊淡出与封面飞行三者同步进行，无生硬跳变
- **配置驱动** — 站点文案、板块、卡片样式、平台标签（含图标）、社交链接全部集中在 [`src/config.ts`](src/config.ts)，构建时随编译嵌入页面
- **亮 / 暗双主题** — 纸感亮色 + 暗夜模式，封面浸染式背景自适应
- **丝滑滚动** — Lenis 平滑滚动 + GSAP ScrollTrigger 首屏视差
- **无障碍** — `prefers-reduced-motion` 全局降级、键盘可达、语义化标签

## 🚀 快速开始

要求 Node.js 22+ 与 pnpm（`corepack enable` 即可启用）。

```bash
pnpm install     # 安装依赖
pnpm dev         # 本地开发（http://localhost:3000）
pnpm lint        # ESLint 检查
pnpm build       # 类型检查 + 生产构建（输出 dist/）
pnpm preview     # 本地预览构建产物
```

## ⚙️ 配置

所有可自定义项集中在 **`src/config.ts`** 一个文件，改完重新构建即生效：

| 配置项 | 说明 |
| --- | --- |
| `SITE` | 站点名、Hero 签名句、板块间分隔文本（`editorNotes`，按间隔配置，置空不显示）、细页脚 slogan |
| `SECTIONS` | 板块元信息（导航 / 页脚 / 路由 / 主题色） |
| `CARD_STYLES` | 每个板块的卡片样式：竖版 `vertical`（2:3 海报）/ 横版 `horizontal`（16:9 key-art），以及封面下方标题行、标签 chips 的显隐开关 |
| `PLATFORM_TAGS` | 平台标签的显示名与图标（如 `PC` → `Monitor` 图标），卡片与详情页统一渲染 |
| `TAG_ICONS` | 类型标签的可选图标映射 |

页脚为底部一条细栏：左侧 `SITE.footerSlogan`，右侧硬编码的 GitHub 仓库图标链接。

作品内容数据在 `src/data/`（`films.ts` / `games.ts`），每个字段带行内注释与 `TODO(主人)` 标记。

## 🗂 项目结构

```
src/
├── config.ts          ★ 站点集中配置（文案 / 板块 / 卡片样式 / 标签图标 / 社交链接）
├── data/              作品内容数据（films / games）与公共类型
├── components/        共享组件（DetailOverlay / FullPageSection / WorkCard / ui）
├── sections/          板块与详情页（FilmSection / GamesSection / FilmDetail / GamesDetail）
├── pages/             路由页面（Home 长滚动页）
├── hooks/             自定义 hooks
├── lib/               工具（lenis 平滑滚动 / 主题 / 共享动画参数）
├── App.tsx            路由（详情以路由级覆盖层叠加在主页之上）
└── main.tsx           入口
```

路径别名 `@/` 指向 `src/`。

## 📦 部署

构建产物为纯静态文件（`dist/`），三个平台的配置均已内置，任选其一：

| 平台 | 配置文件 | 说明 |
| --- | --- | --- |
| **GitHub Pages** | `.github/workflows/deploy.yml` | 推送 `main` 自动部署，含 SPA 404 兜底；Pages Source 需设为 GitHub Actions |
| **Vercel** | `vercel.json` | 导入仓库即用（自动识别 pnpm + SPA 回退） |
| **Cloudflare Pages** | `public/_redirects` | 构建命令 `pnpm build`，输出目录 `dist` |

## 🛠 技术栈

- **构建**：Vite 7 + TypeScript 5.9
- **框架**：React 19 + react-router 7
- **样式**：Tailwind CSS 3 + shadcn/ui（Radix UI）
- **动画**：framer-motion（FLIP / 滚动视差）、GSAP ScrollTrigger（首屏）、Lenis（平滑滚动）
- **CI/CD**：GitHub Actions（lint + 类型检查 + 构建 + Pages 部署）

## 🤝 贡献

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)（分支 / Conventional Commits / PR 规范）。
AI 协作者请先阅读 [AGENTS.md](AGENTS.md)。
