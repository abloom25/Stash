/**
 * <TagChip> — 类型 / 平台等小标签（chip 圆角 999px）。
 * accent 传入时给主题色浅 tint 描边与文字，否则用中性 ink 色。
 * icon 可选（平台等标签的图标集中在 src/config.ts 配置）。
 */
import type { LucideIcon } from "lucide-react";

interface TagChipProps {
  label: string;
  accent?: string; // 板块主题色 hex（可选）
  icon?: LucideIcon; // 标签图标（可选，见 src/config.ts）
}

export default function TagChip({ label, accent, icon: Icon }: TagChipProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.72rem] font-medium leading-none"
      style={
        accent
          ? { borderColor: `${accent}55`, color: accent, backgroundColor: `${accent}12` }
          : { borderColor: "rgb(var(--ink) / 0.14)", color: "rgb(var(--ink-2))" }
      }
    >
      {Icon && <Icon size={12} strokeWidth={2} />}
      {label}
    </span>
  );
}
