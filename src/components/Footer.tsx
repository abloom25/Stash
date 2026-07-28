/**
 * <Footer> — 页脚（design.md §7.8 / home.md §6）
 * --paper-2 底 + 顶部 hairline；三栏：左字标 + 收尾语；中三板块锚点；
 * 右「由热爱装订 · Bound with love, 2025」+ 占位社交图标（圆形线框）。
 * 底部一行极小字占位声明。入视口三栏 stagger 上移淡入（top 90%）。
 * 彩蛋：hover monogram 旋转 15°。
 */
import { motion } from "framer-motion";
import { Headphones, Clapperboard, Gamepad2 } from "lucide-react";
import { SECTIONS } from "@/data/types";
import { scrollToHash } from "@/lib/lenis";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// 占位社交图标（豆瓣 / Spotify / Steam 风格圆形线框）—— TODO(主人): 替换为真实链接
const SOCIALS = [
  { label: "豆瓣（占位）", Icon: Clapperboard },
  { label: "Spotify（占位）", Icon: Headphones },
  { label: "Steam（占位）", Icon: Gamepad2 },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-0 border-t hairline bg-paper-2/80">
      <motion.div
        className="mx-auto grid max-w-[1280px] gap-12 px-[clamp(20px,5vw,64px)] py-20 md:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }} // ≈ top 90%
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* 左：字标 + 收尾语 */}
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}>
          <div className="group flex items-center gap-2.5">
            <img
              src="/assets/monogram.svg"
              alt=""
              className="h-7 w-7 transition-transform duration-300 group-hover:rotate-[15deg]"
            />
            <span className="font-serif text-[1.05rem] font-bold text-ink">
              私藏 <span className="text-ink-3">·</span>{" "}
              <span className="text-[0.85rem] font-medium italic tracking-[0.18em] text-ink-2">Stash</span>
            </span>
          </div>
          <p className="mt-5 font-serif text-[1.3rem] font-medium leading-[1.7] text-ink">
            谢谢你翻到这里。
            <br />
            下一页，由你来写。
          </p>
        </motion.div>

        {/* 中：三板块锚点 */}
        <motion.nav
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
          aria-label="板块导航"
        >
          <p className="eyebrow">目录 · CONTENTS</p>
          <ul className="mt-5 space-y-3">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollToHash(s.hash)}
                  className="group flex items-baseline gap-3 text-[0.95rem] font-medium text-ink-2 transition-colors hover:text-ink"
                >
                  <span className="font-serif text-[0.75rem] tracking-[0.3em]" style={{ color: s.accent }}>
                    {s.index}
                  </span>
                  {s.zh}
                  <span className="eyebrow normal-case tracking-[0.18em]">{s.en}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>

        {/* 右：装订签名 + 占位社交图标 */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
          className="md:text-right"
        >
          <p className="text-[0.85rem] leading-[1.9] text-ink-2">
            由热爱装订
            <br />
            <span className="font-serif italic">Bound with love, 2025</span>
          </p>
          <div className="mt-6 flex gap-3 md:justify-end">
            {SOCIALS.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                title={label}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/30 hover:text-ink"
              >
                <Icon size={16} strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* 底部占位声明 */}
      <div className="border-t hairline">
        <p className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,64px)] py-5 text-[0.68rem] tracking-[0.08em] text-ink-3">
          占位内容 · 封面与评语均为演示数据，待主人替换
        </p>
      </div>
    </footer>
  );
}
