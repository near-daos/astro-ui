import React from 'react';
import { motion } from 'framer-motion';

const rectVariants = {
  on: {
    fill: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-primary-60'
    )
  },
  off: {
    fill: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-neutral-40'
    )
  }
};

const circleVariants = {
  on: {
    cx: 28
  },
  off: {
    cx: 12
  }
};

export const ToggleDisplay: React.FC<{ value?: boolean }> = ({ value }) => {
  return (
    <motion.svg
      initial={value ? 'on' : 'off'}
      animate={value ? 'on' : 'off'}
      width="40px"
      height="24px"
    >
      <motion.rect
        variants={rectVariants}
        width="40"
        height="24"
        rx="12"
        fill="#D9D9D9"
      />
      <motion.circle variants={circleVariants} cy="12" r="9" fill="white" />
    </motion.svg>
  );
};
