/**
 * <FullPageSection> — 整页板块外壳：
 * - min-h-100dvh：每个板块都拥有完整一屏的展示空间，内容垂直居中；
 * - 板块之间可插入「编辑手记」分隔文本（src/config.ts 的 SITE.editorNotes）。
 */
import type { ReactNode } from "react";

interface FullPageSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function FullPageSection({ id, children, className = "" }: FullPageSectionProps) {
  return (
    <section id={id} className={`relative z-10 scroll-mt-16 ${className}`}>
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1280px] flex-col justify-center px-[clamp(20px,5vw,64px)] py-24">
        {children}
      </div>
    </section>
  );
}
