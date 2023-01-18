import React, { FC } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';

import { useMedia, useToggle } from 'react-use';
import AnimateHeight from 'react-animate-height';

import { useAppVersion } from 'hooks/useAppVersion';

import styles from './DaoPurpose.module.scss';

interface Props {
  description: string;
  className?: string;
}

export const DaoPurpose: FC<Props> = ({ description, className }) => {
  const [isOpen, toggle] = useToggle(false);
  const isMobile = useMedia('(max-width: 1023px)');
  const { appVersion } = useAppVersion();

  function renderContent() {
    return (
      <div className={styles.content}>
        <div>{description}</div>
      </div>
    );
  }

  if (appVersion !== 3) {
    return null;
  }

  if (!isMobile) {
    return (
      <section className={cn(styles.root, className)}>
        {renderContent()}
      </section>
    );
  }

  return (
    <AnimateHeight duration={500} height={isOpen ? 'auto' : 24}>
      <section
        className={cn(styles.root, className)}
        tabIndex={-1}
        role="button"
        onClick={() => toggle()}
        onKeyDown={e => e.key === 'Spacebar' && toggle()}
      >
        {renderContent()}
        <div className={styles.control}>
          <Icon
            name={isOpen ? 'buttonArrowUp' : 'buttonArrowDown'}
            className={styles.icon}
          />
        </div>
      </section>
    </AnimateHeight>
  );
};
