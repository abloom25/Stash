/**
 * <Layout> — 共享布局（嵌套路由模式：<Outlet/>，App.tsx 必须使用嵌套 <Route>）。
 * 组成：全局背景层（光斑 + 噪点）→ 内容槽（页脚由 Home 渲染）。
 * Lenis 平滑滚动在此初始化（lerp 0.09，reduced-motion 时降级为原生）。
 *
 * 首页 Hero 为全出血设计故不加全局顶部 padding；
 * 各板块的纵向节奏由 section padding 负责（design.md §5）。
 */
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Background from "./Background";
import { initLenis, destroyLenis } from "@/lib/lenis";

export default function Layout() {
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  return (
    <div className="relative min-h-[100dvh]">
      <Background />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
