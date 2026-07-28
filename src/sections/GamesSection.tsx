/**
 * <GamesSection> — 板块 03 · 游戏 PLAY LOG（画廊墙简版，`/#games`）
 *
 * - SectionHeader：`03 — GAMES · PLAY LOG` + 中文标题 + 编辑手记（入场动画由共享组件实现）。
 * - 16:9 key-art 美术墙：6 张宽画幅裸卡（3/2/1 列响应式网格），卡片入场
 *   stagger 0.08s、`y:40→0`、`scale 0.96→1`，trigger ≈ top 75%。
 * - 主人反馈：去掉 HUD 圆点 / PLAY LOG 小标 / 扫描线 / 玻璃信息条 / 状态图标 / 高光扫过——
 *   key-art 直接陈列（16:9 裸图 + 圆角 + 柔和静影），下方仅有游戏名、
 *   开发商 · 年份与平台 / 类型 chips。
 * - hover（安静版）：整卡 translateY(-4px) + key-art scale(1.03) + 柔和阴影略加深。
 * - 点击：`useNavigate()` → `/games/${work.id}`；封面 layoutId=`cover-${work.id}`
 *   与 <GamesDetail> FLIP 对接（prefers-reduced-motion 时不挂 layoutId，退化为淡入淡出）。
 */
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import TagChip from "@/components/TagChip";
import { FLIP_SPRING } from "@/lib/motion";
import { gameWorks } from "@/data/games";
import type { GameWork } from "@/data/types";

const ACCENT = "#3CA68B"; // 青瓷绿（板块 03 accent）
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]; // easeOutExpo 感（design.md §6）
const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)"; // 任意值 ease 类与 tailwindcss-animate 冲突，改用内联

/** 网格入场：卡片 stagger 0.08s（design.md §6 入场范式） */
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/** 宽画幅裸 key-art 卡（陈列目录版：图内底部渐变遮罩 + 编号 + 游戏名） */
function KeyartCard({ work, no }: { work: GameWork; no: number }) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const open = () => navigate(`/games/${work.id}`);

  return (
    <motion.article
      variants={cardVariants}
      role="link"
      tabIndex={0}
      aria-label={`查看《${work.title}》详情`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className="group cursor-pointer rounded-[16px] transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-games/60 focus-visible:ring-offset-2"
      style={{ transitionDuration: "400ms", transitionTimingFunction: EASE_CSS }}
    >
      {/* 裸 key-art（16:9，FLIP 源元素=整个封面容器）：圆角 + 柔和静影，hover 阴影略加深 */}
      <motion.div
        layoutId={reducedMotion ? undefined : `cover-${work.id}`} // FLIP 源元素（reduced-motion 时退化为淡入淡出）
        transition={FLIP_SPRING}
        className="relative aspect-video overflow-hidden rounded-[16px] shadow-[0_12px_32px_rgba(35,32,43,0.10)] transition-shadow group-hover:shadow-[0_20px_48px_rgba(35,32,43,0.16)]"
        style={{ transitionDuration: "400ms", transitionTimingFunction: EASE_CSS }}
      >
        <img
          src={work.cover}
          alt={`《${work.title}》key art`}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
          style={{ transitionDuration: "400ms", transitionTimingFunction: EASE_CSS }}
        />
        {/* 底部渐变遮罩 + 陈列编号 + 游戏名 / 开发商 · 年份（叠在图内） */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-4 pt-14 transition-colors duration-500 group-hover:from-black/80">
          <p className="mb-1 font-serif text-[0.68rem] font-medium tracking-[0.3em] text-white/60">
            NO.{String(no).padStart(2, "0")}
          </p>
          <h3 className="font-serif text-[1.15rem] font-bold leading-snug text-white">{work.title}</h3>
          <p className="mt-1 text-[0.8rem] font-medium text-white/75">
            {work.creator} · {work.year}
          </p>
        </div>
      </motion.div>

      {/* 平台 + 类型 chips（图下方） */}
      <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
        {work.platforms.map((p) => (
          <TagChip key={p} label={p} accent={ACCENT} />
        ))}
        {work.genres.slice(0, 2).map((g) => (
          <TagChip key={g} label={g} />
        ))}
      </div>
    </motion.article>
  );
}

export default function GamesSection() {
  return (
    <section id="games" className="relative z-10 scroll-mt-16 py-32">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,64px)]">
        <SectionHeader
          index="02"
          eyebrow="GAMES · PLAY LOG"
          title="通关了还想重来的世界"
          note="游戏是唯一能让我合法“住进别处”的媒介。以下七款，按我心里的位置排成一列。" // TODO(主人): 占位编辑手记，可替换
          accent={ACCENT}
        />

        {/* key-art 陈列墙：桌面 4 列（整墙展示）/ 平板 2 列 / 手机 1 列 */}
        <motion.div
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-25% 0px" }} // ≈ top 75% 触发，只播一次
        >
          {gameWorks.map((work, i) => (
            <KeyartCard key={work.id} work={work} no={i + 1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
