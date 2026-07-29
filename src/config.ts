/**
 * 站点集中配置 —— 所有可自定义项都集中在这一个文件里：
 * 站点文案 / Hero / 板块（增删、标题、eyebrow、手记、卡片样式、详情信息栏）/
 * 平台标签（含图标）/ 类型标签图标。
 *
 * 本文件是普通 TS 模块，被组件静态 import，构建时随编译直接嵌入网页
 * （无运行时请求），改完重新 `pnpm build` 即生效。
 *
 * ── 新增一个板块只需两步 ─────────────────────────────────────
 * 1. 在 src/data/ 新建数据文件（参照 films.ts），导出 Work[]；
 * 2. 在下面 SECTIONS 数组里加一条 SectionConfig（import 数据 + 填文案与函数）。
 * 主页板块、路由（`/<id>/:workId`）、锚点（`#<id>`）、详情覆盖层全部自动生成。
 * ────────────────────────────────────────────────────────────
 *
 * 图标用 lucide-react，完整列表见 https://lucide.dev/icons
 */
import { Gamepad2, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Work, WorkExtra } from "@/data/types";
import { filmWorks } from "@/data/films";
import { gameWorks, gameExtras } from "@/data/games";

/** 站点文案 */
export const SITE = {
  /** 站点名（页脚字标） */
  name: "私藏 · Stash",
  /** Hero eyebrow 小标签 */
  heroEyebrow: "A PERSONAL CANON · 私人珍藏志",
  /** Hero 中文大标题（两行；第二行带渐变下划线） */
  heroTitleLine1: "把热爱的事物",
  heroTitleLine2: "装订成册。",
  /** Hero 英文装饰行 */
  heroEn: "Music, Film & Play — pressed between pages like dried flowers.",
  /** Hero 个人签名句 */
  heroSignature:
    "「这里收藏着我反复聆听的唱片、不愿散场的电影，和通关了还想重来一次的游戏。排名不分先后，喜欢不分高下。」",
  /**
   * 板块间「编辑手记」分隔文本：按页面顺序对应每个间隔——
   * [Hero→板块1, 板块1→板块2, …, 最后一个板块→页脚]，共 SECTIONS.length + 1 个；
   * 某个间隔不想要分隔文本就置空字符串 ""。
   */
  editorNotes: ["", "轮到双手上场。", ""] as string[],
  /** 底部细页脚左侧的 slogan */
  footerSlogan: "把热爱的事物装订成册。",
  /** 页脚 GitHub 仓库链接（置空字符串则不显示图标） */
  repoUrl: "https://github.com/abloom25/Stash",
} as const;

/** 卡片样式配置：每个板块可独立选择画幅与封面下方信息显示 */
export interface CardStyleConfig {
  /** 画幅：vertical = 竖版 2:3（海报）；horizontal = 横版 16:9（key-art） */
  orientation: "vertical" | "horizontal";
  /** 封面下方是否显示标题行（作品名 + 副标题） */
  showTitle: boolean;
  /** 封面下方是否显示标签 chips（平台 / 类型） */
  showTags: boolean;
}

/** 详情页信息栏格子 */
export interface InfoCell {
  label: string; // 格子上方小标签，如 '导演'
  value: string; // 格子值，如 '是枝裕和'
}

/**
 * 板块配置 —— 页面结构 / 文案 / 样式的唯一来源。
 * id 是板块的锚：路由 `/<id>/:workId`、锚点 `#<id>` 都由它派生，全站唯一、不要改已上线的 id。
 */
