/**
 * Home — 整站长页：Hero →（分隔文本）→ 板块们（按 src/config.ts 的 SECTIONS 顺序，
 * 每个板块前各一条分隔文本）→（分隔文本）→ 细页脚。板块数量与顺序完全由配置决定。
 * 每个整页板块 min-h-100dvh（FullPageSection），正常自然滚动。
 * 分隔文本按间隔配置（src/config.ts 的 SITE.editorNotes，置空则不显示）。
 * 详情覆盖层（/<section.id>/:workId）以路由方式叠加在本页之上（见 App.tsx）。
 */
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import WorkSection from "@/sections/WorkSection";
import Footer from "@/components/Footer";
import { scrollToHash } from "@/lib/lenis";
import { SECTIONS, SITE } from "@/config";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** 板块间「编辑手记」分隔条（text 为空时不渲染） */
function EditorNote({ text }: { text: string }) {
  if (!text) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }} // ≈ top 85%
      transition={{ duration: 0.4, ease: EASE }}
      className="relative z-10 border-y hairline py-8"
    >
      <p className="text-center font-serif text-[1.05rem] font-medium italic text-ink-2">{text}</p>
    </motion.div>
  );
}

export default function Home() {
  const location = useLocation();
  const mounted = useRef(false);

  // 会话内 hash 变化（关闭详情 / 导航点击）：Lenis 接管后需手动补一次锚点滚动。
  // 首次加载的 hash 处理在 main.tsx（render 前清 hash + 停顶部），这里跳过首帧
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (location.hash) {
      const t = setTimeout(() => scrollToHash(location.hash), 300);
      return () => clearTimeout(t);
    }
  }, [location.hash]);

  const notes = SITE.editorNotes;

  return (
    <>
      <Hero />
      {SECTIONS.flatMap((section, i) => [
        // 不用 <Fragment key>：dev 插件 plugin-inspect-react-code 会注入额外 prop，Fragment 拒收报错
        <EditorNote key={`note-${section.id}`} text={notes[i] ?? ""} />,
        <WorkSection key={section.id} section={section} />,
      ])}
      <EditorNote text={notes[SECTIONS.length] ?? ""} />
      <Footer />
    </>
  );
}
