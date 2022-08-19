import React, { FC, ReactNode, useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { useClickAway } from 'react-use';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'classnames';

import styles from './ContextPopup.module.scss';

interface Props {
  controlItem: (callback: () => void) => ReactNode;
  className?: string;
  offset?: [number, number];
}

const POPUP_LEFT_MARGIN = 20;
const POPUP_RIGHT_MARGIN = 20;

export const ContextPopup: FC<Props> = ({
  children,
  controlItem,
  className,
  offset,
}) => {
  const [open, setOpen] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const ref = useRef(null);

  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: offset ?? [64, 23],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: { left: POPUP_LEFT_MARGIN, right: POPUP_RIGHT_MARGIN },
          },
        },
      ],
    }
  );

  useClickAway(ref, e => {
    const rootResElement = (e.target as HTMLElement).closest(
      '#astro_context-popup'
    );

    if (!rootResElement) {
      setOpen(false);
    }
  });

  function renderContent() {
    if (typeof document === 'undefined') {
      return null;
    }

    return ReactDOM.createPortal(
      <AnimatePresence>
        {open && (
          <div
            ref={setPopperElement}
            style={{ ...popperStyles.popper, zIndex: 100 }}
            {...attributes.popper}
          >
            <motion.div
              id="astro_context-popup"
              className={cn(styles.root, className)}
              initial={{ opacity: 0, transform: 'translateY(40px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0 }}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div ref={ref}>
      {controlItem(handleClick)}
      <div className={styles.anchor} ref={setReferenceElement} />
      {renderContent()}
    </div>
  );
};
