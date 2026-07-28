/**
 * <PressQuoteBlock> — 媒体 / 权威机构评语块（design.md §7.5）
 * eyebrow「媒体评价 · PRESS」（accent 色）+ 若干条引语：
 * 大号 Fraunces 引号（accent 30% 透明）+ 衬线引语文本 + 来源行（Manrope 700 + <ScoreBadge>）。
 * 块与块之间 hairline 分隔。
 *
 * ⚠️ 所有引语为占位数据，请替换为真实评价与链接（PressQuote.url）。
 */
import type { PressQuote } from "@/data/types";
import ScoreBadge from "./ScoreBadge";

interface PressQuoteBlockProps {
  quotes: PressQuote[];
  accent: string; // 板块主题色
}

export default function PressQuoteBlock({ quotes, accent }: PressQuoteBlockProps) {
  return (
    <section aria-label="媒体评价">
      <p className="eyebrow" style={{ color: accent }}>
        媒体评价 · PRESS
      </p>
      <ul className="mt-6">
        {quotes.map((q, i) => (
          <li
            key={`${q.source}-${i}`}
            className={i > 0 ? "mt-8 border-t hairline pt-8" : ""}
          >
            {/* 大引号 */}
            <span
              aria-hidden="true"
              className="block font-serif text-[48px] leading-[0.6]"
              style={{ color: `${accent}4D` }} // accent 30% 透明度
            >
              “
            </span>
            <blockquote className="mt-4 font-serif text-[1.1rem] font-medium leading-[1.8] text-ink">
              {q.quote}
            </blockquote>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {q.url ? (
                <a
                  href={q.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-[0.8rem] font-bold uppercase tracking-[0.12em] text-ink underline-offset-4 hover:underline"
                >
                  {q.source}
                </a>
              ) : (
                <span className="font-sans text-[0.8rem] font-bold uppercase tracking-[0.12em] text-ink">
                  {q.source}
                </span>
              )}
              {q.score && <ScoreBadge score={q.score} source={q.source} />}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
