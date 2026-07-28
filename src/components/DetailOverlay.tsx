/**
 * <DetailOverlay> — 详情覆盖层外壳，三板块共用（design.md §7.4 / home.md §5）
 *
 * 用法（板块 agent）：
 * ```tsx
 * <DetailOverlay accent={accent} onClose={() => navigate("/#music")} cover={
 *   <motion.img layoutId={`cover-${work.id}`} src={work.cover} transition={FLIP_SPRING} … />
 * }>
 *   <DetailBlock>…信息栏…</DetailBlock>
 *   <DetailBlock><PressQuoteBlock …/></DetailBlock>
 *   <DetailBlock><LinesBlock …/></DetailBlock>
 * </DetailOverlay>
 * ```
 * 外层用 <AnimatePresence> 包裹以获得退出动画；封面元素的 layoutId 与
 * WorkCard 中 `cover-${id}` 对应即触发 FLIP（spring 见 FLIP_SPRING）。
 * prefers-reduced-motion：板块应改用淡入淡出（不加 layoutId 即可）。
 */
import { useEffect } from "react";
import type { ReactNode } from "react";
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
  // 退出不单独定义：由右列容器统一做「模糊 + 淡出」（见 src/lib/motion.ts），
  // 与封面 FLIP 同时进行，避免文字先行消失
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
  cover: ReactNode; // 左列封面锚位元素（桌面 sticky；移动端 55% 宽居上）
  children: ReactNode; // 右列内容块（建议用 <DetailBlock> 包裹）
}

export default function DetailOverlay({ accent, tint, backdropSrc, onClose, cover, children }: DetailOverlayProps) {
  const isMobile = useIsMobile(); // 退出方向分端：桌面右列向右、tag 向下；移动端原地

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // body 滚动锁定 + Lenis 暂停（覆盖层自身可滚动）
  useEffect(() => {
    const lenis = getLenis();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // 退出时整层多留到 FLIP 弹簧（≈650ms）落定：文字模糊淡出、scrim 淡出与封面
      // 飞行同步进行（见下方 scrim / 右列 exit），最后整层快速收尾
      exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.55 } }}
    >
      {/* scrim：亮色=浓模糊+主题色浸染；暗色=封面放大模糊背景（.cover-backdrop，见 index.css）。点击空白关闭。
          退出时与封面 FLIP 同步缓慢淡出（0.6s），与文字模糊淡出同窗口进行，
          不再先行消失，避免详情文字与主页面文字重合的突兀感 */}
      <motion.div
        className="detail-scrim absolute inset-0"
        style={{ "--tint": tint ?? "#FAF7F2" } as React.CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeIn" } }}
        onClick={onClose}
        aria-hidden="true"
      >
        {backdropSrc && <img src={backdropSrc} alt="" draggable={false} className="cover-backdrop" />}
      </motion.div>

      {/* 返回按钮：左上角 44px 玻璃圆钮（accent 箭头），hover 沿左侧优雅展开显「返回列表」；
          移动端保持纯圆钮——因为整页空白本来就可点关闭，它只需安静待在角落 */}
      <button
        type="button"
        onClick={onClose}
        aria-label="返回列表"
        style={{ marginTop: "env(safe-area-inset-top)" }}
        className="glass-strong group absolute left-4 top-4 z-10 flex h-11 w-11 items-center overflow-hidden rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[124px] md:left-8 md:top-6"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center">
          <ArrowLeft
            size={16}
            strokeWidth={2}
            style={{ color: accent }}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
        </span>
        <span className="whitespace-nowrap pr-5 text-[0.78rem] font-medium text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          返回列表
        </span>
      </button>

      {/* 可滚动内容区（overscroll-behavior: contain；data-lenis-prevent 让 Lenis 放行本区域的滚轮/触摸滚动） */}
      <div
        data-lenis-prevent
        className="absolute inset-0 overflow-y-auto"
        style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose(); // 点击滚动区空白 = scrim 点击
        }}
      >
        {/* 各层容器都挂"点空白关闭"（仅当点到容器自身、而非内容时触发），
            宽屏下封面下方的空白区域同样可以点击关闭；
            但网格自身不挂——封面与描述之间的 gap 点击不退出 */}
        <div
          className="mx-auto min-h-full max-w-[1200px] p-[clamp(20px,4vw,56px)] pt-20 md:pt-[clamp(20px,4vw,56px)]"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-14">
            {/* 左列：封面锚位（桌面 sticky top 且撑满整行高度，使封面下方左侧空白
                也能点关闭；移动端 55% 宽居中偏上）；封面下方空白可点关闭 */}
            <div
              className="mx-auto min-h-[40vh] w-[55%] self-start lg:sticky lg:top-[clamp(20px,4vw,56px)] lg:mx-0 lg:min-h-[70vh] lg:w-full lg:self-stretch"
              onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
              }}
            >
              {cover}
            </div>
            {/* 右列：流式内容块（stagger 入场）；块间/底部空白同样可点关闭。
                退出：桌面端向右模糊淡出，移动端原地模糊淡出（与封面 FLIP 同步） */}
            <motion.div
              variants={{
                ...overlayContentVariants,
                exit: {
                  opacity: 0,
                  x: isMobile ? 0 : 48,
                  filter: "blur(12px)",
                  transition: { duration: 0.45, ease: "easeIn" },
                },
              }}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-10 pb-24"
              onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
              }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
