/**
 * Home — 整站长页：Hero →（分隔文本）→ 板块 影视 →（分隔文本）→ 板块 游戏
 * →（分隔文本）→ 细页脚。每个整页板块 min-h-100dvh（FullPageSection），正常自然滚动。
 * 分隔文本按间隔配置（src/config.ts 的 SITE.editorNotes，置空则不显示）。
 * 详情覆盖层（/film/:id、/games/:id）以路由方式叠加在本页之上（见 App.tsx）。
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import FilmSection from "@/sections/FilmSection";
import GamesSection from "@/sections/GamesSection";
import Footer from "@/components/Footer";
import { scrollToHash } from "@/lib/lenis";
import { SITE } from "@/config";

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

  // 深链接 /#music 等：Lenis 接管后需手动补一次锚点滚动
  useEffect(() => {
    if (location.hash) {
      const t = setTimeout(() => scrollToHash(location.hash), 300);
      return () => clearTimeout(t);
    }
  }, [location.hash]);

  const notes = SITE.editorNotes;

  return (
    <>
      <Hero />
      <EditorNote text={notes[0] ?? ""} />
      <FilmSection />
      <EditorNote text={notes[1] ?? ""} />
      <GamesSection />
      <EditorNote text={notes[2] ?? ""} />
      <Footer />
    </>
  );
}
