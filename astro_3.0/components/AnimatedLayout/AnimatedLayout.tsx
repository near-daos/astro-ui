import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  children?: ReactNode;
  className?: string;
}

export const AnimatedLayout: FC<Props> = ({ children, className }) => {
  return (
    <AnimatePresence>
      {children && (
        <motion.div
          className={cn(className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
