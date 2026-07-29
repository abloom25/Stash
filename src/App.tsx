/**
 * 路由（BrowserRouter 在 main.tsx）：
 * - `/`                长滚动主页（Hero + 板块们 + 页脚，板块由 config.ts SECTIONS 驱动）
 * - `/<section.id>/:workId`  详情覆盖层：Home 保持挂载，覆盖层按路径匹配叠加渲染，
 *                      包在 <AnimatePresence> 中以播放反向 FLIP / 淡出退场动画
 *                      （见 home.md §5：详情以路由级覆盖层叠在主页之上）。
 *                      板块路由不需要逐个声明——按 SECTIONS 逐条 matchPath 即可。
 * Layout 使用 <Outlet/>，因此这里必须使用嵌套 Route（勿混用 children 模式）。
 */
import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import WorkDetail from "./sections/WorkDetail";
import { SECTIONS } from "./config";

/** 主页 + 详情覆盖层叠加（Home 始终挂载，保证卡片↔封面 FLIP 两端同时在树中） */
function HomeWithOverlays() {
  const { pathname } = useLocation();
  return (
    <>
      <Home />
      <AnimatePresence>
        {SECTIONS.map((section) => {
          const match = matchPath(`/${section.id}/:workId`, pathname);
          return match ? <WorkDetail key={section.id} section={section} id={match.params.workId} /> : null;
        })}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 所有路径都渲染主页；详情路径由覆盖层按 matchPath 叠加 */}
        <Route index element={<HomeWithOverlays />} />
        <Route path="*" element={<HomeWithOverlays />} />
      </Route>
    </Routes>
  );
}
