import type { Variants } from "framer-motion";

/** FLIP 弹簧（调柔：stiffness 210 / damping 28 / mass 1，≈700ms 滑行感） */
export const FLIP_SPRING = { type: "spring", stiffness: 210, damping: 28, mass: 1 } as const;

/** 详情覆盖层右列内容：封面定格后（delay 250ms）分块 stagger 0.09s 入场；退出反向快速淡出 */
export const overlayContentVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.25, staggerChildren: 0.09 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};