export interface SectionConfig {
  id: string; // 'film' —— 派生路由与锚点，全站唯一
  index: string; // 编号 '01'（SectionHeader 展示）
  zh: string; // 板块中文名（备用：导航等）
  en: string; // 板块英文名（备用）
  eyebrow: string; // SectionHeader 的 eyebrow 英文行，如 'FILM & TV · CINEMA & SCREEN'
  title: string; // SectionHeader 中文大标题
  note: string; // SectionHeader 编辑手记（1-2 行）
  accent: string; // 板块主题色 hex（eyebrow / 标签 / 详情点缀）
  accentSoft: string; // 主题色浅 tint
  cardStyle: CardStyleConfig; // 卡片画幅与封面下方信息显隐
  works: Work[]; // 作品数据（来自 src/data/）
  extras?: Record<string, WorkExtra>; // 板块扩展字段（与 works 按 id 关联，可选）
  /** 卡片封面副标题行（图内渐变遮罩 / 封面下方标题行）；默认 `{creator} · {year}` */
  cardSubtitle?: (work: Work) => string;
  /** 详情页 eyebrow 行；默认 `{genres[0]} · {year} · {creator}` */
  detailEyebrow?: (work: Work) => string;
  /** 详情页信息栏格子（2-5 格为宜；移动端自动 2×2 换行） */
  infoCells: (work: Work, extra?: WorkExtra) => InfoCell[];
}

export const SECTIONS: SectionConfig[] = [
  {
    id: "film",
    index: "01",
    zh: "影视",
    en: "CINEMA & SCREEN",
    eyebrow: "FILM & TV · CINEMA & SCREEN",
    title: "不愿散场的光影",
    note: "灯暗下来的那两个小时，是我和世界签署的停战协议。五部片子，按上映年份排成一列——也是一条国漫的时间轴。",
    accent: "#E07A54",
    accentSoft: "#FBEEE7",
    cardStyle: { orientation: "vertical", showTitle: false, showTags: false },
    works: filmWorks,
    cardSubtitle: (w) => `${w.director ?? w.creator} · ${w.year}`,
    detailEyebrow: (w) => `${w.genres[0]} · ${w.year} · ${w.runtime}`,
    infoCells: (w) => [
      { label: "导演", value: w.director ?? w.creator },
      { label: "年份", value: String(w.year) },
      { label: "类型", value: w.genres.join(" / ") },
      { label: w.type === "剧集" ? "集数" : "片长", value: w.runtime ?? "" },
    ],
  },
  {
    id: "games",
    index: "02",
    zh: "游戏",
    en: "PLAY LOG",
    eyebrow: "GAMES · PLAY LOG",
    title: "通关了还想重来的世界",
    note: "游戏是唯一能让我合法“住进别处”的媒介。以下七款，按我心里的位置排成一列。", // TODO(主人): 占位编辑手记，可替换
    accent: "#8B7EC8",
    accentSoft: "#EEEBF8",
    cardStyle: { orientation: "horizontal", showTitle: false, showTags: true },
    works: gameWorks,
    extras: gameExtras,
    detailEyebrow: (w) => `${w.genres[0]} · ${w.year} · ${w.creator}`,
    infoCells: (w, extra) => [
      { label: "平台", value: (w.platforms ?? []).map((p) => platformTag(p).label).join(" · ") },
      { label: "通关时长", value: String(extra?.hoursLabel ?? `${w.hoursPlayed ?? 0}h`) },
      { label: "类型", value: w.genres[0] },
      { label: "成就", value: String(extra?.achievements ?? "") },
    ],
  },
];

/**
 * 平台标签：数据里写 key（如 platforms: ["PC"]），卡片与详情页统一按这里渲染。
 * 想改显示名或图标（例如把 PC 显示为 Steam）只改这一处，全站生效。
 */
export const PLATFORM_TAGS: Record<string, { label: string; icon: LucideIcon }> = {
  PC: { label: "PC", icon: Monitor },
  PS5: { label: "PS5", icon: Gamepad2 },
  Switch: { label: "Switch", icon: Gamepad2 },
};

/** 查平台标签；数据里出现未配置的 key 时原样显示、用兜底图标 */
export function platformTag(id: string): { label: string; icon: LucideIcon } {
  return PLATFORM_TAGS[id] ?? { label: id, icon: Gamepad2 };
}

/**
 * 类型 / 标签图标（可选）：genres 命中 key 时 chip 带图标，未命中则纯文字。
 * 例：开放世界: Map,
 */
export const TAG_ICONS: Record<string, LucideIcon> = {};
