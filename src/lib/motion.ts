import type { Variants } from "framer-motion";

/** FLIP 弹簧（调柔：stiffness 210 / damping 28 / mass 1，≈700ms 滑行感） */
export const FLIP_SPRING = { type: "spring", stiffness: 210, damping: 28, mass: 1 } as const;

/** 详情覆盖层内容列：封面定格后（delay 250ms）分块 stagger 0.09s 入场（y:24→0）。
 *  退出 = 入场镜像：分块按反序 stagger 0.09s 退出（y:0→24，见 DetailOverlay 的
 *  退场约定），与封面 FLIP 回飞同窗口进行 */
export const overlayContentVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.25, staggerChildren: 0.09 } },
};
