# 贡献指南

感谢参与本项目！请遵循以下规范，保证协作顺畅。

## 开发环境

- Node.js 22
- pnpm（可用 `corepack enable` 开启，版本见 `package.json` 的 `packageManager` 字段）

```bash
pnpm install     # 安装依赖
pnpm dev         # 本地开发（http://localhost:3000）
pnpm lint        # ESLint 检查
pnpm build       # 类型检查 + 生产构建
pnpm preview     # 本地预览构建产物
```

## 分支规范

- `main` 为主干分支，始终保持可构建、可发布状态
- 功能开发从 `main` 切出工作分支，命名格式：

| 前缀        | 用途               | 示例                  |
| ----------- | ------------------ | --------------------- |
| `feat/`     | 新功能             | `feat/dark-mode`      |
| `fix/`      | Bug 修复           | `fix/navbar-overlap`  |
| `docs/`     | 文档变更           | `docs/update-readme`  |
| `refactor/` | 重构               | `refactor/hooks`      |
| `chore/`    | 构建、依赖、工具链 | `chore/bump-deps`     |

- 分支名使用小写英文 + 连字符，简短描述变更内容

## 提交规范

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
<type>(<scope>): <subject>
```

- `type`：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `chore` / `ci`
- `scope`：可选，影响的模块，如 `navbar`、`hooks`
- `subject`：简短描述，祈使句，结尾不加句号

示例：

```
feat(navbar): 添加移动端折叠菜单
fix: 修复深色模式下图标颜色错误
chore: 升级 vite 到 7.x
```

一次提交只做一件事，保持提交原子化。

## PR 流程

1. Fork / 从 `main` 切出工作分支
2. 开发并提交，确保 `pnpm lint` 与 `pnpm build` 本地通过
3. 推送分支并创建 Pull Request，**填写 PR 模板中的所有小节**
4. CI（lint + build）必须通过才能合并
5. 至少一名维护者 Review 通过后，使用 **Squash and merge** 合并
6. 合并后删除工作分支

### PR 要求

- 一个 PR 只解决一件事，避免大而杂的变更
- 标题遵循提交规范，如 `feat: 添加搜索功能`
- 界面变更必须附截图或录屏
- 不要夹带与主题无关的重构 / 格式化

## 代码规范

- 使用 TypeScript，禁止新增 `any`（确有必要时在 PR 中说明）
- 组件、hooks、工具函数放在 `src/components` / `src/hooks` / `src/lib`
- 路径别名 `@/` 指向 `src/`，优先使用别名而非深层相对路径
- 样式使用 Tailwind CSS，UI 组件基于 shadcn（`src/components/ui`）
- 不使用 `React.StrictMode`（会导致 GSAP/动画 effect 双跑，见 `src/main.tsx`）
