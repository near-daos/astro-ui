import React, { FC, useState, useEffect } from 'react';
import { IconButton } from 'components/button/IconButton';
import cn from 'classnames';
import styles from './LinkToTop.module.scss';

export const LinkToTop: FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

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
