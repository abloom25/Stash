/**
 * <GamesSection> — 板块 03 · 游戏 PLAY LOG（画廊墙简版，`/#games`）
 *
 * key-art 直接陈列（裸封面 + 圆角 + 柔和静影），图内底部渐变遮罩 + 编号 + 游戏名。
 * 卡片画幅（横版 16:9 / 竖版 2:3）与封面下方信息（标题行 / 平台 · 类型 chips）由
 * src/config.ts 的 CARD_STYLES.games 控制；整页展示空间与「翻页加速」滚动
 * 由 <FullPageSection> 提供。
 *
 * hover（安静版）：整卡 translateY(-4px) + key-art scale(1.03) + 柔和阴影略加深。
 * 点击：`useNavigate()` → `/games/${work.id}`；封面 layoutId=`cover-${work.id}`
 * 与 <GamesDetail> FLIP 对接（prefers-reduced-motion 时不挂 layoutId，退化为淡入淡出）。
 */
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import FullPageSection from "@/components/FullPageSection";
import TagChip from "@/components/TagChip";
import { FLIP_SPRING } from "@/lib/motion";
import { gameWorks } from "@/data/games";
import type { GameWork } from "@/data/types";
import { CARD_STYLES, platformTag, SECTIONS, TAG_ICONS } from "@/config";

const ACCENT = SECTIONS.find((s) => s.id === "games")!.accent; // 板块 03 accent（src/config.ts SECTIONS，紫）
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]; // easeOutExpo 感（design.md §6）
const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)"; // 任意值 ease 类与 tailwindcss-animate 冲突，改用内联

/** 卡片样式（src/config.ts CARD_STYLES.games）：画幅决定封面比例与网格列数 */
const STYLE = CARD_STYLES.games;
const COVER_ASPECT = STYLE.orientation === "vertical" ? "aspect-[2/3]" : "aspect-video";
const GRID_COLS = STYLE.orientation === "vertical" ? "lg:grid-cols-5" : "lg:grid-cols-4";

/** 网格入场：卡片 stagger 0.08s（design.md §6 入场范式） */
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/** 宽画幅裸 key-art 卡（陈列目录版：图内底部渐变遮罩 + 游戏名） */
function KeyartCard({ work }: { work: GameWork }) {
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
      {/* 裸封面（FLIP 源元素=整个封面容器）：圆角 + 柔和静影，hover 阴影略加深 */}
      <motion.div
        layoutId={reducedMotion ? undefined : `cover-${work.id}`} // FLIP 源元素（reduced-motion 时退化为淡入淡出）
        transition={FLIP_SPRING}
        className={`relative ${COVER_ASPECT} overflow-hidden rounded-[16px] shadow-[0_12px_32px_rgba(35,32,43,0.10)] transition-shadow group-hover:shadow-[0_20px_48px_rgba(35,32,43,0.16)]`}
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
        {/* 底部渐变遮罩 + 游戏名 / 开发商 · 年份（叠在图内） */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-4 pt-14 transition-colors duration-500 group-hover:from-black/80">
          <h3 className="font-serif text-[1.15rem] font-bold leading-snug text-white">{work.title}</h3>
          <p className="mt-1 text-[0.8rem] font-medium text-white/75">
            {work.creator} · {work.year}
          </p>
        </div>
      </motion.div>

      {/* 封面下方信息区（标题行 / 平台 + 类型 chips，显隐由 CARD_STYLES.games 控制） */}
      {(STYLE.showTitle || STYLE.showTags) && (
        <div className="px-1 pt-4">
          {STYLE.showTitle && (
            <>
              <h3 className="font-serif text-[1.15rem] font-bold leading-snug text-ink">{work.title}</h3>
              <p className="mt-1 text-[0.8rem] font-medium text-ink-2">
                {work.creator} · {work.year}
              </p>
            </>
          )}
          {STYLE.showTags && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {work.platforms.map((p) => {
                const tag = platformTag(p);
                return <TagChip key={p} label={tag.label} icon={tag.icon} accent={ACCENT} />;
              })}
              {work.genres.slice(0, 2).map((g) => (
                <TagChip key={g} label={g} icon={TAG_ICONS[g]} />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.article>
  );
}

export default function GamesSection() {
  return (
    <FullPageSection id="games">
      <SectionHeader
        index="02"
        eyebrow="GAMES · PLAY LOG"
        title="通关了还想重来的世界"
        note="游戏是唯一能让我合法“住进别处”的媒介。以下七款，按我心里的位置排成一列。" // TODO(主人): 占位编辑手记，可替换
        accent={ACCENT}
      />

      {/* key-art 陈列墙：画幅与列数随 CARD_STYLES.games.orientation 切换 */}
      <motion.div
        className={`mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 ${GRID_COLS} lg:gap-6`}
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-25% 0px" }} // ≈ top 75% 触发，只播一次
      >
        {gameWorks.map((work) => (
          <KeyartCard key={work.id} work={work} />
        ))}
      </motion.div>
    </FullPageSection>
  );
}
