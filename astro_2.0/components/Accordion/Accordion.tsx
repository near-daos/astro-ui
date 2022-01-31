import cn from 'classnames';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { IconButton } from 'components/button/IconButton';

import styles from './Accordion.module.scss';

interface AccordionProps {
  title: ReactNode;
  isOpen?: boolean;
  className?: string;
}

export const Accordion: FC<AccordionProps> = props => {
  const { title, children, isOpen = false, className } = props;

  const [open, setOpen] = useState(isOpen);

  const contentContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentContainerEl = contentContainer.current;

    if (contentContainerEl) {
      contentContainerEl.style.height = open
        ? `${contentContainerEl.scrollHeight}px`
        : '0';
    }
  }, [open]);

  function toggleOpenState() {
    setOpen(!open);
  }

  const rootClassName = cn(styles.root, className, {
    [styles.open]: open,
  });

  return (
    <div className={rootClassName}>
      <div
        tabIndex={0}
        role="button"
        className={styles.header}
        onClick={toggleOpenState}
        onKeyPress={toggleOpenState}
      >
        {title}
        <IconButton
          size="medium"
          icon="buttonArrowDown"
          className={styles.icon}
        />
      </div>
      <div ref={contentContainer} className={styles.contentContainer}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
