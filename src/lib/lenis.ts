/**
 * Lenis 平滑滚动单例（design.md §6：lerp 0.09）。
 * 在 Layout 挂载时初始化；导航 / Hero 药丸通过 scrollToHash 锚点跳转。
 * prefers-reduced-motion 时退化为原生瞬时跳转。
 */
import Lenis from "lenis";

let lenis: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (lenis) return lenis;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null; // 降级：使用原生滚动
  lenis = new Lenis({ lerp: 0.09 });
  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

/** 平滑滚动到锚点板块（offset -80px，避开固定导航） */
export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.2 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
