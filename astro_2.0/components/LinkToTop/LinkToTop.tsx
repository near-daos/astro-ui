import React, { FC, useState, useEffect, useRef } from 'react';
import { IconButton } from 'components/button/IconButton';
import cn from 'classnames';
import styles from './LinkToTop.module.scss';

export const LinkToTop: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const offsetRef = useRef(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (
        window.pageYOffset < offsetRef.current &&
        window.pageYOffset > 100 &&
        !isVisible
      ) {
        setIsVisible(true);
      } else if (
        (window.pageYOffset < 100 && isVisible) ||
        (window.pageYOffset > offsetRef.current && isVisible)
      ) {
        setIsVisible(false);
      }

      offsetRef.current = window.pageYOffset;
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isVisible]);

  const rootClassName = cn(styles.root, {
    [styles.visible]: isVisible,
  });

  return (
    <div className={rootClassName}>
      <IconButton
        icon="buttonResetScroll"
        size="large"
        className={styles.icon}
        onClick={scrollToTop}
      />
    </div>
  );
};
