/**
 * <DetailOverlay> — 详情覆盖层外壳，各板块共用（design.md §7.4 / home.md §5）
 *
 * 用法：
 * ```tsx
 * <DetailOverlay accent={accent} onClose={() => navigate("/#games")} cover={
 *   <motion.img layoutId={`cover-${work.id}`} src={work.cover} transition={FLIP_SPRING} … />
 * }>
 *   <DetailBlock>…信息栏…</DetailBlock>
 *   <DetailBlock><PressQuoteBlock …/></DetailBlock>
 *   <DetailBlock><LinesBlock …/></DetailBlock>
 * </DetailOverlay>
 * ```
 * 外层用 <AnimatePresence> 包裹以获得退出动画；封面元素的 layoutId 与
 * 板块卡片中 `cover-${id}` 对应即触发 FLIP（spring 见 FLIP_SPRING）。
 * prefers-reduced-motion：板块应改用淡入淡出（不加 layoutId 即可）。
 */
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getLenis } from "@/lib/lenis";
import { overlayContentVariants } from "@/lib/motion";
import { useIsMobile } from "@/hooks/use-mobile";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  // 退出 = 入场镜像：按反序 stagger 回退到 hidden（y:0→24 下移淡出），
  // 无模糊、无侧移，与封面 FLIP 回飞同窗口进行
  exit: { opacity: 0, y: 24, transition: { duration: 0.5, ease: EASE } },
};

