/**
 * <GamesDetail> — 板块 03 玩家 spread 详情（`/games/:id`，games.md §3）
 *
 * 构建在共享 <DetailOverlay> 外壳之上（scrim / 返回按钮 / ESC / 滚动锁定 /
 * 右列 stagger 由外壳负责；内容块用 <DetailBlock> 获得 y:24→0 入场，delay 250ms 起
 * stagger 0.09s；退出反向快速淡出）。
 *
 * 左列（桌面 sticky / 移动居上）：静止致敬的 16:9 key-art 锚位——
 *   · 封面 layoutId={`cover-${work.id}`} + FLIP_SPRING，与美术墙卡片 FLIP 对接；
 *   · 落位后整图 scale 0.98→1；
 *   · 图下：平台 chips（显示名与图标统一来自 src/config.ts 的 PLATFORM_TAGS）；
 *   · 对 key art 不施加常驻动效（design.md §6.1：游戏 = 静止致敬）。
 *
 * 右列内容块：
 *   ① 作品头（eyebrow / 游戏名 + Fraunces italic 英文行 / <InfoBar> 四格玻璃横条 /
 *      5 星我的评分 + 简短简介）→ ② 媒体评测 <PressQuoteBlock>（IGN 红方块 /
 *      Metacritic 分段着色，由共享 <ScoreBadge> 自动上色）→ ③ 名台词 <LinesBlock>。
 *
 * 移动布局（<768px）：上下结构由 DetailOverlay 网格自适配；InfoBar 退化为 2×2。
 * 关闭：返回按钮 / 点 scrim / ESC → navigate('/#games')（路由 pop，FLIP 飞回原卡位）。
 * id 无匹配：render null，并在 effect 中 replace 回 '/#games'。
 * prefers-reduced-motion：封面不挂 layoutId，FLIP 退化为淡入淡出。
 */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import DetailOverlay, { DetailBlock } from "@/components/DetailOverlay";
import { FLIP_SPRING } from "@/lib/motion";
import PressQuoteBlock from "@/components/PressQuoteBlock";
import LinesBlock from "@/components/LinesBlock";
import { gameWorks, gameExtras } from "@/data/games";
import type { GameExtra } from "@/data/games";
import type { GameWork } from "@/data/types";
import { platformTag } from "@/config";

/** 四格玻璃信息横条：平台 / 通关时长 / 类型 / 成就（格间竖 hairline；移动 2×2） */
function InfoBar({ work, extra, accent }: { work: GameWork; extra: GameExtra; accent: string }) {
  const cells = [
    { label: "平台", value: work.platforms.map((p) => platformTag(p).label).join(" · ") },
    { label: "通关时长", value: extra.hoursLabel ?? `${work.hoursPlayed}h` },
    { label: "类型", value: work.genres[0] },
    { label: "成就", value: extra.achievements },
  ];
  // 每格边框：移动 2×2（第 2 行加 top hairline）→ 桌面 1×4（竖 hairline 分隔）
  const borders = [
    "",
    "border-l hairline",
    "border-t hairline lg:border-l lg:border-t-0",
    "border-l border-t hairline lg:border-t-0",
  ];
  return (
    <div className="glass mt-6 grid grid-cols-2 overflow-hidden lg:grid-cols-4" aria-label="作品信息栏">
      {cells.map((c, i) => (
        <div key={c.label} className={`px-4 py-3.5 ${borders[i]}`}>
          <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
            {c.label}
          </p>
          <p className="mt-1 text-[0.85rem] font-semibold text-ink">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/** 我的评分：青色 5 星（10 分制 → 5 星）+ 数字 + 「我的评分」小字 */
function MyRatingStars({ rating, accent }: { rating: number; accent: string }) {
  const filled = Math.round(rating / 2);
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1" aria-label={`我的评分 ${rating} / 10`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            strokeWidth={1.5}
            style={{ color: accent, fill: i < filled ? accent : "transparent" }}
          />
        ))}
      </span>
      <span className="font-serif text-[1.2rem] font-semibold leading-none" style={{ color: accent }}>
        {rating.toFixed(1)}
        <span className="ml-1 text-[0.72rem] font-medium text-ink-3">/ 10</span>
      </span>
      <span className="text-[0.72rem] font-medium text-ink-3">我的评分</span>
    </div>
  );
}

export default function GamesDetail({ id }: { id?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const work = gameWorks.find((w) => w.id === id);

  // id 无匹配：replace 回美术墙锚点（渲染 null）
  useEffect(() => {
    if (!work) navigate("/#games", { replace: true });
  }, [work, navigate]);

  // 封面列方位：跟随被点击卡片所在半屏（卡片经 navigate state 传入；直链默认左）。
  // 挂载时锁存——退出动画期间 location.state 已随路由变化清空，不能现读
  const [coverSide] = useState<"left" | "right">(() =>
    (location.state as { coverSide?: string } | null)?.coverSide === "right" ? "right" : "left"
  );

  if (!work) return null;

  const accent = work.palette; // 每部作品自己的主题色
  const extra = gameExtras[work.id];
  const close = () => navigate("/#games");

  // 左列：key-art 锚位（静止致敬，无常驻动效；裸图 + 柔和静影）。
  // 封面下不再放平台 chips——右侧 InfoBar 已有平台格，省去元素碰撞
  const cover = (
    <div>
      <motion.div
        layoutId={reducedMotion ? undefined : `cover-${work.id}`} // FLIP 目标锚位（reduced-motion → 淡入淡出）
        transition={FLIP_SPRING}
        initial={reducedMotion ? { opacity: 0 } : { scale: 0.98 }} // 落位后 scale 0.98→1
        animate={reducedMotion ? { opacity: 1 } : { scale: 1 }}
        className="aspect-video w-full overflow-hidden rounded-[16px] shadow-[0_24px_60px_rgba(35,32,43,0.18)]"
      >
        <img
          src={work.cover}
          alt={`《${work.title}》key art`}
          draggable={false}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  );

  return (
    <DetailOverlay accent={accent} tint={work.palette} backdropSrc={work.cover} onClose={close} coverSide={coverSide} cover={cover}>
      {/* ① 作品头 */}
      <DetailBlock>
        <p className="eyebrow" style={{ color: accent }}>
          {work.genres[0]} · {work.year} · {work.creator}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.15] text-ink">
          {work.title}
        </h1>
        <p className="mt-2 font-serif text-[1.05rem] italic tracking-[0.06em] text-ink-2">{work.titleEn}</p>
        <InfoBar work={work} extra={extra} accent={accent} />
        <MyRatingStars rating={work.myRating} accent={accent} />
        {/* 简短简介 */}
        <p className="mt-5 max-w-[62ch] text-[0.95rem] leading-[1.9] text-ink-2">{work.description}</p>
      </DetailBlock>

      {/* ② 媒体评测（IGN 红方块 / Metacritic 分段着色由共享 ScoreBadge 上色） */}
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
