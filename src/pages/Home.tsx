/**
 * Home — 整站长页：Hero → 板块 影视 → 编辑手记过渡条 → 板块 游戏。
 * 详情覆盖层（/film/:id、/games/:id）以路由方式叠加在本页之上（见 App.tsx）。
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import FilmSection from "@/sections/FilmSection";
import GamesSection from "@/sections/GamesSection";
import { scrollToHash } from "@/lib/lenis";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** 板块间「编辑手记」过渡条（home.md §3） */
function EditorNote({ children }: { children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }} // ≈ top 85%
      transition={{ duration: 0.4, ease: EASE }}
      className="relative z-10 border-y hairline py-8"
    >
      <p className="text-center font-serif text-[1.05rem] font-medium italic text-ink-2">{children}</p>
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

  return (
    <>
      <Hero />
      {/* 板块 影视 */}
      <FilmSection />
      <EditorNote>轮到双手上场。</EditorNote>
      {/* 板块 游戏 */}
      <GamesSection />
    </>
  );
}
