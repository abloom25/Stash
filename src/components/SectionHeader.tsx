/**
 * <SectionHeader> — 板块头部（design.md §7.2）
 * 结构：`01 — MUSIC`（accent 编号 + eyebrow 英文）→ 中文大标题 → 编辑手记 → hairline。
 * 入场范式（§6）：eyebrow → 标题上移 30px 淡入，进入视口 75% 触发，只播一次。
 */
import { motion } from "framer-motion";

interface SectionHeaderProps {
  index: string; // '01'
  eyebrow: string; // 'MUSIC · ON REPEAT'
  title: string; // 中文大标题
  note: string; // 一句编辑手记（1–2 行）
  accent: string; // 板块主题色
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function SectionHeader({ index, eyebrow, title, note, accent }: SectionHeaderProps) {
  return (
    <motion.header
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-25% 0px" }} // ≈ top 75%
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* 编号 + eyebrow */}
      <motion.p
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
        className="flex items-baseline gap-4"
      >
        <span className="font-serif text-[0.85rem] font-medium tracking-[0.35em]" style={{ color: accent }}>
          {index}
        </span>
        <span className="eyebrow" style={{ color: accent }}>
          — {eyebrow}
        </span>
      </motion.p>

      {/* 中文大标题 */}
      <motion.h2
        variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
        className="mt-5 font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold leading-[1.15] text-ink"
      >
        {title}
      </motion.h2>

      {/* 编辑手记 */}
      <motion.p
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
        className="mt-5 max-w-[560px] text-[0.95rem] leading-[1.9] text-ink-2"
      >
        {note}
      </motion.p>

      {/* hairline */}
      <motion.hr
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}
        className="mt-12 border-t hairline"
      />
    </motion.header>
  );
}
