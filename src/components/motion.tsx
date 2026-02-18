"use client";

import { Children, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const staggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const, // ease-out-quad
    },
  },
};

export function StaggerList({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ol" | "ul";
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerVariants}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </MotionTag>
  );
}
