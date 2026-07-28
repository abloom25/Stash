# AGENTS.md — AI 协作者指南

本文件面向在本仓库工作的 AI agent / 协作者，说明项目结构、约定与红线。**改动前请先读完本文件。**

## 项目概览

「私藏 · Stash」— 个人收藏精选集单页应用（Vite + React 19 + TypeScript）。
长滚动主页 + 路由级详情覆盖层，纯静态构建产物（`dist/`），部署到 GitHub Pages / Vercel / Cloudflare Pages。

## 常用命令

```bash
pnpm install     # 安装依赖（包管理只用 pnpm，不要生成 package-lock.json）
pnpm dev         # 本地开发（端口 3000）
pnpm lint        # ESLint —— 提交前必须通过
pnpm build       # tsc 类型检查 + 生产构建 —— 提交前必须通过
```

Node.js 要求 22+（pnpm 11 需要）。CI 对每个 PR / push 跑 `lint` + `build`，红了不能合并。

## 目录与职责

```
src/
├── config.ts          站点集中配置（文案/板块/卡片样式/标签图标/社交链接）—— 改配置只动这里
├── data/              作品数据（films.ts / games.ts）+ 公共类型（types.ts）
├── components/        共享组件；ui/ 为 shadcn 组件（尽量不改，见下文「红线」）
├── sections/          板块（FilmSection / GamesSection）与详情页（FilmDetail / GamesDetail）
├── pages/Home.tsx     长滚动主页（Hero + 板块 + 过渡条）
├── lib/motion.ts      共享动画参数（FLIP_SPRING / overlayContentVariants）
├── lib/lenis.ts       Lenis 平滑滚动单例（getLenis / scrollToHash）
└── App.tsx            路由：所有路径渲染 Home，详情按 useMatch 叠加覆盖层
```

## 核心约定（改代码前必看）

### 配置驱动

- 站点级可选项**全部**在 `src/config.ts`：`SITE`（含分隔文本 `editorNotes`、页脚 `footerSlogan`）/ `SECTIONS` / `CARD_STYLES` / `PLATFORM_TAGS` / `TAG_ICONS`。新增可配置项时放进这个文件，不要散落到组件里。
- 平台标签显示名与图标以 `PLATFORM_TAGS` 为唯一来源，卡片与详情页必须经 `platformTag()` 渲染，保持全站一致。
- 配置是静态 TS 模块，构建时嵌入产物，无运行时请求。

### 数据

- 作品内容在 `src/data/`，字段行内注释 + `TODO(主人)` 标记待替换项；数据 id 被路由与 FLIP `layoutId` 依赖，**不要随意改 id**。

### 动画

- 卡片 ↔ 详情封面 FLIP 依赖 `layoutId={cover-${work.id}}` + `FLIP_SPRING`，两端 layoutId 必须一致。
- 详情退场：文字模糊+淡出、scrim 淡出、封面飞行**同步**进行（时序在 `DetailOverlay.tsx` 与 `lib/motion.ts`），改动时保持三者同窗口，不要恢复分先后退场。
- 板块整页外壳用 `FullPageSection`（100dvh）；页面为正常自然滚动（Lenis 平滑），不要重新加回滚动吸附/滚轮劫持（主人已否决该交互）。
- `prefers-reduced-motion` 必须降级：不挂 layoutId、不做视差位移、不启用 Lenis。
- **不使用 `React.StrictMode`**（会导致 GSAP/动画 effect 双跑，见 `main.tsx`）。

### 样式

- Tailwind CSS + shadcn/ui；主题用 CSS 变量（`--paper` / `--ink` 等，见 `index.css`），亮暗双主题。
- 路径别名 `@/` → `src/`，优先于深层相对路径。

## 红线

- **绝不擅自执行 git 变更操作**：`git commit` / `push` / `reset` / `rebase` / `force-push` 等，每次都必须先获得用户当场明确许可；用户之前的授权不自动延续到下一次操作。
- **绝不绕过提交签名**：本仓库要求 GPG/SSH 签名提交（`commit.gpgsign=true`）。签名失败（如 1Password agent 未运行）时，停下来报告用户，等其解锁后重试；**禁止**用 `-c commit.gpgsign=false`、`--no-gpg-sign` 或改动 git 配置等任何方式绕过。
- 不要引入新的包管理器文件（只认 `pnpm-lock.yaml`）。
- 不要给 `src/components/ui/**` 加业务逻辑；其非组件导出是 shadcn 官方约定，ESLint 已对该目录豁免 `react-refresh/only-export-components`。
- 不要绕过 ESLint 报错硬提交；确需豁免时用带理由的单行 `eslint-disable-next-line`。

## Git 规范

- 分支：`feat/` `fix/` `docs/` `refactor/` `chore/` + 小写连字符描述。
- 提交：Conventional Commits（`feat: ...` / `fix: ...`），原子化，详见 [CONTRIBUTING.md](CONTRIBUTING.md)。
- PR 走模板，CI 绿 + Review 后 Squash 合并。

## 部署

- GitHub Pages：`.github/workflows/deploy.yml` 推 `main` 自动部署（已含 SPA 404 兜底）。
- Vercel：`vercel.json`；Cloudflare Pages：`public/_redirects`。三者都是纯静态 + SPA 回退。
- **子路径部署约定**：站点可部署在域名根（Vercel/CF）或 `/Stash/` 子路径（GitHub Pages）。
  `index.html` 头部内联脚本按 URL 注入 `<base>`（`/Stash/` 或 `/`），`main.tsx` 的
  `BrowserRouter basename` 用同一判断——两者必须保持一致。代码中的资源引用
  （封面 / monogram 等）一律用**相对路径** `assets/...`，不要写 `/assets/...`。
