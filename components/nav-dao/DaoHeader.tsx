import React from 'react';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';

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
      <Icon
        width={24}
        style={{
          marginLeft: 'auto',
          transform: isOpen ? undefined : 'rotate(-90deg)',
          transition: 'all 100ms'
        }}
        name="buttonArrowDown"
        onClick={openCloseDropdown}
      />
    </div>
  );
};
