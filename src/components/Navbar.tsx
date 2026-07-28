/**
 * <GlassNavbar> — 固定顶部毛玻璃导航（design.md §7.1 / home.md §1）
 * - 64px 全宽浓玻璃条，下缘 1px 高光；滚动 >40px 阴影加深
 * - 左：monogram + 字标「私藏 · Stash」
 * - 右：音乐 / 影视 / 游戏锚点，当前板块下滑动 accent 药丸（layoutId="nav-pill"）
 * - Scroll-spy：IntersectionObserver（rootMargin -40% 0px -55%）
 * - 移动端：汉堡 → 全屏玻璃抽屉（大号衬线链接 stagger 入场）
 * - 详情覆盖层打开（/music/:id 等路由）时导航隐藏（y:-100%）
 */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SECTIONS } from "@/config";
import type { SectionId } from "@/data/types";
import { scrollToHash } from "@/lib/lenis";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
/** 药丸滑动 spring（≈300ms） */
const PILL_SPRING = { type: "spring", stiffness: 400, damping: 32 } as const;

export default function Navbar() {
  const [active, setActive] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 详情覆盖层路由（/music/:id、/film/:id、/games/:id）打开时隐藏导航
  const overlayOpen = /^\/(music|film|games)\/[^/]+/.test(location.pathname);

  // 滚动 >40px 加深阴影
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy：当前进入 -40% ~ -95% 视口带的板块高亮
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  // 锚点跳转：若不在主页先回主页再滚动
  const goTo = (hash: string) => {
    setDrawerOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      // 等待主页渲染后再滚动
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(hash)));
    } else {
      scrollToHash(hash);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={overlayOpen ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: overlayOpen ? 0 : 0.2 }}
        className={`fixed inset-x-0 top-0 z-40 h-16 glass-strong border-b border-white/60 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_12px_40px_rgba(35,32,43,0.14)]" : ""
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-[clamp(20px,5vw,64px)]">
          {/* 字标 */}
          <Link to="/" className="group flex items-center gap-2.5" aria-label="回到首页">
            <img src="assets/monogram.svg" alt="" className="h-6 w-6 transition-transform duration-300 group-hover:rotate-[15deg]" />
            <span className="font-serif text-[1.05rem] font-bold tracking-[0.04em] text-ink">
              私藏
              <span className="mx-1.5 text-ink-3">·</span>
              <span className="font-serif text-[0.85rem] font-medium italic tracking-[0.18em] text-ink-2">
                Stash
              </span>
            </span>
          </Link>

          {/* 桌面锚点链接 */}
          <div className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => {
              const isActive = active === s.id && !overlayOpen;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(s.hash)}
                  className="relative px-4 py-2 text-[0.9rem] font-semibold text-ink-2 transition-all duration-200 hover:-translate-y-px hover:text-ink"
                >
                  <span className="relative z-10">{s.zh}</span>
                  {/* 当前板块 accent 药丸（layoutId 滑动） */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={PILL_SPRING}
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: `${s.accent}1F`, border: `1px solid ${s.accent}40` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 移动端汉堡 */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="打开菜单"
          >
            <Menu size={20} />
          </button>
        </div>
      </motion.nav>

      {/* 移动端全屏玻璃抽屉 */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-scrim fixed inset-0 z-[60] flex flex-col"
          >
            <div className="flex h-16 items-center justify-between px-[clamp(20px,5vw,64px)]">
              <span className="font-serif text-[1.05rem] font-bold text-ink">私藏 · Stash</span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink"
                onClick={() => setDrawerOpen(false)}
                aria-label="关闭菜单"
              >
                <X size={20} />
              </button>
            </div>
            <motion.div
              className="flex flex-1 flex-col items-start justify-center gap-8 px-[clamp(20px,5vw,64px)] pb-24"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
              {SECTIONS.map((s) => (
                <motion.button
                  key={s.id}
                  type="button"
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
                  onClick={() => goTo(s.hash)}
                  className="flex items-baseline gap-4 text-left"
                >
                  <span className="font-serif text-[0.8rem] font-medium tracking-[0.35em]" style={{ color: s.accent }}>
                    {s.index}
                  </span>
                  <span className="font-serif text-[2.4rem] font-extrabold leading-none text-ink">{s.zh}</span>
                  <span className="eyebrow">{s.en}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
