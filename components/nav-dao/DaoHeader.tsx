import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { MouseEvent, KeyboardEvent } from 'react';

import { Icon } from 'components/Icon';

import styles from './nav-dao.module.scss';

interface DAOHeaderProps extends React.HTMLProps<HTMLHeadingElement> {
  logo?: string;
  label: string;
  daoId?: string;
  isOpen: boolean;
  className?: string;
  openCloseDropdown: () => void;
}

export const DaoHeader: React.VFC<DAOHeaderProps> = ({
  daoId,
  label,
  className,
  isOpen,
  logo,
  openCloseDropdown,
  ...props
}) => {
  const router = useRouter();

  function onElementClick() {
    if (daoId) {
      router.push(`/dao/${daoId}`);
    } else {
      openCloseDropdown();
    }
  }

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
      onClick={onElementClick}
      onKeyPress={onElementClick}
      className={cn(styles.header, className)}
    >
      {logo ? (
        <Image src={logo} width={24} height={24} alt={`${label} Dao Logo`} />
      ) : (
        <Icon width={24} height={24} name="flag" />
      )}
      <h3> {label} </h3>
      <div
        tabIndex={0}
        role="button"
        onClick={toggleHeading}
        onKeyPress={toggleHeading}
        className={styles.expandCollapseElement}
      >
        <Icon width={24} name="buttonArrowDown" className={iconClassName} />
      </div>
    </div>
  );
};
