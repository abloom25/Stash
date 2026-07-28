/**
 * 全局固定背景层（home.md §0）：
 * --paper 纯色底 → 5 个弥散光斑（纯 CSS 漂移，45–70s，相位错开）→ grain 噪点。
 * 滚动到不同板块时光斑不换，靠卡片 accent 色区分板块气质。
 * 常驻动画隔离在此微组件中并 memo，避免父级重渲染重置动画。
 */
import { memo } from "react";

const BLOBS = [
  // [色, left, top, 尺寸, 动画, 时长, 延迟]
  { color: "blob-peach", left: "-10%", top: "-15%", size: "55vw", anim: "blob-drift-1", dur: "52s", delay: "-10s" },
  { color: "blob-lavender", left: "70%", top: "-5%", size: "50vw", anim: "blob-drift-2", dur: "60s", delay: "-25s" },
  { color: "blob-mint", left: "-15%", top: "45%", size: "45vw", anim: "blob-drift-3", dur: "66s", delay: "-40s" },
  { color: "blob-sky", left: "75%", top: "60%", size: "48vw", anim: "blob-drift-4", dur: "45s", delay: "-15s" },
  { color: "blob-rose", left: "30%", top: "95%", size: "55vw", anim: "blob-drift-5", dur: "70s", delay: "-30s" },
] as const;

function Background() {
  return (
    <>
      {/* 光斑层：z-0，页面内容需置于 relative z-10 之上 */}
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {BLOBS.map((b) => (
          <div
            key={b.color}
            className={`blob ${b.color}`}
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              animation: `${b.anim} ${b.dur} ease-in-out ${b.delay} infinite`,
            }}
          />
        ))}
      </div>
      {/* 噪点纸感层 */}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  );
}

export default memo(Background);
