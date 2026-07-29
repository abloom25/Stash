/**
 * <WorkSection> — 通用板块（陈列墙）：所有板块共用，由 src/config.ts 的
 * SECTIONS 条目驱动（文案 / accent / 卡片样式 / 数据），新增板块无需动本文件。
 *
 * 封面直接陈列（裸封面 + 圆角 + 柔和静影），图内底部渐变遮罩 + 标题 +
 * 副标题行（section.cardSubtitle，默认 创作者 · 年份）。
 * 卡片画幅（竖版 2:3 / 横版 16:9）与封面下方信息（标题行 / 标签 chips）由
 * section.cardStyle 控制；整页展示空间由 <FullPageSection> 提供。
 *
 * FLIP：封面容器使用 layoutId={`cover-${work.id}`} + FLIP_SPRING，
 * 与 WorkDetail 详情封面配对。prefers-reduced-motion：不加 layoutId，退化为淡入。
 * hover（安静版）：整卡 translateY(-4px) + 封面 scale(1.03) + 柔和阴影略加深。
 * 点击 → useNavigate() 至 `/${section.id}/${work.id}`。
 */
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { CSSProperties } from "react";
import type { Work } from "@/data/types";
import type { SectionConfig } from "@/config";
import { platformTag, TAG_ICONS } from "@/config";
import SectionHeader from "@/components/SectionHeader";
import FullPageSection from "@/components/FullPageSection";
import TagChip from "@/components/TagChip";
import { FLIP_SPRING } from "@/lib/motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** 网格入场：stagger 0.08s、上移 40px、scale 0.96→1（design.md §6，trigger ≈ top 75%） */
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/** 陈列卡：裸封面 + 图内渐变遮罩标题；画幅与信息显隐随 section.cardStyle */
function WorkCard({ work, section }: { work: Work; section: SectionConfig }) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { cardStyle: style } = section;
  const aspect = style.orientation === "vertical" ? "aspect-[2/3]" : "aspect-video";
  const subtitle = (section.cardSubtitle ?? ((w: Work) => `${w.creator} · ${w.year}`))(work);

  // 按卡片所在半屏决定详情页封面列方位（左半屏→封面在左，右半屏→封面在右）
  const open = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const coverSide = rect.left + rect.width / 2 < window.innerWidth / 2 ? "left" : "right";
    navigate(`/${section.id}/${work.id}`, { state: { coverSide } });
  };

  return (
    <motion.article
      role="link"
      tabIndex={0}
      aria-label={`查看《${work.title}》详情`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(e);
        }
      }}
      whileTap={{ scale: 0.98 }}
      // 400ms 任意值时长与 tailwindcss-animate 的 duration 工具冲突（有歧义不会生成 CSS），改用内联 transitionDuration 保持规格
      style={{ transitionDuration: "400ms", "--tw-ring-color": `${section.accent}99` } as CSSProperties}
      className="group cursor-pointer rounded-cover transition-transform ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {/* 裸封面（FLIP 源元素=整个封面容器：圆角与阴影随容器一起飞行，更像卡片被"拿起"）。
          flip-opaque：钉住透明度，关掉 layoutId 默认的交叉淡化（见 index.css） */}
      <motion.div
        layoutId={reduce ? undefined : `cover-${work.id}`}
        transition={FLIP_SPRING}
        // borderRadius 经 style 传入（与 rounded-cover 同值 18px）：framer 的缩放
        // 矫正只接管 style/animate 里的圆角——类名设置的圆角在飞行缩放中会视觉
        // 缩水，归位瞬间与卡片圆角对不上（"圆角变一下"）
        style={{ transitionDuration: "400ms", borderRadius: 18 }}
        className={`relative ${aspect} overflow-hidden rounded-cover shadow-[0_12px_32px_rgba(35,32,43,0.10)] transition-shadow ease-out group-hover:shadow-[0_20px_48px_rgba(35,32,43,0.16)] ${reduce ? "" : "flip-opaque"}`}
      >
        <img
          src={work.cover}
          alt={`《${work.title}》封面`}
          loading="lazy"
          draggable={false}
          style={{ transitionDuration: "400ms" }}
          className="h-full w-full object-cover transition-transform ease-out group-hover:scale-[1.03]"
        />
        {/* 底部渐变遮罩 + 标题 / 副标题行（叠在图内）。详情打开期间隐藏（.card-caption，
            见 index.css）——封面「带着」海报飞走了，标题与遮罩等归位后再淡入。
            注意不可加 Tailwind 的 transition-colors：utilities 层会覆盖 .card-caption 的
            opacity 过渡（且渐变本身不可过渡，本来就没生效） */}
        <div className="card-caption pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-5 pt-16 group-hover:from-black/80">
          <h3 className="font-serif text-[1.15rem] font-bold leading-snug text-white">{work.title}</h3>
          <p className="mt-1 text-[0.8rem] font-medium text-white/75">{subtitle}</p>
        </div>
      </motion.div>

      {/* 封面下方信息区（标题行 / 标签 chips，显隐由 section.cardStyle 控制） */}
      {(style.showTitle || style.showTags) && (
        <div className="px-1 pt-4">
          {style.showTitle && (
            <>
              <h3 className="font-serif text-[1.15rem] font-bold leading-snug text-ink">{work.title}</h3>
              <p className="mt-1 text-[0.8rem] font-medium text-ink-2">{subtitle}</p>
            </>
          )}
          {style.showTags && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* 平台 chips（有 platforms 字段的板块才显示，accent 色） */}
              {(work.platforms ?? []).map((p) => {
                const tag = platformTag(p);
                return <TagChip key={p} label={tag.label} icon={tag.icon} accent={section.accent} />;
              })}
              {work.genres.slice(0, work.platforms?.length ? 2 : 3).map((g) => (
                <TagChip key={g} label={g} icon={TAG_ICONS[g]} />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.article>
  );
}

export default function WorkSection({ section }: { section: SectionConfig }) {
  const gridCols = section.cardStyle.orientation === "vertical" ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <FullPageSection id={section.id}>
      <SectionHeader
        index={section.index}
        eyebrow={section.eyebrow}
        title={section.title}
        note={section.note}
        accent={section.accent}
      />

      {/* 陈列墙：画幅与列数随 section.cardStyle.orientation 切换 */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-25% 0px" }}
        className={`mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 ${gridCols} lg:gap-6`}
      >
        {section.works.map((work) => (
          <motion.div key={work.id} variants={cardVariants}>
            <WorkCard work={work} section={section} />
          </motion.div>
        ))}
      </motion.div>
    </FullPageSection>
  );
}
