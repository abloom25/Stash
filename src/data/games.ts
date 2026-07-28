/**
 * 板块 02 · 游戏 PLAY LOG — 游戏单数据（按主人给出的顺序排列）
 *
 * 游戏名 / 开发商 / 年份 / 封面 / 媒体评测（IGN、GameSpot、Metacritic 等真实评分与引语摘录）
 * 均为真实信息。封面替换只需改 `cover` 路径（16:9）。
 * 平台标签的显示名与图标集中在 src/config.ts 的 PLATFORM_TAGS。
 * GameWork 之外的板块扩展字段（通关状态 / 综合分 / 成就）见下方 `gameExtras`，
 * 与 gameWorks 通过 id 关联。
 */
import type { GameWork } from "./types";

export const gameWorks: GameWork[] = [
  {
    id: "game-01", // 路由 /games/game-01 与 layoutId cover-game-01 依赖此 id
    title: "死亡搁浅",
    titleEn: "Death Stranding",
    creator: "小岛工作室",
    year: 2019,
    genres: ["开放世界", "剧情"],
    cover: "/assets/cover-game-01.png", // TODO(主人): 替换封面改这里（1280×720 16:9）
    palette: "#5E7B96", // 封面主色（荒野蓝灰）
    press: [
      { source: "GameSpot", quote: "它积极向上，却不回避痛苦——无论剧情还是玩法，它都在论证：正是逆境本身，让事情值得去做，让生命值得去活。", score: "9/10" }, // GameSpot 评测摘录（译）
      { source: "EGM", quote: "它最终可能会成为有史以来最具争议的游戏之一。", score: "5/5" }, // EGM 评测摘录（译）
      { source: "TheSixthAxis", quote: "它与我玩过的一切都不同：美丽、揪心、心碎、令人抓狂、恢弘、惊艳，又疯狂至极。", score: "10/10" }, // TheSixthAxis 评测摘录（译）
    ],
    myRating: 9.5, // TODO(主人): 替换为我的评分（0–10）
    description: "在分崩离析的美国，山姆·波特·布里吉斯背负货物穿越荒野，把散落的人类据点重新连接起来。",
    lines: [
      { text: "Keep on keeping on.——继续走下去。", speaker: "游戏内格言" },
    ],
    platforms: ["PC", "PS5"], // TODO(主人): 替换为真实游玩平台
    hoursPlayed: 80, // TODO(主人): 替换为真实游玩时长（小时）
  },
  {
    id: "game-02",
    title: "星露谷物语",
    titleEn: "Stardew Valley",
    creator: "ConcernedApe",
    year: 2016,
    genres: ["模拟经营", "像素"],
    cover: "/assets/cover-game-02.png", // TODO(主人): 替换封面改这里
    palette: "#056ECD", // TODO(主人): 替换为封面主色 hex
    press: [
      { source: "IGN", quote: "《星露谷物语》有一种我在其他游戏里很少找到的慰藉……种田、钓鱼、打怪、手工、采矿，和所有人做朋友，或者什么都来一点——这场农场冒险应有尽有。", score: "9.5/10" }, // IGN 评测摘录（译）
      { source: "Metacritic", quote: "Destructoid：「核心机制与令人放松的美学结合得如此出色，玩家会沉浸其中，再也不想离开。」", score: "89/100" }, // Metacritic 收录评测摘录（译）
    ],
    myRating: 10, // TODO(主人): 替换为我的评分（0–10）
    description: "继承爷爷留下的旧农场，在星露谷种田、钓鱼、采矿、交友，开始一段慢下来的生活。",
    lines: [
      { text: "当你感到被现代生活的重担压垮，曾经明亮的内心变得暗淡时……就来这里吧。", speaker: "爷爷的信（大意）" },
    ],
    platforms: ["PC", "Switch"], // TODO(主人): 替换为真实游玩平台
    hoursPlayed: 200, // TODO(主人): 替换为真实游玩时长（小时）
  },
  {
    id: "game-03",
    title: "泰拉瑞亚",
    titleEn: "Terraria",
    creator: "Re-Logic",
    year: 2011,
    genres: ["沙盒", "冒险"],
    cover: "/assets/cover-game-03.png", // TODO(主人): 替换封面改这里
    palette: "#2A9A7B", // TODO(主人): 替换为封面主色 hex
    press: [
      { source: "GameSpot", quote: "当《泰拉瑞亚》把你吸进去，你会发现自己挖掘和建造的时间，远远超出原本的打算。", score: "8/10" }, // GameSpot 评测摘录（译）
      { source: "Metacritic", quote: "IGN Italia：「引人入胜且充满创造力的体验，会悄悄吞噬你大量的闲暇时光。」", score: "83/100" }, // Metacritic 收录评测摘录（译）
    ],
    myRating: 9, // TODO(主人): 替换为我的评分（0–10）
    description: "挖掘、建造、战斗、探索——2D 像素世界里的无限冒险。",
    lines: [
      { text: "你感到一股邪恶的气息正在注视着你……", speaker: "游戏提示语" },
    ],
    platforms: ["PC", "Switch"], // TODO(主人): 替换为真实游玩平台
    hoursPlayed: 150, // TODO(主人): 替换为真实游玩时长（小时）
  },
  {
    id: "game-04",
    title: "我的世界",
    titleEn: "Minecraft",
    creator: "Mojang",
    year: 2011,
    genres: ["沙盒", "生存"],
    cover: "/assets/cover-game-04.png", // TODO(主人): 替换封面改这里
    palette: "#1B89B9", // TODO(主人): 替换为封面主色 hex
    press: [
      { source: "IGN", quote: "方块画面「一眼难忘」（instantly memorable）；「与朋友一起冒险，总是更加快乐」（adventuring is always better with friends）。", score: "9/10" }, // IGN 评测摘录（译）
      { source: "Eurogamer", quote: "《我的世界》是游戏可能性上的一座巍峨丰碑，而它并没有因此陷入晦涩或犬儒。", score: "10/10" }, // Eurogamer 评测摘录（译）
    ],
    myRating: 9, // TODO(主人): 替换为我的评分（0–10）
    description: "用方块创造一切、探索无限世界的沙盒传奇。",
    lines: [
      { text: "游戏结束，玩家醒悟。玩家开始了新的梦。玩家做了另一场梦，一场更好的梦。玩家成为了宇宙，化身为爱。", speaker: "终末之诗" },
    ],
    platforms: ["PC"], // TODO(主人): 替换为真实游玩平台
    hoursPlayed: 300, // TODO(主人): 替换为真实游玩时长（小时）
  },
  {
    id: "game-05",
    title: "底特律：变人",
    titleEn: "Detroit: Become Human",
    creator: "Quantic Dream",
    year: 2018,
    genres: ["互动叙事", "剧情"],
    cover: "/assets/cover-game-05.png", // TODO(主人): 替换封面改这里
    palette: "#3E4E7A", // TODO(主人): 替换为封面主色 hex
    press: [
      { source: "IGN", quote: "《底特律》提供了大量清晰透明的分支路径，吸引你一玩再玩；选择具有永久性，让全程的赌注不断升高。", score: "8/10" }, // IGN 评测摘录（译）
      { source: "Gamersky", quote: "《底特律》是 Quantic Dream 有史以来最具野心的作品。", score: "9.3/10" }, // 游民星空评测摘录（译）
    ],
    myRating: 9, // TODO(主人): 替换为我的评分（0–10）
    description: "2038 年的底特律，卡拉、康纳、马库斯三名仿生人在人与机器的冲突中走向觉醒。",
    lines: [
      { text: "我不是机器，我是活着的。", speaker: "觉醒的仿生人" },
    ],
    platforms: ["PC", "PS5"], // TODO(主人): 替换为真实游玩平台
    hoursPlayed: 40, // TODO(主人): 替换为真实游玩时长（小时）
  },
  {
    id: "game-06",
    title: "明日方舟：终末地",
    titleEn: "Arknights: Endfield",
    creator: "鹰角网络",
    year: 2025, // TODO(主人): 若发行时间有变请更新
    genres: ["RPG", "策略"],
    cover: "/assets/cover-game-06.png", // TODO(主人): 替换封面改这里
    palette: "#8A9333", // TODO(主人): 替换为封面主色 hex
    press: [
      { source: "IGN", quote: "它为抽卡游戏添上美丽的一笔：把复杂的工厂建造模拟与诱人的开放世界 RPG 糅合在一起，自成一格。", score: "7/10" }, // IGN 评测摘录（译）
      { source: "Gamersky", quote: "《终末地》在美术方向、角色设计与世界构建上，自信地展示了自己的实力。", score: "8.7/10" }, // 游民星空评测摘录（译）
      { source: "INVEN", quote: "一次充满潜力的新篇——角色与剧情会立刻把你吸引进去。", score: "9/10" }, // INVEN 评测摘录（译）
    ],
    myRating: 8.5, // TODO(主人): 替换为我的评分（0–10）
    description: "在塔卫二的边疆开拓基地、探索未知——明日方舟世界的全新篇章。", // TODO(主人): 可替换为你自己的一句话简介
    lines: [
      { text: "让我去尽量多的地方，那些可以留下尽量多回忆的地方。" },
    ],
    platforms: ["PC", "PS5"], // TODO(主人): 替换为真实游玩平台
    hoursPlayed: 60, // TODO(主人): 替换为真实游玩时长（小时）
  },
  {
    id: "game-07",
    title: "去月球",
    titleEn: "To the Moon",
    creator: "Freebird Games",
    year: 2011,
    genres: ["叙事", "独立"],
    cover: "/assets/cover-game-07.png", // TODO(主人): 替换封面改这里
    palette: "#AE5835", // TODO(主人): 替换为封面主色 hex
    press: [
      { source: "Gamer.no", quote: "《去月球》是那种让你一见钟情的游戏……它故事多于玩法，但那是一个怎样的故事啊。", score: "100/100" }, // Gamer.no 评测摘录（译）
      { source: "Gamer.nl", quote: "绝对的必玩之作……它展示了年轻的开发者如何用简单的资源与大厂抗衡。", score: "9/10" }, // Gamer.nl 评测摘录（译）
      { source: "CD-Action", quote: "在“游戏能否被视为艺术”这场永无休止的讨论中，《去月球》证明了：它们可以。", score: "8.5/10" }, // CD-Action 评测摘录（译）
    ],
    myRating: 10, // TODO(主人): 替换为我的评分（0–10）
    description: "两位医生通过修改记忆，帮助垂死的老人完成「去月球」的最后心愿。",
    lines: [
      { text: "如果你忘了，或者走丢了呢？", speaker: "莉娃" },
      { text: "那么我们总会在月亮上相遇的，傻瓜。", speaker: "约翰尼" },
    ],
    platforms: ["PC", "Switch"], // TODO(主人): 替换为真实游玩平台
    hoursPlayed: 6, // TODO(主人): 替换为真实游玩时长（小时）
  },
];

