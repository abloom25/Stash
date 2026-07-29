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
├── config.ts          站点集中配置（SITE 文案 / SECTIONS 板块 / 平台标签 / 标签图标）—— 改配置只动这里
├── data/              作品数据（films.ts / games.ts）+ 公共类型（types.ts：通用 Work / WorkExtra）
├── components/        共享组件（DetailOverlay / FullPageSection / SectionHeader / Footer 等）
├── sections/          通用板块与详情页（WorkSection / WorkDetail，由 SECTIONS 驱动，所有板块共用）
├── pages/Home.tsx     长滚动主页（Hero + 按 SECTIONS 渲染板块 + 过渡条）
├── lib/motion.ts      共享动画参数（FLIP_SPRING / overlayContentVariants）
├── lib/lenis.ts       Lenis 平滑滚动单例（getLenis / scrollToHash）
└── App.tsx            路由：所有路径渲染 Home，详情按 matchPath('/<section.id>/:workId') 叠加覆盖层
```

## 核心约定（改代码前必看）

### 配置驱动

- 站点级可选项**全部**在 `src/config.ts`：`SITE`（Hero 文案 / 分隔文本 `editorNotes` / 页脚 `footerSlogan` / `repoUrl`）/ `SECTIONS` / `PLATFORM_TAGS` / `TAG_ICONS`。新增可配置项时放进这个文件，不要散落到组件里。
- **板块完全由 `SECTIONS` 数组驱动**：增删板块、板块文案（`eyebrow` / `title` / `note`）、主题色、卡片样式（`cardStyle`）、卡片副标题（`cardSubtitle`）、详情 eyebrow（`detailEyebrow`）、详情信息栏格子（`infoCells`）都在条目里配。新增板块 = `src/data/` 加一个数据文件 + `SECTIONS` 加一条；主页板块、路由 `/<id>/:workId`、锚点 `#<id>`、详情覆盖层全部自动生成，不需要动组件。
- `SECTIONS` 条目的 `id` 是板块的锚：路由、锚点、FLIP 都由它派生，全站唯一，**已上线的 id 不要改**。
- 数据类型全板块通用：`Work`（板块特有字段全是可选）+ `WorkExtra`（扩展字段，按 id 关联，展示与否由 `infoCells` 决定）。
- 平台标签显示名与图标以 `PLATFORM_TAGS` 为唯一来源，卡片与详情页必须经 `platformTag()` 渲染，保持全站一致。
- 配置是静态 TS 模块，构建时嵌入产物，无运行时请求。

### 数据

- 作品内容在 `src/data/`，字段行内注释 + `TODO(主人)` 标记待替换项；数据 id 被路由与 FLIP `layoutId` 依赖，**不要随意改 id**。

### 动画

- 卡片 ↔ 详情封面 FLIP 依赖 `layoutId={cover-${work.id}}` + `FLIP_SPRING`，两端 layoutId 必须一致。
- FLIP 两端封面容器必须挂 `.flip-opaque`（`index.css`，`opacity: 1 !important`）：framer-motion 的 layoutId 共享转场默认做透明度交叉淡化（飞行封面淡出、卡片淡入），归位瞬间会「闪一下」；钉死后封面完整飞行、卡片始终在墙内，交接无闪烁。与之配套：墙内卡片的图内标题/渐变遮罩挂 `.card-caption`，详情覆盖层存在期间（`body:has(.detail-overlay)`）隐藏、归位后淡入，避免标题遮罩先于封面出现。
- 详情退场 = 入场的镜像（主人要求「怎么进就怎么出」）：内容块按反序 stagger 下移淡出（无模糊无侧移）、封面 FLIP 飞回、scrim 最后收尾淡出，时序在 `DetailOverlay.tsx` 与 `lib/motion.ts`，改动时保持镜像关系。
- 板块整页外壳用 `FullPageSection`（100dvh）；页面为正常自然滚动（Lenis 平滑），不要重新加回滚动吸附/滚轮劫持（主人已否决该交互）。
- `prefers-reduced-motion` 必须降级：不挂 layoutId、不做视差位移、不启用 Lenis。
- **不使用 `React.StrictMode`**（会导致 GSAP/动画 effect 双跑，见 `main.tsx`）。

### 样式

- Tailwind CSS + 自定义组件；主题用 CSS 变量（`--paper` / `--ink` 等，见 `index.css`），亮暗双主题。
- 详情覆盖层内的 accent 文字/图标色一律用 `var(--accent-text)`（由 `DetailOverlay` 按作品 `palette` 注入，暗色模式自动提亮，见 `index.css`），不要直接把 palette hex 当文字色。
- 路径别名 `@/` → `src/`，优先于深层相对路径。

## 红线

- **绝不擅自执行 git 变更操作**：`git commit` / `push` / `reset` / `rebase` / `force-push` 等，每次都必须先获得用户当场明确许可；用户之前的授权不自动延续到下一次操作。
- **绝不绕过提交签名**：本仓库要求 GPG/SSH 签名提交（`commit.gpgsign=true`）。签名失败（如 1Password agent 未运行）时，停下来报告用户，等其解锁后重试；**禁止**用 `-c commit.gpgsign=false`、`--no-gpg-sign` 或改动 git 配置等任何方式绕过。
- 不要引入新的包管理器文件（只认 `pnpm-lock.yaml`）。
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
