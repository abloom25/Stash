import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

// 首次加载始终停在页面顶部：
// 1) 清掉 URL 上的 #games/#film hash——否则浏览器会在 React 插入对应板块后
//    执行原生锚点跳转，一进来就落到页面中间（此处理必须先于 render）；
// 2) 接管滚动恢复——刷新时浏览器不再自动回到上次的滚动位置。
if (window.location.hash) {
  window.history.replaceState(null, "", window.location.pathname);
}
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// 注：不使用 <React.StrictMode>（会导致 GSAP/动画 effect 双跑）
// basename 跟随部署位置：GitHub Pages 项目页在 /Stash/ 下，其余平台在域名根
// （与 index.html 的 <base> 注入一致，保证深链接路由匹配与站内跳转正确）
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={window.location.pathname.indexOf("/Stash") === 0 ? "/Stash" : "/"}>
    <App />
  </BrowserRouter>
);
