/**
 * 详情页 `/film/:id` — 影院 spread（film.md §3，design.md §6.1 FLIP 规范）
 *
 * 构建在共享 <DetailOverlay> 外壳之上：
 * - 左列锚位：裸海报（主人反馈：去掉装裱白卡边 / hairline 内框 / 呼吸阴影 / 铭牌），
 *   仅圆角 + 柔和静影；海报 <motion.img> 使用 layoutId={`cover-${work.id}`}
 *   + FLIP_SPRING，与海报墙 PosterCard 的封面 FLIP 配对。
 * - 右列（DetailBlock stagger，delay 250ms / 0.09s / y:24→0）：
 *   ① 作品头（eyebrow + 片名 + 原文行 + <InfoBar> 四格信息栏 + 星级评分 + 简短简介）
 *   ② 权威影评 <PressQuoteBlock>（真实评分与引语，<ScoreBadge> 自动配色）
 *   ③ 名台词 <LinesBlock>
 * prefers-reduced-motion：不加 layoutId（FLIP → 淡入）。
 * 关闭（返回按钮 / scrim / ESC，由 DetailOverlay 处理）→ navigate('/#film')。
 * id 无匹配：渲染 null，并在 effect 中 navigate('/#film', { replace: true })。
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import type { FilmWork } from "@/data/types";
import { filmWorks } from "@/data/films";
import DetailOverlay, { DetailBlock } from "@/components/DetailOverlay";
import { overlayContentVariants, FLIP_SPRING } from "@/lib/motion";
import PressQuoteBlock from "@/components/PressQuoteBlock";
import LinesBlock from "@/components/LinesBlock";


/** <InfoBar> — 玻璃横条四格信息栏（导演 / 年份 / 类型 / 片长；剧集改「集数」），移动端 2×2 */
function InfoBar({ work }: { work: FilmWork }) {
  const cells = [
    { label: "导演", value: work.director },
    { label: "年份", value: String(work.year) },
    { label: "类型", value: work.genres.join(" / ") },
    { label: work.type === "剧集" ? "集数" : "片长", value: work.runtime },
  ];
  // 格间 1px hairline 竖分隔（移动端 2×2 时补横分隔）
  const borders = [
    "",
    "border-l hairline",
    "border-t hairline lg:border-l lg:border-t-0",
    "border-l border-t hairline lg:border-t-0",
  ];
  return (
    <div className="glass mt-7 grid grid-cols-2 rounded-score lg:grid-cols-4" aria-label="作品信息">
      {cells.map((c, i) => (
        <div key={c.label} className={`px-5 py-3 ${borders[i]}`}>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink-3">{c.label}</p>
          <p className="mt-1 font-serif text-[0.95rem] font-bold leading-snug text-ink">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/** 珊瑚色 5 星（支持半星，如 9/10 → 4.5 星示意） */
function RatingStars({ rating, accent }: { rating: number; accent: string }) {
  const filled = rating / 2; // 10 分制 → 5 星
  return (
    <span className="flex items-center gap-1" aria-label={`我的评分 ${rating} / 10`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, filled - i));
        return (
          <span key={i} className="relative inline-flex" aria-hidden="true">
            <Star size={16} strokeWidth={1.5} style={{ color: accent, fill: "transparent" }} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={16} strokeWidth={1.5} style={{ color: accent, fill: accent }} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export default function FilmDetail({ id }: { id?: string }) {
  const navigate = useNavigate();
  const reduce = useReducedMotion() ?? false;
  const work = filmWorks.find((w) => w.id === id);

  // id 无匹配 → 静默回海报墙
  useEffect(() => {
    if (!work) navigate("/#film", { replace: true });
  }, [work, navigate]);

  if (!work) return null;

  const close = () => navigate("/#film");
  const accent = work.palette; // 每部作品自己的主题色

  return (
    <DetailOverlay
      accent={accent}
      tint={work.palette}
      backdropSrc={work.cover} // 暗色模式下放大模糊的背景
      onClose={close}
      cover={
        // 入场淡入；退出时不加淡出/模糊——海报要干净地 FLIP 飞回卡片，
        // 中途模糊淡出会让飞行动画残缺。
        // 竖版海报几乎撑满左列，海报下方空白实际落在此包装层上——
        // 补一个「点自身空白关闭」，让海报下方区域点击也能退出
        <motion.div
          variants={overlayContentVariants}
          initial="hidden"
          animate="show"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* 裸海报锚位：FLIP 目标元素=整个封面容器（与卡片容器 layoutId 配对） */}
          <motion.div
            layoutId={reduce ? undefined : `cover-${work.id}`}
            transition={FLIP_SPRING}
            initial={reduce ? { opacity: 0 } : false}
            animate={reduce ? { opacity: 1 } : undefined}
            className="overflow-hidden rounded-cover shadow-[0_24px_60px_rgba(35,32,43,0.18)]"
          >
            <img
              src={work.cover}
              alt={`《${work.title}》海报`}
              draggable={false}
              className="aspect-[2/3] w-full object-cover"
            />
          </motion.div>
        </motion.div>
      }
    >
      {/* ① 作品头：eyebrow → 片名 + 原文行 → 信息栏 → 我的评分 */}
      <DetailBlock>
        <p className="eyebrow" style={{ color: accent }}>
          {work.genres[0]} · {work.year} · {work.runtime}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.15] text-ink">
          {work.title}
        </h1>
        <p className="mt-2 font-serif text-[1.05rem] italic tracking-[0.04em] text-ink-3">{work.titleEn}</p>

        <InfoBar work={work} />

        {/* 我的评分：珊瑚色 5 星 + 数字 + 小字 */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <RatingStars rating={work.myRating} accent={accent} />
          <span className="font-serif text-[1.4rem] font-semibold leading-none" style={{ color: accent }}>
            {work.myRating.toFixed(1)}
            <span className="ml-1 text-[0.75rem] font-medium text-ink-3">/ 10</span>
          </span>
          <span className="text-[0.72rem] font-medium tracking-[0.1em] text-ink-3">我的评分</span>
        </div>

        {/* 简短简介 */}
        <p className="mt-6 max-w-[62ch] text-[0.95rem] leading-[1.9] text-ink-2">{work.description}</p>
      </DetailBlock>

      {/* ② 权威影评：豆瓣 / 猫眼等真实评分与引语 */}
      <DetailBlock>
        <PressQuoteBlock quotes={work.press} accent={accent} />
      </DetailBlock>

      {/* ③ 名台词展示 */}
      <DetailBlock>
        <LinesBlock lines={work.lines} accent={accent} />
      </DetailBlock>
    </DetailOverlay>
  );
}
