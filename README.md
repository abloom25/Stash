# Stash

基于 Vite + React 19 + TypeScript 的前端项目，UI 使用 Tailwind CSS + shadcn/ui。

## 技术栈

- **构建**：Vite 7
- **框架**：React 19 + TypeScript + react-router 7
- **样式**：Tailwind CSS 3 + shadcn/ui（Radix UI）
- **动画**：GSAP、framer-motion、lenis
- **包管理**：pnpm

## 快速开始

要求 Node.js 22+ 和 pnpm（可用 `corepack enable` 开启）。

```bash
pnpm install     # 安装依赖
pnpm dev         # 本地开发（http://localhost:3000）
pnpm lint        # ESLint 检查
pnpm build       # 类型检查 + 生产构建（输出 dist/）
pnpm preview     # 本地预览构建产物
```

## 目录结构

```
src/
├── components/    可复用组件（components/ui 为 shadcn 组件）
├── sections/      页面区块
├── pages/         路由页面
├── hooks/         自定义 hooks
├── lib/           工具函数
├── data/          静态数据
├── App.tsx        根组件（路由定义）
└── main.tsx       入口
```

路径别名 `@/` 指向 `src/`。

## 部署

构建产物为纯静态文件（`dist/`），三个平台的部署配置均已内置，任选其一即可。

### Vercel

已包含 `vercel.json`（Vite 构建 + SPA 回退）。在 Vercel 导入仓库即可，Vercel 检测到 `pnpm-lock.yaml` 会自动使用 pnpm，无需额外配置；或使用 CLI：

```bash
pnpm dlx vercel --prod
```

### Cloudflare Pages

已包含 `public/_redirects`（SPA 回退）。在 Cloudflare Pages 连接仓库，配置：

- 构建命令：`pnpm build`
- 输出目录：`dist`

Cloudflare 检测到 `pnpm-lock.yaml` 会自动使用 pnpm 安装依赖。

### GitHub Pages

已包含 `.github/workflows/deploy.yml`，推送到 `main` 自动构建部署。首次使用需在仓库 **Settings → Pages** 中将 Source 设为 **GitHub Actions**。

也可手动触发：Actions → Deploy to GitHub Pages → Run workflow。

## 贡献

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)（分支 / 提交 / PR 规范）。
