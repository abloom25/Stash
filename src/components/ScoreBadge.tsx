/**
 * <ScoreBadge> — 评分小方块（design.md §7.7）
 * 圆角 16px，Fraunces 数字 + 小字来源。按来源上色：
 * 烂番茄=番茄红 / IMDb=金 / 豆瓣=青绿 / Metacritic 按分数段绿黄红 / IGN=红 / 其他=ink。
 * 颜色经 --badge 变量交给 index.css 的 .score-badge 配方派生（暗色模式自动提亮）。
 */
import type { CSSProperties } from "react";
interface ScoreBadgeProps {
  score: string; // '8.7' | '94%' | '9/10' …
  source: string; // 来源名，用于配色
}

/** 按来源名解析徽章主色 */
function badgeColor(source: string, score: string): string {
  const s = source.toLowerCase();
  if (s.includes("烂番茄") || s.includes("rotten")) return "#E0452C";
  if (s.includes("imdb")) return "#D9A821";
  if (s.includes("豆瓣")) return "#2A7A5E";
  if (s.includes("metacritic")) {
    const n = parseInt(score, 10);
    if (!Number.isNaN(n)) {
      if (n >= 75) return "#4C9A52"; // 绿
      if (n >= 50) return "#D9A821"; // 黄
      return "#C62F2F"; // 红
    }
    return "#4C9A52";
  }
  if (s.includes("ign")) return "#C62F2F";
  return "#23202B"; // 音乐媒体及其他：ink
}

export default function ScoreBadge({ score, source }: ScoreBadgeProps) {
  return (
    <span
      className="score-badge inline-flex items-baseline gap-1.5 rounded-score px-2.5 py-1"
      // 底色/描边/文字色均由 .score-badge 配方按 --badge 派生（暗色自动提亮，见 index.css）
      style={{ "--badge": badgeColor(source, score) } as CSSProperties}
      title={`${source} 评分`}
    >
      <span className="score-badge-text font-serif text-[1.05rem] font-semibold leading-none">
        {score}
      </span>
      <span className="score-badge-text text-[0.62rem] font-bold uppercase tracking-[0.14em] opacity-70">
        {source}
      </span>
    </span>
  );
}
