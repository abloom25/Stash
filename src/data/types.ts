/**
 * 「私藏 · Stash」公共数据模型（design.md §8）
 *
 * 各板块数据文件（films.ts / games.ts）由对应板块维护，字段均带行内注释。
 * 封面替换只需改 `cover` 路径；站点级配置（板块 / 标签 / 社交链接）见 src/config.ts。
 */

/** 媒体 / 权威机构评语 */
export interface PressQuote {
  source: string; // 来源名：Pitchfork / 烂番茄 / IGN / 豆瓣…
  quote: string; // 引语正文
  score?: string; // 评分，如 '8.7'、'94%'、'9/10'
  url?: string; // 原文链接（可选）
}

/** 作品公共字段 */
export interface WorkBase {
  id: string; // 'music-01'
  title: string; // 中文名
  titleEn: string; // 英文 / 原文名
  creator: string; // 艺术家 / 导演 / 开发商
  year: number;
  genres: string[]; // 2-3 个标签
  cover: string; // '/assets/cover-music-01.png' —— 替换封面改这里
  palette: string; // 封面主色 hex，用于卡片光晕与详情页光斑
  press: PressQuote[]; // 2-3 条媒体评语
  myRating: number; // 个人评分 0-10
  description: string; // 简短简介（一两句话）
  lines: { text: string; speaker?: string }[]; // 名台词展示
}

/** 音乐：代表曲目 + 厂牌 */
export interface MusicTrack {
  no: number; // 曲序
  name: string;
  duration: string; // '4:32'
  fave?: boolean; // 心头好标记
}
export interface MusicWork extends WorkBase {
  tracks: MusicTrack[];
  label: string; // 厂牌
}

/** 影视：导演 / 片长 / 类型 */
export interface FilmWork extends WorkBase {
  director: string;
  runtime: string; // '118 分钟' / '全 11 集'
  type: "电影" | "剧集" | "纪录片";
}

/** 游戏：平台 / 时长 */
export interface GameWork extends WorkBase {
  platforms: string[]; // ['Switch', 'PC'] —— 显示名与图标见 src/config.ts PLATFORM_TAGS
  hoursPlayed: number; // 游玩时长（小时）
}

/** 板块标识 */
export type SectionId = "music" | "film" | "games";

/** 板块元信息（实例见 src/config.ts 的 SECTIONS） */
export interface SectionMeta {
  id: SectionId;
  index: string; // '01'
  zh: string; // '音乐'
  en: string; // 'MUSIC'
  hash: string; // '#music'
  route: string; // '/music'
  accent: string; // 板块主题色
  accentSoft: string; // 主题色浅 tint
}
