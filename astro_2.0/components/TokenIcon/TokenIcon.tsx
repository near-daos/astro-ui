import React, { FC } from 'react';
import cn from 'classnames';
import { useIsValidImage } from 'hooks/useIsValidImage';
import { Icon, IconName } from 'components/Icon';

import styles from './TokenIcon.module.scss';

interface TokenIconProps {
  symbol: string;
  icon: string;
  className?: string;
}

export const TokenIcon: FC<TokenIconProps> = ({ symbol, icon, className }) => {
  let type: 'ICON' | 'URL';
  let iconName: IconName | null;
  let url = '';

  switch (symbol?.toLowerCase()) {
    case 'near':
    case 'wnear': {
      type = 'ICON';
      iconName = 'tokenNearBig';
      break;
    }
    case 'aurora': {
      type = 'ICON';
      iconName = 'aurora';
      break;
    }
    case 'usn': {
      type = 'ICON';
      iconName = 'logoUsn';
      break;
    }
    default: {
      type = 'URL';
      iconName = null;
      url = icon;
    }
  }

  const isValid = useIsValidImage(type === 'URL' ? url : '');

  let content = <div className={styles.icon} />;

  if (isValid) {
    content = (
      <div
        data-testid="custom-icon"
        style={{
          backgroundImage: `url(${encodeURI(decodeURIComponent(url))})`,
        }}
        className={styles.icon}
      />
    );
  }

  if (type === 'ICON' && iconName) {
    content = <Icon name={iconName} />;
  }

  return (
    <div className={styles.root}>
      <div className={cn(styles.iconWrapper, className)}>{content}</div>
    </div>
  );
};