/** 内容分块包装：获得 stagger 入场 */
export function DetailBlock({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

interface DetailOverlayProps {
  accent: string; // 作品主题色（徽章、eyebrow、返回箭头等）
  tint?: string; // 作品主题色浸染 scrim 背景（亮色模式；默认中性米白）
  backdropSrc?: string; // 暗色模式下放大模糊的封面背景图（传作品封面）
  onClose: () => void; // 关闭（路由 pop 回 /#section）
  cover: ReactNode; // 封面列锚位元素（桌面 sticky；移动端 55% 宽居上）
  children: ReactNode; // 内容列内容块（建议用 <DetailBlock> 包裹）
  coverSide?: "left" | "right"; // 封面列方位：跟随被点击卡片所在半屏（默认左；移动端无效）
}

export default function DetailOverlay({ accent, tint, backdropSrc, onClose, cover, children, coverSide = "left" }: DetailOverlayProps) {
  const isMobile = useIsMobile(); // 点空白关闭 / scrim 点击仅桌面端启用（窄屏防误触）
  const flip = coverSide === "right"; // 桌面端封面列置右（窄屏无需判断：封面恒居中居上）
  // 触摸下拉退出的起点记录（仅滚动到顶时下拉才触发）
  const touchStart = useRef<{ x: number; y: number; scrollTop: number } | null>(null);

  // 点空白关闭仅桌面端启用：窄屏左右缝隙易误触，
  // 移动端退出走返回按钮 + 顶部下拉手势
  const blankClose = (e: React.MouseEvent<HTMLElement>) => {
    if (!isMobile && e.target === e.currentTarget) onClose();
  };

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // body 滚动锁定 + Lenis 暂停（覆盖层自身可滚动）。
  // 锁定时滚动条消失会引起内容右移——给 body 补一个滚动条等宽的 padding-right
  // 抵消（不用 scrollbar-gutter：预留槽位是 fixed 覆盖层盖不住的 html 外区域，
  // 会在详情页右侧漏出一条底色竖条）
  useEffect(() => {
    const lenis = getLenis();
    const prev = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      document.body.style.paddingRight = prevPadding;
      lenis?.start();
    };
  }, []);

  return (
    <motion.div
      className="detail-overlay fixed inset-0 z-50"
      // --accent 供子树派生 --accent-text（暗色自动提亮，见 index.css）
      style={{ "--accent": accent } as CSSProperties}
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // 退出时整层多留到 FLIP 弹簧（≈700ms）落定：内容列反序 stagger 下移淡出、
      // 封面飞回原卡位、scrim 收尾淡出（各子层各自的 exit，见下）。
      // 根层不做整体 opacity 淡出——那会把仍在飞行的封面带成半透明，
      // 卸载瞬间陈列墙卡片封面接管显示成全不透明，归位时「闪一下」；
      // 用一个无视觉变化的退出时长撑住层，等子层落定后卸载
      exit={{ opacity: 1, transition: { duration: 0.72 } }}
    >
      {/* scrim：亮色=浓模糊+主题色浸染；暗色=封面放大模糊背景（.cover-backdrop，见 index.css）。点击空白关闭。
          退出 = 入场镜像：入场时 scrim 最先淡入（0.3s），退场时最后淡出——
          等内容块反序 stagger 落定后收尾（delay 0.4 + 0.3s），与封面 FLIP 回飞同窗口结束 */}
      <motion.div
        className="detail-scrim absolute inset-0"
        style={{ "--tint": tint ?? "#FAF7F2" } as React.CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.4, ease: "easeIn" } }}
        onClick={() => {
          if (!isMobile) onClose(); // 窄屏 scrim 点击不退出（防误触）
        }}
        aria-hidden="true"
      >
        {backdropSrc && <img src={backdropSrc} alt="" draggable={false} className="cover-backdrop" />}
      </motion.div>

      {/* 返回按钮：左上角 44px 玻璃圆钮（accent 箭头）。
          hover 展开「返回列表」仅限可悬停设备（[@media(hover:hover)]）——
          触屏点按不触发，避免「先展开再退出」的怪感；退场与 scrim 同窗口收尾淡出。
          任意值 ease 类与 tw-animate-css 冲突不会生成 CSS，缓动改用内联 */}
      <motion.button
        type="button"
        onClick={onClose}
        aria-label="返回列表"
        exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.55, ease: "easeIn" } }}
        style={{ marginTop: "env(safe-area-inset-top)", transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        className="glass-strong group absolute left-4 top-4 z-10 flex h-11 w-11 items-center overflow-hidden rounded-full transition-[width] duration-500 [@media(hover:hover)]:hover:w-[124px] md:left-8 md:top-6"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center">
          <ArrowLeft
            size={16}
            strokeWidth={2}
            style={{ color: "var(--accent-text)" }}
            className="transition-transform duration-300 [@media(hover:hover)]:group-hover:-translate-x-0.5"
          />
        </span>
        <span className="whitespace-nowrap pr-5 text-[0.78rem] font-medium text-ink opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100">
          返回列表
        </span>
      </motion.button>

      {/* 可滚动内容区（overscroll-behavior: contain；data-lenis-prevent 让 Lenis 放行本区域的滚轮/触摸滚动）。
          触摸退出：内容滚动到顶后继续下拉 >90px（竖向为主）即关闭——
          未滚动或滚动中的下拉仍归原生滚动，不抢手势 */}
      <div
        data-lenis-prevent
        className="absolute inset-0 overflow-y-auto"
        style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        onClick={blankClose} // 点击滚动区空白 = scrim 点击（仅桌面端）
        onTouchStart={(e) => {
          touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            scrollTop: e.currentTarget.scrollTop,
          };
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || start.scrollTop > 0) return; // 只有从顶部起拉的才判定为退出
          const dy = e.changedTouches[0].clientY - start.y;
          const dx = e.changedTouches[0].clientX - start.x;
          if (dy > 90 && dy > Math.abs(dx) * 1.5) onClose();
        }}
      >
        {/* 各层容器都挂"点空白关闭"（仅当点到容器自身、而非内容时触发，且仅桌面端），
            宽屏下封面下方的空白区域同样可以点击关闭；
            但网格自身不挂——封面与描述之间的 gap 点击不退出 */}
        <div
          className="mx-auto min-h-full max-w-[1200px] p-[clamp(20px,4vw,56px)] pt-20 md:pt-[clamp(20px,4vw,56px)]"
          onClick={blankClose}
        >
          <div
            className={`grid grid-cols-1 items-start gap-10 lg:gap-14 ${
              flip ? "lg:grid-cols-[minmax(0,1fr)_400px]" : "lg:grid-cols-[400px_minmax(0,1fr)]"
            }`}
          >
            {/* 封面列：外层撑满整行高度（封面下方空白也能点关闭），
                内层 sticky 锚位——滚动时封面吸住不动（外层与网格同高，
                sticky 只能挂在内层才有滑动空间）；移动端 55% 宽居中偏上。
                coverSide=right 时置右（order-2），移动端恒居上 */}
            <div
              className={`mx-auto w-[55%] self-start lg:mx-0 lg:min-h-[70vh] lg:w-full lg:self-stretch ${
                flip ? "lg:order-2" : ""
              }`}
              onClick={blankClose}
            >
              <div className="lg:sticky lg:top-[clamp(20px,4vw,56px)]">{cover}</div>
            </div>
            {/* 内容列：流式内容块（stagger 入场）；块间/底部空白同样可点关闭。
                退出 = 入场镜像：分块按反序（staggerDirection: -1）逐个 y:0→24 淡出
                （itemVariants.exit），与封面 FLIP 回飞同窗口进行，无模糊无侧移 */}
            <motion.div
              variants={{
                ...overlayContentVariants,
                exit: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
              }}
              initial="hidden"
              animate="show"
              exit="exit"
              className={`space-y-10 pb-24 ${flip ? "lg:order-1" : ""}`}
              onClick={blankClose}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
