/**
 * 路由（BrowserRouter 在 main.tsx）：
 * - `/`                长滚动主页（Hero + 三板块 + 页脚）
 * - `/film/:id`、`/games/:id`  详情覆盖层：Home 保持挂载，覆盖层按 useMatch 叠加渲染，
 *                      包在 <AnimatePresence> 中以播放反向 FLIP / 淡出退场动画
 *                      （见 home.md §5：详情以路由级覆盖层叠在主页之上）。
 * Layout 使用 <Outlet/>，因此这里必须使用嵌套 Route（勿混用 children 模式）。
 */
import { Routes, Route, useMatch } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FilmDetail from "./sections/FilmDetail";
import GamesDetail from "./sections/GamesDetail";

/** 主页 + 详情覆盖层叠加（Home 始终挂载，保证卡片↔封面 FLIP 两端同时在树中） */
function HomeWithOverlays() {
  const filmMatch = useMatch("/film/:id");
  const gamesMatch = useMatch("/games/:id");
  return (
    <>
      <Home />
      <AnimatePresence>
        {filmMatch && <FilmDetail key="film-detail" id={filmMatch.params.id} />}
        {gamesMatch && <GamesDetail key="games-detail" id={gamesMatch.params.id} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 所有路径都渲染主页；详情路径由覆盖层按 useMatch 叠加 */}
        <Route index element={<HomeWithOverlays />} />
        <Route path="film/:id" element={<HomeWithOverlays />} />
        <Route path="games/:id" element={<HomeWithOverlays />} />
        <Route path="*" element={<HomeWithOverlays />} />
      </Route>
    </Routes>
  );
}
