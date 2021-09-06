import React from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';
import Image from 'next/image';
import styles from './nav-dao.module.scss';

interface DAOHeaderProps extends React.HTMLProps<HTMLHeadingElement> {
  label: string;
  className?: string;
  isOpen?: boolean;
  logo?: string;
}

export const DaoHeader: React.VFC<DAOHeaderProps> = ({
  label,
  className,
  isOpen,
  logo,
  ...props
}) => {
  return (
    <div {...props} className={cn(styles.header, className)}>
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
      />
    </div>
  );
};
