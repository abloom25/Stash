/**
 * <WorkDetail> — 通用详情页（`/<section.id>/:workId`）：所有板块共用，
 * 由 src/config.ts 的 SECTIONS 条目驱动，新增板块无需动本文件。
 *
 * 构建在共享 <DetailOverlay> 外壳之上（scrim / 返回按钮 / ESC / 滚动锁定 /
 * 内容列 stagger 由外壳负责）：
 * - 封面列（桌面 sticky / 移动居上）：裸封面 + 圆角 + 柔和静影，
 *   layoutId={`cover-${work.id}`} + FLIP_SPRING 与陈列墙卡片 FLIP 对接；
 *   画幅随 section.cardStyle.orientation（竖版 2:3 / 横版 16:9）。
 * - 内容列（DetailBlock stagger）：
 *   ① 作品头（eyebrow=section.detailEyebrow + 标题 + 原文行 + 星级评分焦点行
 *      + <InfoBar>（格子由 section.infoCells 配置）+ 简短简介）
 *   ② 媒体评价 <PressQuoteBlock>（<ScoreBadge> 自动配色）
 *   ③ 名台词 <LinesBlock>
 * accent 文字色统一取 DetailOverlay 注入的 --accent-text（暗色自动提亮，见 index.css）。
 * prefers-reduced-motion：不加 layoutId（FLIP → 淡入）。
 * 关闭（返回按钮 / scrim / ESC，由 DetailOverlay 处理）→ navigate('/#<section.id>')。
 * id 无匹配：渲染 null，并在 effect 中 navigate('/#<section.id>', { replace: true })。
 */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import type { InfoCell, SectionConfig } from "@/config";
import DetailOverlay, { DetailBlock } from "@/components/DetailOverlay";
import { overlayContentVariants, FLIP_SPRING } from "@/lib/motion";
import PressQuoteBlock from "@/components/PressQuoteBlock";
import LinesBlock from "@/components/LinesBlock";

/** 桌面端信息栏列数（按格子数）：lookup 保证 Tailwind 类名是字面量可被扫描 */
const LG_COLS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

/** 玻璃横条信息栏：格子由 section.infoCells 配置；移动端 2 列换行，格间 hairline 分隔 */
function InfoBar({ cells }: { cells: InfoCell[] }) {
  const lgCols = LG_COLS[cells.length] ?? "lg:grid-cols-4";
  return (
    <div className={`glass mt-6 grid grid-cols-2 overflow-hidden ${lgCols}`} aria-label="作品信息栏">
      {cells.map((c, i) => (
        <div
          key={c.label}
          // 移动端 2 列：奇数格左 hairline、第 2 行起上 hairline；桌面 1 行：非首格左 hairline
          className={`hairline px-4 py-3.5 ${i % 2 === 1 ? "border-l" : ""} ${
            i >= 2 ? "border-t lg:border-t-0" : ""
          } ${i > 0 ? "lg:border-l" : ""}`}
        >
          <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--accent-text)" }}>
            {c.label}
          </p>
          <p className="mt-1 text-[0.85rem] font-semibold text-ink">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/** 我的评分：5 星（支持半星，10 分制 → 5 星）+ 大号数字焦点行；颜色取 --accent-text（暗色自动提亮） */
function MyRating({ rating }: { rating: number }) {
  const filled = rating / 2;
  return (
    <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
      <span className="flex items-center gap-1 pb-0.5" aria-label={`我的评分 ${rating} / 10`}>
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, filled - i));
          return (
            <span key={i} className="relative inline-flex" aria-hidden="true">
              <Star size={18} strokeWidth={1.5} style={{ color: "var(--accent-text)", fill: "transparent" }} />
              {fill > 0 && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                  <Star size={18} strokeWidth={1.5} style={{ color: "var(--accent-text)", fill: "var(--accent-text)" }} />
                </span>
              )}
            </span>
          );
        })}
      </span>
      <span className="font-serif text-[2rem] font-bold leading-none" style={{ color: "var(--accent-text)" }}>
        {rating.toFixed(1)}
        <span className="ml-1.5 text-[0.8rem] font-medium text-ink-3">/ 10</span>
      </span>
      <span className="pb-0.5 text-[0.72rem] font-medium text-ink-3">我的评分</span>
    </div>
  );
}