/**
 * 板块扩展字段（通关状态 / Metacritic 综合分 / 成就进度）。
 * 与 gameWorks 通过 id 关联。
 */
export interface GameExtra {
  status: "cleared" | "playing"; // 已通关 ✓ / 沉迷中…
  metaScore: number; // Metacritic 综合分
  achievements: string; // 成就进度，如 '32/32'
  hoursLabel?: string; // 时长展示文案（可选，如 '200h+'）
}

export const gameExtras: Record<string, GameExtra> = {
  "game-01": {
    status: "cleared", // TODO(主人): 替换为真实状态
    metaScore: 82, // TODO(主人): 替换为真实 Metacritic 分数
    achievements: "45/63", // TODO(主人): 替换为真实成就进度
  },
  "game-02": {
    status: "playing", // TODO(主人): 替换为真实状态
    metaScore: 89, // TODO(主人): 替换为真实 Metacritic 分数
    achievements: "38/40", // TODO(主人): 替换为真实成就进度
    hoursLabel: "200h+", // TODO(主人): 替换为真实时长文案
  },
  "game-03": {
    status: "cleared", // TODO(主人): 替换为真实状态
    metaScore: 83, // TODO(主人): 替换为真实 Metacritic 分数
    achievements: "52/88", // TODO(主人): 替换为真实成就进度
  },
  "game-04": {
    status: "playing", // TODO(主人): 替换为真实状态
    metaScore: 93, // TODO(主人): 替换为真实 Metacritic 分数
    achievements: "60/80", // TODO(主人): 替换为真实成就进度
    hoursLabel: "300h+", // TODO(主人): 替换为真实时长文案
  },
  "game-05": {
    status: "cleared", // TODO(主人): 替换为真实状态
    metaScore: 78, // TODO(主人): 替换为真实 Metacritic 分数
    achievements: "30/49", // TODO(主人): 替换为真实成就进度
  },
  "game-06": {
    status: "playing", // TODO(主人): 替换为真实状态
    metaScore: 78, // Metacritic PC 版
    achievements: "进行中", // TODO(主人): 替换为真实成就进度
  },
  "game-07": {
    status: "cleared", // TODO(主人): 替换为真实状态
    metaScore: 81, // TODO(主人): 替换为真实 Metacritic 分数
    achievements: "全流程", // TODO(主人): 替换为真实成就进度
  },
};
