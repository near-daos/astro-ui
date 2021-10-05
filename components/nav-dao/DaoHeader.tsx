import cn from 'classnames';
import React, { KeyboardEvent, MouseEvent } from 'react';

import { Icon } from 'components/Icon';
import { ImageWithFallback } from 'components/image-with-fallback';

import styles from './nav-dao.module.scss';

interface DAOHeaderProps extends React.HTMLProps<HTMLHeadingElement> {
  logo?: string;
  label: string;
  isOpen: boolean;
  className?: string;
  openCloseDropdown: () => void;
}

export const DaoHeader: React.VFC<DAOHeaderProps> = ({
  label,
  className,
  isOpen,
  logo,
  openCloseDropdown,
  ...props
}) => {
  function toggleHeading(e: MouseEvent | KeyboardEvent) {
    e.stopPropagation();
    openCloseDropdown();
  }

  const iconClassName = cn(styles.expandCollapseIcon, {
    [styles.open]: isOpen
  });

  return (
    <div
      {...props}
      tabIndex={0}
      role="button"
      onClick={toggleHeading}
      onKeyPress={toggleHeading}
      className={cn(styles.header, className)}
    >
      {logo ? (
        <ImageWithFallback
          fallbackSrc="/flag.svg"
          loading="eager"
          src={logo}
          width={24}
          height={24}
          alt={`${label} Dao Logo`}
        />
      ) : (
        <Icon width={24} height={24} name="flag" />
      )}
      <h3> {label} </h3>
      <div className={styles.expandCollapseElement}>
        <Icon width={24} name="buttonArrowDown" className={iconClassName} />
      </div>
    </div>
  );
};
