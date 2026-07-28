/**
 * <WorkCard> — 作品卡片基类（画廊墙简版：封面直接陈列，不再套玻璃卡）。
 * 裸封面（overflow hidden, rounded-cover + 柔和静影）+ 下方 meta 区：作品名（衬线）/
 * 创作者 · 年份（meta）/ 2–3 个 <TagChip>；右侧安静的「翻开 →」提示。
 *
 * FLIP 约定（§6.1）：封面 <motion.img> 使用 layoutId={`cover-${work.id}`}，
 * 详情页封面必须使用同一个 layoutId，点击卡片时封面即"飞"到详情锚位。
 *
 * hover（安静版）：整卡 translateY(-4px) + 封面 scale(1.03) + 柔和阴影略加深。
 * 通过 coverAspect 传入画幅类名（音乐 aspect-square / 影视 aspect-[2/3] / 游戏 aspect-video）。
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { WorkBase } from "@/data/types";
import TagChip from "./TagChip";
import { FLIP_SPRING } from "@/lib/motion";

interface WorkCardProps {
  work: WorkBase;
  to: string; // 详情路由，如 `/music/${work.id}`
  accent: string; // 板块主题色
  coverAspect?: string; // 封面画幅类名，默认方形
}

export default function WorkCard({ work, to, accent, coverAspect = "aspect-square" }: WorkCardProps) {
  return (
    <Link to={to} className="block rounded-cover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" aria-label={`查看《${work.title}》详情`}>
      <motion.article
        className="group transition-transform duration-300 ease-out hover:-translate-y-1"
        whileTap={{ scale: 0.98 }}
      >
        {/* 裸封面（FLIP 源元素）：圆角 + 柔和静影，hover 阴影略加深 */}
        <div
          className={`overflow-hidden rounded-cover ${coverAspect} shadow-[0_12px_32px_rgba(35,32,43,0.10)] transition-shadow duration-300 ease-out group-hover:shadow-[0_20px_48px_rgba(35,32,43,0.16)]`}
        >
          <motion.img
            layoutId={`cover-${work.id}`}
            transition={FLIP_SPRING}
            src={work.cover}
            alt={`《${work.title}》封面`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* meta 区（无卡片底，文字直接落在纸面上） */}
        <div className="px-1 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-[1.15rem] font-bold leading-snug text-ink">
                {work.title}
              </h3>
              <p className="mt-1 text-[0.8rem] font-medium text-ink-2">
                {work.creator} · {work.year}
              </p>
            </div>
            {/* 翻开提示 */}
            <span
              className="mt-1 inline-flex shrink-0 items-center gap-1 text-[0.72rem] font-medium text-ink-3 transition-colors duration-200 group-hover:text-[var(--card-accent)]"
              style={{ ["--card-accent" as string]: accent }}
            >
              翻开
              <ArrowRight size={13} strokeWidth={2} />
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {work.genres.slice(0, 3).map((g) => (
              <TagChip key={g} label={g} accent={accent} />
            ))}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
