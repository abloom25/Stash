/**
 * <LinesBlock> — 名台词展示（玻璃块 + 大引号 + 衬线台词 + 说话人）。
 * 与 PressQuoteBlock 同族版式；accent 传作品主题色（work.palette）。
 */
interface LineItem {
  text: string;
  speaker?: string;
}

export default function LinesBlock({ lines, accent }: { lines: LineItem[]; accent: string }) {
  return (
    <section aria-label="名台词" className="glass relative overflow-hidden rounded-card p-7 md:p-9">
      <p className="eyebrow" style={{ color: accent }}>
        名台词 · MEMORABLE LINES
      </p>
      <ul className="mt-6 space-y-6">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-3">
            {/* 装饰性大引号 */}
            <span aria-hidden="true" className="mt-1 shrink-0 font-serif text-[1.8rem] leading-none" style={{ color: `${accent}99` }}>
              “
            </span>
            <div>
              <p className="font-serif text-[1.05rem] leading-[1.9] text-ink">{line.text}</p>
              {line.speaker && <p className="mt-1.5 text-[0.75rem] font-medium tracking-wide text-ink-3">—— {line.speaker}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