export default function WorkDetail({ section, id }: { section: SectionConfig; id?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion() ?? false;
  const work = section.works.find((w) => w.id === id);

  // id 无匹配 → 静默回陈列墙
  useEffect(() => {
    if (!work) navigate(`/#${section.id}`, { replace: true });
  }, [work, navigate, section.id]);

  // 封面列方位：跟随被点击卡片所在半屏（卡片经 navigate state 传入；直链默认左）。
  // 挂载时锁存——退出动画期间 location.state 已随路由变化清空，不能现读
  const [coverSide] = useState<"left" | "right">(() =>
    (location.state as { coverSide?: string } | null)?.coverSide === "right" ? "right" : "left"
  );

  if (!work) return null;

  const close = () => navigate(`/#${section.id}`);
  const aspect = section.cardStyle.orientation === "vertical" ? "aspect-[2/3]" : "aspect-video";
  const eyebrow = (section.detailEyebrow ?? ((w) => `${w.genres[0]} · ${w.year} · ${w.creator}`))(work);

  return (
    <DetailOverlay
      accent={work.palette} // 每部作品自己的主题色
      tint={work.palette}
      backdropSrc={work.cover} // 暗色模式下放大模糊的背景
      onClose={close}
      coverSide={coverSide}
      cover={
        // 入场淡入；退出时不加淡出/模糊——封面要干净地 FLIP 飞回卡片，
        // 中途模糊淡出会让飞行动画残缺。
        // 封面下方空白实际落在此包装层上——补一个「点自身空白关闭」
        <motion.div
          variants={overlayContentVariants}
          initial="hidden"
          animate="show"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* 裸封面锚位：FLIP 目标元素=整个封面容器（与卡片容器 layoutId 配对）。
              flip-opaque：钉住透明度，关掉 layoutId 默认的交叉淡化（见 index.css）——
              否则归位途中封面会逐渐淡出「溶」掉，而不是完整飞回卡位 */}
          <motion.div
            layoutId={reduce ? undefined : `cover-${work.id}`}
            transition={FLIP_SPRING}
            initial={reduce ? { opacity: 0 } : { scale: 0.98 }} // 落位后 scale 0.98→1
            animate={reduce ? { opacity: 1 } : { scale: 1 }}
            // borderRadius 经 style 传入（与 rounded-cover 同值 18px）：让 framer 的
            // 缩放矫正在飞行中保持视觉圆角恒定（见 WorkSection 同名注释）
            style={{ borderRadius: 18 }}
            className={`overflow-hidden rounded-cover shadow-[0_24px_60px_rgba(35,32,43,0.18)] ${aspect} ${reduce ? "" : "flip-opaque"}`}
          >
            <img
              src={work.cover}
              alt={`《${work.title}》封面`}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </motion.div>
      }
    >
      {/* ① 作品头：eyebrow → 标题 + 原文行 → 我的评分（视觉焦点）→ 信息栏 → 简介 */}
      <DetailBlock>
        <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
          {eyebrow}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2.1rem,4vw,3.1rem)] font-extrabold leading-[1.12] text-ink">
          {work.title}
        </h1>
        <p className="mt-2 font-serif text-[1.05rem] italic tracking-[0.04em] text-ink-3">{work.titleEn}</p>
        <MyRating rating={work.myRating} />
        <InfoBar cells={section.infoCells(work, section.extras?.[work.id])} />
        {/* 简短简介 */}
        <p className="mt-7 max-w-[62ch] text-[1rem] leading-[1.9] text-ink-2">{work.description}</p>
      </DetailBlock>

      {/* ② 媒体评价：真实评分与引语 */}
      <DetailBlock className="border-t hairline pt-10">
        <PressQuoteBlock quotes={work.press} />
      </DetailBlock>

      {/* ③ 名台词展示 */}
      <DetailBlock>
        <LinesBlock lines={work.lines} />
      </DetailBlock>
    </DetailOverlay>
  );
}
