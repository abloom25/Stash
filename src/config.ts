/**
 * 站点集中配置 —— 所有可自定义项都集中在这一个文件里：
 * 站点文案 / 板块 / 卡片样式 / 平台标签（含图标）/ 类型标签图标。
 *
 * 本文件是普通 TS 模块，被组件静态 import，构建时随编译直接嵌入网页
 * （无运行时请求），改完重新 `pnpm build` 即生效。
 *
 * 图标用 lucide-react，完整列表见 https://lucide.dev/icons
 */
import { Gamepad2, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SectionMeta } from "@/data/types";

/** 站点文案 */
export const SITE = {
  /** 站点名（页脚字标） */
  name: "私藏 · Stash",
  /** Hero 个人签名句 */
  heroSignature:
    "「这里收藏着我反复聆听的唱片、不愿散场的电影，和通关了还想重来一次的游戏。排名不分先后，喜欢不分高下。」",
  /**
   * 板块间「编辑手记」分隔文本：按页面顺序对应每个间隔——
   * [Hero→影视, 影视→游戏, 游戏→页脚]，某个间隔不想要分隔文本就置空字符串 ""。
   */
  editorNotes: ["", "轮到双手上场。", ""] as string[],
  /** 底部细页脚左侧的 slogan */
  footerSlogan: "把热爱的事物装订成册。",
} as const;

/** 板块元信息（导航 / SectionHeader / 路由共用） */
export const SECTIONS: SectionMeta[] = [
  { id: "film", index: "01", zh: "影视", en: "CINEMA & SCREEN", hash: "#film", route: "/film", accent: "#E07A54", accentSoft: "#FBEEE7" },
  { id: "games", index: "02", zh: "游戏", en: "PLAY LOG", hash: "#games", route: "/games", accent: "#8B7EC8", accentSoft: "#EEEBF8" },
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

/** 卡片样式配置：每个板块可独立选择画幅与封面下方信息显示 */
export interface CardStyleConfig {
  /** 画幅：vertical = 竖版 2:3（海报）；horizontal = 横版 16:9（key-art） */
  orientation: "vertical" | "horizontal";
  /** 封面下方是否显示标题行（作品名 + 创作者 · 年份） */
  showTitle: boolean;
  /** 封面下方是否显示标签 chips（平台 / 类型） */
  showTags: boolean;
}

/** 板块卡片样式：影视默认竖版海报、游戏默认横版 key-art（标题叠在图内，游戏额外显示平台标签） */
export const CARD_STYLES: Record<"film" | "games", CardStyleConfig> = {
  film: { orientation: "vertical", showTitle: false, showTags: false },
  games: { orientation: "horizontal", showTitle: false, showTags: true },
};

/**
 * 类型 / 标签图标（可选）：genres 命中 key 时 chip 带图标，未命中则纯文字。
 * 例：开放世界: Map,
 */
export const TAG_ICONS: Record<string, LucideIcon> = {};
