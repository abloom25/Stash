/**
 * <PressQuoteBlock> — 媒体 / 权威机构评语块（design.md §7.5）
 * eyebrow「媒体评价 · PRESS」+ 若干条引语：
 * 衬线引语文本 + 来源行（Manrope 700 + <ScoreBadge>）。块与块之间 hairline 分隔。
 * accent 色取自 DetailOverlay 注入的 --accent-text（暗色自动提亮），无需传参。
 *
 * ⚠️ 所有引语为占位数据，请替换为真实评价与链接（PressQuote.url）。
 */
import type { PressQuote } from "@/data/types";
import ScoreBadge from "./ScoreBadge";

export default function PressQuoteBlock({ quotes }: { quotes: PressQuote[] }) {
  return (
    <section aria-label="媒体评价">
      <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
        媒体评价 · PRESS
      </p>
      <ul className="mt-6">
        {quotes.map((q, i) => (
          <li
            key={`${q.source}-${i}`}
            className={i > 0 ? "mt-8 border-t hairline pt-8" : ""}
          >
            {/* 大引号：与引文左对齐悬挂，不留空档 */}
            <span
              aria-hidden="true"
              className="-mb-1 block h-6 font-serif text-[2.5rem] leading-none"
              style={{ color: "color-mix(in srgb, var(--accent-text) 40%, transparent)" }}
            >
              “
            </span>
            <blockquote className="font-serif text-[1.1rem] font-medium leading-[1.8] text-ink">
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
